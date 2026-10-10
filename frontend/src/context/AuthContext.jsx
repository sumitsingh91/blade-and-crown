// frontend/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('access_token');

    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await API.post('/auth/login/', { email, password });
    const { user, tokens } = response.data;

    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);

    API.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`;
    setUser(user);
    return response.data;
  };

  const register = async (userData) => {
    const response = await API.post('/auth/register/', userData);
    const { user, tokens } = response.data;

    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);

    API.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`;
    setUser(user);
    return response.data;
  };

  const logout = async () => {
    try {
      const refresh = localStorage.getItem('refresh_token');
      await API.post('/auth/logout/', { refresh });
    } catch (error) {
      // Continue anyway
    }

    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    delete API.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};