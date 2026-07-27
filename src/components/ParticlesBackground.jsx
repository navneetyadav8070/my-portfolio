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
        // Mouse ke paas aane par lines jud jaati hain — interactive, high-tech feel.
        interactivity: {
          events: {
            onHover: { enable: !isMobile, mode: "grab" },
            resize: { enable: true },
          },
          modes: {
            grab: { distance: 190, links: { opacity: 0.55, color: "#00ff88" } },
          },
        },
        particles: {
          // Halke green shades — flat single color se zyada depth deta hai.
          color: { value: ["#00ff88", "#00cc6a", "#8affc9"] },
          links: {
            color: "#00ff88",
            distance: 150,
            enable: !isMobile,
            opacity: 0.3,
            width: 1,
          },
          move: {
            enable: true,
            speed: isMobile ? 0.5 : 1.1,
            direction: "none",
            outModes: { default: "out" },
          },
          number: {
            value: isMobile ? 24 : 65,
            density: { enable: true, area: 900 },
          },
          // Twinkle: opacity halke se ghatti-badhti hai (stars jaisa).
          opacity: {
            value: { min: 0.2, max: 0.6 },
            animation: { enable: true, speed: 0.7, sync: false },
          },
          // Pulse: size halke se breathe karta hai (desktop par hi).
          size: {
            value: { min: 1, max: 3 },
            animation: { enable: !isMobile, speed: 2, sync: false },
          },
        },
      }}
    />
  );
};

export default ParticlesBackground;
