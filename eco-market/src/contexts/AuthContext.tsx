"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { User, RegisterFormData, LoginFormData } from "@/types";
import { apiClient } from "@/lib/axios";
import useMounted from "@/hooks/useMounted";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginFormData) => Promise<boolean>;
  logout: () => void;
  register: (userData: RegisterFormData) => Promise<boolean>;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mounted = useMounted();

  useEffect(() => {
    if (mounted) {
      // checkAuth();
    }
  }, [mounted]);

  const checkAuth = async () => {
    try {
      // Skip auth check if on login/register pages to prevent loops
      if (typeof window !== "undefined") {
        const pathname = window.location.pathname;
        if (pathname.includes('/login') || pathname.includes('/register')) {
          setIsLoading(false);
          return;
        }
      }

      // Try to verify token with backend
      const response = await apiClient.get("/accounts/auth");
      if (response.data.status === "success" && response.data.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      // Clear any stored user data
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginFormData): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await apiClient.post("/account/login", credentials);

      if (response.data.status === "success" && response.data.user) {
        setUser(response.data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterFormData): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await apiClient.post("/accounts/register", userData);

      if (response.data.status === "success" && response.data.user) {
        setUser(response.data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.post("/accounts/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      if (!user) return false;

      setIsLoading(true);
      const response = await apiClient.put("/account/update", userData);

      if (response.data.status === "success" && response.data.account) {
        setUser(response.data.account);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Profile update failed:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading: isLoading || !mounted,
    login,
    logout,
    register,
    updateProfile,
  };

  // Show loading state during hydration
  if (!mounted) {
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
