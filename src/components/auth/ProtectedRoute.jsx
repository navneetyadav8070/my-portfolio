import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ROLE_HIERARCHY = {
  'user': 1,
  'admin': 2,
  'super_admin': 3
};

export function ProtectedRoute({ children, requiredRole = null }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check email verification
  if (!user.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  // Check account status
  if (user.status !== 'active') {
    return <Navigate to="/account-disabled" replace />;
  }

  // Role check
  if (requiredRole) {
    const userLevel = ROLE_HIERARCHY[user.role] || 0;
    const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;

    if (userLevel < requiredLevel) {
      return <Navigate to="/access-denied" replace />;
    }
  }

  return children;
}

export function AdminRoute({ children }) {
  return <ProtectedRoute requiredRole="admin">{children}</ProtectedRoute>;
}

export function SuperAdminRoute({ children }) {
  return <ProtectedRoute requiredRole="super_admin">{children}</ProtectedRoute>;
}

export function UserRoute({ children }) {
  return <ProtectedRoute requiredRole="user">{children}</ProtectedRoute>;
}