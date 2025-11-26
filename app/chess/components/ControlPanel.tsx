import React from 'react';
import { GameMode, Difficulty, MoveHistoryItem, GameStats } from '../types';
import { Settings, RefreshCw, Cpu, Users, RotateCcw, ChevronRight } from 'lucide-react';

interface ControlPanelProps {
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
  difficulty: Difficulty;
  setDifficulty: (diff: Difficulty) => void;
  resetGame: () => void;
  undoMove: () => void;
  history: MoveHistoryItem[];
  stats: GameStats;
  isAiThinking: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  gameMode,
  setGameMode,
  difficulty,
  setDifficulty,
  resetGame,
  undoMove,
  history,
  stats,
  isAiThinking
}) => {
  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800 w-full lg:w-96 shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-slate-800 bg-slate-900/50">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 mb-2">
          Text2 Game Chess
        </h1>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span className={`w-2 h-2 rounded-full ${stats.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
          {stats.status === 'active' 
            ? `${stats.turn === 'w' ? "White" : "Black"}'s Turn` 
            : stats.status.toUpperCase().replace('-', ' ')}
        </div>
        {stats.status !== 'active' && stats.winner && (
           <div className="mt-2 text-yellow-400 font-semibold animate-bounce">
             Winner: {stats.winner === 'w' ? 'White' : 'Black'}
           </div>
        )}
      </div>

      {/* Settings */}
      <div className="p-6 space-y-6 overflow-y-auto flex-1">
        
        {/* Game Mode */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Game Mode</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setGameMode(GameMode.PvP)}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
                gameMode === GameMode.PvP
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'
              }`}
            >
              <Users size={18} />
              <span>PvP</span>
            </button>
            <button
              onClick={() => setGameMode(GameMode.PvAI)}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
                gameMode === GameMode.PvAI
                  ? 'bg-cyan-600/20 border-cyan-500 text-cyan-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'
              }`}
            >
              <Cpu size={18} />
              <span>Vs AI</span>
            </button>
          </div>
        </div>

        {/* AI Difficulty */}
        {gameMode === GameMode.PvAI && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">AI Difficulty</label>
            <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
              {Object.values(Difficulty).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`flex-1 py-2 text-sm rounded-md transition-all ${
                    difficulty === diff
                      ? 'bg-slate-700 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Move History */}
        <div className="space-y-3 flex-1 flex flex-col min-h-[200px]">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex justify-between items-center">
            <span>Move History</span>
            <span className="text-slate-600">{history.length} moves</span>
          </label>
          <div className="bg-slate-950/50 rounded-lg border border-slate-800 flex-1 p-0 overflow-hidden relative">
            <div className="absolute inset-0 overflow-y-auto p-2 space-y-0.5">
              {history.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-slate-600 text-sm italic">
                  <span>No moves yet</span>
                  <span>Start the game!</span>
                </div>
              )}
              {history.map((move) => (
                <div key={move.number} className="grid grid-cols-[30px_1fr_1fr] text-sm py-1 px-2 hover:bg-slate-800/50 rounded">
                  <span className="text-slate-600 font-mono">{move.number}.</span>
                  <span className="text-slate-300 font-medium">{move.white}</span>
                  <span className="text-slate-300 font-medium">{move.black || ''}</span>
                </div>
              ))}
              <div id="history-end" />
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 border-t border-slate-800 bg-slate-900/50 space-y-3">
        {isAiThinking && (
           <div className="flex items-center justify-center gap-2 text-cyan-400 text-sm py-2 bg-cyan-950/30 rounded-lg border border-cyan-900/50 animate-pulse">
             <Cpu size={16} className="animate-spin" />
             <span>Gemini is thinking...</span>
           </div>
        )}
        
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={undoMove}
            disabled={history.length === 0 || isAiThinking}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCcw size={18} />
            Undo
          </button>
          <button
            onClick={resetGame}
            disabled={isAiThinking}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={18} />
            New Game
          </button>
        </div>
      </div>
    </div>
  );
};