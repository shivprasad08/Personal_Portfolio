import { graphql } from "@octokit/graphql";
import { GITHUB_USERNAME, GITHUB_TOKEN } from "@/config/github";

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

export async function fetchAllGitHubStats() {
  if (!GITHUB_TOKEN) {
    throw new Error("GITHUB_TOKEN is not set");
  }

  const query = `
    query userInfo($login: String!) {
      user(login: $login) {
        c2023: contributionsCollection(from: "2023-01-01T00:00:00Z", to: "2023-12-31T23:59:59Z") {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
        c2024: contributionsCollection(from: "2024-01-01T00:00:00Z", to: "2024-12-31T23:59:59Z") {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
        c2025: contributionsCollection(from: "2025-01-01T00:00:00Z", to: "2025-12-31T23:59:59Z") {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
        c2026: contributionsCollection(from: "2026-01-01T00:00:00Z", to: "2026-12-31T23:59:59Z") {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response: any = await graphqlWithAuth(query, { login: GITHUB_USERNAME });
    
    // Combine all years' contribution calendars
    const calendars = [
      response.user.c2023.contributionCalendar,
      response.user.c2024.contributionCalendar,
      response.user.c2025.contributionCalendar,
      response.user.c2026.contributionCalendar,
    ];

    // Merge weeks
    const allWeeks = calendars.flatMap(c => c.weeks);

    // Sum up total contributions
    const totalContributions = calendars.reduce((acc, c) => acc + c.totalContributions, 0);

    return {
      totalContributions,
      weeks: allWeeks
    };
  } catch (error) {
    console.error("Error fetching all GitHub stats:", error);
    throw error;
  }
}

export async function fetchGitHubStats(year?: string) {
  if (!GITHUB_TOKEN) {
    throw new Error("GITHUB_TOKEN is not set");
  }

  // Determine start and end dates based on the year passed
  let fromStr = "";
  let toStr = "";

  if (year) {
    fromStr = `${year}-01-01T00:00:00Z`;
    toStr = `${year}-12-31T23:59:59Z`;
  }

  const query = `
    query userInfo($login: String!, $from: DateTime, $to: DateTime) {
      user(login: $login) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `;

  try {
    const variables: any = { login: GITHUB_USERNAME };
    if (year) {
      variables.from = fromStr;
      variables.to = toStr;
    }
    
    const response: any = await graphqlWithAuth(query, variables);
    return response.user.contributionsCollection.contributionCalendar;
  } catch (error) {
    console.error("Error fetching GitHub stats:", error);
    throw error;
  }
}

export async function fetchGitHubActivity() {
  if (!GITHUB_TOKEN) {
    throw new Error("GITHUB_TOKEN is not set");
  }

  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=100`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
      next: { revalidate: 900 } // 15 mins cache
    });
    
    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.statusText}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error("Error fetching GitHub activity:", error);
    throw error;
  }
}
