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
      className={`fixed bottom-8 right-8 z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
      }`}
    >
      <Link
        to="home"
        smooth={true}
        duration={500}
        className="w-12 h-12 bg-accent/20 backdrop-blur-sm border border-accent/50 rounded-full flex items-center justify-center text-accent hover:bg-accent hover:text-dark transition-all duration-300 cursor-pointer shadow-lg shadow-accent/20 hover:shadow-accent/50"
      >
        <FaArrowUp className="text-lg" />
      </Link>
    </div>
  );
};

export default ScrollToTop;