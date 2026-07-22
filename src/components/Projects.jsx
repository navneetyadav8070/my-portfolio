import { FaGithub, FaExternalLinkAlt, FaStar } from 'react-icons/fa';
import Tilt from 'react-parallax-tilt';

const PROJECTS = [
  {
    id: 1,
    title: "Custom E-Commerce Platform",
    description: "Hand-coded online store with React front-end, FastAPI back-end, product database, cart & checkout system.",
    longDescription: "A fully functional e-commerce solution built from scratch with modern technologies.",
    tags: ["React", "FastAPI", "Database", "Stripe"],
    liveDemo: "#",
    github: "#",
    stars: 15,
    color: "from-blue-500/20 to-purple-500/20"
  },
  {
    id: 2,
    title: "Full App with Realtime Database",
    description: "End-to-end app connected to Firebase Realtime Database with REST APIs for live data sync.",
    longDescription: "Real-time application with instant data synchronization across multiple clients.",
    tags: ["React", "Firebase", "REST API", "WebSocket"],
    liveDemo: "#",
    github: "#",
    stars: 12,
    color: "from-green-500/20 to-teal-500/20"
  },
  {
    id: 3,
    title: "Telegram Automation Bot",
    description: "Python bot using Telethon/Pyrogram & MTProto API with webhooks for automated messaging.",
    longDescription: "Advanced automation bot handling thousands of messages with intelligent responses.",
    tags: ["Python", "Telethon", "Webhooks", "MTProto"],
    liveDemo: "#",
    github: "#",
    stars: 20,
    color: "from-orange-500/20 to-red-500/20"
  }
];

const ProjectCard = ({ project, index }) => {
  return (
    <Tilt
      tiltMaxAngleX={5}
      tiltMaxAngleY={5}
      perspective={1000}
      scale={1.02}
      transitionSpeed={1000}
      className="h-full"
    >
      <div className="project-card h-full bg-dark-card rounded-2xl border border-dark-border overflow-hidden hover:border-accent/30">
        {/* Project Header with Gradient */}
        <div className={`h-48 bg-gradient-to-br ${project.color} relative overflow-hidden`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl opacity-20">
              {project.tags[0] === "React" ? "⚛️" : project.tags[0] === "Python" ? "🐍" : "🔥"}
            </div>
          </div>
          {/* Stars Badge */}
          <div className="absolute top-4 right-4 glass rounded-full px-3 py-1 flex items-center gap-1 text-sm">
            <FaStar className="text-yellow-400" />
            <span className="text-white">{project.stars}</span>
          </div>
        </div>

        {/* Project Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
          <p className="text-gray-400 text-sm mb-4">{project.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 text-xs font-medium bg-dark text-accent rounded-full border border-dark-border"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <a
              href={project.liveDemo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Live demo of ${project.title}`}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-accent text-dark font-semibold rounded-full hover:bg-accent-hover transition-all duration-300 text-sm"
            >
              <FaExternalLinkAlt className="text-xs" />
              Live Demo
            </a>
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Source code of ${project.title}`}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 glass text-white font-semibold rounded-full border border-accent/20 hover:border-accent transition-all duration-300 text-sm"
            >
              <FaGithub />
              Code
            </a>
          </div>
        </div>
      </div>
    </Tilt>
  );
};

const Projects = () => {
  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 bg-dark relative">
      <div className="max-w-7xl mx-auto">
        <div className="fade-in-section">
          {/* Section Header */}
          <div className="text-center mb-16">
            <p className="text-accent text-sm uppercase tracking-widest mb-2">Portfolio</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Featured Projects
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Some of my recent works that showcase my skills
            </p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="w-12 h-1 bg-accent rounded-full" />
              <div className="w-3 h-3 bg-accent rounded-full" />
              <div className="w-12 h-1 bg-accent rounded-full" />
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PROJECTS.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>

          {/* GitHub CTA */}
          <div className="text-center mt-12">
            <a
              href="https://github.com/navneetyadav8070"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View more projects on GitHub"
              className="inline-flex items-center gap-2 px-8 py-4 glass text-white font-semibold rounded-full border border-accent/30 hover:bg-accent/10 transition-all duration-300"
            >
              <FaGithub className="text-xl" />
              View More on GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;