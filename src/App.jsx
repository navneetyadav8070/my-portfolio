import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { onAuthChange } from './firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase/config';
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
import AIAssistant from './components/AIAssistant';
import LoadingScreen from './components/LoadingScreen';

// Route pages lazy-load hoti hain — homepage ke initial bundle se bahar,
// isliye website (index) bahut fast load hoti hai.
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Checkout = lazy(() => import('./components/Checkout'));
const CreateAdmin = lazy(() => import('./pages/admin/CreateAdmin'));
const ManageProjects = lazy(() => import('./pages/admin/ManageProjects'));

const PageLoader = () => (
  <div className="min-h-screen bg-dark flex items-center justify-center">
    <div className="w-10 h-10 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
  </div>
);

const ScrollToTopOnNavigate = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

// Admin Route Guard
const AdminRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      if (!user) {
        navigate('/login');
        setLoading(false);
        return;
      }

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === 'super_admin' || userData.role === 'admin') {
          setIsAdmin(true);
        } else {
          navigate('/dashboard');
        }
      } else {
        navigate('/login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return isAdmin ? children : null;
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
      <AIAssistant />
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
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage user={user} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/projects"
            element={
              <AdminRoute>
                <ManageProjects />
              </AdminRoute>
            }
          />
          <Route path="/checkout" element={user ? <Checkout /> : <Navigate to="/login" />} />
          <Route path="/create-admin" element={<CreateAdmin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;