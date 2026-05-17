"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, ShieldCheck, X, Eye, Image as ImageIcon } from "lucide-react";
import { certificates, Certificate } from "@/data/certificates";

export default function Certificates() {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [imageError, setImageError] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  const displayedCertificates = certificates.slice(0, visibleCount);
  const hasMore = visibleCount < certificates.length;

  const handleShowMore = () => {
    setVisibleCount(certificates.length);
  };

  return (
    <section id="certificates" className="scroll-mt-24">
      <div className="flex items-center gap-2 mb-6 border-b border-[#30363d] pb-2">
        <Award size={24} className="text-[#e6edf3]" />
        <h2 className="text-2xl font-normal text-[#e6edf3]">Certifications</h2>
        <span className="ml-2 bg-[#21262d] text-[#e6edf3] text-xs px-2 py-1 rounded-full border border-[#30363d] select-none">
          {certificates.length}
        </span>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {displayedCertificates.map((cert, i) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 4) * 0.05, duration: 0.2 }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(57, 211, 83, 0.1)" }}
              className="p-5 bg-[#161b22] border border-[#30363d] rounded-xl hover:border-[#39d353] transition-all group flex flex-col h-full relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#39d353]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="mb-4 text-[#7d8590] group-hover:text-[#39d353] transition-colors select-none">
                <ShieldCheck size={32} />
              </div>
              
              <h3 className="font-bold text-[#e6edf3] mb-1 line-clamp-2 leading-tight">
                {cert.name}
              </h3>
              
              <div className="text-sm text-[#7d8590] mb-6 flex-grow">
                {cert.issuer} • {cert.date}
              </div>
              
              <button 
                suppressHydrationWarning
                onClick={() => {
                  setSelectedCert(cert);
                  setImageError(false);
                }}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#58a6ff] hover:text-[#e6edf3] hover:underline mt-auto w-max transition-colors select-none group/btn cursor-pointer"
              >
                show <Eye size={15} className="group-hover/btn:scale-110 transition-transform" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Stateful Show More / Show Less Buttons */}
      {hasMore ? (
        <div className="flex justify-center mt-8">
          <button
            suppressHydrationWarning
            onClick={handleShowMore}
            className="px-6 py-2 border border-[#30363d] hover:border-[#8b949e] hover:bg-[#21262d]/25 text-[#58a6ff] hover:text-[#58a6ff] text-xs font-semibold rounded-md transition-all duration-200 select-none shadow-sm cursor-pointer"
          >
            Show more
          </button>
        </div>
      ) : visibleCount > 6 ? (
        <div className="flex justify-center mt-8">
          <button
            suppressHydrationWarning
            onClick={() => setVisibleCount(6)}
            className="px-6 py-2 border border-[#30363d] hover:border-[#8b949e] hover:bg-[#21262d]/25 text-[#58a6ff] hover:text-[#58a6ff] text-xs font-semibold rounded-md transition-all duration-200 select-none shadow-sm cursor-pointer"
          >
            Show less
          </button>
        </div>
      ) : null}

      {/* Stunning High-Fidelity Modal Overlay */}
      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCert(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-4xl bg-[#0d1117] border border-[#30363d] rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col h-[85vh]"
            >
              {/* Header Panel */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-[#30363d] bg-[#161b22] select-none">
                <div>
                  <h3 className="font-bold text-base text-[#e6edf3] pr-4 line-clamp-1 leading-snug">
                    {selectedCert.name}
                  </h3>
                  <p className="text-xs text-[#7d8590] mt-0.5">
                    {selectedCert.issuer} • Issued {selectedCert.date}
                  </p>
                </div>
                <button
                  suppressHydrationWarning
                  onClick={() => setSelectedCert(null)}
                  className="p-1.5 text-[#7d8590] hover:text-[#e6edf3] hover:bg-[#21262d] rounded-lg transition-all cursor-pointer"
                  aria-label="Close dialog"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Certificate Viewer Frame */}
              <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center bg-[#070a0e]">
                {imageError ? (
                  /* Developer-friendly placeholder when image is missing */
                  <div className="flex flex-col items-center justify-center text-center p-8 max-w-md select-none">
                    <div className="w-16 h-16 rounded-full bg-[#1c1412] border border-[#ff7b72]/30 flex items-center justify-center mb-4 text-[#ff7b72]">
                      <ImageIcon size={28} />
                    </div>
                    <h4 className="text-sm font-semibold text-[#f85149] mb-2">Certificate File Not Found</h4>
                    <p className="text-xs text-[#8b949e] leading-relaxed mb-4">
                      Please upload your certificate file/asset to the following path in your project folder:
                    </p>
                    <code className="px-3 py-2 bg-[#161b22] border border-[#30363d] rounded-md text-[11px] text-[#58a6ff] break-all font-mono">
                      public{selectedCert.imagePath}
                    </code>
                  </div>
                ) : selectedCert.imagePath.toLowerCase().endsWith(".pdf") ? (
                  /* High-fidelity PDF rendering via native iframe */
                  <div className="w-full h-full">
                    <iframe
                      src={selectedCert.imagePath}
                      title={`${selectedCert.name} credential`}
                      className="w-full h-full rounded-lg border border-[#30363d] shadow-md bg-[#161b22] overflow-hidden"
                    />
                  </div>
                ) : (
                  /* High-fidelity Image rendering */
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src={selectedCert.imagePath}
                      alt={`${selectedCert.name} credential`}
                      onError={() => setImageError(true)}
                      className="max-w-full max-h-[70vh] object-contain rounded-lg border border-[#30363d] shadow-md select-none pointer-events-none"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
