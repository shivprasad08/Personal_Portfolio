"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Repository {
  name: string;
  url: string;
  count?: number;
  ratio?: number;
  isFork?: boolean;
  language?: string | null;
  color?: string | null;
  date?: string;
  status?: string;
  state?: string;
  prs?: Array<{
    title: string;
    url: string;
    state: string;
    date: string;
  }>;
}

interface PRHighlight {
  number: number;
  title: string;
  repo: string;
  url: string;
  additions: number;
  deletions: number;
  changedFiles: number;
  comments: number;
  date: string;
}

interface ReviewPR {
  title: string;
  url: string;
  date: string;
}

interface Category {
  type: "commits" | "repos" | "pr_highlight" | "pr_others" | "reviews";
  title: string;
  repos?: Repository[];
  pr?: PRHighlight;
  prs?: ReviewPR[];
  date?: string;
}

interface MonthActivity {
  month: string;
  categories: Category[];
}

interface ContributionActivityProps {
  year: number;
}

// SVG Icons matching GitHub UI
const CommitIcon = () => (
  <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" className="fill-[#7d8590] w-4 h-4">
    <path d="M10.5 7.75a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm1.43.029a4.002 4.002 0 0 1-7.86 0H1.75a.75.75 0 0 1 0-1.5h2.32a4.002 4.002 0 0 1 7.86 0h2.32a.75.75 0 0 1 0 1.5h-2.32Z"></path>
  </svg>
);

const RepoIcon = () => (
  <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" className="fill-[#7d8590] w-4 h-4">
    <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 1 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 0 1 1-1h8ZM5 12.25v.25h6v-.25a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0-.75.75Z"></path>
  </svg>
);

const ForkIcon = () => (
  <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" className="fill-[#7d8590] w-4 h-4">
    <path d="M5 3.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm0 2.122a2.25 2.25 0 1 0-1.5 0v.878A2.25 2.25 0 0 0 5.75 8.5h1.5v2.128a2.251 2.251 0 1 0 1.5 0V8.5h1.5a2.25 2.25 0 0 0 2.25-2.25v-.878a2.25 2.25 0 1 0-1.5 0v.878a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 5 6.25v-.878Zm3.75 7.378a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm3-8.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"></path>
  </svg>
);

const PRIcon = ({ className = "fill-[#7d8590]" }: { className?: string }) => (
  <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" className={`${className} w-4 h-4`}>
    <path d="M5 3.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm0 2.122a2.25 2.25 0 1 0-1.5 0v5.256a2.251 2.251 0 1 0 1.5 0V5.372ZM11.25 6a.75.75 0 0 0-.75.75v.25h-5v-.25a.75.75 0 0 0-.75-.75H4v4h1.5v-2h5v2H12V6h-.75Z"></path>
  </svg>
);

const ReviewIcon = () => (
  <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" className="fill-[#7d8590] w-4 h-4">
    <path d="M8 2c4.35 0 8 3.12 8 6 0 2.88-3.65 6-8 6S0 10.88 0 8c0-2.88 3.65-6 8-6ZM1.5 8c0 1.88 2.8 4.5 6.5 4.5s6.5-2.62 6.5-4.5S11.7 3.5 8 3.5 1.5 6.12 1.5 8ZM8 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 1.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z"></path>
  </svg>
);

const CommentIcon = () => (
  <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" className="fill-[#7d8590] w-3.5 h-3.5 mr-1">
    <path d="M1 2.75C1 1.784 1.784 1 2.75 1h10.5c.966 0 1.75.784 1.75 1.75v7.5A1.75 1.75 0 0 1 13.25 12H9.06l-3.5 3.5a.75.75 0 0 1-1.25-.53v-2.97H2.75A1.75 1.75 0 0 1 1 11.25v-8.5ZM2.75 2.5a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25h3a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.75.75 0 0 1 .53-.22h4a.25.25 0 0 0 .25-.25v-8.5a.25.25 0 0 0-.25-.25H2.75Z"></path>
  </svg>
);

// Renders mathematically proportional addition/deletion diff blocks
const DiffBlocks = ({ additions, deletions }: { additions: number; deletions: number }) => {
  const total = additions + deletions;
  if (total === 0) {
    return (
      <div className="flex gap-0.5 items-center mr-1 select-none">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="w-1.5 h-1.5 bg-[#21262d] rounded-[1px] border border-[#30363d]/45"></span>
        ))}
      </div>
    );
  }

  const greenCount = Math.min(5, Math.max(additions > 0 ? 1 : 0, Math.round((additions / total) * 5)));
  const redCount = Math.min(5 - greenCount, Math.max(deletions > 0 ? 1 : 0, Math.round((deletions / total) * 5)));
  const emptyCount = 5 - greenCount - redCount;

  return (
    <div className="flex gap-0.5 items-center mr-1 select-none">
      {[...Array(greenCount)].map((_, i) => (
        <span key={`g-${i}`} className="w-1.5 h-1.5 bg-[#2ea043] rounded-[1px] shadow-sm"></span>
      ))}
      {[...Array(redCount)].map((_, i) => (
        <span key={`r-${i}`} className="w-1.5 h-1.5 bg-[#f85149]/80 rounded-[1px] shadow-sm"></span>
      ))}
      {[...Array(emptyCount)].map((_, i) => (
        <span key={`e-${i}`} className="w-1.5 h-1.5 bg-[#21262d] rounded-[1px] border border-[#30363d]/45"></span>
      ))}
    </div>
  );
};

export default function ContributionActivity({ year }: ContributionActivityProps) {
  const [activities, setActivities] = useState<MonthActivity[]>([]);
  const [loadedYears, setLoadedYears] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visibleMonths, setVisibleMonths] = useState(3);

  useEffect(() => {
    async function loadActivity() {
      setIsLoading(true);
      setError(null);
      setVisibleMonths(3);
      try {
        const res = await fetch(`/api/github/activity?year=${year}`);
        if (!res.ok) {
          throw new Error("Failed to load activities");
        }
        const data = await res.json();
        setActivities(data);
        setLoadedYears([year]);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    }
    loadActivity();
  }, [year]);

  const getIcon = (type: Category["type"]) => {
    switch (type) {
      case "commits": return <CommitIcon />;
      case "repos": return <RepoIcon />;
      case "pr_highlight": return <PRIcon className="fill-[#2ea043]" />;
      case "pr_others": return <PRIcon className="fill-[#7d8590]" />;
      case "reviews": return <ReviewIcon />;
    }
  };

  const minLoadedYear = loadedYears.length > 0 ? Math.min(...loadedYears) : year;
  const canLoadOlder = minLoadedYear > 2023;
  const hasMore = activities.length > visibleMonths || canLoadOlder;

  const handleShowMore = async () => {
    const nextVisible = visibleMonths + 3;

    if (nextVisible <= activities.length) {
      setVisibleMonths(nextVisible);
      return;
    }

    if (canLoadOlder) {
      setIsLoadingMore(true);
      try {
        const prevYear = minLoadedYear - 1;
        const res = await fetch(`/api/github/activity?year=${prevYear}`);
        if (res.ok) {
          const newData = await res.json();
          setActivities((prev) => {
            const existingMonths = new Set(prev.map((a) => a.month));
            const filteredNew = newData.filter((a: any) => !existingMonths.has(a.month));
            return [...prev, ...filteredNew];
          });
          setLoadedYears((prev) => [...prev, prevYear]);
          setVisibleMonths(nextVisible);
        }
      } catch (err) {
        console.error("Failed to load older activity:", err);
      } finally {
        setIsLoadingMore(false);
      }
    } else {
      setVisibleMonths(activities.length);
    }
  };

  const handleShowLess = () => {
    setVisibleMonths(3);
    setLoadedYears([year]);
    setActivities((prev) => prev.filter((a) => a.month.endsWith(year.toString())));
  };

  if (isLoading) {
    return (
      <div className="w-full mt-10">
        <h2 className="text-xl font-semibold text-[#e6edf3] mb-6">Contribution activity</h2>
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-32 bg-[#0d1117] rounded-md"></div>
          <div className="border-l border-[#30363d] ml-[15px] pl-[30px] space-y-4">
            <div className="h-16 bg-[#0d1117] rounded-xl"></div>
            <div className="h-24 bg-[#0d1117] rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || activities.length === 0) {
    return (
      <div className="w-full mt-10 text-center py-10 border border-[#30363d] rounded-xl bg-[#0d1117]">
        <h2 className="text-xl font-semibold text-[#e6edf3] mb-2">Contribution activity</h2>
        <p className="text-[#7d8590] text-sm">No activity recorded for this period.</p>
      </div>
    );
  }

  const displayedMonths = activities.slice(0, visibleMonths);

  return (
    <div className="w-full mt-10">
      <h2 className="text-xl font-semibold text-[#e6edf3] mb-6 select-none">Contribution activity</h2>

      <div className="relative">
        {displayedMonths.map((monthData) => (
          <div key={monthData.month} className="mb-8">
            {/* Month Header Divider */}
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <span className="text-xs font-semibold text-[#e6edf3] whitespace-nowrap bg-[#0d1117] pr-3 select-none">
                {monthData.month}
              </span>
              <div className="h-[1px] w-full bg-[#30363d]/50"></div>
            </div>

            {/* Vertical timeline section */}
            <div className="border-l border-[#30363d] ml-[15px] pl-[30px] relative space-y-8 select-none">
              {monthData.categories.map((category, catIndex) => (
                <div
                  key={catIndex}
                  className="relative group/item pt-1"
                >
                  {/* Timeline Circle with Icon */}
                  <div className="w-8 h-8 rounded-full border border-[#30363d] bg-[#0d1117] flex items-center justify-center absolute left-[-47px] top-[-2px] group-hover/item:border-[#58a6ff] transition-colors z-20 shadow-md">
                    {getIcon(category.type)}
                  </div>

                  {/* Category Header */}
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-semibold text-[#e6edf3] flex items-center gap-1">
                      {category.type === "pr_highlight" && category.pr ? (
                        <>
                          Created a pull request in{" "}
                          <a href={category.pr.url} target="_blank" rel="noreferrer" className="hover:text-[#58a6ff] underline decoration-transparent hover:decoration-[#58a6ff] transition-all">
                            {category.pr.repo}
                          </a>{" "}
                          that received {category.pr.comments} comment{category.pr.comments === 1 ? '' : 's'}
                        </>
                      ) : (
                        category.title
                      )}
                    </h3>
                    {category.date && (
                      <span className="text-xs text-[#7d8590]">{category.date}</span>
                    )}
                  </div>

                  {/* 1. Commits List */}
                  {category.type === "commits" && category.repos && (
                    <div className="space-y-3">
                      {category.repos.map((repo) => (
                        <div key={repo.name} className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                          <a href={repo.url} target="_blank" rel="noreferrer" className="text-[#e6edf3] font-semibold hover:text-[#58a6ff] hover:underline decoration-[#58a6ff] truncate">
                            {repo.name}
                          </a>
                          <div className="flex items-center gap-3 w-full sm:w-48 flex-shrink-0">
                            <div className="flex-1 h-2 bg-[#21262d] rounded-full overflow-hidden border border-[#30363d]/50">
                              <div 
                                className="h-full bg-[#39d353] rounded-full transition-all duration-500 shadow-[0_0_4px_rgba(57,211,83,0.3)]" 
                                style={{ width: `${repo.ratio}%` }}
                              />
                            </div>
                            <span className="text-xs text-[#7d8590] w-14 text-right underline decoration-transparent group-hover/item:decoration-[#7d8590] transition-colors">{repo.count} commit{repo.count === 1 ? '' : 's'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 2. Repositories Created List (With Forks indicator) */}
                  {category.type === "repos" && category.repos && (
                    <div className="space-y-3">
                      {category.repos.map((repo) => (
                        <div key={repo.name} className="flex justify-between items-center text-xs">
                          <a href={repo.url} target="_blank" rel="noreferrer" className="text-[#e6edf3] font-semibold hover:text-[#58a6ff] hover:underline decoration-[#58a6ff] flex items-center gap-2">
                            {repo.isFork ? <ForkIcon /> : <RepoIcon />}
                            {repo.name}
                          </a>
                          <div className="flex items-center gap-4 text-[#7d8590]">
                            {repo.language && (
                              <div className="flex items-center gap-1.5">
                                <span 
                                  className="w-3 h-3 rounded-full shadow-sm"
                                  style={{ backgroundColor: repo.color || "#8b949e" }}
                                />
                                <span className="text-xs">{repo.language}</span>
                              </div>
                            )}
                            <span className="text-xs">{repo.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 3. Pull Request Highlight Card */}
                  {category.type === "pr_highlight" && category.pr && (
                    <div className="border border-[#30363d] rounded-xl p-4 bg-transparent hover:border-[#58a6ff]/40 transition-colors shadow-sm">
                      <div className="flex gap-2 items-start mb-2">
                        <div className="pt-0.5 flex-shrink-0">
                          <PRIcon className="fill-[#2ea043]" />
                        </div>
                        <a 
                          href={category.pr.url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-[#e6edf3] text-sm font-bold hover:text-[#58a6ff] hover:underline decoration-[#58a6ff] transition-all leading-snug"
                        >
                          {category.pr.title}
                        </a>
                      </div>
                      
                      <div className="text-[11px] text-[#7d8590] ml-6 mb-3">
                        Opened in {category.pr.repo} • #{category.pr.number}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 ml-6 text-xs text-[#7d8590]">
                        <span className="text-[#2ea043] font-semibold">+{category.pr.additions}</span>
                        <span className="text-[#f85149] font-semibold">-{category.pr.deletions}</span>
                        
                        <DiffBlocks additions={category.pr.additions} deletions={category.pr.deletions} />

                        <span>lines changed</span>

                        {category.pr.comments > 0 && (
                          <div className="flex items-center ml-1 text-[#7d8590]">
                            <span>•</span>
                            <div className="flex items-center ml-2">
                              <CommentIcon />
                              <span>{category.pr.comments} comment{category.pr.comments === 1 ? '' : 's'}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 4. Other Pull Requests List (Grouped by Repo with States & Titles) */}
                  {category.type === "pr_others" && category.repos && (
                    <div className="space-y-4">
                      {category.repos.map((repo) => (
                        <div key={repo.name} className="text-xs">
                          {/* Repo header with state-colored pill */}
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[#7d8590] font-semibold">
                              {repo.name}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold select-none ${
                              repo.state === "merged"
                                ? "bg-[#261647] text-[#d6bdfa] border border-[#4c2d82]"
                                : repo.state === "closed"
                                ? "bg-[#2b1716] text-[#ff9e9a] border border-[#532725]"
                                : "bg-[#132318] text-[#85ea9d] border border-[#254d2e]"
                            }`}>
                              {repo.count} {repo.state || "open"}
                            </span>
                          </div>

                          {/* List of individual PR titles & states */}
                          <div className="space-y-2 pl-4 border-l border-[#30363d]/50">
                            {repo.prs?.map((pr, index) => (
                              <div key={index} className="flex justify-between items-start gap-4 py-1">
                                <a 
                                  href={pr.url} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="text-[#e6edf3] font-medium hover:text-[#58a6ff] hover:underline decoration-[#58a6ff] transition-all leading-normal flex items-start gap-2 flex-1"
                                >
                                  <div className="pt-0.5 flex-shrink-0">
                                    <PRIcon className={pr.state === "MERGED" ? "fill-[#a371f7]" : pr.state === "CLOSED" ? "fill-[#f85149]" : "fill-[#39d353]"} />
                                  </div>
                                  <span>{pr.title}</span>
                                </a>
                                <span className="text-[#7d8590] whitespace-nowrap text-[10px] pt-0.5">{pr.date}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 5. PR Reviews List */}
                  {category.type === "reviews" && category.repos && (
                    <div className="space-y-4">
                      {category.repos.map((repo) => (
                        <div key={repo.name} className="text-xs">
                          <span className="text-[#7d8590] block mb-2">
                            Reviewed pull requests in <span className="text-[#e6edf3] font-semibold">{repo.name}</span>
                          </span>
                          
                          <div className="space-y-2 pl-4 border-l border-[#30363d]/50">
                            {category.prs?.map((pr, index) => (
                              <div key={index} className="flex justify-between items-start gap-4 py-1">
                                <a 
                                  href={pr.url} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="text-[#e6edf3] font-medium hover:text-[#58a6ff] hover:underline decoration-[#58a6ff] transition-all leading-normal flex items-start gap-2 flex-1"
                                >
                                  <div className="pt-0.5 flex-shrink-0">
                                    <svg aria-hidden="true" height="14" viewBox="0 0 16 16" version="1.1" width="14" className="fill-[#7d8590] w-3.5 h-3.5">
                                      <path d="M1 2.75C1 1.784 1.784 1 2.75 1h10.5c.966 0 1.75.784 1.75 1.75v7.5A1.75 1.75 0 0 1 13.25 12H9.06l-3.5 3.5a.75.75 0 0 1-1.25-.53v-2.97H2.75A1.75 1.75 0 0 1 1 11.25v-8.5ZM2.75 2.5a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25h3a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.75.75 0 0 1 .53-.22h4a.25.25 0 0 0 .25-.25v-8.5a.25.25 0 0 0-.25-.25H2.75Z"></path>
                                    </svg>
                                  </div>
                                  <span>{pr.title}</span>
                                </a>
                                <span className="text-[#7d8590] whitespace-nowrap text-[10px] pt-0.5">{pr.date}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Show more activity / Show less buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        {hasMore && (
          <button
            onClick={handleShowMore}
            disabled={isLoadingMore}
            className="flex-1 py-2 border border-[#30363d] hover:border-[#8b949e] hover:bg-[#21262d]/25 text-[#58a6ff] hover:text-[#58a6ff] text-xs font-semibold rounded-md transition-all text-center select-none disabled:opacity-50 cursor-pointer shadow-sm"
          >
            {isLoadingMore ? "Loading more activity..." : "Show more activity"}
          </button>
        )}
        {visibleMonths > 3 && (
          <button
            onClick={handleShowLess}
            className="flex-1 py-2 border border-[#30363d] hover:border-[#8b949e] hover:bg-[#21262d]/25 text-[#58a6ff] hover:text-[#58a6ff] text-xs font-semibold rounded-md transition-all text-center select-none cursor-pointer shadow-sm"
          >
            Show less
          </button>
        )}
      </div>
    </div>
  );
}
