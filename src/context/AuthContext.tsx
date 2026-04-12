import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => void; // Added this
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

  // NEW: Function to update user data in state and localStorage
  const updateUser = (updatedData: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const newUserData = { ...prev, ...updatedData };
      localStorage.setItem("grocygo_user", JSON.stringify(newUserData));
      return newUserData;
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};