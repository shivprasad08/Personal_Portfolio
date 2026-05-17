import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const token = process.env.PORTFOLIO_GITHUB_TOKEN;
  const vercelToken = process.env.GITHUB_TOKEN;
  
  return NextResponse.json({
    username: process.env.NEXT_PUBLIC_GITHUB_USERNAME || "not set",
    tokenExists: !!token,
    tokenPrefix: token ? token.substring(0, 7) : "none",
    tokenLength: token ? token.length : 0,
    vercelGithubTokenExists: !!vercelToken,
    vercelGithubTokenPrefix: vercelToken ? vercelToken.substring(0, 7) : "none",
    vercelGithubTokenLength: vercelToken ? vercelToken.length : 0,
  });
}
