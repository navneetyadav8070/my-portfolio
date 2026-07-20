import { useEffect, useState } from 'react';
import Typewriter from 'typewriter-effect';
import ParticlesBackground from './ParticlesBackground';
import { FaGithub, FaLinkedin, FaArrowRight, FaCode, FaEnvelope, FaCheckCircle } from 'react-icons/fa';

const SOCIAL_LINKS = {
  github: "https://github.com/navneetyadav8070",
  linkedin: "https://linkedin.com/in/navneetyadav",
  email: "mailto:Navneetyadav8070@gmail.com"
};

const HERO_CONTENT = {
  greeting: "Freelance Full Stack Developer",
  name: "Navneet Yadav",
  tagline: "I help businesses build custom websites, web apps, and AI-integrated products that drive growth. Available for remote projects worldwide.",
  highlights: [
    "4+ Years Experience",
    "50+ Projects Delivered",
    "5-Star Reviews",
    "Worldwide Clients"
  ]
};

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => { setIsVisible(true); }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = window.innerWidth < 640 ? 70 : 100;
      const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
      try { window.scrollTo({ top: offsetPosition, behavior: 'smooth' }); } 
      catch (error) { window.scrollTo(0, offsetPosition); }
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center gradient-bg relative overflow-hidden">
      <ParticlesBackground />
      <div className="absolute inset-0 hex-bg opacity-[0.04]" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-20">
        {/* Profile Image - Fixed */}
        <div className={`mb-10 transform transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
          <div className="relative inline-block">
            <div className="absolute -inset-4 rounded-2xl border-2 border-accent/10 rotate-6 animate-spin-slow" />
            <div className="absolute -inset-8 rounded-2xl border border-accent/5 -rotate-3 animate-spin-reverse" />
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-accent/40 shadow-2xl shadow-accent/20 mx-auto relative z-10 bg-gradient-to-br from-accent/10 to-dark-card flex items-center justify-center">
              <span className="text-5xl sm:text-6xl">👨‍💻</span>
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 border-4 border-dark rounded-full z-20 animate-pulse flex items-center justify-center">
              <FaCheckCircle className="text-dark text-xs" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <p className={`text-accent/80 text-sm sm:text-base font-medium tracking-[0.3em] uppercase transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {HERO_CONTENT.greeting}
          </p>
          <h1 className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <span className="gradient-text glow-text">{HERO_CONTENT.name}</span>
          </h1>
          <div className={`text-xl sm:text-2xl md:text-3xl font-bold min-h-[50px] transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Typewriter options={{ strings: ["Websites & Web Apps", "AI-Powered Solutions", "E-Commerce Platforms", "Custom Dashboards", "API Development"], autoStart: true, loop: true, deleteSpeed: 40, delay: 60, wrapperClassName: "text-accent font-bold", cursorClassName: "text-accent" }} />
          </div>
          <p className={`text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {HERO_CONTENT.tagline}
          </p>

          <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto transition-all duration-700 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {HERO_CONTENT.highlights.map((item, i) => (
              <div key={i} className="glass rounded-2xl p-4 border border-white/5">
                <p className="text-xs text-gray-400">{item}</p>
              </div>
            ))}
          </div>

          <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 transition-all duration-700 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <button onClick={() => scrollToSection('projects')} className="group relative inline-flex items-center justify-center px-8 py-4 bg-accent text-dark font-bold rounded-2xl transition-all duration-500 hover:scale-105 active:scale-95 cursor-pointer shadow-2xl shadow-accent/30 w-full sm:w-auto border-none outline-none">
              <FaCode className="mr-2" /> View My Work <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => scrollToSection('contact')} className="group relative inline-flex items-center justify-center px-8 py-4 glass text-white font-bold rounded-2xl border-2 border-white/10 hover:border-accent/50 transition-all duration-500 hover:scale-105 active:scale-95 cursor-pointer w-full sm:w-auto outline-none">
              <FaEnvelope className="mr-2" /> Start a Project
            </button>
          </div>

          <div className={`flex justify-center items-center gap-4 pt-8 transition-all duration-700 delay-1100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 glass rounded-xl border border-white/5 hover:border-accent/30 transition-all hover:scale-105 group">
              <FaGithub className="text-lg text-gray-400 group-hover:text-accent transition-colors" /><span className="text-sm text-gray-400 group-hover:text-white hidden sm:inline">GitHub</span>
            </a>
            <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 glass rounded-xl border border-white/5 hover:border-accent/30 transition-all hover:scale-105 group">
              <FaLinkedin className="text-lg text-gray-400 group-hover:text-[#0A66C2] transition-colors" /><span className="text-sm text-gray-400 group-hover:text-white hidden sm:inline">LinkedIn</span>
            </a>
            <a href={SOCIAL_LINKS.email} className="flex items-center gap-2 px-4 py-2.5 glass rounded-xl border border-white/5 hover:border-accent/30 transition-all hover:scale-105 group">
              <FaEnvelope className="text-lg text-gray-400 group-hover:text-accent transition-colors" /><span className="text-sm text-gray-400 group-hover:text-white hidden sm:inline">Email</span>
            </a>
          </div>

          <div className={`flex justify-center pt-4 transition-all duration-700 delay-1200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full border border-accent/10">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-gray-400">Available for new projects — Let's build something great!</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <button onClick={() => scrollToSection('services')} className="flex flex-col items-center gap-2 bg-transparent border-none cursor-pointer group outline-none">
          <span className="text-[10px] text-gray-600 uppercase tracking-[0.2em] group-hover:text-accent transition-colors">See What I Do</span>
          <div className="w-5 h-8 border-2 border-accent/20 group-hover:border-accent/50 rounded-full flex justify-center transition-all"><div className="w-1.5 h-3 bg-accent/50 group-hover:bg-accent rounded-full mt-1.5 animate-bounce" /></div>
        </button>
      </div>
    </section>
  );
};

export default Hero;