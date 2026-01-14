'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { redirect } from 'next/navigation';
import { User, AuthState, AuthContextType } from '@/types/auth';
import { useBetterAuth } from '@/hooks/useBetterAuth';
import apiClient from '@/lib/api/clients';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const auth = useBetterAuth();
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
  });

  const fetchUser = useCallback(async () => {
    try {
      const res = await apiClient.get('/auth/me');
      setState({
        user: { id: res.data.id, email: res.data.email },
        isAuthenticated: true,
        loading: false,
        error: null,
      });
    } catch (err: any) {
      setState({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: err.message || 'Not authenticated',
      });
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const signIn = async (email: string, password: string) => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      await auth.signIn(email, password);
      await fetchUser();
    } catch (err: any) {
      setState(s => ({ ...s, loading: false, error: err.message }));
      throw err;
    }
  };

  // similar for signUp...

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
      redirect('/signin');
    }
  };

  return (
    <AuthContext.Provider
      value={{ ...state, signIn, signUp, signOut, refreshAuth: fetchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
