"use client";

import useSWR from "swr";
import { RefreshCcw, Flame } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function StatsCard() {
  const { data, error, isLoading, mutate } = useSWR("/api/github/stats", fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 300000, // 5 min
  });

  if (isLoading) return <div className="animate-pulse bg-[#161b22] h-48 rounded-xl border border-[#30363d]"></div>;
  if (error) return <div className="bg-[#161b22] h-48 rounded-xl border border-[#30363d] flex items-center justify-center text-red-400">Failed to load stats</div>;

  const stats = data || {
    totalContributions: 328,
    contributionRange: "Sep 5, 2023 – Present",
    currentStreak: 3,
    currentStreakRange: "May 14 – May 16",
    longestStreak: 4,
    longestStreakRange: "Mar 28, 2025 – Mar 31, 2025"
  };

  return (
    <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-6 shadow-sm relative">
      <button 
        onClick={() => mutate()} 
        className="absolute top-4 right-4 text-[#7d8590] hover:text-[#e6edf3] transition-colors"
        title="Refresh stats"
      >
        <RefreshCcw size={16} />
      </button>

      <div className="grid grid-cols-3 gap-4 text-center divide-x divide-[#30363d]">
        {/* Total Contributions */}
        <div className="flex flex-col items-center justify-center px-2">
          <span className="text-3xl font-bold text-[#e6edf3]">{stats.totalContributions}</span>
          <span className="text-xs text-[#7d8590] mt-1 font-medium uppercase tracking-wider">Total Contributions</span>
          <span className="text-[10px] text-[#7d8590] mt-2 block">{stats.contributionRange}</span>
        </div>

        {/* Current Streak */}
        <div className="flex flex-col items-center justify-center px-2">
          <div className="relative w-16 h-16 flex items-center justify-center mb-2">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-[#30363d]"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#f78166]"
                strokeWidth="3"
                strokeDasharray={`${Math.min((stats.currentStreak / 30) * 100, 100)}, 100`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <Flame size={14} className="text-[#f78166] -mt-1" />
              <span className="text-sm font-bold text-[#e6edf3]">{stats.currentStreak}</span>
            </div>
          </div>
          <span className="text-xs text-[#f78166] font-medium uppercase tracking-wider">Current Streak</span>
          <span className="text-[10px] text-[#7d8590] mt-1 block">{stats.currentStreakRange}</span>
        </div>

        {/* Longest Streak */}
        <div className="flex flex-col items-center justify-center px-2">
          <span className="text-3xl font-bold text-[#e6edf3]">{stats.longestStreak}</span>
          <span className="text-xs text-[#7d8590] mt-1 font-medium uppercase tracking-wider">Longest Streak</span>
          <span className="text-[10px] text-[#7d8590] mt-2 block">{stats.longestStreakRange}</span>
        </div>
      </div>
    </div>
  );
}
