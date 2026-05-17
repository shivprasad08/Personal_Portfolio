"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, ArrowRight, ExternalLink } from "lucide-react";
import { GITHUB_USERNAME } from "@/config/github";

// Custom count-up hook for seamless, dependency-free stat counting
function useCountUp(endVal: number, duration: number = 1200) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * endVal));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [endVal, duration]);

  return count;
}

export default function Hero() {
  // Canvas particle drift animation logic
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }

    const particles: Particle[] = [];
    const maxParticles = 55;

    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1.5,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw sparse vector lines
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.3;
            ctx.strokeStyle = `rgba(63, 185, 80, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Draw sparse drifting dots
      particles.forEach((p) => {
        ctx.fillStyle = "rgba(63, 185, 80, 0.75)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Subtitle roles rotating state
  const roles = [
    "Full Stack Developer",
    "AI/ML Enthusiast",
    "MERN Stack Engineer",
    "Problem Solver",
  ];
  const [roleIndex, setRoleIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Live stats from GitHub API
  const [liveStats, setLiveStats] = useState({ commits: 344, streak: 4 });
  useEffect(() => {
    fetch("/api/github/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.totalContributions === "number") {
          setLiveStats({
            commits: data.totalContributions,
            streak: data.currentStreak || 0,
          });
        }
      })
      .catch((err) => console.error("Error fetching live hero stats:", err));
  }, []);

  // Terminal code simulation typing delay
  const codeLines = [
    "const developer = {",
    '  name:     "Shivprasad",',
    '  role:     "Full Stack Dev",',
    '  location: "Pimpri, MH 🇮🇳",',
    `  streak:   ${liveStats.streak},   // days 🔥`,
    `  commits:  ${liveStats.commits},  // and counting`,
    "  openTo:   true,  // hire me!",
    "};",
    "",
    "export default developer;"
  ];
  const [visibleLines, setVisibleLines] = useState(0);
  useEffect(() => {
    const timers = codeLines.map((_, i) => {
      return setTimeout(() => {
        setVisibleLines(i + 1);
      }, i * 80);
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  // Render static styled code segments for Next.js SSR alignment
  const renderHighlightedLine = (index: number) => {
    switch (index) {
      case 0:
        return (
          <>
            <span className="text-[#ff7b72]">const</span>{" "}
            <span className="text-[#79c0ff]">developer</span>{" "}
            <span className="text-[#e6edf3]">=</span>{" "}
            <span className="text-[#e6edf3]">{`{`}</span>
          </>
        );
      case 1:
        return (
          <>
            {"  "}
            <span className="text-[#79c0ff]">name</span>
            <span className="text-[#e6edf3]">:</span>{"     "}{" "}
            <span className="text-[#a5d6ff]">"Shivprasad"</span>
            <span className="text-[#e6edf3]">,</span>
          </>
        );
      case 2:
        return (
          <>
            {"  "}
            <span className="text-[#79c0ff]">role</span>
            <span className="text-[#e6edf3]">:</span>{"     "}{" "}
            <span className="text-[#a5d6ff]">"Full Stack Dev"</span>
            <span className="text-[#e6edf3]">,</span>
          </>
        );
      case 3:
        return (
          <>
            {"  "}
            <span className="text-[#79c0ff]">location</span>
            <span className="text-[#e6edf3]">:</span>{" "}
            <span className="text-[#a5d6ff]">"Pimpri, MH 🇮🇳"</span>
            <span className="text-[#e6edf3]">,</span>
          </>
        );
      case 4:
        return (
          <>
            {"  "}
            <span className="text-[#79c0ff]">streak</span>
            <span className="text-[#e6edf3]">:</span>{"   "}{" "}
            <span className="text-[#f2cc60]">{liveStats.streak}</span>
            <span className="text-[#e6edf3]">,</span>{"   "}{" "}
            <span className="text-[#484f58]">// days 🔥</span>
          </>
        );
      case 5:
        return (
          <>
            {"  "}
            <span className="text-[#79c0ff]">commits</span>
            <span className="text-[#e6edf3]">:</span>{"  "}{" "}
            <span className="text-[#f2cc60]">{liveStats.commits}</span>
            <span className="text-[#e6edf3]">,</span>{"  "}{" "}
            <span className="text-[#484f58]">// and counting</span>
          </>
        );
      case 6:
        return (
          <>
            {"  "}
            <span className="text-[#79c0ff]">openTo</span>
            <span className="text-[#e6edf3]">:</span>{"   "}{" "}
            <span className="text-[#ff7b72]">true</span>
            <span className="text-[#e6edf3]">,</span>{"  "}{" "}
            <span className="text-[#484f58]">// hire me!</span>
          </>
        );
      case 7:
        return <span className="text-[#e6edf3]">{`};`}</span>;
      case 8:
        return <span className="text-[#484f58]"></span>;
      case 9:
        return (
          <>
            <span className="text-[#ff7b72]">export default</span>{" "}
            <span className="text-[#e6edf3]">developer</span>
            <span className="text-[#e6edf3]">;</span>
          </>
        );
      default:
        return null;
    }
  };

  // Live count-up numbers for quick stats strip (removed)

  // Framer Motion staggered animations for left-hand columns
  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as any }
    }
  };

  return (
    <section id="hero" aria-label="Introduction" className="relative min-h-[90vh] lg:min-h-screen flex items-center overflow-hidden bg-[#0d1117]">
      {/* Canvas Particle Overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
      />

      <div className="container mx-auto px-4 lg:px-20 z-10 grid lg:grid-cols-[60fr_40fr] gap-12 items-center w-full py-12 md:py-24">
        
        {/* Left Column (60%) */}
        <motion.div
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Name Reveal Line */}
          <motion.div variants={itemVariants}>
            <h1 className="text-3xl sm:text-4xl lg:text-[50px] font-bold font-mono tracking-tight text-[#e6edf3] leading-none mb-1">
              Hi! I'm{" "}
              <span className="whitespace-nowrap">
                <span className="text-[#e6edf3] font-mono name-reveal inline-block select-none relative">
                  Shivprasad
                </span>{" "}
                <span className="inline-block waving-hand relative -top-1 md:-top-1.5 select-none align-middle">
                  👋
                </span>
              </span>
              <span className="inline-block w-[3px] h-[0.9em] bg-[#3fb950] ml-2 align-middle animate-[blink_1s_step-end_infinite]" />
            </h1>
          </motion.div>

          {/* Subtitle with Rotating Roles */}
          <motion.div variants={itemVariants} className="text-lg text-[#e6edf3]">
            <span>I'm a </span>
            <span className="text-[#3fb950] font-mono font-semibold inline-block relative ml-0.5 min-h-[28px] align-top">
              <AnimatePresence mode="wait">
                <motion.span
                  key={roles[roleIndex]}
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="inline-block"
                >
                  {roles[roleIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.div>

          {/* Bio */}
          <motion.div variants={itemVariants}>
            <p className="text-[#7d8590] text-[15px] leading-relaxed max-w-[440px] font-normal select-none">
              I build scalable web applications and intuitive user interfaces.
              Passionate about turning complex problems into elegant, efficient,
              and accessible solutions.
            </p>
          </motion.div>

          {/* Buttons with Micro-Interactions */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-2 select-none">
            <a
              href="#projects"
              className="bg-[#238636] hover:bg-[#2ea043] text-white px-6 py-3 rounded-md text-sm font-medium flex items-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(35,134,54,0.6)] cursor-pointer"
            >
              View Projects <ArrowRight size={16} />
            </a>
            
            <a
              href="/resume.pdf"
              target="_blank"
              className="bg-[#21262d] hover:bg-[#30363d]/50 border border-[#30363d] hover:border-[#3fb950] text-[#e6edf3] px-6 py-3 rounded-md text-sm font-medium flex items-center gap-2 transition-all cursor-pointer"
            >
              Download Resume <Download size={16} />
            </a>
            
            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noreferrer"
              className="text-[#58a6ff] hover:underline px-4 py-3 text-sm font-medium flex items-center gap-2 transition-all group/github cursor-pointer"
            >
              GitHub <ExternalLink size={16} className="transition-transform group-hover/github:translate-x-1" />
            </a>
          </motion.div>
        </motion.div>

        {/* Right Column - Fake Terminal Window (45%) */}
        <div className="hidden lg:block select-none perspective-[1000px]">
          <motion.div
            initial={{ opacity: 0, x: 40, rotateY: -12 }}
            animate={{ opacity: 1, x: 0, rotateY: -4 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] as any }}
            whileHover={{ rotateY: 0, rotateX: 0 }}
            className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-[0_0_0_1px_#30363d,0_24px_48px_rgba(0,0,0,0.5),0_0_80px_rgba(63,185,80,0.05)] transition-transform duration-500 ease-out"
          >
            {/* Title Bar Chrome */}
            <div className="bg-[#1c2128] border-bottom border-[#30363d] p-[10px_14px] flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f85149]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#e3b341]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#3fb950]" />
              </div>
              <span className="text-xs text-[#7d8590] font-mono flex-grow text-center pr-[50px]">portfolio.ts</span>
              <span className="text-[10px] text-[#7d8590] border border-[#30363d] bg-[#0d1117] rounded px-2 py-0.5 font-mono">TS</span>
            </div>

            {/* Editor Body */}
            <div className="grid grid-cols-[36px_1fr] font-mono text-[13px] leading-[1.85] p-[16px_0] min-h-[260px]">
              {/* Line Numbers */}
              <div className="text-right pr-3.5 text-[#484f58] border-r border-[#21262d]">
                {codeLines.map((_, i) => (
                  <div key={i} className="h-[24px]">{i + 1}</div>
                ))}
              </div>

              {/* Code Area */}
              <div className="pl-5 overflow-hidden">
                <AnimatePresence>
                  {codeLines.slice(0, visibleLines).map((_, i) => {
                    const isLast = i === visibleLines - 1;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.15 }}
                        className="h-[24px] flex items-center whitespace-nowrap"
                      >
                        {renderHighlightedLine(i)}
                        {isLast && visibleLines < codeLines.length && (
                          <span className="inline-block w-[6px] h-3.5 bg-[#39d353] ml-1 animate-[blink_1s_step-end_infinite] align-middle" />
                        )}
                        {isLast && visibleLines === codeLines.length && (
                          <span className="inline-block w-[6px] h-3.5 bg-[#39d353] ml-1 animate-[blink_1s_step-end_infinite] align-middle" />
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            {/* Bottom Status Bar */}
            <div className="bg-[#238636] p-[3px_14px] flex justify-between font-mono text-[11px] text-white/95">
              <div className="flex gap-4">
                <span>TypeScript</span>
                <span>UTF-8</span>
              </div>
              <span className="font-semibold text-white">● Live</span>
            </div>
          </motion.div>
        </div>

      </div>

      <style jsx global>{`
        /* Name clip-path reveal swipe */
        @keyframes reveal {
          from { clip-path: inset(0 100% 0 0); }
          to   { clip-path: inset(0 0% 0 0); }
        }
        .name-reveal {
          animation: reveal 0.8s cubic-bezier(0.77, 0, 0.18, 1) 0.3s both;
        }

        /* Waving hand micro-animation */
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(-12deg); }
          40% { transform: rotate(14deg); }
          60% { transform: rotate(-10deg); }
          80% { transform: rotate(8deg); }
        }
        .waving-hand {
          animation: wave 2.5s ease-in-out infinite;
          transform-origin: 70% 70%;
        }

        /* Standard cursor blink */
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}
