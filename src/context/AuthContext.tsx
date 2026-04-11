import React, { createContext, useContext, useState, useEffect } from "react";

// Updated User interface to include created_at
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at?: string; // Added this to fix the Profile.tsx error
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("grocygo_token"));

  useEffect(() => {
    const savedUser = localStorage.getItem("grocygo_user");
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse saved user", e);
        localStorage.removeItem("grocygo_user");
      }
    }
  }, [token]);

  const login = (userData: User, token: string) => {
    localStorage.setItem("grocygo_token", token);
    localStorage.setItem("grocygo_user", JSON.stringify(userData));
    setUser(userData);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("grocygo_token");
    localStorage.removeItem("grocygo_user");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};