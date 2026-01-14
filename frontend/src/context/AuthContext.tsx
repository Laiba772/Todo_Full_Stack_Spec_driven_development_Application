// T020: AuthContext with AuthContextProvider - Updated for BetterAuth

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User, AuthState, AuthContextType } from '@/types/auth';
import { useBetterAuth } from '@/hooks/useBetterAuth';
import { jwtDecode } from 'jwt-decode';
import apiClient from '@/lib/api/clients';


export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const authHook = useBetterAuth();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true, // Set to true initially while checking session
    error: null,
    isAuthenticated: false,
  });
  const router = useRouter();

  // Function to fetch user data from backend
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
        isAuthenticated: true
      });
      return user;
    } catch (error) {
      console.error('Failed to fetch user session:', error);
      setAuthState({
        user: null,
        loading: false,
        error: 'Session expired or invalid',
        isAuthenticated: false
      });
      return null;
    }
  }, []);

  // Check for existing session on initial load
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const signIn = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    try {
      await authHook.signIn(email, password); // This sets the HttpOnly cookie
      await fetchUser(); // Fetch user details after successful sign-in
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Sign in failed',
        isAuthenticated: false,
        user: null
      }));
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    try {
      await authHook.signUp(email, password); // This sets the HttpOnly cookie
      await fetchUser(); // Fetch user details after successful sign-up
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Sign up failed',
        isAuthenticated: false,
        user: null
      }));
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authHook.signOut();
      setAuthState({
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false
      });
      router.push('/signin');
    } catch (error) {
      console.error('Sign out error:', error);
      // Even if sign out fails, clear local state
      setAuthState({
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false
      });
      router.push('/signin');
    }
  };

  const refreshAuth = useCallback(async () => {
    await fetchUser(); // Re-fetch user to refresh auth state
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
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }
  return context;
}
