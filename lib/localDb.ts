import fs from 'fs';
import path from 'path';

export interface LocalProjectState {
  _id: string;
  repoName: string;
  status: 'pending' | 'approved' | 'ignored';
  description: string;
  language: string;
  topics: string[];
  updatedAt: number;
}

const dbPath = path.join(process.cwd(), 'data', 'projectStates.json');

export function getLocalProjects(): LocalProjectState[] {
  try {
    if (!fs.existsSync(dbPath)) {
      return [];
    }
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading local DB:', error);
    return [];
  }
}

export function saveLocalProjects(projects: LocalProjectState[]) {
  try {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dbPath, JSON.stringify(projects, null, 2));
  } catch (error) {
    console.error('Error writing local DB:', error);
  }
}
