"use client";

import { motion } from "framer-motion";
import { Cpu } from "lucide-react";

export default function TechStack() {
  const skills = [
    { name: "C++", slug: "cplusplus", color: "00599C" },
    { name: "Python", slug: "python", color: "3776AB" },
    { name: "JavaScript", slug: "javascript", color: "F7DF1E" },
    { name: "TypeScript", slug: "typescript", color: "3178C6" },
    { name: "React", slug: "react", color: "61DAFB" },
    { name: "Next.js", slug: "nextdotjs", color: "ffffff" },
    { name: "Node.js", slug: "nodedotjs", color: "339933" },
    { name: "Express", slug: "express", color: "ffffff" },
    { name: "MongoDB", slug: "mongodb", color: "47A248" },
    { name: "SQL", slug: "mysql", color: "4479A1" },
    { name: "Tailwind CSS", slug: "tailwindcss", color: "06B6D4" },
    { name: "Git", slug: "git", color: "F05032" },
    { name: "Docker", slug: "docker", color: "2496ED" },
    { name: "AWS", slug: "amazonwebservices", color: "FF9900" },
    { name: "LangChain", slug: "langchain", color: "13B58E" },
    { name: "RAG", slug: "rag", color: "39d353" }
  ];

  return (
    <section id="techstack" className="scroll-mt-24">
      <div className="flex items-center gap-2 mb-8 border-b border-[#30363d] pb-2">
        <Cpu size={24} className="text-[#e6edf3]" />
        <h2 className="text-2xl font-normal text-[#e6edf3]">Tech Stack</h2>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
        {skills.map((skill, i) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.03 }}
            whileHover={{ y: -5, borderColor: "#39d353", boxShadow: "0 8px 20px -5px rgba(57, 211, 83, 0.15)" }}
            className="flex flex-col items-center justify-center p-6 bg-[#161b22] border border-[#30363d] rounded-xl transition-all duration-300 group cursor-default select-none hover:border-[#39d353]"
          >
            <div className="mb-3 flex items-center justify-center w-14 h-14 bg-[#0d1117] rounded-lg border border-[#30363d]/50 group-hover:border-[#39d353]/30 transition-colors">
              {skill.slug === "rag" ? (
                <svg viewBox="0 0 24 24" className="w-8 h-8 fill-none stroke-[#39d353] transition-transform group-hover:scale-110 duration-300 select-none pointer-events-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2c4.418 0 8 1.12 8 2.5S16.418 7 12 7s-8-1.12-8-2.5S7.582 2 12 2z" />
                  <path d="M4 4.5v5c0 1.38 3.582 2.5 8 2.5s8-1.12 8-2.5v-5" />
                  <path d="M4 9.5v5c0 1.38 3.582 2.5 8 2.5s8-1.12 8-2.5v-5" />
                  <circle cx="12" cy="14" r="2.5" fill="#0d1117" />
                  <line x1="12" y1="9.5" x2="12" y2="11.5" />
                </svg>
              ) : (
                <img
                  src={`https://cdn.simpleicons.org/${skill.slug}/${skill.color}`}
                  alt={`${skill.name} icon`}
                  className="w-8 h-8 object-contain transition-transform group-hover:scale-110 duration-300 select-none pointer-events-none"
                />
              )}
            </div>
            <span className="text-xs font-semibold text-[#8b949e] group-hover:text-[#e6edf3] transition-colors text-center font-mono">
              {skill.name}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
