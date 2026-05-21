"use client";

import { useState } from "react";
import { Play, Pause } from "lucide-react";

export default function SnakeGame() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="mt-8 border border-[#30363d] rounded-xl p-6 bg-[#0d1117]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-[#e6edf3]">Contribution Snake</h3>
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center gap-2 px-3 py-1 bg-[#238636] hover:bg-[#2ea043] text-white text-sm rounded-md transition-colors"
          suppressHydrationWarning
        >
          {isPlaying ? <><Pause size={14} /> Pause</> : <><Play size={14} /> Watch Snake</>}
        </button>
      </div>
      
      <div className="h-32 bg-black border border-[#30363d] rounded-lg flex flex-col items-center justify-center text-[#7d8590]">
        {isPlaying ? (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#39d353] animate-pulse rounded-sm"></div>
            <div className="w-3 h-3 bg-[#39d353] rounded-sm"></div>
            <div className="w-3 h-3 bg-[#39d353] rounded-sm"></div>
            <span className="ml-2">Snake is eating contributions...</span>
          </div>
        ) : (
          <span>Click play to watch the snake animation</span>
        )}
      </div>
    </div>
  );
}
