import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaFolderOpen } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { logoutUser } from '../firebase';

const LOGO_TEXT = "NY";
const NAV_LINKS = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'services', label: 'Services', icon: '💼' },
  { id: 'pricing', label: 'Pricing', icon: '💰' },
  { id: 'about', label: 'About', icon: '👤' },
  { id: 'skills', label: 'Skills', icon: '⚡' },
  { id: 'projects', label: 'Work', icon: '🚀' },
  { id: 'contact', label: 'Contact', icon: '📬' },
];

const Navbar = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  const scrollToSection = useCallback((sectionId) => {
    setIsOpen(false);
    
    if (!isHomePage) {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const offset = element.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top: offset, behavior: 'smooth' });
        }
      }, 500);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = element.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    }
  }, [navigate, isHomePage]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      if (isHomePage) {
        const sections = NAV_LINKS.map(link => document.getElementById(link.id));
        const scrollPosition = window.scrollY + 200;
        for (let i = sections.length - 1; i >= 0; i--) {
          if (sections[i] && scrollPosition >= sections[i].offsetTop) {
            setActiveSection(NAV_LINKS[i].id);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-dark/95 backdrop-blur-2xl shadow-2xl shadow-black/30 border-b border-white/5' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <button onClick={() => scrollToSection('home')} className="flex items-center space-x-3 group bg-transparent border-none cursor-pointer outline-none">
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-green-400 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500 shadow-lg shadow-accent/20">
              <span className="text-xl font-bold text-dark">{LOGO_TEXT}</span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-lg font-bold text-white">Navneet Yadav</p>
              <p className="text-[10px] text-gray-500 tracking-widest uppercase">Freelance Developer</p>
            </div>
          </button>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            {isHomePage && NAV_LINKS.map((link) => (
              <button key={link.id} onClick={() => scrollToSection(link.id)}
                className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 bg-transparent border-none cursor-pointer outline-none ${activeSection === link.id ? 'text-accent bg-accent/5' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                <span className="mr-1.5">{link.icon}</span>{link.label}
                {activeSection === link.id && <motion.div layoutId="activeTab" className="absolute bottom-0 left-2 right-2 h-0.5 bg-accent rounded-full" transition={{ type: "spring", stiffness: 500, damping: 30 }} />}
              </button>
            ))}
            
            {!isHomePage && (
              <Link to="/" className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-all">🏠 Home</Link>
            )}
            
            <div className="ml-3 flex items-center gap-2">
              {user ? (
                <>
                  <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 glass border border-accent/20 text-accent text-sm font-medium rounded-xl hover:bg-accent/10 transition-all">
                    <FaFolderOpen size={14} /> My Projects
                  </Link>
                  <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-red-400 transition-all bg-transparent border-none cursor-pointer">
                    <FaSignOutAlt size={14} />
                  </button>
                </>
              ) : (
                <Link to="/login" className="px-5 py-2 bg-accent text-dark text-sm font-semibold rounded-xl hover:bg-accent-hover transition-all">
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="w-10 h-10 flex items-center justify-center rounded-xl glass border border-white/10 text-gray-300 hover:text-accent transition-all bg-transparent cursor-pointer">
              {isOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="lg:hidden overflow-hidden">
              <div className="px-2 pt-2 pb-4 space-y-1.5 glass rounded-2xl mt-2 border border-white/5">
                {isHomePage && NAV_LINKS.map((link) => (
                  <button key={link.id} onClick={() => scrollToSection(link.id)} className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium w-full text-left bg-transparent border-none cursor-pointer ${activeSection === link.id ? 'text-accent bg-accent/10' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
                    <span className="text-xl">{link.icon}</span>{link.label}
                  </button>
                ))}
                
                {!isHomePage && (
                  <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium w-full text-gray-300 hover:text-white hover:bg-white/5">
                    🏠 Home
                  </Link>
                )}
                
                <div className="border-t border-white/5 pt-2 mt-2">
                  {user ? (
                    <>
                      <Link to="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium w-full text-accent bg-accent/10">
                        <FaFolderOpen /> My Projects
                      </Link>
                      <button onClick={() => { handleLogout(); setIsOpen(false); }} className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium w-full text-left text-red-400 hover:bg-white/5">
                        <FaSignOutAlt /> Logout
                      </button>
                    </>
                  ) : (
                    <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium w-full text-accent bg-accent/10">
                      🔐 Login / Register
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;