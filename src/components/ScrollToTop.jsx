import { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import { Link } from 'react-scroll';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div
      className={`fixed bottom-24 right-5 sm:right-6 z-40 transition-all duration-300 ${
        isVisible ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-0 pointer-events-none'
      }`}
    >
      <Link
        to="home"
        smooth={true}
        duration={500}
        aria-label="Scroll to top"
        role="button"
        tabIndex={0}
        className="w-11 h-11 bg-accent/20 backdrop-blur-sm border border-accent/50 rounded-full flex items-center justify-center text-accent hover:bg-accent hover:text-dark transition-all duration-300 cursor-pointer shadow-lg shadow-accent/20 hover:shadow-accent/50"
      >
        <FaArrowUp className="text-base" />
      </Link>
    </div>
  );
};

export default ScrollToTop;