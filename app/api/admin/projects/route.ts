import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/cache';
import { ProjectState } from '@/models/ProjectState';
import { GITHUB_USERNAME } from '@/config/github';
import { getLocalProjects, saveLocalProjects } from '@/lib/localDb';
import * as OTPAuth from 'otpauth';

async function verifyAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get('portfolio_admin_session');
  return session?.value === 'true';
}

export async function GET() {
  try {
    const isAuth = await verifyAuth();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const conn = await connectToDatabase();

    // 1. Fetch all repositories from GitHub sorted by pushed
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=pushed&direction=desc`, {
      headers: {
        ...(process.env.GITHUB_TOKEN && { Authorization: `token ${process.env.GITHUB_TOKEN}` }),
        Accept: 'application/vnd.github.v3+json',
      },
      next: { revalidate: 60 } 
    });

    if (!res.ok) {
      throw new Error('Failed to fetch GitHub repos');
    }

    const repos = await res.json();
    const hardcodedProjects = new Set([
      "codeContext",
      "medical-graph-rag",
      "Briefly",
      "collaborative-code-editor",
      "url-shortener",
      "FoodBridge",
      "hobby-match",
      "BudgetBuddy",
      "Prep"
    ]);

    const newRepos = Array.isArray(repos) 
      ? repos.filter((r: any) => !hardcodedProjects.has(r.name))
      : [];
      
    const top3Repos = newRepos.slice(0, 3);

    // 2. Sync with MongoDB or LocalDB
    let newProjects = [];
    let allPending = [];

    if (conn) {
      const existingStates = await ProjectState.find({});
      const existingRepoNames = new Set(existingStates.map((p) => p.repoName));

      for (const repo of top3Repos) {
        if (repo.fork) continue;
        if (!existingRepoNames.has(repo.name)) {
          const newState = new ProjectState({
            repoName: repo.name,
            status: 'pending',
            description: repo.description || `An exciting new ${repo.language || 'software'} project recently published on GitHub. Check out the repository for more details!`,
            language: repo.language || 'Unknown',
            topics: repo.topics || [],
          });
          await newState.save();
          newProjects.push(newState);
        }
      }
      allPending = await ProjectState.find({ status: 'pending' }).sort({ createdAt: -1 });
    } else {
      // LocalDB fallback
      let localProjects = getLocalProjects();
      const existingRepoNames = new Set(localProjects.map((p) => p.repoName));
      let updated = false;

      for (const repo of top3Repos) {
        if (repo.fork) continue;
        if (!existingRepoNames.has(repo.name)) {
          localProjects.push({
            _id: Math.random().toString(36).substring(7),
            repoName: repo.name,
            status: 'pending',
            description: repo.description || `An exciting new ${repo.language || 'software'} project recently published on GitHub. Check out the repository for more details!`,
            language: repo.language || 'Unknown',
            topics: repo.topics || [],
            updatedAt: Date.now()
          });
          updated = true;
        }
      }
      if (updated) saveLocalProjects(localProjects);
      allPending = localProjects.filter(p => p.status === 'pending').sort((a, b) => b.updatedAt - a.updatedAt);
    }

    // 3. Filter pending projects to only show those in the top 3 latest pushes
    const top3RepoNames = new Set(top3Repos.map(r => r.name));
    allPending = allPending.filter((p: any) => top3RepoNames.has(p.repoName));

    return NextResponse.json({ pendingProjects: allPending });
  } catch (error) {
    console.error('Error fetching admin projects:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const isAuth = await verifyAuth();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { repoName, action, description, language, topics, token } = await request.json();

    if (!repoName || !['approve', 'ignore'].includes(action)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // Verify TOTP token only for approval actions
    if (action === 'approve') {
      if (!token) {
        return NextResponse.json({ error: 'Authenticator token is required' }, { status: 400 });
      }

      const secret = process.env.PORTFOLIO_TOTP_SECRET;
      if (!secret) {
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
      }

      const totp = new OTPAuth.TOTP({ secret: OTPAuth.Secret.fromBase32(secret) });
      const isValid = totp.validate({ token, window: 1 }) !== null;

      if (!isValid) {
        return NextResponse.json({ error: 'Invalid authenticator code' }, { status: 401 });
      }
    }

    const conn = await connectToDatabase();

    let updatedProject = null;

    if (conn) {
      const updateData: any = { status: action === 'approve' ? 'approved' : 'ignored' };
      if (description !== undefined) updateData.description = description;
      if (language !== undefined) updateData.language = language;
      if (topics !== undefined) updateData.topics = topics;

      updatedProject = await ProjectState.findOneAndUpdate(
        { repoName },
        updateData,
        { new: true }
      );
    } else {
      let localProjects = getLocalProjects();
      const index = localProjects.findIndex(p => p.repoName === repoName);
      if (index !== -1) {
        localProjects[index].status = action === 'approve' ? 'approved' : 'ignored';
        if (description !== undefined) localProjects[index].description = description;
        if (language !== undefined) localProjects[index].language = language;
        if (topics !== undefined) localProjects[index].topics = topics;
        localProjects[index].updatedAt = Date.now();
        saveLocalProjects(localProjects);
        updatedProject = localProjects[index];
      }
    }

    return NextResponse.json({ success: true, project: updatedProject });
  } catch (error) {
    console.error('Error updating project state:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
