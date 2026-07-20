import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { ProtectedRoute, AdminRoute, SuperAdminRoute, UserRoute } from './components/auth/ProtectedRoute';
import LoadingScreen from './components/LoadingScreen';

// Lazy load all pages
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const VerifyEmailPage = lazy(() => import('./pages/auth/VerifyEmailPage'));
const UserDashboard = lazy(() => import('./pages/user/Dashboard'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const SuperAdminDashboard = lazy(() => import('./pages/admin/SuperAdminDashboard'));
const CreateAdminPage = lazy(() => import('./pages/admin/CreateAdminPage'));
const ManageAdminsPage = lazy(() => import('./pages/admin/ManageAdminsPage'));
const ManageUsersPage = lazy(() => import('./pages/admin/ManageUsersPage'));
const CheckoutPage = lazy(() => import('./pages/Checkout'));
const AccessDeniedPage = lazy(() => import('./pages/AccessDenied'));
const NotFoundPage = lazy(() => import('./pages/NotFound'));
const AccountDisabledPage = lazy(() => import('./pages/AccountDisabled'));

const PageLoader = () => (
  <div className="min-h-screen bg-dark flex items-center justify-center">
    <div className="w-10 h-10 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/access-denied" element={<AccessDeniedPage />} />
            <Route path="/account-disabled" element={<AccountDisabledPage />} />
            
            {/* User Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute><UserDashboard /></ProtectedRoute>
            } />
            <Route path="/checkout" element={
              <ProtectedRoute><CheckoutPage /></ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <AdminRoute><AdminDashboard /></AdminRoute>
            } />
            <Route path="/admin/projects" element={
              <AdminRoute><AdminDashboard /></AdminRoute>
            } />
            
            {/* Super Admin Routes */}
            <Route path="/super-admin" element={
              <SuperAdminRoute><SuperAdminDashboard /></SuperAdminRoute>
            } />
            <Route path="/super-admin/create-admin" element={
              <SuperAdminRoute><CreateAdminPage /></SuperAdminRoute>
            } />
            <Route path="/super-admin/manage-admins" element={
              <SuperAdminRoute><ManageAdminsPage /></SuperAdminRoute>
            } />
            <Route path="/super-admin/manage-users" element={
              <SuperAdminRoute><ManageUsersPage /></SuperAdminRoute>
            } />
            
            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}