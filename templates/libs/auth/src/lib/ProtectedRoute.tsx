import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
  fallback?: ReactNode;
}

/**
 * Component to protect routes that require authentication
 * Redirects to login page if user is not authenticated
 */
export function ProtectedRoute({
  children,
  redirectTo = '/login',
  fallback = <div>Loading...</div>,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login page
      window.location.href = redirectTo;
    }
  }, [isAuthenticated, isLoading, redirectTo]);

  if (isLoading) {
    return <>{fallback}</>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
