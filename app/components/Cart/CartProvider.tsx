"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  propertyId: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  add: (propertyId: string, quantity?: number) => void;
  remove: (propertyId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "sweethomes_cart_v1";

function safeParseCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((x) => {
        if (!x || typeof x !== "object") return null;
        const record = x as Record<string, unknown>;
        const propertyId = typeof record.propertyId === "string" ? record.propertyId : null;
        const quantity = typeof record.quantity === "number" ? record.quantity : 1;
        if (!propertyId) return null;
        return { propertyId, quantity: Math.max(1, Math.floor(quantity)) } as CartItem;
      })
      .filter(Boolean) as CartItem[];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => safeParseCart());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const add = useCallback((propertyId: string, quantity = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((x) => x.propertyId === propertyId);
      if (idx === -1) return [...prev, { propertyId, quantity: Math.max(1, quantity) }];
      const next = [...prev];
      next[idx] = { ...next[idx], quantity: next[idx].quantity + Math.max(1, quantity) };
      return next;
    });
  }, []);

  const remove = useCallback((propertyId: string) => {
    setItems((prev) => prev.filter((x) => x.propertyId !== propertyId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = useMemo(() => items.reduce((sum, x) => sum + x.quantity, 0), [items]);

  const value = useMemo<CartContextValue>(() => ({ items, count, add, remove, clear }), [add, clear, count, items, remove]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
