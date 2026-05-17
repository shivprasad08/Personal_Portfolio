"use client";

import { useState } from "react";
import useSWR from "swr";
import { Tooltip } from "react-tooltip";
import { motion } from "framer-motion";
import ContributionActivity from "./ContributionActivity";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

export default function ContributionGraph() {
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const { data, error, isLoading } = useSWR(`/api/github/contributions?year=${year}`, fetcher);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2023 + 1 }, (_, i) => currentYear - i);

  // Get month labels at starting week indices
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthLabels: { [key: number]: string } = {};
  let lastMonth = -1;

  data?.weeks?.forEach((week: any, weekIndex: number) => {
    if (week.contributionDays.length > 0) {
      const date = new Date(week.contributionDays[0].date);
      const month = date.getMonth();
      if (month !== lastMonth) {
        monthLabels[weekIndex] = months[month];
        lastMonth = month;
      }
    }
  });

  const getColor = (level: number) => {
    switch (level) {
      case 1: return "bg-[#0e4429] border border-transparent";
      case 2: return "bg-[#006d32] border border-transparent";
      case 3: return "bg-[#26a641] border border-transparent";
      case 4: return "bg-[#39d353] border border-transparent";
      default: return "bg-[#0d1117] border border-white/60 hover:border-white transition-colors";
    }
  };

  const getGlow = (level: number) => {
    switch (level) {
      case 1: return "0 0 4px rgba(14, 68, 41, 0.4)";
      case 2: return "0 0 6px rgba(0, 109, 50, 0.6)";
      case 3: return "0 0 8px rgba(38, 166, 65, 0.8)";
      case 4: return "0 0 10px rgba(57, 211, 83, 0.95)";
      default: return "none";
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Top Header Row with Title and Year Selector */}
      <div className="flex items-center justify-between gap-4 w-full mb-2">
        <h2 className="text-2xl font-normal text-[#e6edf3] select-none">Activity</h2>
        <div className="flex items-center gap-1.5">
          {years.map((y) => (
            <button
              key={y}
              onClick={() => setYear(y)}
              className={`px-3 py-1 text-xs font-mono rounded-md border transition-all cursor-pointer ${
                year === y
                  ? "bg-[#21262d] border-[#3fb950] text-[#39d353] shadow-[0_0_12px_rgba(57,211,83,0.15)] font-semibold"
                  : "bg-[#161b22] border-[#30363d] text-[#7d8590] hover:text-[#e6edf3] hover:border-[#8b949e]"
              }`}
              suppressHydrationWarning
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Box */}
      <div className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-[#e6edf3]">
            {data?.totalContributions || "0"} contributions in {year}
          </h3>
        </div>

        <div className="overflow-x-auto pb-4 custom-scrollbar">
          {isLoading ? (
            <div className="animate-pulse h-[120px] bg-[#161b22] rounded-md"></div>
          ) : error ? (
            <div className="text-red-400 text-sm py-8 text-center">Failed to load contributions</div>
          ) : (
            <div className="w-full min-w-[820px] flex flex-col gap-1 select-none">
              {/* Months Row */}
              <div className="flex w-full text-[9px] text-[#7d8590] h-4">
                {/* Spacer matching the day labels column width */}
                <div className="w-[30px] flex-shrink-0" />
                
                {/* Flex columns for months layout stretching with grid */}
                <div className="flex-1 flex justify-between">
                  {data?.weeks?.map((week: any, weekIndex: number) => {
                    const label = monthLabels[weekIndex];
                    return (
                      <div key={weekIndex} className="w-[12px] flex-shrink-0 relative">
                        {label && (
                          <span className="absolute left-0 top-0 whitespace-nowrap">
                            {label}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Grid (day labels + weeks grid stretching across full width) */}
              <div className="flex w-full items-center">
                {/* Day labels column */}
                <div className="w-[30px] flex flex-col gap-[3px] text-[10px] text-[#7d8590] pt-[2px] flex-shrink-0">
                  <span className="h-[12px]"></span>
                  <span className="h-[12px] leading-[12px]">Mon</span>
                  <span className="h-[12px]"></span>
                  <span className="h-[12px] leading-[12px]">Wed</span>
                  <span className="h-[12px]"></span>
                  <span className="h-[12px] leading-[12px]">Fri</span>
                  <span className="h-[12px]"></span>
                </div>

                {/* Week columns container stretching evenly */}
                <div className="flex-1 flex justify-between">
                  {data?.weeks?.map((week: any, weekIndex: number) => (
                    <div key={weekIndex} className="flex flex-col gap-[3px]">
                      {week.contributionDays.map((day: ContributionDay, dayIndex: number) => (
                        <motion.div
                          key={day.date}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: (weekIndex * 7 + dayIndex) * 0.001, duration: 0.2 }}
                          className={`w-[12px] h-[12px] flex-shrink-0 ${getColor(day.level)}`}
                          style={{ 
                            borderRadius: "2px",
                            boxShadow: getGlow(day.level)
                          }}
                          data-tooltip-id="contribution-tooltip"
                          data-tooltip-content={`${day.count} contributions on ${new Date(day.date).toLocaleDateString()}`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-4 text-[10px] text-[#7d8590]">
          <a href="https://docs.github.com/articles/why-are-my-contributions-not-showing-up-on-my-profile" className="hover:text-[#58a6ff]">
            Learn how we count contributions
          </a>
          <div className="flex items-center gap-1">
            <span>Less</span>
            <div className="w-[12px] h-[12px] bg-[#0d1117] border border-white/60 flex-shrink-0" style={{ borderRadius: "2px" }}></div>
            <div className="w-[12px] h-[12px] bg-[#0e4429] flex-shrink-0" style={{ borderRadius: "2px", boxShadow: "0 0 2px rgba(14, 68, 41, 0.3)" }}></div>
            <div className="w-[12px] h-[12px] bg-[#006d32] flex-shrink-0" style={{ borderRadius: "2px", boxShadow: "0 0 3px rgba(0, 109, 50, 0.45)" }}></div>
            <div className="w-[12px] h-[12px] bg-[#26a641] flex-shrink-0" style={{ borderRadius: "2px", boxShadow: "0 0 4px rgba(38, 166, 65, 0.6)" }}></div>
            <div className="w-[12px] h-[12px] bg-[#39d353] flex-shrink-0" style={{ borderRadius: "2px", boxShadow: "0 0 5px rgba(57, 211, 83, 0.8)" }}></div>
            <span>More</span>
          </div>
        </div>

        <Tooltip id="contribution-tooltip" className="!bg-[#21262d] !text-xs !px-2 !py-1 z-50" />
      </div>

      {/* Contribution Activity Timeline */}
      <ContributionActivity year={year} />
    </div>
  );
}
