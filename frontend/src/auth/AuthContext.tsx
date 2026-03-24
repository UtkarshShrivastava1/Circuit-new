

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import * as jwt_decode from "jwt-decode";

type AuthState = {
  token: string | null;
  slug: string | null;
  role: string | null;
  userId: string | null;
};

type DecodedToken = {
  userId: string;
  organization: string;
  role: string;
  iat: number;
  exp: number;
};

type AuthContextType = {
  auth: AuthState;
  login: (data: { token: string; slug: string }) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>({
    token: null,
    slug: null,
    role: null,
    userId: null,
  });

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("auth");
    if (stored) {
      const parsed = JSON.parse(stored);
      setAuth(parsed);
    }
  }, []);

  const login = (data: { token: string; slug: string }) => {
    let role: string | null = null;
    let userId: string | null = null;

    try {
      // ✅ Decode JWT safely
  const payload = (jwt_decode as any)(data.token) as DecodedToken;
 
      role = payload.role ? payload.role.toLowerCase() : null; // fallback if undefined
      userId = payload.userId ?? null;
      
    } catch (e) {
      console.warn("Failed to decode token:", e);
    }

    const newAuth: AuthState = {
      token: data.token,
      slug: data.slug,
      role,
      userId,
    };

    setAuth(newAuth);
    localStorage.setItem("auth", JSON.stringify(newAuth));
  };

  const logout = () => {
    setAuth({
      token: null,
      slug: null,
      role: null,
      userId: null,
    });
    localStorage.removeItem("auth");
  };

  return <AuthContext.Provider value={{ auth, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};