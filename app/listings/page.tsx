"use client";

import Image from "next/image";
import Link from "next/link";
import Reveal from "../components/Animations/Reveal";
import { useI18n } from "../components/I18n/I18nProvider";
import { useWishlist } from "../components/Wishlist/WishlistProvider";
import { PROPERTIES, Property, PropertyCountry, PropertyStatus } from "../data/properties";
import { PATHS } from "@/constants/path";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Filters = {
  q: string;
  country: "ALL" | PropertyCountry;
  status: "ALL" | PropertyStatus;
  minPrice: string;
  maxPrice: string;
};

function isDesktop() {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(min-width: 768px)").matches;
}

function clampNumber(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function matchesFilters(p: Property, filters: Filters) {
  const q = filters.q.trim().toLowerCase();
  const matchesQ =
    !q ||
    p.name.en.toLowerCase().includes(q) ||
    p.location.en.toLowerCase().includes(q) ||
    p.city.en.toLowerCase().includes(q) ||
    p.name.ar.includes(q) ||
    p.location.ar.includes(q) ||
    p.city.ar.includes(q);

  const matchesCountry = filters.country === "ALL" ? true : p.country === filters.country;
  const matchesStatus = filters.status === "ALL" ? true : p.status === filters.status;

  const min = filters.minPrice ? Number(filters.minPrice) : null;
  const max = filters.maxPrice ? Number(filters.maxPrice) : null;
  const matchesMin = min == null || !Number.isFinite(min) ? true : p.usdPricePerMonth >= min;
  const matchesMax = max == null || !Number.isFinite(max) ? true : p.usdPricePerMonth <= max;

  return matchesQ && matchesCountry && matchesStatus && matchesMin && matchesMax;
}

function FacilityPill({ f }: { f: string }) {
  return <span className="badge badge-outline badge-sm">{f}</span>;
}

function FiltersPanel({
  filters,
  updateFilters,
  t,
}: {
  filters: Filters;
  updateFilters: (patch: Partial<Filters> | ((prev: Filters) => Filters)) => void;
  t: (path: string) => string;
}) {
  return (
    <div className="card border border-base-200 bg-base-100">
      <div className="card-body gap-4">
        <div>
          <div className="text-sm font-semibold">{t("filters.name")}</div>
          <input
            className="input input-bordered mt-2 w-full"
            placeholder={t("filters.searchPlaceholder")}
            value={filters.q}
            onChange={(e) => updateFilters({ q: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-sm font-semibold">{t("filters.minPrice")}</div>
            <input
              className="input input-bordered mt-2 w-full"
              inputMode="numeric"
              value={filters.minPrice}
              onChange={(e) => updateFilters({ minPrice: e.target.value })}
              placeholder="0"
            />
          </div>
          <div>
            <div className="text-sm font-semibold">{t("filters.maxPrice")}</div>
            <input
              className="input input-bordered mt-2 w-full"
              inputMode="numeric"
              value={filters.maxPrice}
              onChange={(e) => updateFilters({ maxPrice: e.target.value })}
              placeholder="15000"
            />
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold">{t("filters.country")}</div>
          <select
            className="select select-bordered mt-2 w-full"
            value={filters.country}
            onChange={(e) => updateFilters({ country: e.target.value as Filters["country"] })}
          >
            <option value="ALL">{t("filters.all")}</option>
            <option value="UAE">{t("filters.uae")}</option>
            <option value="US">{t("filters.us")}</option>
          </select>
        </div>

        <div>
          <div className="text-sm font-semibold">{t("filters.projectType")}</div>
          <select
            className="select select-bordered mt-2 w-full"
            value={filters.status}
            onChange={(e) => updateFilters({ status: e.target.value as Filters["status"] })}
          >
            <option value="ALL">{t("filters.all")}</option>
            <option value="available">{t("listing.status.available")}</option>
            <option value="future">{t("listing.status.future")}</option>
          </select>
        </div>

        <button
          className="btn btn-ghost btn-sm"
          onClick={() => updateFilters({ q: "", country: "ALL", status: "ALL", minPrice: "", maxPrice: "" })}
        >
          {t("filters.clear")}
        </button>
      </div>
    </div>
  );
}

function PropertyCard({ p }: { p: Property }) {
  const { locale, priceFromUsd, t } = useI18n();
  const { has, toggle } = useWishlist();
  const [activeImage, setActiveImage] = useState(0);

  const name = locale === "ar" ? p.name.ar : p.name.en;
  const location = locale === "ar" ? p.location.ar : p.location.en;
  const city = locale === "ar" ? p.city.ar : p.city.en;

  const imageSrc = p.images[activeImage] ?? p.images[0];
  const wished = has(p.id);

  return (
    <Reveal>
      <div className="card border border-base-200 bg-base-100 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
        <figure className="relative h-44 w-full bg-base-200">
          {imageSrc ? (
            <>
              <Image
                src={imageSrc}
                alt={name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-base-100/70 via-transparent to-transparent" />
            </>
          ) : null}
        </figure>

        <div className="card-body gap-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-lg font-semibold leading-tight">{name}</div>
              <div className="text-sm opacity-70">
                {location} • {city} • {p.country}
              </div>
            </div>
            <span className={`badge ${p.status === "future" ? "badge-ghost" : "badge-primary"}`}>
              {p.status === "future" ? t("listing.status.future") : t("listing.status.available")}
            </span>
          </div>

          {p.images.length > 1 ? (
            <div className="flex gap-2">
              {p.images.slice(0, 4).map((src, idx) => (
                <button
                  key={src + idx}
                  type="button"
                  className={`relative h-10 w-14 overflow-hidden rounded-xl border transition-all duration-200 hover:-translate-y-0.5 ${
                    idx === activeImage ? "border-primary" : "border-base-200"
                  } bg-base-200`}
                  onClick={() => setActiveImage(idx)}
                  aria-label={`${t("listing.thumbnail")} ${idx + 1}`}
                >
                  <Image src={src} alt={name} fill className="object-contain p-2" sizes="56px" />
                </button>
              ))}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <span className="badge badge-outline">{p.bedrooms} {t("units.bedShort")}</span>
            <span className="badge badge-outline">{p.bathrooms} {t("units.bathShort")}</span>
            <span className="badge badge-outline">{p.sqft} {t("units.sqft")}</span>
            <span className="badge badge-outline">★ {p.rating.toFixed(1)}</span>
          </div>

          <div className="flex flex-wrap gap-1">
            {p.facilities.slice(0, 4).map((f) => (
              <FacilityPill key={f} f={f} />
            ))}
          </div>

          <div className="mt-1 flex items-center justify-between">
            <div className="text-primary font-semibold">
              {priceFromUsd(p.usdPricePerMonth)} {t("money.perMonthSuffix")}
            </div>
            <div className="flex gap-2">
              <button
                className={`btn btn-sm transition-transform active:scale-[0.98] ${wished ? "btn-secondary" : "btn-outline"}`}
                onClick={() => toggle(p.id)}
              >
                {wished ? t("wishlist.remove") : t("wishlist.add")}
              </button>
              <Link className="btn btn-primary btn-sm" href={PATHS.property(p.id)}>
                {t("actions.view")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export default function ListingsPage() {
  const { t } = useI18n();

  const [filters, setFilters] = useState<Filters>({
    q: "",
    country: "ALL",
    status: "ALL",
    minPrice: "",
    maxPrice: "",
  });

  const [page, setPage] = useState(1);
  const [mobileCount, setMobileCount] = useState(6);

  const updateFilters = useCallback((patch: Partial<Filters> | ((prev: Filters) => Filters)) => {
    setFilters((prev) => {
      const next = typeof patch === "function" ? patch(prev) : { ...prev, ...patch };
      return next;
    });
    // Reset pagination whenever filters are changed by user interaction
    setPage(1);
    setMobileCount(6);
  }, []);

  const [desktopMode, setDesktopMode] = useState(() => (typeof window === "undefined" ? true : isDesktop()));
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const handler = () => setDesktopMode(mql.matches);
    mql.addEventListener?.("change", handler);
    return () => mql.removeEventListener?.("change", handler);
  }, []);

  const filtered = useMemo(() => {
    return PROPERTIES.filter((p) => matchesFilters(p, filters));
  }, [filters]);

  // Desktop pagination
  const pageSize = 6;

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const desktopItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  // Mobile infinite scroll

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (desktopMode) return;
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setMobileCount((c) => clampNumber(c + 3, 0, filtered.length));
      },
      { threshold: 0.1 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [desktopMode, filtered.length]);

  const items = desktopMode ? desktopItems : filtered.slice(0, mobileCount);

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <main className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">{t("listings.title")}</h1>
            <p className="mt-2 opacity-80">{t("listings.subtitle")}</p>
          </div>
          <Link href={PATHS.home} className="btn btn-ghost btn-sm self-start md:self-auto">
            ← {t("actions.back")}
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-12">
          <div className="md:col-span-4 lg:col-span-3">
            {/* Desktop filters */}
            <div className="hidden md:block">
              <FiltersPanel filters={filters} updateFilters={updateFilters} t={t} />
            </div>

            {/* Mobile filters accordion */}
            <details className="collapse collapse-arrow border border-base-200 bg-base-100 md:hidden">
              <summary className="collapse-title text-sm font-semibold">{t("filters.title")}</summary>
              <div className="collapse-content">
                <FiltersPanel filters={filters} updateFilters={updateFilters} t={t} />
              </div>
            </details>
          </div>

          <div className="md:col-span-8 lg:col-span-9">
            <div className="flex items-center justify-between">
              <div className="text-sm opacity-70">
                {filtered.length} {t("listings.results")}
              </div>
              {desktopMode ? (
                <div className="join">
                  <button
                    className="btn btn-sm join-item"
                    onClick={() => setPage((p) => clampNumber(p - 1, 1, totalPages))}
                    disabled={page <= 1}
                  >
                    {t("pagination.prev")}
                  </button>
                  <button className="btn btn-sm join-item btn-ghost" disabled>
                    {page} / {totalPages}
                  </button>
                  <button
                    className="btn btn-sm join-item"
                    onClick={() => setPage((p) => clampNumber(p + 1, 1, totalPages))}
                    disabled={page >= totalPages}
                  >
                    {t("pagination.next")}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="loading loading-spinner loading-sm opacity-70" aria-hidden="true" />
                </div>
              )}
            </div>

            <div className="mt-4 grid gap-4">
              {items.map((p) => (
                <PropertyCard key={p.id} p={p} />
              ))}
            </div>

            {!desktopMode ? (
              <div ref={sentinelRef} className="h-10" />
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
