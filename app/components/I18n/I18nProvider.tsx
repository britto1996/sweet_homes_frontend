"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import en from "../../i18n/en.json";
import ar from "../../i18n/ar.json";

export type Locale = "en" | "ar";
export type Currency = "USD" | "AED";

type Translations = typeof en;

type I18nContextValue = {
  locale: Locale;
  currency: Currency;
  setLocale: (locale: Locale) => void;
  setCurrency: (currency: Currency) => void;
  t: (path: string) => string;
  money: (amount: number, options?: { maximumFractionDigits?: number }) => string;
  priceFromUsd: (usdAmount: number, options?: { maximumFractionDigits?: number }) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function getPath(obj: unknown, path: string): unknown {
  const parts = path.split(".").filter(Boolean);
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return undefined;
    const record = current as Record<string, unknown>;
    if (!(part in record)) return undefined;
    current = record[part];
  }
  return current;
}

function safeLocaleIntl(locale: Locale): string {
  return locale === "ar" ? "ar-AE" : "en-US";
}

function defaultCurrencyForLocale(locale: Locale): Currency {
  return locale === "ar" ? "AED" : "USD";
}

const STORAGE_KEY = "sweethomes_i18n_v1";
const USD_TO_AED = 3.67;

function safeParseSettings(): { locale: Locale; currency: Currency } {
  if (typeof window === "undefined") return { locale: "en", currency: "USD" };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { locale: "en", currency: "USD" };
    const parsed = JSON.parse(raw) as { locale?: Locale; currency?: Currency };
    const locale: Locale = parsed.locale === "ar" ? "ar" : "en";
    const currency: Currency = parsed.currency === "AED" ? "AED" : "USD";
    return { locale, currency };
  } catch {
    return { locale: "en", currency: "USD" };
  }
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const initial = useMemo(() => safeParseSettings(), []);
  const [locale, setLocaleState] = useState<Locale>(initial.locale);
  const [currency, setCurrencyState] = useState<Currency>(initial.currency);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ locale, currency }));
    } catch {
      // ignore
    }
  }, [locale, currency]);

  useEffect(() => {
    const doc = document.documentElement;
    doc.setAttribute("lang", locale);
    doc.setAttribute("dir", locale === "ar" ? "rtl" : "ltr");
  }, [locale]);

  const translations: Translations = useMemo(() => {
    return locale === "ar" ? (ar as Translations) : (en as Translations);
  }, [locale]);

  const setLocale = useCallback(
    (nextLocale: Locale) => {
      setLocaleState(nextLocale);
      setCurrencyState((prev) => {
        // Keep user choice, but if previous was the auto default for the old locale,
        // switch to the new locale default.
        const prevWasDefault = prev === defaultCurrencyForLocale(locale);
        return prevWasDefault ? defaultCurrencyForLocale(nextLocale) : prev;
      });
    },
    [locale]
  );

  const setCurrency = useCallback((next: Currency) => setCurrencyState(next), []);

  const t = useCallback(
    (path: string) => {
      const value = getPath(translations, path);
      if (typeof value === "string") return value;
      return path;
    },
    [translations]
  );

  const money = useCallback(
    (amount: number, options?: { maximumFractionDigits?: number }) => {
      const formatter = new Intl.NumberFormat(safeLocaleIntl(locale), {
        style: "currency",
        currency,
        maximumFractionDigits: options?.maximumFractionDigits ?? 0,
      });
      return formatter.format(amount);
    },
    [currency, locale]
  );

  const priceFromUsd = useCallback(
    (usdAmount: number, options?: { maximumFractionDigits?: number }) => {
      const amount = currency === "AED" ? usdAmount * USD_TO_AED : usdAmount;
      return money(amount, {
        maximumFractionDigits:
          options?.maximumFractionDigits ?? (currency === "AED" ? 0 : 0),
      });
    },
    [currency, money]
  );

  const value: I18nContextValue = useMemo(
    () => ({ locale, currency, setLocale, setCurrency, t, money, priceFromUsd }),
    [currency, locale, money, priceFromUsd, setCurrency, setLocale, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
