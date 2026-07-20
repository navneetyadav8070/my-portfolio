import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { onAuthChange } from './firebase/config';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Process from './components/Process';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import LoadingScreen from './components/LoadingScreen';
import LoginPage from './pages/auth/LoginPage';
import Checkout from './components/Checkout';

const ADMIN_EMAIL = "navneetyadav8070@gmail.com";

const ScrollToTopOnNavigate = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const HomePage = ({ user }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); }),
        { threshold: 0.1 }
      );
      document.querySelectorAll('.fade-in-section').forEach(s => observer.observe(s));
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Navbar user={user} />
      <main>
        <Hero />
        <Services />
        <About />
        <Skills />
        <Projects />
        <Process />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <Router>
      <ScrollToTopOnNavigate />
      <Routes>
        <Route path="/" element={<HomePage user={user} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/checkout" element={user ? <Checkout /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;