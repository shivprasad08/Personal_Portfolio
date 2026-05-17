import { NextResponse } from "next/server";
import { fetchAllGitHubStats } from "@/lib/github";
import { format, parseISO } from "date-fns";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const calendar = await fetchAllGitHubStats();
    
    const rawDays = calendar.weeks.flatMap((w: any) => w.contributionDays);
    const today = new Date().toISOString().split('T')[0];
    
    console.log("DEBUG: rawDays count =", rawDays.length);
    
    // Check for duplicates in rawDays
    const datesSeen = new Set<string>();
    const duplicates: string[] = [];
    rawDays.forEach((d: any) => {
      if (datesSeen.has(d.date)) {
        duplicates.push(d.date);
      }
      datesSeen.add(d.date);
    });
    console.log("DEBUG: Duplicate dates in rawDays =", duplicates);
    
    // Deduplicate days by date (keeping the one with the higher contributionCount in case of overlaps)
    const uniqueDaysMap = new Map<string, any>();
    for (const day of rawDays) {
      const existing = uniqueDaysMap.get(day.date);
      if (!existing || day.contributionCount > existing.contributionCount) {
        uniqueDaysMap.set(day.date, day);
      }
    }
    
    const allDays = Array.from(uniqueDaysMap.values());
    console.log("DEBUG: allDays count (deduplicated) =", allDays.length);
    
    // Sort allDays chronologically to ensure proper streak calculations
    allDays.sort((a: any, b: any) => a.date.localeCompare(b.date));
    
    // Calculate total contributions by summing unique days
    const totalContributions = allDays.reduce((acc: number, day: any) => acc + day.contributionCount, 0);
    console.log("DEBUG: calculated totalContributions =", totalContributions);
    
    // Calculate streaks
    let currentStreak = 0;
    let longestStreak = 0;
    let currentStreakStart = "";
    let currentStreakEnd = "";
    let longestStreakStart = "";
    let longestStreakEnd = "";
    
    let tempStreak = 0;
    let tempStart = "";
    
    for (const day of allDays) {
      if (day.date > today) break;
      
      if (day.contributionCount > 0) {
        if (tempStreak === 0) tempStart = day.date;
        tempStreak++;
        currentStreak = tempStreak;
        currentStreakStart = tempStart;
        currentStreakEnd = day.date;
        
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
          longestStreakStart = tempStart;
          longestStreakEnd = day.date;
        }
      } else {
        // If it's today and 0, current streak might be from yesterday, but we'll reset if it's strictly < today
        if (day.date < today) {
          tempStreak = 0;
          tempStart = "";
        }
      }
    }

    // Check if current streak is broken (0 contributions today AND yesterday)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    const todayData = allDays.find((d: any) => d.date === today);
    const yesterdayData = allDays.find((d: any) => d.date === yesterdayStr);
    
    if ((!todayData || todayData.contributionCount === 0) && (!yesterdayData || yesterdayData.contributionCount === 0)) {
       currentStreak = 0;
       currentStreakStart = "";
       currentStreakEnd = "";
    }

    const formatDate = (dateStr: string) => dateStr ? format(parseISO(dateStr), "MMM d, yyyy") : "";
    const formatRange = (start: string, end: string) => {
      if (!start || !end) return "No current streak";
      if (start === end) return formatDate(start);
      return `${format(parseISO(start), "MMM d")} – ${format(parseISO(end), "MMM d")}`;
    };
    
    const formatLongestRange = (start: string, end: string) => {
      if (!start || !end) return "No streak";
      if (start === end) return formatDate(start);
      return `${formatDate(start)} – ${formatDate(end)}`;
    };

    // Find the first ever active contribution day to start the range
    const firstActiveDay = allDays.find((d: any) => d.contributionCount > 0);
    const firstDate = firstActiveDay ? firstActiveDay.date : (allDays[0]?.date || "");

    return NextResponse.json({
      totalContributions,
      contributionRange: firstDate ? `${formatDate(firstDate)} – Present` : "Present",
      currentStreak,
      currentStreakRange: formatRange(currentStreakStart, currentStreakEnd),
      longestStreak,
      longestStreakRange: formatLongestRange(longestStreakStart, longestStreakEnd)
    });
  } catch (error) {
    console.error("Failed to fetch GitHub stats:", error);
    return NextResponse.json({
      totalContributions: 0,
      contributionRange: "Error loading data",
      currentStreak: 0,
      currentStreakRange: "Error",
      longestStreak: 0,
      longestStreakRange: "Error"
    }, { status: 500 });
  }
}
