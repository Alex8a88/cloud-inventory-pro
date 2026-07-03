import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState(localStorage.getItem('username'));

  const login = (tokenValue, usernameValue) => {
    localStorage.setItem('token', tokenValue);
    localStorage.setItem('username', usernameValue);
    setToken(tokenValue);
    setUsername(usernameValue);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUsername(null);
  };

  const isAuthenticated = () => !!token;

  return (
    <AuthContext.Provider value={{ token, username, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);