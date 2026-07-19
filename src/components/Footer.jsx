import { FaGithub, FaLinkedin, FaEnvelope, FaHeart } from 'react-icons/fa';
import { Link } from 'react-scroll';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  // EDIT: Update links
  const socialLinks = [
    { icon: FaGithub, href: "https://github.com/navneetyadav8070", label: "GitHub" },
    { icon: FaLinkedin, href: "https://linkedin.com/in/navneetyadav", label: "LinkedIn" },
    { icon: FaEnvelope, href: "mailto:Navneetyadav8070@gmail.com", label: "Email" }
  ];

  return (
    <footer className="bg-dark border-t border-white/5 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-6">
          {/* Logo */}
          <Link
            to="home"
            smooth={true}
            duration={600}
            className="text-2xl font-bold cursor-pointer"
          >
            <span className="gradient-text">NY</span>
          </Link>

          {/* Navigation */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            {['Home', 'About', 'Skills', 'Projects', 'Contact'].map((item) => (
              <Link
                key={item}
                to={item.toLowerCase()}
                smooth={true}
                duration={600}
                offset={-80}
                className="text-gray-400 hover:text-accent transition-colors cursor-pointer"
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl glass border border-white/5 flex items-center justify-center text-gray-400 hover:text-accent hover:border-accent/30 transition-all duration-300"
                aria-label={social.label}
              >
                <social.icon size={18} />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-center">
            <p className="text-gray-500 text-sm flex items-center justify-center gap-1.5">
              © {currentYear} Navneet Yadav. Built with 
              <FaHeart className="text-red-500 text-xs animate-pulse" />
              using React & Tailwind
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;