import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('ongo_token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize and verify session on initial load
  useEffect(() => {
    async function loadUser() {
      const storedToken = localStorage.getItem('ongo_token');

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.getMe();
        if (response?.data?.user) {
          setUser(response.data.user);
          setToken(storedToken);
        } else {
          // Incompatible response format
          logout();
        }
      } catch (err) {
        console.warn('Session expired or invalid, logging out:', err.message);
        logout();
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const response = await api.login({ email, password });
      const { user: userData, token: userToken } = response.data;

      localStorage.setItem('ongo_token', userToken);
      setToken(userToken);
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const register = async (name, email, password) => {
    setError(null);
    try {
      const response = await api.register({ name, email, password });
      const { user: userData, token: userToken } = response.data;

      localStorage.setItem('ongo_token', userToken);
      setToken(userToken);
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('ongo_token');
    setToken(null);
    setUser(null);
    setError(null);
  };

  const clearError = () => setError(null);

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
