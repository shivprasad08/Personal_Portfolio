"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Briefcase, Heart, GitBranch, ArrowRight } from "lucide-react";
import { GITHUB_USERNAME } from "@/config/github";

export default function Footer() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  // Reusable lightweight canvas particle loop specifically tuned for the footer
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
    const maxParticles = 30; // Fewer particles than hero for small spacing

    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.2 + 1,
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

      // Draw faint lines
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.08;
            ctx.strokeStyle = `rgba(63, 185, 80, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Draw drifting particles
      particles.forEach((p) => {
        ctx.fillStyle = "rgba(63, 185, 80, 0.5)";
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

  // Comment block heading typing sequence
  const commentLines = [
    "/*",
    " * Let's build something",
    " * together.",
    " */"
  ];
  const [visibleCommentLines, setVisibleCommentLines] = useState(0);
  useEffect(() => {
    const timers = commentLines.map((_, i) => {
      return setTimeout(() => {
        setVisibleCommentLines(i + 1);
      }, i * 60);
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Framer Motion entry animations
  const leftColContainer = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const leftColItem = {
    hidden: { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }
    }
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-gradient-to-b from-transparent to-[#0d1117] pt-20 mt-24 border-t border-[#21262d] shadow-[0_-1px_0_#30363d]"
    >
      {/* Background Canvas Particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
      />

      <div className="container mx-auto px-4 lg:px-20 z-10 grid lg:grid-cols-2 gap-16 items-center w-full relative pb-16">
        
        {/* Left Column (50%) */}
        <motion.div
          className="space-y-6"
          variants={leftColContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Code Comment Heading */}
          <motion.div variants={leftColItem} className="font-mono">
            <div className="min-h-[68px] select-none text-[13px] text-[#484f58] leading-normal font-mono">
              <AnimatePresence>
                {commentLines.slice(0, visibleCommentLines).map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {line}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold font-mono text-[#e6edf3] mt-2">
              Get In Touch
            </h2>
          </motion.div>

          {/* Subtitle */}
          <motion.div variants={leftColItem}>
            <p className="text-[14px] text-[#7d8590] leading-relaxed max-w-[380px] font-normal select-none">
              Whether you have a question, a project idea, or just want to say hi — my inbox is always open.
            </p>
          </motion.div>

          {/* Mapped Contact Cards */}
          <motion.div variants={leftColItem} className="space-y-4 max-w-xl pt-2 select-none">
            {/* Email Contact Card */}
            <a
              href="mailto:shivprasad.mahind@gmail.com"
              className="flex items-center justify-between p-[18px_24px] bg-transparent border border-[#21262d] border-l-[3px] border-l-[#3fb950] rounded-[0_8px_8px_0] hover:border-l-[#39d353] hover:bg-[#3fb950]/[0.03] transition-all duration-200 group"
            >
              <div className="flex items-center gap-4">
                <Mail size={20} className="text-[#3fb950]" />
                <div>
                  <div className="text-[14px] font-semibold text-[#e6edf3]">Email Me</div>
                  <div className="text-[13px] text-[#7d8590] font-mono mt-0.5">shivprasad.mahind@gmail.com</div>
                </div>
              </div>
              <ArrowRight size={18} className="text-[#484f58] group-hover:text-[#3fb950] group-hover:translate-x-1 transition-all" />
            </a>

            {/* LinkedIn Contact Card */}
            <a
              href="https://www.linkedin.com/in/shivprasad-mahind08/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-[18px_24px] bg-transparent border border-[#21262d] border-l-[3px] border-l-[#3fb950] rounded-[0_8px_8px_0] hover:border-l-[#39d353] hover:bg-[#3fb950]/[0.03] transition-all duration-200 group"
            >
              <div className="flex items-center gap-4">
                <Briefcase size={20} className="text-[#3fb950]" />
                <div>
                  <div className="text-[14px] font-semibold text-[#e6edf3]">Connect on LinkedIn</div>
                  <div className="text-[13px] text-[#7d8590] font-mono mt-0.5">linkedin.com/in/shivprasad-mahind08/</div>
                </div>
              </div>
              <ArrowRight size={18} className="text-[#484f58] group-hover:text-[#3fb950] group-hover:translate-x-1 transition-all" />
            </a>
          </motion.div>

          {/* Social Icons Row */}
          <motion.div variants={leftColItem} className="flex gap-3.5 pt-2 select-none">
            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noreferrer"
              title="GitHub"
              className="w-9 h-9 border border-[#30363d] rounded-md flex items-center justify-center text-[#7d8590] hover:text-[#3fb950] hover:border-[#3fb950] hover:bg-[#3fb950]/[0.06] transition-all duration-150 cursor-pointer"
            >
              <svg viewBox="0 0 24 24" className="w-[16px] h-[16px] fill-current" stroke="none">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
            </a>
            
            <a
              href="https://www.linkedin.com/in/shivprasad-mahind08/"
              target="_blank"
              rel="noreferrer"
              title="LinkedIn"
              className="w-9 h-9 border border-[#30363d] rounded-md flex items-center justify-center text-[#7d8590] hover:text-[#3fb950] hover:border-[#3fb950] hover:bg-[#3fb950]/[0.06] transition-all duration-150 cursor-pointer"
            >
              <svg viewBox="0 0 24 24" className="w-[16px] h-[16px] fill-current" stroke="none">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z"/>
              </svg>
            </a>
            
            <a
              href="https://x.com/Shivprasad_08"
              target="_blank"
              rel="noreferrer"
              title="Twitter / X"
              className="w-9 h-9 border border-[#30363d] rounded-md flex items-center justify-center text-[#7d8590] hover:text-[#3fb950] hover:border-[#3fb950] hover:bg-[#3fb950]/[0.06] transition-all duration-150 cursor-pointer"
            >
              <svg viewBox="0 0 24 24" className="w-[16px] h-[16px] fill-current" stroke="none">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            
            <a
              href="mailto:shivprasad.mahind@gmail.com"
              title="Email"
              className="w-9 h-9 border border-[#30363d] rounded-md flex items-center justify-center text-[#7d8590] hover:text-[#3fb950] hover:border-[#3fb950] hover:bg-[#3fb950]/[0.06] transition-all duration-150 cursor-pointer"
            >
              <Mail size={18} />
            </a>
          </motion.div>
        </motion.div>

        {/* Right Column - Terminal Contact Form (50%) */}
        <motion.div
          initial={{ opacity: 0, x: 32, rotateY: 10 }}
          whileInView={{ opacity: 1, x: 0, rotateY: 4 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] as any }}
          whileHover={{ rotateY: 0, rotateX: 0 }}
          className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-[0_0_0_1px_#21262d,0_24px_48px_rgba(0,0,0,0.4),0_0_60px_rgba(63,185,80,0.04)] transition-transform duration-500 ease-out select-none perspective-[1000px]"
        >
          {/* Title Bar chrome */}
          <div className="bg-[#1c2128] border-bottom border-[#30363d] p-[10px_14px] flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f85149]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#e3b341]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#3fb950]" />
            </div>
            <span className="text-xs text-[#7d8590] font-mono flex-grow text-center pr-[40px]">contact.sh</span>
          </div>

          {/* Form Body - Shell prompt */}
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4.5">
            {/* Name Prompt */}
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-[13px] text-[#3fb950] select-none">$</span>
              <span className="font-mono text-[13px] text-[#79c0ff] min-w-[80px] select-none">
                name<span className="text-[#e6edf3]">:</span>
              </span>
              <input
                type="text"
                required
                placeholder="Shivprasad"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="flex-1 bg-[#0d1117] border border-[#21262d] rounded px-3.5 py-2.5 font-mono text-[13px] text-[#e6edf3] outline-none placeholder-[#484f58] focus:border-[#3fb950] focus:shadow-[0_0_0_2px_rgba(63,185,80,0.1)] transition-all"
                suppressHydrationWarning
              />
            </div>

            {/* Email Prompt */}
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-[13px] text-[#3fb950] select-none">$</span>
              <span className="font-mono text-[13px] text-[#79c0ff] min-w-[80px] select-none">
                email<span className="text-[#e6edf3]">:</span>
              </span>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="flex-1 bg-[#0d1117] border border-[#21262d] rounded px-3.5 py-2.5 font-mono text-[13px] text-[#e6edf3] outline-none placeholder-[#484f58] focus:border-[#3fb950] focus:shadow-[0_0_0_2px_rgba(63,185,80,0.1)] transition-all"
                suppressHydrationWarning
              />
            </div>

            {/* Message Prompt */}
            <div className="flex items-start gap-2.5">
              <span className="font-mono text-[13px] text-[#3fb950] pt-1.5 select-none">$</span>
              <span className="font-mono text-[13px] text-[#79c0ff] min-w-[80px] pt-1.5 select-none">
                message<span className="text-[#e6edf3]">:</span>
              </span>
              <textarea
                required
                placeholder="Hey Shivprasad, let's talk..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="flex-1 bg-[#0d1117] border border-[#21262d] rounded px-3.5 py-2.5 font-mono text-[13px] text-[#e6edf3] outline-none placeholder-[#484f58] focus:border-[#3fb950] focus:shadow-[0_0_0_2px_rgba(63,185,80,0.1)] transition-all resize-none min-h-[110px]"
                rows={4}
                suppressHydrationWarning
              />
            </div>

            {/* Submit Row - Node Execution */}
            <div className="flex items-center gap-2.5 mt-1 pt-3 border-t border-[#21262d]">
              <span className="font-mono text-[13px] text-[#3fb950] select-none">$</span>
              
              <button
                type="submit"
                disabled={status === "loading"}
                className="flex items-center gap-2 bg-[#238636] hover:bg-[#2ea043] border-none rounded px-5 py-2.5 cursor-pointer transition-colors disabled:opacity-75"
                suppressHydrationWarning
              >
                <span className="font-mono text-[13px] text-white">
                  {status === "loading" ? "node executing.js" : "node send.js"}
                </span>
                <span className="text-white text-[10px] select-none">▶</span>
              </button>
            </div>

            {/* Form alerts */}
            {status === "success" && (
              <div className="font-mono text-[12px] text-[#3fb950] mt-1 select-none">
                ✓ message sent successfully!
              </div>
            )}
            {status === "error" && (
              <div className="font-mono text-[12px] text-[#f78166] mt-1 select-none">
                ✗ failed to execute send.js. try again later.
              </div>
            )}
          </form>

          {/* Visual VS Code Status Bar */}
          <div className="bg-[#238636] p-[3px_14px] flex justify-between font-mono text-[11px] text-white/90">
            <div className="flex gap-4">
              <span>contact.sh</span>
              <span>UTF-8</span>
            </div>
            <span>
              {status === "idle" && "● Ready"}
              {status === "loading" && "● Sending..."}
              {status === "success" && "● Sent ✓"}
              {status === "error" && "● Error ✗"}
            </span>
          </div>
        </motion.div>

      </div>

      {/* Bottom Status Bar - Page Wide Footer */}
      <footer className="w-full bg-[#238636] p-[6px_20px] flex items-center justify-between font-mono text-[11px] text-white/90 mt-20 relative z-10 select-none">
        
        {/* Left Cluster */}
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 opacity-90">
            <GitBranch size={12} />
            main
          </span>
          <span className="opacity-90">
            © {new Date().getFullYear()} Shivprasad
          </span>
        </div>

        {/* Center Banner */}
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2 opacity-95">
          Built with Next.js & ❤️
        </div>

        {/* Right Cluster */}
        <div className="flex items-center gap-4">
          <span onClick={scrollToTop} className="cursor-pointer opacity-90 hover:opacity-100 transition-opacity">
            ↑ Back to top
          </span>
          <span className="opacity-90 hidden sm:inline">
            TypeScript
          </span>
          <span className="font-bold opacity-100">
            ● Live
          </span>
        </div>

      </footer>
    </section>
  );
}
