import { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('printflow_user');
    const token = localStorage.getItem('printflow_token');

    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    setLoading(false);
  }, []);

  // Save user and token
  const login = (userData, token = null) => {
    setUser(userData);
    localStorage.setItem('printflow_user', JSON.stringify(userData));
    if (token) {
      localStorage.setItem('printflow_token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('printflow_user');
    localStorage.removeItem('printflow_token');
    delete axios.defaults.headers.common['Authorization'];
  };

  // Register via API
  const register = async ({ name, email, password, companyName }) => {
    const res = await axios.post('http://localhost:5000/api/auth/register', {
      name, email, password, companyName
    });

    if (res.data.success) {
      login(res.data.user, res.data.token);
    }

    return res.data;
  };

  // Login via API
  const loginWithApi = async ({ email, password }) => {
    const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });

    if (res.data.success) {
      login(res.data.user, res.data.token);
    }

    return res.data;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, register, loginWithApi }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
