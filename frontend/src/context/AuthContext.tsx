// frontend/src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setAccessToken } from '../api/axios';

interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessTokenState, setAccessTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Silent refresh on app mount (keeps user logged in on page refresh)
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const res = await api.post('/auth/refresh');
        setAccessTokenState(res.data.accessToken);
        setAccessToken(res.data.accessToken);
      } catch (err) {
        setAccessTokenState(null);
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (token: string) => {
    setAccessTokenState(token);
    setAccessToken(token);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setAccessTokenState(null);
      setAccessToken(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!accessTokenState,
        accessToken: accessTokenState,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};