import React, { createContext, ReactNode, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type UserRole = "Admin" | "Dealer" | "Farmer" | null;

export interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole;
  login: (role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userRole: null,
  login: async () => {},
  logout: async () => {},
});

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    restoreAuth();
  }, []);

  async function restoreAuth() {
    try {
      const role = await AsyncStorage.getItem("userRole");
      if (role === "Admin" || role === "Dealer" || role === "Farmer") {
        setUserRole(role);
        setIsAuthenticated(true);
      } else {
        setUserRole(null);
        setIsAuthenticated(false);
      }
    } catch {
      setUserRole(null);
      setIsAuthenticated(false);
    }
  }

  async function login(role: UserRole) {
    setUserRole(role);
    setIsAuthenticated(true);
    await AsyncStorage.setItem("userRole", role ?? "");
  }

  async function logout() {
    setUserRole(null);
    setIsAuthenticated(false);
    await AsyncStorage.removeItem("userRole");
  }

  return (
    <AuthContext.Provider value={{ userRole, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
