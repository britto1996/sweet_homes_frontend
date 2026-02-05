"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import Card from "@/app/components/UI/Card";
import Reveal from "@/app/components/Animations/Reveal";
import { useAuth } from "@/app/components/Auth/AuthProvider";
import { useI18n } from "@/app/components/I18n/I18nProvider";
import { PATHS } from "@/constants/path";
import { useSellerProperties } from "@/app/components/Seller/SellerPropertiesProvider";
import PropertyCreateForm from "@/app/components/Seller/PropertyCreateForm";

function isDesktop() {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(min-width: 768px)").matches;
}

function clampNumber(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

type ListFilters = {
  q: string;
};

function matchesQ(name: string, description: string, q: string) {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  return name.toLowerCase().includes(needle) || description.toLowerCase().includes(needle);
}

export default function SellerPropertiesPage() {
  const { t, priceFromUsd } = useI18n();
  const { user } = useAuth();
  const router = useRouter();
  const { mine, remove, clearMine } = useSellerProperties();

  const [filters, setFilters] = useState<ListFilters>({ q: "" });

  const [page, setPage] = useState(1);
  const [mobileCount, setMobileCount] = useState(6);

  const [desktopMode, setDesktopMode] = useState(() => (typeof window === "undefined" ? true : isDesktop()));

  useEffect(() => {
    const currentUser = user;
    if (!currentUser) {
      router.replace(PATHS.login);
      return;
    }
    if (currentUser.role !== "seller") {
      // Buyers should not access seller tooling.
      router.replace(PATHS.home);
    }
  }, [router, user]);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const handler = () => setDesktopMode(mql.matches);
    mql.addEventListener?.("change", handler);
    return () => mql.removeEventListener?.("change", handler);
  }, []);

  const filtered = useMemo(() => {
    return mine.filter((p) => matchesQ(p.name, p.description, filters.q));
  }, [filters.q, mine]);

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

  if (!user) return null;
  if (user.role !== "seller") {
    return (
      <main className="min-h-[calc(100vh-64px)] grid place-items-center px-4 py-10">
        <Card title={t("seller.errors.notSeller")}>
          <button className="btn btn-primary" onClick={() => router.push(PATHS.home)}>
            {t("actions.back")}
          </button>
        </Card>
      </main>
    );
  }

  const inputBase =
    "input input-bordered w-full bg-base-100 border-2 border-primary/60 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none";
  const CreateForm = <PropertyCreateForm onCreated={() => {
    setPage(1);
    setMobileCount(6);
  }} />;

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <main className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">{t("seller.title")}</h1>
            <p className="mt-2 opacity-80">{t("seller.subtitle")}</p>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-ghost btn-sm" onClick={() => router.push(PATHS.home)}>
              ← {t("actions.back")}
            </button>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => {
                clearMine();
                setPage(1);
                setMobileCount(6);
              }}
              disabled={mine.length === 0}
            >
              {t("seller.actions.clearAll")}
            </button>
          </div>
        </div>

        {desktopMode ? (
          <div className="mt-6 grid gap-4 md:grid-cols-12">
            {/* Desktop: Create form */}
            <div className="md:col-span-5 lg:col-span-4">
              <Reveal>{CreateForm}</Reveal>
            </div>

            {/* Desktop: List */}
            <div className="md:col-span-7 lg:col-span-8">
            {mine.length > 0 ? (
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="text-lg font-semibold">{t("seller.listTitle")}</div>
                  <div className="text-sm opacity-70">{filtered.length} {t("listings.results")}</div>
                </div>

                <div className="flex w-full gap-2 md:max-w-md">
                  <input
                    className={inputBase}
                    value={filters.q}
                    onChange={(e) => {
                      setFilters({ q: e.target.value });
                      setPage(1);
                      setMobileCount(6);
                    }}
                    placeholder={t("seller.searchPlaceholder")}
                  />
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
                  ) : null}
                </div>
              </div>
            ) : (
              <div className="text-lg font-semibold">{t("seller.listTitle")}</div>
            )}

            <div className="mt-4 grid gap-4">
              {items.length === 0 ? (
                <Card>
                  <div className="text-sm opacity-80">{t("seller.empty")}</div>
                </Card>
              ) : (
                items.map((p) => (
                  <Reveal key={p.id}>
                    <div className="card border border-base-200 bg-base-100 shadow-sm">
                      <div className="card-body gap-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className="relative h-16 w-20 overflow-hidden rounded-xl border border-base-200 bg-base-200">
                              <Image
                                src={p.images[0] ?? "/apartments/apartment-1.svg"}
                                alt={p.name}
                                fill
                                className="object-cover"
                                sizes="80px"
                              />
                            </div>
                            <div>
                              <div className="text-lg font-semibold leading-tight">{p.name}</div>
                              <div className="text-sm opacity-70 line-clamp-2">{p.description}</div>
                              <div className="mt-2 flex flex-wrap gap-1">
                                {p.facilities.slice(0, 6).map((f) => (
                                  <span key={f} className="badge badge-outline badge-sm">{t(`facilities.${f}`)}</span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            <div className="text-primary font-semibold">{priceFromUsd(p.priceUsd, { maximumFractionDigits: 0 })}</div>
                            <button className="btn btn-outline btn-sm" onClick={() => remove(p.id)}>
                              {t("seller.actions.remove")}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))
              )}
            </div>

            {!desktopMode ? (
              <>
                <div ref={sentinelRef} className="h-10" />
                <div className="mt-2 flex items-center gap-2 text-sm opacity-70">
                  <span className="loading loading-spinner loading-sm" aria-hidden="true" />
                  <span>{t("listings.autoLoading")}</span>
                </div>
              </>
            ) : null}
            </div>
          </div>
        ) : (
          <div className="mt-6">
            <div className="flex items-center justify-between gap-2">
              <div className="text-lg font-semibold">{t("seller.listTitle")}</div>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => router.push(PATHS.sellerPropertyCreate)}
              >
                {t("seller.createTitle")}
              </button>
            </div>

            <div className="mt-3">
              {mine.length > 0 ? (
                <input
                  className={inputBase}
                  value={filters.q}
                  onChange={(e) => {
                    setFilters({ q: e.target.value });
                    setPage(1);
                    setMobileCount(6);
                  }}
                  placeholder={t("seller.searchPlaceholder")}
                />
              ) : null}
            </div>

            <div className="mt-4 grid gap-4">
              {items.length === 0 ? (
                <Card>
                  <div className="text-sm opacity-80">{t("seller.empty")}</div>
                </Card>
              ) : (
                items.map((p) => (
                  <Reveal key={p.id}>
                    <div className="card border border-base-200 bg-base-100 shadow-sm">
                      <div className="card-body gap-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className="relative h-16 w-20 overflow-hidden rounded-xl border border-base-200 bg-base-200">
                              <Image
                                src={p.images[0] ?? "/apartments/apartment-1.svg"}
                                alt={p.name}
                                fill
                                className="object-cover"
                                sizes="80px"
                              />
                            </div>
                            <div>
                              <div className="text-lg font-semibold leading-tight">{p.name}</div>
                              <div className="text-sm opacity-70 line-clamp-2">{p.description}</div>
                              <div className="mt-2 flex flex-wrap gap-1">
                                {p.facilities.slice(0, 6).map((f) => (
                                  <span key={f} className="badge badge-outline badge-sm">
                                    {t(`facilities.${f}`)}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            <div className="text-primary font-semibold">
                              {priceFromUsd(p.priceUsd, { maximumFractionDigits: 0 })}
                            </div>
                            <button className="btn btn-outline btn-sm" onClick={() => remove(p.id)}>
                              {t("seller.actions.remove")}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))
              )}
            </div>

            <div ref={sentinelRef} className="h-10" />
            <div className="mt-2 flex items-center gap-2 text-sm opacity-70">
              <span className="loading loading-spinner loading-sm" aria-hidden="true" />
              <span>{t("listings.autoLoading")}</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
