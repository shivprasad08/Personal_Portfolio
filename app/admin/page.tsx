"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (data.success) {
        // Redirect to homepage where alerts will now appear
        router.push("/");
        router.refresh();
      } else {
        setError(data.error || "Invalid token");
      }
    } catch (err) {
      setError("An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1117] text-[#e6edf3]">
      <form 
        onSubmit={handleLogin}
        className="max-w-sm w-full p-8 bg-[#161b22] border border-[#30363d] rounded-xl shadow-lg"
      >
        <h1 className="text-2xl font-semibold mb-6 text-center">Admin Access</h1>
        
        <p className="text-sm text-[#7d8590] mb-6 text-center">
          Enter the 6-digit code from your authenticator app.
        </p>

        {error && (
          <div className="p-3 mb-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
            {error}
          </div>
        )}

        <div className="mb-6">
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
            placeholder="000000"
            className="w-full text-center tracking-[0.5em] text-2xl p-4 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#e6edf3] placeholder:text-[#484f58] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all"
            autoFocus
          />
        </div>

        <button
          type="submit"
          disabled={token.length !== 6 || loading}
          className="w-full py-3 bg-[#238636] hover:bg-[#2ea043] disabled:bg-[#238636]/50 disabled:text-white/50 text-white font-medium rounded-lg transition-colors"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
}
