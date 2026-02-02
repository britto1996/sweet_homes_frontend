"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useMemo } from "react";
import { PATHS } from "@/constants/path";
import { useI18n } from "../components/I18n/I18nProvider";
import { useWishlist } from "../components/Wishlist/WishlistProvider";
import { getPropertyById } from "../data/properties";

export default function WishlistPage() {
  const { locale, priceFromUsd, t } = useI18n();
  const { ids, remove, clear } = useWishlist();

  const properties = useMemo(() => {
    return ids
      .map((id) => getPropertyById(id))
      .filter(Boolean);
  }, [ids]);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">{t("wishlist.title")}</h1>
        <Link className="btn btn-ghost btn-sm" href={PATHS.listings}>
          ← {t("nav.listings")}
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="mt-6">
          <div className="alert">{t("wishlist.empty")}</div>
          <Link className="btn btn-primary mt-4" href={PATHS.listings}>
            {t("actions.browseAll")}
          </Link>
        </div>
      ) : (
        <div className="mt-6">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm opacity-70">{properties.length} {t("listings.results")}</div>
            <button className="btn btn-ghost btn-sm" onClick={clear}>
              {t("wishlist.clear")}
            </button>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {properties.map((p) => {
              const name = locale === "ar" ? p!.name.ar : p!.name.en;
              const location = locale === "ar" ? p!.location.ar : p!.location.en;
              const city = locale === "ar" ? p!.city.ar : p!.city.en;
              const imageSrc = p!.images[0];
              return (
                <div key={p!.id} className="card border border-base-200 bg-base-100">
                  <figure className="relative h-44 w-full bg-base-200">
                    {imageSrc ? (
                      <Image src={imageSrc} alt={name} fill className="object-contain p-6" sizes="(max-width: 768px) 100vw, 50vw" />
                    ) : null}
                  </figure>
                  <div className="card-body">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-lg font-semibold leading-tight">{name}</div>
                        <div className="text-sm opacity-70">{location} • {city} • {p!.country}</div>
                      </div>
                      <button className="btn btn-ghost btn-sm" onClick={() => remove(p!.id)}>
                        {t("wishlist.remove")}
                      </button>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-primary font-semibold">{priceFromUsd(p!.usdPricePerMonth)} {t("money.perMonthSuffix")}</div>
                      <Link className="btn btn-primary btn-sm" href={PATHS.property(p!.id)}>
                        {t("actions.view")}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}
