import { FaCode, FaGraduationCap, FaBriefcase } from 'react-icons/fa';
import { Link } from 'react-scroll';

const ABOUT_CONTENT = {
  title: "About Me",
  subtitle: "Get to know me better",
  bio: "Full Stack Developer with 4+ years of hands-on experience building custom-coded websites and applications across multiple stacks — React, Next.js, Node.js, PHP, Java and Python. I also develop native Android apps and integrate AI/LLM features. I combine strong engineering with digital marketing to help products reach customers and grow.",
  extendedBio: "I specialize in creating high-performance, scalable solutions that solve real business problems. My approach combines technical excellence with strategic thinking to deliver products that not only work flawlessly but also drive growth.",
  info: [
    { label: "Name", value: "Navneet Yadav" },
    { label: "Email", value: "Navneetyadav8070@gmail.com" },
    { label: "Phone", value: "+91 8826999747" },
    { label: "Location", value: "Greater Noida, India" },
    { label: "Availability", value: "Remote (Worldwide)" },
    { label: "Experience", value: "4+ Years" }
  ],
  highlights: [
    { icon: <FaCode />, title: "Clean Architecture", description: "Scalable & maintainable code" },
    { icon: <FaGraduationCap />, title: "Latest Tech", description: "Cutting-edge stack" },
    { icon: <FaBriefcase />, title: "Business Focus", description: "ROI-driven development" }
  ]
};

const About = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 80;
      const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
      try { window.scrollTo({ top: offsetPosition, behavior: 'smooth' }); } 
      catch (error) { window.scrollTo(0, offsetPosition); }
    }
  };

  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 bg-dark relative overflow-hidden">
      <div className="absolute inset-0 hex-bg opacity-[0.03]" />
      
      <div className="max-w-7xl mx-auto relative">
        <div className="fade-in-section">
          <div className="text-center mb-16">
            <p className="text-accent/70 text-xs sm:text-sm uppercase tracking-[0.2em] mb-3">{ABOUT_CONTENT.subtitle}</p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">{ABOUT_CONTENT.title}</h2>
            <div className="flex items-center justify-center gap-3">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-accent/50" />
              <div className="w-2 h-2 bg-accent rounded-full" />
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-accent/50" />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Photo with Emoji Fallback */}
            <div className="relative">
              <div className="relative w-72 h-72 sm:w-96 sm:h-96 mx-auto">
                <div className="absolute -inset-4 border border-accent/10 rounded-2xl rotate-3 transition-transform duration-500 hover:rotate-6" />
                <div className="absolute inset-0 border border-accent/20 rounded-2xl -rotate-3 transition-transform duration-500 hover:-rotate-6" />
                <div className="relative w-full h-full rounded-2xl overflow-hidden border border-accent/20 shadow-2xl shadow-accent/5 bg-gradient-to-br from-accent/10 to-dark-card flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-8xl">👨‍💻</span>
                    <p className="text-accent mt-4 font-medium">Navneet Yadav</p>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 glass rounded-2xl p-4 border border-accent/10 shadow-xl backdrop-blur-xl">
                  <p className="text-3xl font-bold gradient-text">4+</p>
                  <p className="text-xs text-gray-400">Years of Excellence</p>
                </div>
              </div>
            </div>

            {/* Right - Content */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">Crafting Digital Excellence</h3>
                <p className="text-gray-300 leading-relaxed">{ABOUT_CONTENT.bio}</p>
                <p className="text-gray-500 leading-relaxed mt-4">{ABOUT_CONTENT.extendedBio}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {ABOUT_CONTENT.info.map((item, index) => (
                  <div key={index} className="glass rounded-xl p-4 border border-white/5 hover:border-accent/10 transition-all duration-300 min-w-0">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">{item.label}</p>
                    <p className={`text-white text-sm font-medium mt-1 ${item.label === 'Email' ? 'break-all' : 'break-words'}`}>{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3">
                {ABOUT_CONTENT.highlights.map((item, index) => (
                  <div key={index} className="text-center glass rounded-xl p-4 border border-white/5 hover:border-accent/10 transition-all duration-300">
                    <div className="text-xl text-accent mb-2 flex justify-center opacity-70">{item.icon}</div>
                    <h4 className="text-white font-medium text-xs mb-1">{item.title}</h4>
                    <p className="text-gray-500 text-[10px]">{item.description}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => scrollToSection('contact')}
                className="inline-flex items-center gap-2 text-accent hover:text-white transition-colors duration-300 cursor-pointer text-sm font-medium bg-transparent border-none"
              >
                <span>Start a conversation</span>
                <span className="text-lg">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;