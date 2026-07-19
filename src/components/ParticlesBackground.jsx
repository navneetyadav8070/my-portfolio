import { useCallback } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
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