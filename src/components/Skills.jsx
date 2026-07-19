import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SKILLS_DATA = {
  "Frontend Development": {
    icon: "🎨",
    skills: [
      { name: "React.js", level: 95 },
      { name: "Next.js", level: 90 },
      { name: "JavaScript", level: 95 },
      { name: "TypeScript", level: 85 },
      { name: "HTML5/CSS3", level: 98 },
      { name: "Tailwind CSS", level: 95 }
    ]
  },
  "Backend Development": {
    icon: "⚙️",
    skills: [
      { name: "Node.js", level: 90 },
      { name: "Python", level: 85 },
      { name: "Java", level: 80 },
      { name: "PHP", level: 85 },
      { name: "FastAPI", level: 88 },
      { name: "REST APIs", level: 95 }
    ]
  },
  "AI & Machine Learning": {
    icon: "🤖",
    skills: [
      { name: "OpenAI API", level: 90 },
      { name: "LangChain", level: 85 },
      { name: "RAG Systems", level: 80 },
      { name: "AI Integration", level: 90 }
    ]
  },
  "Mobile Development": {
    icon: "📱",
    skills: [
      { name: "Android (Java)", level: 85 },
      { name: "Kotlin", level: 75 },
      { name: "XML", level: 90 },
      { name: "Firebase", level: 88 }
    ]
  },
  "DevOps & Cloud": {
    icon: "☁️",
    skills: [
      { name: "AWS", level: 80 },
      { name: "Docker", level: 85 },
      { name: "CI/CD", level: 82 },
      { name: "Git & GitHub", level: 95 },
      { name: "Linux", level: 85 }
    ]
  },
  "Digital Marketing": {
    icon: "📈",
    skills: [
      { name: "SEO", level: 90 },
      { name: "SEM", level: 85 },
      { name: "Meta Ads", level: 88 },
      { name: "Google Ads", level: 85 }
    ]
  }
};

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState("Frontend Development");

  return (
    <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-card relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="fade-in-section">
          {/* Section Header */}
          <div className="text-center mb-16">
            <p className="text-accent text-sm uppercase tracking-widest mb-2">My Skills</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Technical Expertise
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Technologies I've been working with recently
            </p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="w-12 h-1 bg-accent rounded-full" />
              <div className="w-3 h-3 bg-accent rounded-full" />
              <div className="w-12 h-1 bg-accent rounded-full" />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {Object.keys(SKILLS_DATA).map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-accent text-dark shadow-lg shadow-accent/25'
                    : 'glass text-gray-400 hover:text-white border border-accent/10 hover:border-accent/30'
                }`}
              >
                {SKILLS_DATA[category].icon} {category}
              </button>
            ))}
          </div>

          {/* Skills Display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto"
            >
              {SKILLS_DATA[activeCategory].skills.map((skill, index) => (
                <div key={index} className="skill-card glass rounded-xl p-6 border border-accent/10">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-white font-medium">{skill.name}</span>
                    <span className="text-accent text-sm font-bold">{skill.level}%</span>
                  </div>
                  <div className="w-full h-2 bg-dark rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="h-full bg-gradient-to-r from-accent to-green-400 rounded-full relative"
                    >
                      <div className="absolute inset-0 shimmer" />
                    </motion.div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Skills;