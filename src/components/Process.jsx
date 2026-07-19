import { FaLightbulb, FaPencilRuler, FaCode, FaRocket, FaHeadset } from 'react-icons/fa';

const STEPS = [
  { icon: <FaLightbulb />, title: "Discovery", description: "We discuss your goals, target audience, and requirements to define the project scope." },
  { icon: <FaPencilRuler />, title: "Design & Plan", description: "I create wireframes and design mockups. You approve before development starts." },
  { icon: <FaCode />, title: "Development", description: "Clean, efficient code. Regular updates and demos to ensure we're aligned." },
  { icon: <FaRocket />, title: "Launch", description: "Testing, deployment, and go-live. Everything optimized for performance." },
  { icon: <FaHeadset />, title: "Support", description: "Post-launch support and maintenance to keep your product running smoothly." }
];

const Process = () => (
  <section id="process" className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-card relative overflow-hidden">
    <div className="max-w-7xl mx-auto">
      <div className="fade-in-section">
        <div className="text-center mb-16">
          <p className="text-accent text-sm uppercase tracking-widest mb-3">How I Work</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">My Process</h2>
          <p className="text-gray-400 max-w-xl mx-auto">A proven approach to deliver high-quality results</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {STEPS.map((step, i) => (
            <div key={i} className="text-center glass rounded-2xl p-6 border border-white/5 hover:border-accent/20 transition-all relative group">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-dark font-bold text-sm">{i + 1}</div>
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center text-accent text-2xl mx-auto mt-4 mb-4 group-hover:bg-accent group-hover:text-dark transition-all">{step.icon}</div>
              <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
              <p className="text-gray-400 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Process;