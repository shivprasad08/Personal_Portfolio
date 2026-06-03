"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";

interface Project {
  _id: string;
  repoName: string;
  description: string;
  language: string;
  topics: string[];
}

export default function ProjectAlerts() {
  const [pendingProjects, setPendingProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [showTotpModal, setShowTotpModal] = useState(false);
  const [token, setToken] = useState("");
  const [actionType, setActionType] = useState<"approve" | "ignore" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchPendingProjects();
  }, []);

  useEffect(() => {
    if (pendingProjects.length > 0 && !currentProject) {
      setCurrentProject(pendingProjects[0]);
    }
  }, [pendingProjects, currentProject]);

  const fetchPendingProjects = async () => {
    try {
      const res = await fetch("/api/admin/projects");
      if (res.ok) {
        const data = await res.json();
        setPendingProjects(data.pendingProjects || []);
      }
    } catch (err) {
      console.error("Failed to fetch pending projects:", err);
    }
  };

  const handleActionClick = (action: "approve" | "ignore") => {
    if (action === "ignore") {
      executeAction("ignore");
    } else {
      setActionType(action);
      setShowTotpModal(true);
      setToken("");
      setError("");
    }
  };

  const executeAction = async (actionToRun: "approve" | "ignore", tokenValue?: string) => {
    if (!currentProject) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoName: currentProject.repoName,
          action: actionToRun,
          description: currentProject.description,
          language: currentProject.language,
          topics: currentProject.topics,
          ...(tokenValue && { token: tokenValue }),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setShowTotpModal(false);
        setPendingProjects((prev) => prev.filter((p) => p._id !== currentProject._id));
        setCurrentProject(null);
        router.refresh();
      } else {
        setError(data.error || "Failed to verify token");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const submitAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (actionType === "approve" && token.length === 6) {
      await executeAction("approve", token);
    }
  };

  if (!currentProject && pendingProjects.length === 0) return null;

  return (
    <>
      <AnimatePresence>
        {currentProject && !showTotpModal && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 right-6 z-50 w-80 bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="bg-[#1f242c] px-4 py-3 border-b border-[#30363d] flex justify-between items-center">
              <h3 className="text-[#e6edf3] font-semibold text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#3fb950] animate-pulse"></span>
                New Project Detected
              </h3>
              <button 
                onClick={() => handleActionClick("ignore")}
                className="text-[#7d8590] hover:text-[#f85149] transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-4">
              <p className="text-[#58a6ff] font-semibold mb-1">{currentProject.repoName}</p>
              <p className="text-[#7d8590] text-xs line-clamp-2 mb-4">
                {currentProject.description || "No description provided."}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleActionClick("ignore")}
                  className="flex-1 px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] text-xs font-semibold rounded-md transition-colors"
                >
                  Ignore
                </button>
                <button
                  onClick={() => handleActionClick("approve")}
                  className="flex-1 px-3 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-1"
                >
                  <Check size={14} /> Add to Portfolio
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTotpModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl w-full max-w-sm overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-center mb-4 text-[#d29922]">
                  <ShieldAlert size={48} />
                </div>
                <h3 className="text-[#e6edf3] text-xl font-semibold text-center mb-2">
                  Authenticator Required
                </h3>
                <p className="text-[#7d8590] text-sm text-center mb-6">
                  Please enter the 6-digit code from your authenticator app to {actionType} <strong>{currentProject?.repoName}</strong>.
                </p>

                <form onSubmit={submitAction}>
                  {error && (
                    <div className="mb-4 p-2 bg-red-900/30 border border-red-500/50 rounded text-red-200 text-xs text-center">
                      {error}
                    </div>
                  )}

                  <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                    placeholder="000000"
                    autoFocus
                    className="w-full text-center tracking-[0.5em] text-2xl p-3 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#e6edf3] placeholder:text-[#484f58] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all mb-4"
                  />

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowTotpModal(false)}
                      className="flex-1 py-2 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] font-medium rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={token.length !== 6 || loading}
                      className="flex-1 py-2 bg-[#238636] hover:bg-[#2ea043] disabled:bg-[#238636]/50 disabled:text-white/50 text-white font-medium rounded-lg transition-colors"
                    >
                      {loading ? "Verifying..." : "Confirm"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
