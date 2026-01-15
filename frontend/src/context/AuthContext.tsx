'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, redirect } from 'next/navigation';
import { User, AuthState, AuthContextType } from '@/types/auth';
import { useBetterAuth } from '@/hooks/useBetterAuth';
import { jwtDecode } from 'jwt-decode';
import { AuthGuard } from '@/components/auth/AuthGuard';

interface DecodedToken {
  sub: string;
  email: string;
  exp: number;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const auth = useBetterAuth();
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp > currentTime) {
          setState({
            user: { id: decodedToken.sub, email: decodedToken.email },
            isAuthenticated: true,
            loading: false,
            error: null,
          });
        } else {
          // Token expired
          localStorage.removeItem('access_token');
          setState(s => ({ ...s, isAuthenticated: false, loading: false }));
        }
      } catch (error) {
        // Invalid token
        localStorage.removeItem('access_token');
        setState(s => ({ ...s, isAuthenticated: false, loading: false }));
      }
    } else {
      setState(s => ({ ...s, loading: false }));
    }
  }, []);

  const signIn = async (email: string, password: string) => { // This line contains the extra period from the original replace string
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const user = await auth.signIn(email, password);
      setState({
        user: { id: user.id, email: user.email },
        isAuthenticated: true,
        loading: false,
        error: null,
      });
    } catch (err: any) {
      setState(s => ({ ...s, loading: false, error: err.message }));
      throw err;
    }
  };

  const signUp = async (email: string, password: string) => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const user = await auth.signUp(email, password);
      setState({
        user: { id: user.id, email: user.email },
        isAuthenticated: true,
        loading: false,
        error: null,
      });
    } catch (err: any) {
      setState(s => ({ ...s, loading: false, error: err.message }));
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
    } catch (err) {
      console.warn('SignOut failed on server', err);
    } finally {
      setState({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });
      // No need to redirect here, the hook does it
    }
  };

  return (
    <AuthContext.Provider
      value={{ ...state, signIn, signUp, signOut }}
    >
      <AuthGuard>{children}</AuthGuard>
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};