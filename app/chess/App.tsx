import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chess, Move } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { ControlPanel } from './components/ControlPanel';
import { GameMode, Difficulty, MoveHistoryItem, GameStats } from './types';
import { getBestMove } from './services/geminiService';

const App: React.FC = () => {
  // Game State
  const [game, setGame] = useState(new Chess());
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.PvAI);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Medium);
  const [isAiThinking, setIsAiThinking] = useState(false);
  
  // UI State
  const [boardWidth, setBoardWidth] = useState(600);
  const boardContainerRef = useRef<HTMLDivElement>(null);

  // Responsive Board
  useEffect(() => {
    const handleResize = () => {
      if (boardContainerRef.current) {
        const width = boardContainerRef.current.offsetWidth;
        setBoardWidth(Math.min(width, 700));
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helpers to derive stats and history
  const getHistory = (): MoveHistoryItem[] => {
    const history = game.history({ verbose: true });
    const formatted: MoveHistoryItem[] = [];
    for (let i = 0; i < history.length; i += 2) {
      formatted.push({
        number: Math.floor(i / 2) + 1,
        white: history[i].san,
        black: history[i + 1]?.san,
      });
    }
    return formatted;
  };

  const getStats = (): GameStats => {
    let status: GameStats['status'] = 'active';
    let winner: 'w' | 'b' | undefined;

    if (game.isCheckmate()) {
      status = 'checkmate';
      winner = game.turn() === 'w' ? 'b' : 'w';
    } else if (game.isDraw()) {
      status = 'draw';
    } else if (game.isStalemate()) {
      status = 'stalemate';
    } else if (game.isCheck()) {
      status = 'check';
    }

    return {
      status,
      turn: game.turn(),
      winner
    };
  };

  const makeMove = useCallback((moveStr: string | { from: string; to: string; promotion?: string }) => {
    try {
      const gameCopy = new Chess(game.fen());
      const result = gameCopy.move(moveStr);
      
      if (result) {
        setGame(gameCopy);
        return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  }, [game]);

  // AI Turn Effect
  useEffect(() => {
    if (game.isGameOver() || gameMode !== GameMode.PvAI || game.turn() === 'w') return;

    // AI plays Black
    const playAiMove = async () => {
      setIsAiThinking(true);
      
      // Artificial delay for better UX (so it doesn't feel instant/robotic)
      await new Promise(r => setTimeout(r, 600));

      const possibleMoves = game.moves();
      if (possibleMoves.length === 0) {
        setIsAiThinking(false);
        return;
      }

      // Get history array for context
      const historyStr = game.history();

      const bestMove = await getBestMove(game.fen(), possibleMoves, difficulty, historyStr);
      
      makeMove(bestMove);
      setIsAiThinking(false);
    };

    playAiMove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game, gameMode, difficulty]);

  // Human Drop Handler
  const onDrop = (sourceSquare: string, targetSquare: string) => {
    if (gameMode === GameMode.PvAI && game.turn() === 'b') return false; // Prevent moving during AI turn
    if (game.isGameOver()) return false;

    const move = makeMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q', // auto-promote to queen for simplicity
    });

    return move;
  };

  const resetGame = () => {
    setGame(new Chess());
    setIsAiThinking(false);
  };

  const undoMove = () => {
    const gameCopy = new Chess(game.fen());
    gameCopy.undo(); // Undo last move
    
    // If Vs AI, undo twice (player's move + AI's response)
    if (gameMode === GameMode.PvAI && gameCopy.turn() === 'b') {
        gameCopy.undo(); 
    }
    setGame(gameCopy);
  };

  const stats = getStats();
  const history = getHistory();

  // Scroll to bottom of history
  useEffect(() => {
    const el = document.getElementById('history-end');
    el?.scrollIntoView({ behavior: 'smooth' });
  }, [history.length]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col lg:flex-row overflow-hidden">
      
      {/* Main Board Area */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8 bg-[url('https://images.unsplash.com/photo-1586165368502-1bad197a6461?q=80&w=2658&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center relative">
        {/* Overlay */}
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm"></div>

        <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-4xl">
            
            {/* Mobile Header (Only visible on small screens) */}
            <div className="lg:hidden w-full flex justify-between items-center text-white px-2">
                <h2 className="font-bold text-lg text-indigo-400">Text2 Game Chess</h2>
                <span className={`text-xs px-2 py-1 rounded-full ${stats.turn === 'w' ? 'bg-white text-slate-900' : 'bg-slate-800 text-white'}`}>
                    {stats.turn === 'w' ? "White's Turn" : "Black's Turn"}
                </span>
            </div>

            <div 
              ref={boardContainerRef} 
              className="w-full max-w-[700px] aspect-square shadow-2xl rounded-lg overflow-hidden border-4 border-slate-800"
            >
              <Chessboard 
                position={game.fen()} 
                onPieceDrop={onDrop}
                boardWidth={boardWidth}
                customDarkSquareStyle={{ backgroundColor: '#334155' }} // Slate 700
                customLightSquareStyle={{ backgroundColor: '#94a3b8' }} // Slate 400
                customBoardStyle={{
                    borderRadius: '4px',
                }}
                arePiecesDraggable={!isAiThinking && !game.isGameOver()}
                animationDuration={200}
              />
            </div>
            
            {/* Game Over Banner */}
            {stats.status !== 'active' && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-900/95 border border-indigo-500/50 p-8 rounded-2xl shadow-2xl text-center backdrop-blur-md animate-in zoom-in duration-300 z-50">
                    <h2 className="text-4xl font-black text-white mb-2 tracking-tight">
                        {stats.winner ? (stats.winner === 'w' ? "WHITE WINS!" : "BLACK WINS!") : "DRAW"}
                    </h2>
                    <p className="text-indigo-300 font-medium mb-6">
                        {stats.status === 'checkmate' ? "Checkmate" : "Stalemate / Draw"}
                    </p>
                    <button 
                        onClick={resetGame}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-full transition-transform hover:scale-105 shadow-lg shadow-indigo-500/30"
                    >
                        Play Again
                    </button>
                </div>
            )}
        </div>
      </div>

      {/* Control Panel */}
      <ControlPanel 
        gameMode={gameMode}
        setGameMode={setGameMode}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        resetGame={resetGame}
        undoMove={undoMove}
        history={history}
        stats={stats}
        isAiThinking={isAiThinking}
      />
    </div>
  );
};

export default App;