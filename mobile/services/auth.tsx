/**
 * Auth Context — Health Dashboard
 *
 * React Context for managing authentication state.
 * JWT tokens are stored in expo-secure-store (OS-level encryption).
 *
 * TODO(security): Implement automatic token refresh before expiration.
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api, getStoredToken, setStoredToken, removeStoredToken, ApiError } from './api';
import type { Usuario, LoginRequest, RegisterRequest } from '../types';

interface AuthState {
  user: Usuario | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Load token from SecureStore on mount
  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await getStoredToken();
      if (storedToken) {
        // Validate token by calling /me
        const user = await api.me();
        setState({
          user,
          token: storedToken,
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } catch {
      // Token is invalid or expired — clear it
      await removeStoredToken();
      setState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  const login = useCallback(async (data: LoginRequest) => {
    const response = await api.login(data);
    await setStoredToken(response.token);
    setState({
      user: response.usuario,
      token: response.token,
      isLoading: false,
      isAuthenticated: true,
    });
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    const response = await api.register(data);
    await setStoredToken(response.token);
    setState({
      user: response.usuario,
      token: response.token,
      isLoading: false,
      isAuthenticated: true,
    });
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } catch {
      // Even if the API call fails, clear local state
    }
    await removeStoredToken();
    setState({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
    });
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const user = await api.me();
      setState(prev => ({ ...prev, user }));
    } catch {
      // Silently fail
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
