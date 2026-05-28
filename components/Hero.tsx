"use client";

import { motion } from "framer-motion";
import { Download, ArrowRight, ExternalLink } from "lucide-react";
import { GITHUB_USERNAME } from "@/config/github";
import { HeroPongAnimation } from "@/components/ui/animated-hero-section";
import { HeroTypewriter } from "@/components/HeroTypewriter";

export default function Hero() {
  return (
    <section id="hero" aria-label="Introduction" className="relative h-[calc(72dvh-4rem)] min-h-[520px] max-h-[640px] flex flex-col justify-end items-center gap-6 overflow-hidden bg-black pb-12 sm:h-[calc(78dvh-4rem)] sm:min-h-[580px] md:h-[calc(100vh-4rem)] md:min-h-[640px] md:max-h-none md:pb-16">
      {/* Pong animation — absolute within the hero container */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <HeroPongAnimation />
      </div>

      {/* Canvas-only pixel hero — text rendered inside the canvas */}

      {/* Typewriter — positioned just below the canvas name */}
      <div className="absolute top-[40%] sm:top-[42%] md:top-[44%] lg:top-[63%] left-1/2 -translate-x-1/2 z-20 pointer-events-none select-none">
        <HeroTypewriter />
      </div>

      {/* Buttons with Micro-Interactions positioned below the typewriter on mobile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute top-[54%] bottom-auto md:top-auto md:bottom-[100px] left-1/2 -translate-x-1/2 z-10 flex w-full flex-row flex-wrap items-center justify-center gap-2 px-4 select-none"
      >
        <a
          href="#projects"
          className="bg-[#238636] hover:bg-[#2ea043] text-white px-4 py-2 text-xs md:px-5 md:py-2.5 md:text-sm rounded-md font-medium flex items-center gap-1.5 transition-all hover:shadow-[0_0_20px_rgba(35,134,54,0.6)] cursor-pointer"
        >
          View Projects <ArrowRight size={16} />
        </a>
        
        <a
          href="/resume.pdf"
          target="_blank"
          className="bg-[#21262d] hover:bg-[#30363d]/50 border border-[#30363d] hover:border-[#3fb950] text-[#e6edf3] px-4 py-2 text-xs md:px-5 md:py-2.5 md:text-sm rounded-md font-medium flex items-center gap-1.5 transition-all cursor-pointer"
        >
          Download Resume <Download size={16} />
        </a>
        
        <a
          href={`https://github.com/${GITHUB_USERNAME}`}
          target="_blank"
          rel="noreferrer"
          className="text-[#58a6ff] hover:underline px-4 py-2 text-xs md:text-sm font-medium flex items-center gap-1 transition-all group/github cursor-pointer"
        >
          GitHub <ExternalLink size={16} className="transition-transform group-hover/github:translate-x-1" />
        </a>
      </motion.div>

      
    </section>
  );
}
