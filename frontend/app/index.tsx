import React, { useEffect, useState, createContext, ReactNode } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { TabLayout } from "./_layout";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface AuthContextType {
  isAuthenticated: boolean;
  userRole: "Admin" | "Dealer" | "Farmer" | null;
  login: (role: AuthContextType["userRole"]) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userRole: null,
  login: async () => {},
  logout: async () => {},
});

interface Props {
  children?: ReactNode;
}

export default function TabNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<AuthContextType["userRole"]>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    restoreAuthState();
  }, []);

  async function restoreAuthState() {
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
    } finally {
      setLoading(false);
    }
  }

  async function login(role: AuthContextType["userRole"]) {
    setIsAuthenticated(true);
    setUserRole(role);
    await AsyncStorage.setItem("userRole", role ?? "");
  }

  async function logout() {
    setIsAuthenticated(false);
    setUserRole(null);
    await AsyncStorage.removeItem("userRole");
  }

  if (loading) {
    return null; // or splash screen
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
      <NavigationContainer>
        <TabLayout />
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

