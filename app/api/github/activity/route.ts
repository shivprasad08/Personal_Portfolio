import { NextResponse } from "next/server";
import { GITHUB_USERNAME, GITHUB_TOKEN } from "@/config/github";
import { graphql } from "@octokit/graphql";
import { format, parseISO } from "date-fns";

export const dynamic = "force-dynamic";

const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${GITHUB_TOKEN}`,
  },
  request: {
    fetch: (url: any, opts: any) => {
      return fetch(url, {
        ...opts,
        cache: "no-store",
      });
    },
  },
});

export async function GET(request: Request) {
  if (!GITHUB_TOKEN) {
    return NextResponse.json({ error: "GITHUB_TOKEN not configured" }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const year = parseInt(searchParams.get("year") || new Date().getFullYear().toString(), 10);

  // Construct 12 monthly aliases in a single query
  let queryFields = "";
  for (let m = 1; m <= 12; m++) {
    const monthStr = m < 10 ? `0${m}` : `${m}`;
    const nextMonth = m === 12 ? 1 : m + 1;
    const nextYear = m === 12 ? year + 1 : year;
    const nextMonthStr = nextMonth < 10 ? `0${nextMonth}` : `${nextMonth}`;
    
    const fromStr = `${year}-${monthStr}-01T00:00:00Z`;
    const toStr = `${nextYear}-${nextMonthStr}-01T00:00:00Z`;
    
    queryFields += `
      m${m}: contributionsCollection(from: "${fromStr}", to: "${toStr}") {
        commitContributionsByRepository(maxRepositories: 50) {
          repository {
            nameWithOwner
            url
          }
          contributions {
            totalCount
          }
        }
        repositoryContributions(first: 50) {
          nodes {
            occurredAt
            repository {
              nameWithOwner
              url
              isFork
              primaryLanguage {
                name
                color
              }
            }
          }
        }
        pullRequestContributions(first: 50) {
          nodes {
            occurredAt
            pullRequest {
              title
              url
              number
              state
              additions
              deletions
              changedFiles
              comments {
                totalCount
              }
              repository {
                nameWithOwner
              }
            }
          }
        }
        pullRequestReviewContributions(first: 50) {
          nodes {
            occurredAt
            pullRequestReview {
              pullRequest {
                title
                url
                number
              }
              repository {
                nameWithOwner
              }
            }
          }
        }
      }
    `;
  }

  const query = `
    query monthlyActivity($login: String!) {
      user(login: $login) {
        ${queryFields}
      }
    }
  `;

  try {
    const response: any = await graphqlWithAuth(query, { login: GITHUB_USERNAME });
    const user = response.user;

    const result: any[] = [];
    const months = [
      "January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"
    ];

    // Loop backward from December to January to display newest months first
    for (let m = 12; m >= 1; m--) {
      const monthData = user[`m${m}`];
      if (!monthData) continue;

      const categories: any[] = [];

      // 1. Commits Category
      const commitRepos = monthData.commitContributionsByRepository || [];
      if (commitRepos.length > 0) {
        const totalCommits = commitRepos.reduce((acc: number, c: any) => acc + c.contributions.totalCount, 0);
        const totalReposCount = commitRepos.length;
        
        categories.push({
          type: "commits",
          title: `Created ${totalCommits} commit${totalCommits === 1 ? '' : 's'} in ${totalReposCount} repositor${totalReposCount === 1 ? 'y' : 'ies'}`,
          repos: commitRepos.map((c: any) => {
            const count = c.contributions.totalCount;
            const ratio = totalCommits > 0 ? Math.round((count / totalCommits) * 100) : 0;
            return {
              name: c.repository.nameWithOwner,
              url: c.repository.url,
              count,
              ratio
            };
          })
        });
      }

      // 2. Repositories Created Category
      const repoNodes = monthData.repositoryContributions?.nodes || [];
      if (repoNodes.length > 0) {
        categories.push({
          type: "repos",
          title: `Created ${repoNodes.length} repositor${repoNodes.length === 1 ? 'y' : 'ies'}`,
          repos: repoNodes.map((r: any) => ({
            name: r.repository.nameWithOwner,
            url: r.repository.url,
            isFork: r.repository.isFork || false,
            language: r.repository.primaryLanguage?.name || null,
            color: r.repository.primaryLanguage?.color || null,
            date: format(parseISO(r.occurredAt), "MMM d")
          }))
        });
      }

      // 3. Pull Requests Category
      const prNodes = monthData.pullRequestContributions?.nodes || [];
      if (prNodes.length > 0) {
        // Highlight the latest PR
        const sortedPRs = [...prNodes].sort((a: any, b: any) => b.occurredAt.localeCompare(a.occurredAt));
        const highlightNode = sortedPRs[0];
        const highlightPR = highlightNode.pullRequest;
        
        const prComments = highlightPR.comments?.totalCount || 0;
        categories.push({
          type: "pr_highlight",
          title: `Created a pull request in ${highlightPR.repository.nameWithOwner} that received ${prComments} comment${prComments === 1 ? '' : 's'}`,
          date: format(parseISO(highlightNode.occurredAt), "MMM d"),
          pr: {
            number: highlightPR.number,
            title: highlightPR.title,
            repo: highlightPR.repository.nameWithOwner,
            url: highlightPR.url,
            additions: highlightPR.additions,
            deletions: highlightPR.deletions,
            changedFiles: highlightPR.changedFiles,
            comments: prComments,
            date: format(parseISO(highlightNode.occurredAt), "MMM d")
          }
        });

        // Group the remaining PRs as "other pull requests"
        if (sortedPRs.length > 1) {
          const others = sortedPRs.slice(1);
          
          // Group by repository
          const reposGroup: Record<string, any> = {};
          others.forEach((o: any) => {
            const pr = o.pullRequest;
            const repoName = pr.repository.nameWithOwner;
            if (!reposGroup[repoName]) {
              reposGroup[repoName] = {
                name: repoName,
                count: 0,
                mergedCount: 0,
                prs: []
              };
            }
            reposGroup[repoName].count++;
            if (pr.state === "MERGED") {
              reposGroup[repoName].mergedCount++;
            }
            reposGroup[repoName].prs.push({
              title: pr.title,
              url: pr.url,
              state: pr.state,
              date: format(parseISO(o.occurredAt), "MMM d")
            });
          });

          const totalRepos = Object.keys(reposGroup).length;

          categories.push({
            type: "pr_others",
            title: `Opened ${others.length} other pull request${others.length === 1 ? '' : 's'} in ${totalRepos} repositor${totalRepos === 1 ? 'y' : 'ies'}`,
            repos: Object.values(reposGroup).map((g: any) => {
              // Determine primary state of the group
              let groupState = "open";
              if (g.mergedCount === g.count) {
                groupState = "merged";
              } else if (g.prs.some((p: any) => p.state === "CLOSED")) {
                groupState = "closed";
              }
              return {
                name: g.name,
                count: g.count,
                state: groupState,
                prs: g.prs
              };
            })
          });
        }
      }

      // 4. Pull Request Reviews Category
      const reviewNodes = monthData.pullRequestReviewContributions?.nodes || [];
      if (reviewNodes.length > 0) {
        const sortedReviews = [...reviewNodes].sort((a: any, b: any) => b.occurredAt.localeCompare(a.occurredAt));
        const reposMap = new Map<string, number>();
        sortedReviews.forEach((r: any) => {
          const repoName = r.pullRequestReview.repository.nameWithOwner;
          reposMap.set(repoName, (reposMap.get(repoName) || 0) + 1);
        });

        categories.push({
          type: "reviews",
          title: `Reviewed ${sortedReviews.length} pull request${sortedReviews.length === 1 ? '' : 's'} in ${reposMap.size} repositor${reposMap.size === 1 ? 'y' : 'ies'}`,
          repos: Array.from(reposMap.entries()).map(([name, count]) => ({
            name,
            count
          })),
          prs: sortedReviews.map((r: any) => ({
            title: r.pullRequestReview.pullRequest.title,
            url: r.pullRequestReview.pullRequest.url,
            date: format(parseISO(r.occurredAt), "MMM d")
          }))
        });
      }

      // Only add month if there was active activity
      if (categories.length > 0) {
        result.push({
          month: `${months[m - 1]} ${year}`,
          categories
        });
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("GraphQL failed to fetch activities:", error);
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 });
  }
}
