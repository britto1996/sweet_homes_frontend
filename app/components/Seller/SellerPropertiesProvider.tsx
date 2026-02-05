"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { PropertyFacility } from "@/app/data/properties";
import { useAuth } from "@/app/components/Auth/AuthProvider";

export type SellerProperty = {
  id: string;
  ownerEmail: string;
  name: string;
  description: string;
  priceUsd: number;
  facilities: PropertyFacility[];
  images: string[];
  createdAt: number;
};

type CreateSellerPropertyInput = {
  name: string;
  description: string;
  priceUsd: number;
  facilities: PropertyFacility[];
  images: string[];
};

type SellerPropertiesContextValue = {
  all: SellerProperty[];
  mine: SellerProperty[];
  create: (input: CreateSellerPropertyInput) => SellerProperty;
  remove: (id: string) => void;
  clearMine: () => void;
};

const SellerPropertiesContext = createContext<SellerPropertiesContextValue | null>(null);

const STORAGE_KEY = "sweethomes_seller_properties_v1";

function safeParse(): SellerProperty[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((v) => v && typeof v === "object")
      .map((v) => v as Partial<SellerProperty>)
      .filter(
        (p): p is SellerProperty =>
          typeof p.id === "string" &&
          typeof p.ownerEmail === "string" &&
          typeof p.name === "string" &&
          typeof p.description === "string" &&
          typeof p.priceUsd === "number" &&
          Array.isArray(p.facilities) &&
          Array.isArray(p.images) &&
          typeof p.createdAt === "number"
      );
  } catch {
    return [];
  }
}

function safeId(prefix: string) {
  try {
    const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : null;
    if (id) return `${prefix}-${id}`;
  } catch {
    // ignore
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function SellerPropertiesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  // Don't read localStorage during the initial render; it can cause hydration mismatches.
  const [all, setAll] = useState<SellerProperty[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const load = () => {
      setAll(safeParse());
      setHydrated(true);
    };

    // Defer state update to avoid synchronous setState in effect.
    if (typeof queueMicrotask === "function") {
      queueMicrotask(load);
    } else {
      void Promise.resolve().then(load);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch {
      // ignore
    }
  }, [all, hydrated]);

  const mine = useMemo(() => {
    if (!user) return [];
    return all
      .filter((p) => p.ownerEmail.toLowerCase() === user.email.toLowerCase())
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [all, user]);

  const create = useCallback(
    (input: CreateSellerPropertyInput) => {
      if (!user) throw new Error("NOT_AUTHENTICATED");
      if (user.role !== "seller") throw new Error("NOT_SELLER");

      const next: SellerProperty = {
        id: safeId("seller-prop"),
        ownerEmail: user.email,
        name: input.name.trim(),
        description: input.description.trim(),
        priceUsd: input.priceUsd,
        facilities: input.facilities,
        images: input.images,
        createdAt: Date.now(),
      };

      setAll((prev) => [next, ...prev]);
      return next;
    },
    [user]
  );

  const remove = useCallback(
    (id: string) => {
      setAll((prev) => {
        if (!user) return prev;
        if (user.role !== "seller") return prev;
        return prev.filter((p) => !(p.id === id && p.ownerEmail.toLowerCase() === user.email.toLowerCase()));
      });
    },
    [user]
  );

  const clearMine = useCallback(() => {
    setAll((prev) => {
      if (!user) return prev;
      if (user.role !== "seller") return prev;
      return prev.filter((p) => p.ownerEmail.toLowerCase() !== user.email.toLowerCase());
    });
  }, [user]);

  const value = useMemo<SellerPropertiesContextValue>(() => ({ all, mine, create, remove, clearMine }), [all, mine, create, remove, clearMine]);

  return <SellerPropertiesContext.Provider value={value}>{children}</SellerPropertiesContext.Provider>;
}

export function useSellerProperties() {
  const ctx = useContext(SellerPropertiesContext);
  if (!ctx) throw new Error("useSellerProperties must be used inside SellerPropertiesProvider");
  return ctx;
}
