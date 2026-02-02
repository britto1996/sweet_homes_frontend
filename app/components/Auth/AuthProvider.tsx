"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { UserRole } from "../UI/RoleSwitch";

export type AuthUser = {
  email: string;
  role: UserRole;
};

type LoginInput = {
  email: string;
  password: string;
  role: UserRole;
};

type AuthContextValue = {
  user: AuthUser | null;
  login: (input: LoginInput) => Promise<AuthUser>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "sweethomes_auth_v1";

const MOCK_USERS: Array<{ email: string; password: string; role: UserRole }> = [
  { email: "buyer@sweethomes.test", password: "SweetHomes@123", role: "buyer" },
  { email: "seller@sweethomes.test", password: "SweetHomes@123", role: "seller" },
];

function safeParseUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AuthUser>;
    if (typeof parsed.email !== "string") return null;
    if (parsed.role !== "buyer" && parsed.role !== "seller") return null;
    return { email: parsed.email, role: parsed.role };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => safeParseUser());

  useEffect(() => {
    try {
      if (!user) {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      }
    } catch {
      // ignore
    }
  }, [user]);

  const login = useCallback(async ({ email, password, role }: LoginInput) => {
    // Simulate API latency
    await new Promise((r) => setTimeout(r, 900));

    const normalizedEmail = email.trim().toLowerCase();
    const match = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === normalizedEmail && u.password === password && u.role === role
    );

    if (!match) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const nextUser: AuthUser = { email: match.email, role: match.role };
    setUser(nextUser);
    return nextUser;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const value = useMemo<AuthContextValue>(() => ({ user, login, logout }), [login, logout, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
