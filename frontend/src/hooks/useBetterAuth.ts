import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import apiClient from '@/lib/api/clients';

// For now, since BetterAuth uses atoms instead of standard hooks, we'll create a simple wrapper
// that works with our existing system but represents the BetterAuth integration
interface User {
  id: string;
  email: string;
  token?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshAuth: () => void;
}

export function useBetterAuth(): AuthContextType {
  const router = useRouter();

  // Direct API calls to match our backend endpoints
  const signInHandler = useCallback(async (email: string, password: string) => {
    try {
      await apiClient.post('/auth/signin', {
        email,
        password
      });

      router.push('/tasks');
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail?.message || error.message || 'Sign in failed';
      throw new Error(errorMessage);
    }
  }, [router]);

  const signUpHandler = useCallback(async (email: string, password: string) => {
    try {
      await apiClient.post('/auth/signup', {
        email,
        password
      });

      router.push('/tasks');
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail?.message || error.message || 'Sign up failed';
      throw new Error(errorMessage);
    }
  }, [router]);

  const signOutHandler = useCallback(async () => {
    try {
      await apiClient.post('/auth/signout'); // Call backend to clear HttpOnly cookie
      router.push('/signin');
    } catch (error) {
      console.error('Sign out error:', error);
      // Even if sign out fails on backend, redirect to sign in locally
      router.push('/signin');
    }
  }, [router]);

  const refreshAuth = useCallback(() => {
    // Session refreshing would happen automatically with JWT
  }, []);

  // Return initial state - the actual state will be managed by AuthContext
  return {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
    signIn: signInHandler,
    signUp: signUpHandler,
    signOut: signOutHandler,
    refreshAuth,
  };
}