import mongoose, { Schema } from "mongoose";

const GithubCacheSchema = new Schema({
  key: { type: String, unique: true },
  data: Schema.Types.Mixed,
  fetchedAt: { type: Date, default: Date.now, expires: 3600 }
});

export default mongoose.models.GithubCache || mongoose.model("GithubCache", GithubCacheSchema);
