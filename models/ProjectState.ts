import mongoose, { Document, Model, Schema } from 'mongoose';
import { GITHUB_USERNAME } from '@/config/github';

export interface IProjectState extends Document {
  repoName: string;
  status: 'pending' | 'approved' | 'ignored';
  description?: string;
  language?: string;
  topics?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProjectStateSchema = new Schema<IProjectState>(
  {
    repoName: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'ignored'],
      default: 'pending',
    },
    description: {
      type: String,
    },
    language: {
      type: String,
    },
    topics: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent mongoose from compiling the model twice in Next.js development mode
export const ProjectState: Model<IProjectState> =
  mongoose.models.ProjectState || mongoose.model<IProjectState>('ProjectState', ProjectStateSchema);
