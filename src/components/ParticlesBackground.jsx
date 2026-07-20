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

  return (
    <Particles
      id="tsparticles"
      className="absolute inset-0"
      options={{
        fullScreen: false,
        fpsLimit: 60,
        particles: {
          color: { value: "#00ff88" },
          links: { color: "#00ff88", distance: 150, enable: true, opacity: 0.2, width: 1 },
          move: { enable: true, speed: 1 },
          number: { value: 50 },
          opacity: { value: 0.3 },
          size: { value: { min: 1, max: 3 } },
        },
      }}
    />
  );
};

export default ParticlesBackground;
