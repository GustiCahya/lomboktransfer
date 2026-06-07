"use client";

import React, { useEffect, useState, Suspense } from "react";
import { usePathname } from "next/navigation";

/**
 * Global page transition loading bar.
 * Renders a slim animated progress bar at the very top of the viewport
 * whenever the pathname changes (simulating route transitions).
 */
export default function PageTransitionLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Kick off loading animation on route change
    setLoading(true);
    setProgress(20);

    const t1 = setTimeout(() => setProgress(60), 100);
    const t2 = setTimeout(() => setProgress(85), 300);
    const t3 = setTimeout(() => {
      setProgress(100);
    }, 600);
    const t4 = setTimeout(() => {
      setLoading(false);
      setProgress(0);
    }, 900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [pathname]);

  if (!loading) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        height: "3px",
        background: "transparent",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress}%`,
          transition: "width 0.3s ease",
          background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--primary) / 0.7))",
          borderRadius: "0 2px 2px 0",
          boxShadow: "0 0 8px hsl(var(--primary) / 0.6)",
        }}
      />
    </div>
  );
}

export function PageTransitionLoaderWrapper() {
  return (
    <Suspense fallback={null}>
      <PageTransitionLoader />
    </Suspense>
  );
}
