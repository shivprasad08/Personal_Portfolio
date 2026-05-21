"use client"

import { useTypewriter } from "@/hooks/useTypewriter"

export function HeroTypewriter() {
  const text = useTypewriter()

  return (
    <p className="font-mono text-lg md:text-xl tracking-wide text-center">
      <span className="text-[#484f58]">&gt;&nbsp;</span>
      <span className="text-[#7d8590]">I&apos;m a&nbsp;</span>
      <span className="text-[#3fb950]">{text}</span>
      <span
        className="inline-block w-[2px] h-[1em] bg-[#3fb950] ml-[2px] align-middle"
        style={{ animation: "blink 1s step-end infinite" }}
      />
    </p>
  )
}

export default HeroTypewriter
