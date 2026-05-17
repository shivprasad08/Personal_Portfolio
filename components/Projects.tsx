"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Book, Circle } from "lucide-react";
import { GITHUB_USERNAME } from "@/config/github";

export default function Projects() {
  const [showAll, setShowAll] = useState(false);

  const projects = [
    {
      name: "medical-graph-rag",
      description: "Advanced medical knowledge graph RAG platform utilizing Neo4j and LLMs to provide clinical context-aware answers to complex medical questions.",
      language: "Python",
      langColor: "#3572A5",
      topics: ["python", "rag", "neo4j", "llm", "healthcare"]
    },
    {
      name: "Briefly",
      description: "AI-powered summarization and transcription platform designed to capture and condense long audio meetings into structured insights.",
      language: "TypeScript",
      langColor: "#3178c6",
      topics: ["react", "nodejs", "mongodb", "whisper", "express"]
    },
    {
      name: "collaborative-code-editor",
      description: "Real-time collaborative code editor supporting concurrent programming rooms, syntax highlighting, and live synchronization.",
      language: "JavaScript",
      langColor: "#f1e05a",
      topics: ["react", "socket-io", "nodejs", "monaco-editor"]
    },
    {
      name: "url-shortener",
      description: "High-performance URL shortener and redirect service handling 500+ requests per second with ultra-low latency.",
      language: "TypeScript",
      langColor: "#3178c6",
      topics: ["nodejs", "express", "redis", "mongodb", "system-design"]
    },
    // Show More Items:
    {
      name: "FoodBridge",
      description: "MERN-stack platform that acts as a bridge to redirect surplus food from commercial outlets to local shelters and NGOs.",
      language: "JavaScript",
      langColor: "#f1e05a",
      topics: ["react", "express", "mongodb", "node", "social-impact"]
    },
    {
      name: "hobby-match",
      description: "A full-stack matchmaking application connecting individuals based on shared hobbies, featuring premium chat systems.",
      language: "TypeScript",
      langColor: "#3178c6",
      topics: ["react", "nodejs", "mongodb", "socket-io", "tailwindcss"]
    },
    {
      name: "BudgetBuddy",
      description: "A modern, responsive personal finance assistant featuring intuitive expense visualizers, categorizations, and budget trackers.",
      language: "JavaScript",
      langColor: "#f1e05a",
      topics: ["react", "tailwind", "chartjs", "finance"]
    },
    {
      name: "Prep",
      description: "Interactive interview preparation dashboard supplying customized technical roadmaps, mock questions, and flashcard sets.",
      language: "TypeScript",
      langColor: "#3178c6",
      topics: ["react", "typescript", "education", "prep"]
    }
  ];

  const displayedProjects = showAll ? projects : projects.slice(0, 4);

  return (
    <section id="projects" aria-label="Projects" className="scroll-mt-24">
      <div className="flex justify-between items-end mb-6 border-b border-[#30363d] pb-2 select-none">
        <h2 className="text-2xl font-normal text-[#e6edf3]">Projects</h2>
        <a href={`https://github.com/${GITHUB_USERNAME}?tab=repositories`} target="_blank" rel="noreferrer" className="text-sm text-[#58a6ff] hover:underline mb-1">
          View all repositories →
        </a>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <AnimatePresence>
          {displayedProjects.map((project, i) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              viewport={{ once: true }}
              transition={{ delay: showAll ? 0 : i * 0.05, duration: 0.2 }}
              className="p-4 bg-[#0d1117] border border-[#30363d] rounded-xl hover:border-[#39d353] transition-all duration-300 flex flex-col h-full hover:shadow-[0_0_8px_rgba(57,211,83,0.15)] group/card"
            >
              <div className="flex items-center gap-2 mb-2">
                <Book size={16} className="text-[#7d8590]" />
                <a 
                  href={`https://github.com/${GITHUB_USERNAME}/${project.name}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-[#58a6ff] font-semibold text-sm hover:underline"
                >
                  {project.name}
                </a>
                <span className="ml-auto text-xs text-[#7d8590] border border-[#30363d] rounded-full px-2 py-0.5 select-none">Public</span>
              </div>
              
              <p className="text-sm text-[#7d8590] mb-4 flex-grow line-clamp-2 select-none">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4 select-none">
                {project.topics.map(topic => (
                  <span key={topic} className="px-2 py-1 bg-[#121d2f] text-[#58a6ff] rounded-full text-[10px] font-medium hover:bg-[#1f3552] transition-colors">
                    {topic}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 text-xs text-[#7d8590] select-none pt-1 border-t border-[#30363d]/30">
                <span className="flex items-center gap-1.5">
                  <Circle size={10} fill={project.langColor} stroke="none" />
                  {project.language}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex justify-center mt-6">
        <button
          suppressHydrationWarning
          onClick={() => setShowAll(!showAll)}
          className="px-6 py-2 border border-[#30363d] hover:border-[#8b949e] hover:bg-[#21262d]/25 text-[#58a6ff] hover:text-[#58a6ff] text-xs font-semibold rounded-md transition-all duration-200 select-none shadow-sm cursor-pointer"
        >
          {showAll ? "Show less" : "Show more"}
        </button>
      </div>
    </section>
  );
}
