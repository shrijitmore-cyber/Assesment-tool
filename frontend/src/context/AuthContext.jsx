import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api, formatApiError } from "@/lib/api";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null => checking, false => logged out
  const [error, setError] = useState("");

  const loadMe = useCallback(async () => {
    const token = localStorage.getItem("aim_token");
    if (!token) {
      setUser(false);
      return;
    }
    try {
      const { data } = await api.get("/auth/me");
      setUser(data.user);
    } catch (e) {
      localStorage.removeItem("aim_token");
      setUser(false);
    }
  }, []);

  useEffect(() => {
    loadMe();
  }, [loadMe]);

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("aim_token", data.token);
      setUser(data.user);
      setError("");
      return data.user;
    } catch (e) {
      const msg = formatApiError(e);
      setError(msg);
      throw new Error(msg);
    }
  };

  const register = async (payload) => {
    try {
      const { data } = await api.post("/auth/register", payload);
      localStorage.setItem("aim_token", data.token);
      setUser(data.user);
      setError("");
      return data.user;
    } catch (e) {
      const msg = formatApiError(e);
      setError(msg);
      throw new Error(msg);
    }
  };

  const logout = () => {
    localStorage.removeItem("aim_token");
    setUser(false);
  };

  return (
    <AuthCtx.Provider value={{ user, error, login, register, logout, reload: loadMe }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
