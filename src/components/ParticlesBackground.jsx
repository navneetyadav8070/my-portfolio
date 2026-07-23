import { useEffect, useState } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

// Version-safe: koi `initParticlesEngine` import nahi (wo har version me nahi hota,
// isliye build fail ho raha tha). Engine ko dynamic import se init karte hain.
const ParticlesBackground = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const mod = await import("@tsparticles/engine");
      const engine = mod.tsParticles;
      if (engine) {
        await loadSlim(engine);
        if (mounted) setReady(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (!ready) return null;

  // Mobile par kaam halka rakhte hain: kam particles, links band (links O(n²) —
  // sabse mehnge), aur kam FPS. Isse phone par scroll smooth rehta hai.
  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 768px)").matches;

  return (
    <Particles
      id="tsparticles"
      className="absolute inset-0"
      options={{
        fullScreen: false,
        fpsLimit: isMobile ? 30 : 60,
        detectRetina: true,
        particles: {
          color: { value: "#00ff88" },
          links: {
            color: "#00ff88",
            distance: 150,
            enable: !isMobile,
            opacity: 0.2,
            width: 1,
          },
          move: { enable: true, speed: isMobile ? 0.6 : 1 },
          number: { value: isMobile ? 22 : 50 },
          opacity: { value: 0.3 },
          size: { value: { min: 1, max: 3 } },
        },
      }}
    />
  );
};

export default ParticlesBackground;
