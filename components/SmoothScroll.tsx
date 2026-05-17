"use client";

import { useEffect } from "react";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let scrollInstance: any;

    const initLocomotive = async () => {
      try {
        const LocomotiveScroll = (await import("locomotive-scroll")).default;

        scrollInstance = new LocomotiveScroll({
          lenisOptions: {
            wrapper: window,
            content: document.documentElement,
            lerp: 0.08,             // Inertia speed/smoothness multiplier
            duration: 1.1,          // Momentum duration
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 0.95,
            touchMultiplier: 1.8,
            normalizeWheel: true,
          } as any
        });
      } catch (error) {
        console.error("Failed to initialize Locomotive Scroll:", error);
      }
    };

    initLocomotive();

    return () => {
      if (scrollInstance) {
        scrollInstance.destroy();
      }
    };
  }, []);

  return <>{children}</>;
}
