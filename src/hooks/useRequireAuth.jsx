import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export function useRequireAuth(requiredRole = null) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      // Not logged in
      navigate('/login', { replace: true });
      return;
    }

    if (requiredRole) {
      const roleHierarchy = {
        'user': 1,
        'admin': 2,
        'super_admin': 3
      };

      const userRoleLevel = roleHierarchy[user.role] || 0;
      const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

      if (userRoleLevel < requiredRoleLevel) {
        // Insufficient permissions
        navigate('/access-denied', { replace: true });
        return;
      }
    }
  }, [user, loading, requiredRole, navigate]);

  return { user, loading };
}