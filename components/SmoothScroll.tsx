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

        // Expose globally for other components to access if needed (like custom back-to-top buttons)
        (window as any).locomotiveScroll = scrollInstance;
      } catch (error) {
        console.error("Failed to initialize Locomotive Scroll:", error);
      }
    };

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (href && href.startsWith("#")) {
        const targetId = href;
        if (targetId === "#") {
          e.preventDefault();
          if (scrollInstance) {
            scrollInstance.scrollTo(0, { duration: 1.2 });
          } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        } else {
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            e.preventDefault();
            if (scrollInstance) {
              scrollInstance.scrollTo(targetElement, {
                offset: -96, // Accounts for scroll-mt-24 and navbar height
                duration: 1.2,
              });
            } else {
              targetElement.scrollIntoView({ behavior: "smooth" });
            }
          }
        }
      }
    };

    initLocomotive();
    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      if (scrollInstance) {
        scrollInstance.destroy();
      }
    };
  }, []);

  return <>{children}</>;
}

