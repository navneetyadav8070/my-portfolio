import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { onAuthChange, isSignInWithEmailLink, signInWithEmailLink, auth } from './firebase';
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
import Login from './components/Login';
import Register from './components/Register';
import ClientDashboard from './components/ClientDashboard';
import AdminDashboard from './components/AdminDashboard';
import Checkout from './components/Checkout';
import AdminLoginPage from './components/AdminLoginPage';

const ADMIN_EMAIL = "navneetyadav8070@gmail.com";

const ScrollToTopOnNavigate = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const AdminDashboardWrapper = ({ user }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      if (sessionStorage.getItem('adminAuthenticated') === 'true' && 
          sessionStorage.getItem('adminEmail') === ADMIN_EMAIL) {
        setIsAdmin(true);
        setChecking(false);
        return;
      }

      if (isSignInWithEmailLink(auth, window.location.href)) {
        try {
          let email = window.localStorage.getItem('emailForSignIn');
          if (!email) email = ADMIN_EMAIL;
          
          const result = await signInWithEmailLink(auth, email, window.location.href);
          
          if (result.user.email === ADMIN_EMAIL) {
            sessionStorage.setItem('adminAuthenticated', 'true');
            sessionStorage.setItem('adminEmail', result.user.email);
            sessionStorage.setItem('adminLoginTime', Date.now().toString());
            window.localStorage.removeItem('emailForSignIn');
            setIsAdmin(true);
            setChecking(false);
            return;
          } else {
            await auth.signOut();
          }
        } catch (err) {
          console.error('OTP verification failed:', err);
        }
      }

      setChecking(false);
    };

    checkAdmin();
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin-login" replace />;
  }

  return <AdminDashboard />;
};

const HomePage = ({ user }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) entry.target.classList.add('is-visible');
          });
        },
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
      if (user && user.email === ADMIN_EMAIL) {
        const isAdminRoute = window.location.pathname.includes('/ny-admin-8070') || 
                            window.location.pathname.includes('/admin-login');
        
        if (isAdminRoute || sessionStorage.getItem('adminAuthenticated') === 'true') {
          setUser(null);
          setLoading(false);
          return;
        } else {
          auth.signOut();
          setUser(null);
          setLoading(false);
          return;
        }
      }
      
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
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
        <Route path="/dashboard" element={user ? <ClientDashboard user={user} /> : <Navigate to="/login" replace />} />
        <Route path="/checkout" element={user ? <Checkout /> : <Navigate to="/login?redirect=checkout" replace />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/ny-admin-8070" element={<AdminDashboardWrapper user={user} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;