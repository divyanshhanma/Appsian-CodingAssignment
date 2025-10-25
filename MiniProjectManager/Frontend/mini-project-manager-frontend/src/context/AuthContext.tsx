import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthResponse, UserInfo } from '../types/auth';
import * as authService from '../services/authService';
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  user: UserInfo | null;
  jwtToken: string | null;
  login: (username: string, password: string) => Promise<void>; // Changed return type to void
  register: (username: string, password: string) => Promise<void>; // Changed return type to void
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUser({ userId: decoded.nameid, username: decoded.unique_name });
        setJwtToken(token);
      } catch (error) {
        console.error("Invalid token", error);
        // If token is invalid, ensure we log out and clear everything
        handleLogout(); 
      }
    } else {
      // If no token exists, ensure states are null
      setUser(null);
      setJwtToken(null);
    }
  }, []); // Run only once on mount

  const handleLogin = async (username: string, password: string): Promise<void> => {
    try {
      const response: AuthResponse = await authService.login(username, password);
      localStorage.setItem('jwtToken', response.token);
      const decoded: any = jwtDecode(response.token);
      setUser({ userId: decoded.nameid, username: decoded.unique_name });
      setJwtToken(response.token);
      // navigate('/dashboard'); // Removed: LoginForm will handle navigation
    } catch (error) {
      console.error("Login failed", error);
      // If login fails, ensure no stale data persists
      handleLogout(); // Clear any potentially stale local storage/state
      throw error; // Re-throw to be caught by calling component (LoginForm)
    }
  };

  const handleRegister = async (username: string, password: string): Promise<void> => {
    try {
      const response: AuthResponse = await authService.register(username, password);
      localStorage.setItem('jwtToken', response.token);
      const decoded: any = jwtDecode(response.token);
      setUser({ userId: decoded.nameid, username: decoded.unique_name });
      setJwtToken(response.token);
      // navigate('/dashboard'); // Removed: RegisterForm will handle navigation
    } catch (error) {
      console.error("Registration failed", error);
      // If registration fails, ensure no stale data persists
      handleLogout(); // Clear any potentially stale local storage/state
      throw error; // Re-throw to be caught by calling component (RegisterForm)
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setJwtToken(null);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, jwtToken, login: handleLogin, register: handleRegister, logout: handleLogout }}>
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
