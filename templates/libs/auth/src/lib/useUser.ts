import { useAuth } from './useAuth';
import type { User } from '@<%= projectName %>/shared';

/**
 * Hook to access the current user
 * @returns Current user object or null if not authenticated
 */
export function useUser(): User | null {
  const { user } = useAuth();
  return user;
}
