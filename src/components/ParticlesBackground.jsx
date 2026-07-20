import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const ParticlesBackground = () => {
  const [ready, setReady] = useState(false);

  // FIXED: v3/v4 API — engine ek baar init hota hai, phir Particles render hota hai.
  // Purana `init={...}` prop v4 me kaam nahi karta tha, isliye particles dikhte hi nahi the.
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setReady(true));
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
