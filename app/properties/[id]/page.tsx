"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useMemo, useState } from "react";
import Reveal from "../../components/Animations/Reveal";
import { useI18n } from "../../components/I18n/I18nProvider";
import { useWishlist } from "../../components/Wishlist/WishlistProvider";
import { getPropertyById, PropertyFacility } from "../../data/properties";
import { PATHS } from "@/constants/path";
import PropertyMapsPanel from "@/app/components/Maps/PropertyMapsPanel";

function FacilityIcon({ name }: { name: PropertyFacility }) {
  const common = "h-5 w-5";
  switch (name) {
    case "metro":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M7 18h10m-9 2h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M7 16V8a5 5 0 0 1 10 0v8" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M9 11h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "parking":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M7 4h6a5 5 0 0 1 0 10H7V4Z" stroke="currentColor" strokeWidth="2" />
          <path d="M7 14v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "gym":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 10v4m16-4v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M6 9v6m12-6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "pool":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 18c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M8 6c0 2 2 4 4 4s4-2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M12 10v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "security":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 3l8 4v6c0 5-3.4 8.4-8 9-4.6-.6-8-4-8-9V7l8-4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M9 12l2 2 4-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "petFriendly":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 18c3 0 5-1.6 5-4 0-2-1.8-3.2-5-3.2S7 12 7 14c0 2.4 2 4 5 4Z" stroke="currentColor" strokeWidth="2" />
          <path d="M9 10c-.8 0-1.5-.7-1.5-1.5S8.2 7 9 7s1.5.7 1.5 1.5S9.8 10 9 10Zm6 0c-.8 0-1.5-.7-1.5-1.5S14.2 7 15 7s1.5.7 1.5 1.5S15.8 10 15 10Z" fill="currentColor" />
        </svg>
      );
    case "seaView":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3 17c2 1.5 4 1.5 6 0s4-1.5 6 0 4 1.5 6 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M6 10c1.5-3 4-5 6-5s4.5 2 6 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "smartHome":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 3l9 7v11H3V10l9-7Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M9 15h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M10 12h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "park":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 2c3 3 5 5 5 8a5 5 0 0 1-10 0c0-3 2-5 5-8Z" stroke="currentColor" strokeWidth="2" />
          <path d="M12 15v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "school":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3 7l9-4 9 4-9 4-9-4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M7 10v7c0 1 2 3 5 3s5-2 5-3v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

export default function PropertyDetailsPage() {
  const { locale, priceFromUsd, t } = useI18n();
  const { has, toggle } = useWishlist();

  const params = useParams<{ id?: string | string[] }>();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const property = useMemo(() => {
    if (!id) return undefined;
    const decoded = decodeURIComponent(id);
    return getPropertyById(decoded);
  }, [id]);
  const [activeImage, setActiveImage] = useState(0);
  const [showEnquire, setShowEnquire] = useState(false);

  if (!property) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="alert alert-error">{t("property.notFound")}</div>
        <Link className="btn btn-ghost mt-4" href={PATHS.listings}>
          {t("actions.backToListings")}
        </Link>
      </main>
    );
  }

  const name = locale === "ar" ? property.name.ar : property.name.en;
  const location = locale === "ar" ? property.location.ar : property.location.en;
  const city = locale === "ar" ? property.city.ar : property.city.en;
  const description = locale === "ar" ? property.description.ar : property.description.en;

  const imageSrc = property.images[activeImage] ?? property.images[0];
  const wished = has(property.id);

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <main className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="flex items-center justify-between gap-3">
          <Link href={PATHS.listings} className="btn btn-ghost btn-sm">
            ← {t("nav.listings")}
          </Link>
          <div className="badge badge-outline">{property.country}</div>
        </div>

        <Reveal>
          <div className="mt-4 grid gap-6 md:grid-cols-12">
            <div className="md:col-span-7">
              <div className="card border border-base-200 bg-base-100 overflow-hidden">
                <figure className="relative h-64 w-full bg-base-200 md:h-96">
                  <Image
                    src={imageSrc}
                    alt={name}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-base-100/70 via-transparent to-transparent" />
                </figure>
                <div className="card-body">
                  <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{name}</h1>
                    <div className="text-sm opacity-70">
                      {location} • {city} • {property.country}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="badge badge-outline">{property.bedrooms} {t("units.bedShort")}</span>
                      <span className="badge badge-outline">{property.bathrooms} {t("units.bathShort")}</span>
                      <span className="badge badge-outline">{property.sqft} {t("units.sqft")}</span>
                      <span className="badge badge-outline">★ {property.rating.toFixed(1)} ({property.reviewCount})</span>
                    </div>

                    <p className="mt-2 opacity-85">{description}</p>

                    {property.images.length > 1 ? (
                      <div className="mt-3 flex gap-2">
                        {property.images.slice(0, 6).map((src, idx) => (
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
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-5">
              <div className="card border border-base-200 bg-base-100">
                <div className="card-body gap-4">
                  <div>
                    <div className="text-sm font-semibold opacity-70">{t("property.price")}</div>
                    <div className="text-2xl font-semibold text-primary">
                      {priceFromUsd(property.usdPricePerMonth)} {t("money.perMonthSuffix")}
                    </div>
                    <div className="text-xs opacity-70">{t("money.convertedHint")}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      className={`btn col-span-2 transition-transform active:scale-[0.98] ${
                        wished ? "btn-secondary" : "btn-primary"
                      }`}
                      onClick={() => toggle(property.id)}
                    >
                      {wished ? t("wishlist.remove") : t("wishlist.add")}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <a className="btn btn-ghost" href={`tel:${property.contactPhone}`}>
                      {t("property.call")}
                    </a>
                    <button className="btn btn-ghost" onClick={() => setShowEnquire(true)}>
                      {t("property.enquire")}
                    </button>
                  </div>

                  <div>
                    <div className="text-sm font-semibold">{t("property.facilities")}</div>
                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {property.facilities.map((f) => (
                        <div key={f} className="flex items-center gap-2 rounded-2xl border border-base-200 p-3">
                          <span className="text-primary">
                            <FacilityIcon name={f} />
                          </span>
                          <span className="text-sm">{t(`facilities.${f}`)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Reveal delayMs={90}>
                <div className="mt-4">
                  <PropertyMapsPanel
                    destination={property.coords}
                    destinationLabel={name}
                  />
                </div>
              </Reveal>

              <Reveal delayMs={120}>
                <div className="mt-4 card border border-base-200 bg-base-100">
                  <div className="card-body">
                    <div className="text-sm font-semibold">{t("property.reviews")}</div>
                    {property.reviews.length === 0 ? (
                      <div className="text-sm opacity-70 mt-2">{t("property.noReviews")}</div>
                    ) : (
                      <div className="mt-3 grid gap-3">
                        {property.reviews.map((r) => (
                          <div key={r.id} className="rounded-2xl border border-base-200 p-4">
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-semibold">{r.name}</div>
                              <div className="badge badge-outline">★ {r.rating}</div>
                            </div>
                            <div className="mt-2 text-sm opacity-80">{r.text}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </Reveal>
      </main>

      {/* Enquire modal */}
      <dialog className="modal" open={showEnquire} onClose={() => setShowEnquire(false)}>
        <div className="modal-box">
          <h3 className="font-semibold text-lg">{t("enquire.title")}</h3>
          <p className="mt-2 text-sm opacity-70">{t("enquire.subtitle")}</p>
          <div className="mt-4 grid gap-3">
            <input className="input input-bordered w-full" placeholder={t("enquire.name")} />
            <input className="input input-bordered w-full" placeholder={t("enquire.email")} />
            <textarea className="textarea textarea-bordered w-full" placeholder={t("enquire.message")} rows={4} />
          </div>
          <div className="modal-action">
            <button className="btn" onClick={() => setShowEnquire(false)}>
              {t("actions.close")}
            </button>
            <button className="btn btn-primary" onClick={() => setShowEnquire(false)}>
              {t("actions.send")}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setShowEnquire(false)}>close</button>
        </form>
      </dialog>

      {/* Buy modal */}
    </div>
  );
}
