const fs = require('fs');
const path = require('path');

// Load .env.local
const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length === 2) {
      process.env[parts[0].trim()] = parts[1].trim();
    }
  });
}

const GITHUB_USERNAME = process.env.NEXT_PUBLIC_GITHUB_USERNAME || "shivprasad08";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

async function run() {
  const { graphql } = require("@octokit/graphql");
  const graphqlWithAuth = graphql.defaults({
    headers: {
      authorization: `token ${GITHUB_TOKEN}`,
    },
  });

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
    const response = await graphqlWithAuth(query, { login: GITHUB_USERNAME });
    
    const calendars = [
      response.user.c2023.contributionCalendar,
      response.user.c2024.contributionCalendar,
      response.user.c2025.contributionCalendar,
      response.user.c2026.contributionCalendar,
    ];

    const rawDays = calendars.flatMap(c => c.weeks.flatMap(w => w.contributionDays));

    // Deduplicate
    const uniqueDaysMap = new Map();
    for (const day of rawDays) {
      const existing = uniqueDaysMap.get(day.date);
      if (!existing || day.contributionCount > existing.contributionCount) {
        uniqueDaysMap.set(day.date, day);
      }
    }

    const allDays = Array.from(uniqueDaysMap.values());
    allDays.sort((a, b) => a.date.localeCompare(b.date));

    // Filter May 2026
    const may2026Days = allDays.filter(d => d.date.startsWith("2026-05"));
    console.log("May 2026 Days with contributions:", may2026Days.filter(d => d.contributionCount > 0));

  } catch (error) {
    console.error(error);
  }
}

run();
