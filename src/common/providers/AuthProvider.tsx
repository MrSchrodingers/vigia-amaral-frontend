"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api.service';
import { User } from '../interfaces/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (data: FormData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      try {
        const decoded: { sub: string } = jwtDecode(storedToken);
        // Em uma app real, você faria uma chamada a /api/auth/users/me para validar o token e obter dados do usuário
        setUser({ email: decoded.sub, id: '', is_active: true }); // Mock user data from token
        setToken(storedToken);
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem('accessToken');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (data: FormData) => {
    const response = await api.post('/api/auth/token', data);
    const { access_token } = response.data;
    localStorage.setItem('accessToken', access_token);
    const decoded: { sub: string } = jwtDecode(access_token);
    setUser({ email: decoded.sub, id: '', is_active: true }); // Mock user data from token
    setToken(access_token);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
    setToken(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};