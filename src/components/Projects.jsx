import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import Tilt from 'react-parallax-tilt';

const PROJECTS = [
  {
    id: 1,
    title: "DocChat — Chat with your PDFs",
    category: "AI · RAG",
    icon: "📄",
    description: "A ChatGPT-style assistant that answers from your PDFs with an exact page citation for every claim (RAG) — plus OCR for scanned files and chat history synced across devices.",
    tags: ["React", "RAG", "Groq · Llama 3.3", "Gemini", "Firebase"],
    liveDemo: "",
    github: "https://github.com/navneetyadav8070",
    color: "from-violet-500/20 to-indigo-500/20"
  },
  {
    id: 2,
    title: "Compresso — Compress anything",
    category: "Full-Stack",
    icon: "🗜️",
    description: "A universal compression platform for images, PDF, video, audio, docs, code & archives — with an AI smart-compressor, a live preview matrix and a format converter. Strict TypeScript, self-hostable.",
    tags: ["React 19", "TypeScript", "Fastify", "FFmpeg", "Docker"],
    liveDemo: "",
    github: "https://github.com/navneetyadav8070",
    color: "from-cyan-500/20 to-blue-500/20"
  },
  {
    id: 3,
    title: "VCardify — Bulk Contact Saver",
    category: "Python · API",
    icon: "📇",
    description: "Turns any messy file of phone numbers — PDF, Excel, CSV, Word or text — into one phone-ready .vcf, with smart detection, de-duplication and one-scan QR import across 8 formats.",
    tags: ["Python", "FastAPI", "Tailwind", "Firebase", "Docker"],
    liveDemo: "https://vcardify.onrender.com",
    github: "https://github.com/navneetyadav8070/bulk-contacts-save-tool",
    color: "from-emerald-500/20 to-teal-500/20"
  }
];

const ProjectCard = ({ project }) => {
  const hasLive = project.liveDemo && project.liveDemo !== "#";
  const hasCode = project.github && project.github !== "#";

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
            <div className="text-6xl opacity-25">{project.icon}</div>
          </div>
          {/* Category Badge */}
          <div className="absolute top-4 right-4 glass rounded-full px-3 py-1 text-xs font-medium text-accent border border-accent/20">
            {project.category}
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

          {/* Buttons — Live Demo shows only when a real URL exists */}
          <div className="flex gap-3">
            {hasLive && (
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
            )}
            {hasCode && (
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
            )}
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
              Real products I've designed, built and shipped — end to end.
            </p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="w-12 h-1 bg-accent rounded-full" />
              <div className="w-3 h-3 bg-accent rounded-full" />
              <div className="w-12 h-1 bg-accent rounded-full" />
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PROJECTS.map((project) => (
              <ProjectCard key={project.id} project={project} />
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
