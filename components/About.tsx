"use client";

import { motion } from "framer-motion";
import { MapPin, Mail } from "lucide-react";
import { GITHUB_USERNAME } from "@/config/github";
import { getLinkedInImage, LINKEDIN_PROFILE } from "@/config/social";
import StatsCard from "./StatsCard";
import Image from "next/image";

export default function About() {
  return (
    <section id="about" aria-label="About Me" className="scroll-mt-24">
      <div className="grid md:grid-cols-3 gap-12">
        {/* Left Col - Image */}
        <div className="md:col-span-1">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-full overflow-hidden border-4 border-[#30363d] relative z-10 bg-[#0d1117]">
              <Image 
                src={getLinkedInImage() || "/Shiv_Mahind.png"} 
                alt="Shivprasad Mahind — Profile" 
                className="w-full h-full object-cover"
                width={320}
                height={320}
                priority
              />
            </div>
            
            {/* Active Status Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-[#39d353] scale-105 opacity-50 z-0"></div>
            
            {/* Scan line effect */}
            <div className="absolute inset-0 rounded-full overflow-hidden z-20 pointer-events-none">
              <div className="w-full h-1 bg-[#58a6ff] opacity-50 animate-[scan_3s_ease-in-out_infinite]"></div>
            </div>
          </motion.div>
        </div>

        {/* Right Col - Info */}
        <div className="md:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold font-mono text-[#e6edf3] mb-2">About Me</h2>
            <div className="flex items-center gap-2 text-[#7d8590] mb-6">
              <MapPin size={16} />
              <span>Pimpri, Maharashtra</span>
            </div>

            <p className="text-[#e6edf3] leading-relaxed text-lg mb-4">
              I am a Final-year Computer Engineering student at PCCOE, actively seeking full-time AI and software engineering roles.
            </p>

            <p className="text-[#e6edf3] leading-relaxed text-lg mb-4">
              My journey spans building AI-powered systems and full-stack applications, competing in hackathons, and contributing to open source projects. I work across the entire stack — from backend APIs and modern frontends to LLM integrations and RAG pipelines — and I thrive in environments where I can solve complex problems and ship fast.
            </p>

            <p className="text-[#e6edf3] leading-relaxed text-lg mb-4">
              Beyond writing code, I've co-authored a deep learning research paper on medical image classification and contributed to open source repositories with merged PRs. Whether working independently on a critical problem or collaborating in a fast-paced hackathon environment, I bring a calm, methodical approach to building impactful solutions.
            </p>

            <p className="text-[#e6edf3] leading-relaxed text-lg mb-8">
              I'm drawn to the intersection of AI and engineering — where cutting-edge models meet production systems. Currently exploring the AI/ML domain and open source. Let's connect!
            </p>

            <div className="mb-8">
              <StatsCard />
            </div>

            <div className="flex justify-center gap-4 md:justify-start">
              <a 
                href={`https://github.com/${GITHUB_USERNAME}`} 
                target="_blank" 
                rel="noreferrer" 
                title="GitHub"
                className="w-10 h-10 rounded-full bg-[#21262d] border border-[#30363d] flex items-center justify-center text-[#e6edf3] hover:bg-[#30363d] hover:text-white transition-colors cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current" stroke="none">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
              </a>
              <a 
                href={LINKEDIN_PROFILE} 
                target="_blank" 
                rel="noreferrer" 
                title="LinkedIn"
                className="w-10 h-10 rounded-full bg-[#21262d] border border-[#30363d] flex items-center justify-center text-[#e6edf3] hover:bg-[#30363d] hover:text-white transition-colors cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current" stroke="none">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z"/>
                </svg>
              </a>
              <a 
                href="https://x.com/Shivprasad_08" 
                target="_blank" 
                rel="noreferrer" 
                title="Twitter / X"
                className="w-10 h-10 rounded-full bg-[#21262d] border border-[#30363d] flex items-center justify-center text-[#e6edf3] hover:bg-[#30363d] hover:text-white transition-colors cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="w-[17px] h-[17px] fill-current" stroke="none">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a 
                href="mailto:shivprasad.mahind@gmail.com" 
                title="Email"
                className="w-10 h-10 rounded-full bg-[#21262d] border border-[#30363d] flex items-center justify-center text-[#e6edf3] hover:bg-[#30363d] hover:text-white transition-colors cursor-pointer"
              >
                <Mail size={18} />
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(500%); }
        }
      `}</style>
    </section>
  );
}
