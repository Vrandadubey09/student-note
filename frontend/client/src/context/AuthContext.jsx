import { createContext, useContext, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const register = async (name, email, password) => {
    return api.post("/auth/register", { name, email, password });
  };

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const { token: newToken, ...userInfo } = res.data;

    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userInfo));

    setToken(newToken);
    setUser(userInfo);

    return res;
  };

  const setProfile = (profile) => {
    const next = { ...user, ...profile };
    setUser(next);
    localStorage.setItem("user", JSON.stringify(next));
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = Boolean(token && user);

  return (
    <AuthContext.Provider
      value={{ token, user, isAuthenticated, register, login, setProfile, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
