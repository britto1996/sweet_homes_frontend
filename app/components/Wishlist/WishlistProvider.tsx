"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type WishlistContextValue = {
  ids: string[];
  count: number;
  has: (propertyId: string) => boolean;
  add: (propertyId: string) => void;
  remove: (propertyId: string) => void;
  toggle: (propertyId: string) => void;
  clear: () => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

const STORAGE_KEY = "sweethomes_wishlist_v1";

function safeParseWishlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((v) => typeof v === "string");
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const initial = useMemo(() => safeParseWishlist(), []);
  const [ids, setIds] = useState<string[]>(initial);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      // ignore
    }
  }, [ids]);

  const add = useCallback((propertyId: string) => {
    setIds((prev) => (prev.includes(propertyId) ? prev : [propertyId, ...prev]));
  }, []);

  const remove = useCallback((propertyId: string) => {
    setIds((prev) => prev.filter((id) => id !== propertyId));
  }, []);

  const toggle = useCallback(
    (propertyId: string) => {
      setIds((prev) => (prev.includes(propertyId) ? prev.filter((id) => id !== propertyId) : [propertyId, ...prev]));
    },
    []
  );

  const clear = useCallback(() => setIds([]), []);

  const has = useCallback((propertyId: string) => ids.includes(propertyId), [ids]);

  const value = useMemo<WishlistContextValue>(
    () => ({ ids, count: ids.length, has, add, remove, toggle, clear }),
    [clear, has, ids, remove, toggle, add]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
}
