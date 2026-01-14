// src/lib/context/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User, AuthState, AuthContextType } from '@/types/auth';
import { useBetterAuth } from '@/hooks/useBetterAuth';
import apiClient from '@/lib/api/clients';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const authHook = useBetterAuth();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
    isAuthenticated: false,
  });

  const router = useRouter();

  // Fetch user from backend
  const fetchUser = useCallback(async () => {
    setAuthState(prev => ({ ...prev, loading: true }));
    try {
      const response = await apiClient.get('/auth/me');
      const user: User = {
        id: response.data.id,
        email: response.data.email,
      };
      setAuthState({
        user,
        loading: false,
        error: null,
        isAuthenticated: true,
      });
      return user;
    } catch (error) {
      console.error('Failed to fetch user session:', error);
      setAuthState({
        user: null,
        loading: false,
        error: 'Session expired or invalid',
        isAuthenticated: false,
      });
      return null;
    }
  }, []);

  // Check session on mount
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const signIn = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    try {
      await authHook.signIn(email, password); // sets HttpOnly cookie
      await fetchUser();
    } catch (error: any) {
      setAuthState({
        user: null,
        loading: false,
        error: error.message || 'Sign in failed',
        isAuthenticated: false,
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    try {
      await authHook.signUp(email, password); // sets HttpOnly cookie
      await fetchUser();
    } catch (error: any) {
      setAuthState({
        user: null,
        loading: false,
        error: error.message || 'Sign up failed',
        isAuthenticated: false,
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authHook.signOut(); // clears cookie in backend
      setAuthState({
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false,
      });
      router.push('/signin');
    } catch (error) {
      console.error('Sign out error:', error);
      setAuthState({
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false,
      });
      router.push('/signin');
    }
  };

  const refreshAuth = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        signIn,
        signUp,
        signOut,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }
  return context;
}
