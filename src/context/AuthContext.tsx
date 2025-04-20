import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

interface User {
  _id: string;
  username: string;
  email: string;
  profilePicture: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  register: (username: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: { username?: string; profilePicture?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const register = async (username: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data } = await axios.post(`${API_URL}/api/auth/register`, {
        username,
        email,
        password
      });
      
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
      throw new Error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data } = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password
      });
      
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      throw new Error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Call update status endpoint to set user as offline
    if (user) {
      axios.put(
        `${API_URL}/api/users/status`,
        { status: 'offline' },
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      ).catch(err => console.error('Error updating status:', err));
    }
    
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateProfile = async (data: { username?: string; profilePicture?: string }) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user) {
        throw new Error('Not authenticated');
      }
      
      const response = await axios.put(
        `${API_URL}/api/users/profile`,
        data,
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );
      
      const updatedUser = {
        ...user,
        username: response.data.username,
        profilePicture: response.data.profilePicture
      };
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Profile update failed');
      throw new Error(err.response?.data?.message || 'Profile update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      register,
      login,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};