import React, { createContext, useContext, useEffect, useState } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = authService.getToken();
    const u = authService.getCurrentUser();
    setToken(t || null);
    setUser(u || null);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
