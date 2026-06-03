"use client";

import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

export default function SetupTOTP() {
  const [setupData, setSetupData] = useState<{ secret: string; otpauth: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/totp-setup")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setSetupData(data);
        }
      })
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1117] text-[#e6edf3]">
      <div className="max-w-md w-full p-8 bg-[#161b22] border border-[#30363d] rounded-xl shadow-lg">
        <h1 className="text-2xl font-semibold mb-6 text-center">Setup Authenticator App</h1>
        
        {error && (
          <div className="p-4 mb-6 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        {setupData && (
          <div className="flex flex-col items-center">
            <p className="text-sm text-[#7d8590] mb-6 text-center">
              Scan this QR code with your Google Authenticator, Microsoft Authenticator, or Authy app.
            </p>
            
            <div className="p-4 bg-white rounded-xl mb-6">
              <QRCode value={setupData.otpauth} size={200} />
            </div>

            <p className="text-xs text-[#7d8590] mb-2">Or enter this secret manually:</p>
            <code className="px-3 py-1.5 bg-[#0d1117] border border-[#30363d] rounded text-[#58a6ff] font-mono select-all">
              {setupData.secret}
            </code>

            <div className="mt-8 text-sm text-[#7d8590]">
              Once you have scanned the code, you can close this page. You will use the 6-digit codes to add new projects.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
