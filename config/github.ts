const rawUsername = process.env.NEXT_PUBLIC_GITHUB_USERNAME || "shivprasad08";
export const GITHUB_USERNAME = rawUsername.trim().split(/[\s\n]+/)[0];
export const GITHUB_TOKEN = process.env.PORTFOLIO_GITHUB_TOKEN || process.env.GITHUB_TOKEN;
