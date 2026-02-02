"use client";

import Link from "next/link";
import React, { useMemo, useState } from "react";
import { useCart } from "../components/Cart/CartProvider";
import { useI18n } from "../components/I18n/I18nProvider";
import { getPropertyById } from "../data/properties";
import { PATHS } from "@/constants/path";

export default function CartPage() {
  const { items, remove, clear } = useCart();
  const { locale, priceFromUsd, t } = useI18n();
  const [checkedOut, setCheckedOut] = useState(false);

  const lines = useMemo(() => {
    return items
      .map((it) => {
        const p = getPropertyById(it.propertyId);
        if (!p) return null;
        const name = locale === "ar" ? p.name.ar : p.name.en;
        const price = p.usdPricePerMonth * it.quantity;
        return { ...it, p, name, price };
      })
      .filter(Boolean) as Array<{ propertyId: string; quantity: number; name: string; price: number } & { p: NonNullable<ReturnType<typeof getPropertyById>> }>;
  }, [items, locale]);

  const totalUsd = useMemo(() => lines.reduce((sum, l) => sum + l.price, 0), [lines]);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">{t("cart.title")}</h1>
        <Link className="btn btn-ghost btn-sm" href={PATHS.listings}>
          ← {t("nav.listings")}
        </Link>
      </div>

      {checkedOut ? (
        <div className="alert alert-success mt-6">{t("cart.checkoutComplete")}</div>
      ) : null}

      {lines.length === 0 ? (
        <div className="mt-6">
          <div className="alert">{t("cart.empty")}</div>
          <Link className="btn btn-primary mt-4" href={PATHS.listings}>
            {t("cart.browse")}
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-12">
          <div className="md:col-span-8">
            <div className="grid gap-3">
              {lines.map((l) => (
                <div key={l.propertyId} className="card border border-base-200 bg-base-100">
                  <div className="card-body">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-lg font-semibold">{l.name}</div>
                        <div className="text-sm opacity-70">
                          {t("cart.qty")} {l.quantity}
                        </div>
                      </div>
                      <button className="btn btn-ghost btn-sm" onClick={() => remove(l.propertyId)}>
                        {t("cart.remove")}
                      </button>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-primary font-semibold">
                        {priceFromUsd(l.p.usdPricePerMonth)} {t("money.perMonthSuffix")}
                      </div>
                      <Link className="btn btn-outline btn-sm" href={PATHS.property(l.propertyId)}>
                        {t("actions.view")}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-4">
            <div className="card border border-base-200 bg-base-100">
              <div className="card-body">
                <div className="text-sm font-semibold">{t("cart.summary")}</div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="opacity-70">{t("cart.total")}</div>
                  <div className="text-primary font-semibold">{priceFromUsd(totalUsd)}</div>
                </div>

                <button
                  className="btn btn-primary mt-4"
                  onClick={() => {
                    setCheckedOut(true);
                    clear();
                  }}
                >
                  {t("cart.checkout")}
                </button>
                <button className="btn btn-ghost mt-2" onClick={clear}>
                  {t("cart.clear")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
