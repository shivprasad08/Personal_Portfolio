import { NextResponse } from "next/server";
import { fetchGitHubStats } from "@/lib/github";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year");

  try {
    const calendar = await fetchGitHubStats(year || undefined);

    // Map GitHub's data structure to what our component expects
    const weeks = calendar.weeks.map((week: any) => ({
      contributionDays: week.contributionDays.map((day: any) => {
        const count = day.contributionCount;
        let level = 0;
        if (count > 0 && count <= 3) level = 1;
        else if (count > 3 && count <= 6) level = 2;
        else if (count > 6 && count <= 9) level = 3;
        else if (count > 9) level = 4;

        return {
          date: day.date,
          count: count,
          level: level
        };
      })
    }));

    return NextResponse.json({
      totalContributions: calendar.totalContributions,
      weeks
    });
  } catch (error) {
    console.error("Failed to fetch GitHub contributions:", error);
    return NextResponse.json({
      totalContributions: 0,
      weeks: []
    }, { status: 500 });
  }
}
