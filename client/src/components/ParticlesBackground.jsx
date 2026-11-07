import React, { useEffect, useId, useRef } from "react";
import { tsParticles } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

// The engine is loaded once per page, not once per component.
let enginePromise = null;
const initEngine = () => {
  if (!enginePromise) {
    enginePromise = loadSlim(tsParticles);
  }
  return enginePromise;
};

export default function ParticlesBackground({
  className = "absolute inset-0 z-0 pointer-events-none",
  color = "#10B981",
  count = 60,
  linkOpacity = 0.2,
}) {
  const containerRef = useRef(null);
  const rawId = useId();
  const id = `particles-${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;

  useEffect(() => {
    let cancelled = false;
    let instance = null;

    (async () => {
      try {
        await initEngine();
        if (cancelled || !containerRef.current) return;

        instance = await tsParticles.load({
          id,
          element: containerRef.current,
          options: {
            fullScreen: { enable: false },
            background: { color: "transparent" },
            fpsLimit: 60,
            detectRetina: true,
            particles: {
              color: { value: color },
              links: {
                enable: true,
                color,
                distance: 130,
                opacity: linkOpacity,
                width: 1,
              },
              move: { enable: true, speed: 1 },
              number: { value: count, density: { enable: true, area: 800 } },
              opacity: { value: 0.32 },
              shape: { type: "circle" },
              size: { value: { min: 1, max: 3 } },
            },
          },
        });

        if (cancelled) {
          instance.destroy();
          instance = null;
        }
      } catch (error) {
        // A decorative background must never break the page it sits behind.
        console.warn("Particle background disabled:", error.message);
      }
    })();

    return () => {
      cancelled = true;
      instance?.destroy();
    };
  }, [id, color, count, linkOpacity]);

  return <div ref={containerRef} className={className} aria-hidden="true" />;
}
