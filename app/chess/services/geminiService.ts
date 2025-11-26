import { GoogleGenAI } from "@google/genai";
import { Difficulty } from "../types";

// Initialize Gemini
// Note: API Key must be provided in the environment variable process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getBestMove = async (
  fen: string,
  validMoves: string[],
  difficulty: Difficulty,
  history: string[]
): Promise<string> => {
  try {
    const modelId = 'gemini-2.5-flash';

    let prompt = `You are a chess engine. 
    Current FEN position: "${fen}".
    Move history (SAN): ${history.slice(-10).join(', ')}.
    
    The list of VALID legal moves for the current side is: ${JSON.stringify(validMoves)}.
    
    Your task: Select the best move from the list of valid moves.
    `;

    if (difficulty === Difficulty.Easy) {
      prompt += `Play a beginner-level move. It shouldn't be a blunder, but avoid complex tactics.`;
    } else if (difficulty === Difficulty.Medium) {
      prompt += `Play a strong intermediate move. Develop pieces and control the center.`;
    } else {
      prompt += `Play a Grandmaster-level move. Look for tactical advantages, mates, and positional dominance.`;
    }

    prompt += `\nCRITICAL: Return ONLY the move string (Standard Algebraic Notation, e.g., "Nf3", "e4", "O-O") from the provided valid list. Do not explain. Do not use markdown.`;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });

    const move = response.text?.trim();
    
    // Basic cleaning in case the model is chatty
    const cleanedMove = move?.replace(/['"`.]/g, '').split(/\s+/)[0];

    if (cleanedMove && validMoves.includes(cleanedMove)) {
      return cleanedMove;
    }
    
    // Fallback: If Gemini fails or hallucinates an invalid move, pick a random valid move
    // This ensures the game doesn't crash.
    console.warn("Gemini returned invalid or empty move, falling back to random.", move);
    return validMoves[Math.floor(Math.random() * validMoves.length)];

  } catch (error) {
    console.error("Error fetching move from Gemini:", error);
    // Fallback on error
    return validMoves[Math.floor(Math.random() * validMoves.length)];
  }
};