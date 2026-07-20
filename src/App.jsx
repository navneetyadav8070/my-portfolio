import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { onAuthChange, isSignInWithEmailLink, signInWithEmailLink, auth } from './firebase';
import { logger } from './utils/logger';
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
      logger.section('🔐 ADMIN VERIFICATION');
      
      // Check 1: Session
      if (sessionStorage.getItem('adminAuthenticated') === 'true' && 
          sessionStorage.getItem('adminEmail') === ADMIN_EMAIL) {
        logger.success('ADMIN', 'Session valid - access granted');
        setIsAdmin(true);
        setChecking(false);
        return;
      }

      // Check 2: Email OTP
      if (isSignInWithEmailLink(auth, window.location.href)) {
        logger.info('ADMIN', 'Email link detected, verifying...');
        try {
          let email = window.localStorage.getItem('emailForSignIn');
          if (!email) email = ADMIN_EMAIL;
          
          const result = await signInWithEmailLink(auth, email, window.location.href);
          
          if (result.user.email === ADMIN_EMAIL) {
            logger.success('ADMIN', 'OTP verified - access granted', { email: result.user.email });
            sessionStorage.setItem('adminAuthenticated', 'true');
            sessionStorage.setItem('adminEmail', result.user.email);
            sessionStorage.setItem('adminLoginTime', Date.now().toString());
            window.localStorage.removeItem('emailForSignIn');
            setIsAdmin(true);
            setChecking(false);
            return;
          } else {
            logger.warn('ADMIN', 'Wrong email tried', { email: result.user.email });
            await auth.signOut();
          }
        } catch (err) {
          logger.error('ADMIN', 'OTP verification failed', { error: err.code, message: err.message });
        }
      }

      logger.warn('ADMIN', 'Access denied - redirecting to login');
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
    logger.route('Redirecting to /admin-login');
    return <Navigate to="/admin-login" replace />;
  }

  logger.success('ADMIN', 'Admin dashboard loaded');
  return <AdminDashboard />;
};

const HomePage = ({ user }) => {
  useEffect(() => {
    logger.component('HomePage', { user: user?.email || 'no user' });
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
    logger.section('🚀 APP STARTING');
    logger.pageLoad();
    logger.info('APP', 'Environment', { 
      host: window.location.hostname,
      path: window.location.pathname,
      isDev: window.location.hostname === 'localhost'
    });

    const unsubscribe = onAuthChange((user) => {
      logger.auth('Auth state changed', { 
        email: user?.email || 'no user', 
        isLoggedIn: !!user,
        isAdmin: user?.email === ADMIN_EMAIL,
        timestamp: new Date().toISOString()
      });
      
      if (user && user.email === ADMIN_EMAIL) {
        logger.auth('⚠️ ADMIN DETECTED', { email: user.email });
        
        const isAdminRoute = window.location.pathname.includes('/ny-admin-8070') || 
                            window.location.pathname.includes('/admin-login');
        
        logger.route('Admin route check', { 
          isAdminRoute, 
          path: window.location.pathname,
          hasSession: sessionStorage.getItem('adminAuthenticated') === 'true'
        });
        
        if (isAdminRoute || sessionStorage.getItem('adminAuthenticated') === 'true') {
          logger.auth('✅ Admin staying on admin route - not setting as normal user');
          setUser(null);
          setLoading(false);
          return;
        } else {
          logger.auth('❌ Admin on public page - force signing out');
          auth.signOut();
          setUser(null);
          setLoading(false);
          return;
        }
      }
      
      logger.auth(user ? 'User logged in' : 'No user logged in');
      setUser(user);
      setLoading(false);
    });
    
    return () => {
      logger.info('APP', 'Cleanup - unmounting');
      unsubscribe();
    };
  }, []);

  if (loading) {
    logger.info('APP', 'Showing loading screen');
    return <LoadingScreen />;
  }

  logger.route('Rendering routes', { path: window.location.pathname, user: user?.email });

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