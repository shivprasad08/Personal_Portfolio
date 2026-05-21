"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { GITHUB_USERNAME } from "@/config/github";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Certificates", href: "#certificates" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0d1117]/80 backdrop-blur-md border-b border-[#30363d]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-bold text-xl tracking-tight">
              S<span className="text-[#7d8590]">.</span>
            </Link>
            <div className="flex items-center gap-2 text-xs text-[#7d8590] bg-[#21262d] px-2 py-1 rounded-full border border-[#30363d]">
              <span className="w-2 h-2 rounded-full bg-[#39d353] animate-pulse"></span>
              Available for work
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center">
            <ul className="flex items-center gap-6 text-sm font-medium">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[#e6edf3] hover:text-[#58a6ff] transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#e6edf3] focus:outline-none"
              suppressHydrationWarning
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0d1117] border-b border-[#30363d] absolute top-16 left-0 w-full shadow-lg">
          <ul className="flex flex-col py-4 px-4">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="block py-3 text-sm font-medium text-[#e6edf3] border-b border-[#30363d] last:border-0"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
