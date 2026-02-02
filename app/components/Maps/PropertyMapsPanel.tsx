"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

import { useI18n } from "@/app/components/I18n/I18nProvider";
import {
  formatKm,
  googleMapsDirectionsUrl,
  googleMapsEmbedDirectionsUrl,
  googleMapsEmbedSearchUrl,
  googleMapsOpenAtUrl,
  googleMapsSearchNearbyUrl,
  haversineKm,
  type LatLng,
} from "@/app/lib/geo";

const DEFAULT_START: LatLng = { lat: 25.2048, lng: 55.2708 }; // Dubai fallback

function clampLatLng(raw: { lat: number; lng: number }): LatLng {
  const lat = Number.isFinite(raw.lat)
    ? Math.max(-90, Math.min(90, raw.lat))
    : 0;
  const lng = Number.isFinite(raw.lng)
    ? Math.max(-180, Math.min(180, raw.lng))
    : 0;
  return { lat, lng };
}

type Props = {
  destination: LatLng;
  destinationLabel: string;
};

type TravelMode = "driving" | "transit" | "walking";

type NearbyCategoryKey =
  | "attractions"
  | "hospitals"
  | "pharmacies"
  | "shops"
  | "supermarkets"
  | "carRentals"
  | "restaurants"
  | "cafes"
  | "parks";

const NEARBY: Array<{ key: NearbyCategoryKey; query: string }> = [
  { key: "attractions", query: "tourist attractions" },
  { key: "hospitals", query: "hospitals" },
  { key: "pharmacies", query: "pharmacy" },
  { key: "shops", query: "shops" },
  { key: "supermarkets", query: "supermarket" },
  { key: "carRentals", query: "car rental" },
  { key: "restaurants", query: "restaurants" },
  { key: "cafes", query: "cafes" },
  { key: "parks", query: "parks" },
];

export default function PropertyMapsPanel({ destination, destinationLabel }: Props) {
  const { t } = useI18n();

  const [start, setStart] = useState<LatLng>(DEFAULT_START);
  const [geoStatus, setGeoStatus] = useState<
    "idle" | "requesting" | "granted" | "denied" | "unsupported" | "error"
  >("idle");
  const [tracking, setTracking] = useState(false);
  const [accuracyM, setAccuracyM] = useState<number | null>(null);

  const [mode, setMode] = useState<TravelMode>("driving");
  const [tab, setTab] = useState<"directions" | "nearby">("directions");
  const [nearbyKey, setNearbyKey] = useState<NearbyCategoryKey>("attractions");

  const watchIdRef = useRef<number | null>(null);

  const distanceKm = useMemo(() => haversineKm(start, destination), [start, destination]);

  const embedUrl = useMemo(() => {
    if (tab === "directions") {
      return googleMapsEmbedDirectionsUrl({ origin: start, destination, travelmode: mode });
    }
    const q = NEARBY.find((c) => c.key === nearbyKey)?.query ?? "tourist attractions";
    return googleMapsEmbedSearchUrl({ near: destination, query: q });
  }, [destination, mode, nearbyKey, start, tab]);

  function useMyLocationOnce() {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoStatus("unsupported");
      return;
    }

    setGeoStatus("requesting");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next = clampLatLng({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStart(next);
        setAccuracyM(Number.isFinite(pos.coords.accuracy) ? pos.coords.accuracy : null);
        setGeoStatus("granted");
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) setGeoStatus("denied");
        else setGeoStatus("error");
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 30_000 }
    );
  }

  function startTracking() {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoStatus("unsupported");
      return;
    }
    if (watchIdRef.current != null) return;

    setGeoStatus("requesting");
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const next = clampLatLng({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStart(next);
        setAccuracyM(Number.isFinite(pos.coords.accuracy) ? pos.coords.accuracy : null);
        setGeoStatus("granted");
        setTracking(true);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) setGeoStatus("denied");
        else setGeoStatus("error");
        stopTracking();
      },
      { enableHighAccuracy: true, maximumAge: 5_000, timeout: 10_000 }
    );

    watchIdRef.current = watchId;
  }

  function stopTracking() {
    if (typeof navigator !== "undefined" && navigator.geolocation && watchIdRef.current != null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }
    watchIdRef.current = null;
    setTracking(false);
  }

  useEffect(() => {
    return () => stopTracking();
  }, []);

  return (
    <div className="card border border-base-200 bg-base-100">
      <div className="card-body gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">{t("property.map.title")}</div>
            <div className="mt-1 text-xs opacity-70">{t("property.map.subtitle")}</div>
          </div>
          <a
            className="btn btn-ghost btn-sm"
            href={googleMapsOpenAtUrl({ center: destination, zoom: 15 })}
            target="_blank"
            rel="noreferrer"
          >
            {t("planner.openMap")}
          </a>
        </div>

        <div className="rounded-2xl border border-base-200 bg-base-50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold opacity-70">{t("planner.startPoint")}</div>
              <div className="mt-1 text-xs opacity-70">
                {start.lat.toFixed(5)}, {start.lng.toFixed(5)}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="badge badge-outline">
                  {t("planner.distanceToApartment")}: {formatKm(distanceKm)}
                </span>
                {tracking ? (
                  <span className="badge badge-primary">
                    {t("planner.trackingOn")}
                    {accuracyM != null ? ` ±${Math.round(accuracyM)}m` : ""}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                className={`btn btn-sm ${geoStatus === "requesting" ? "btn-disabled" : "btn-primary"}`}
                onClick={useMyLocationOnce}
                type="button"
              >
                {geoStatus === "requesting" ? t("planner.locating") : t("planner.useMyLocation")}
              </button>
              {tracking ? (
                <button className="btn btn-sm btn-outline" type="button" onClick={stopTracking}>
                  {t("planner.stopTracking")}
                </button>
              ) : (
                <button className="btn btn-sm btn-outline" type="button" onClick={startTracking}>
                  {t("planner.startTracking")}
                </button>
              )}
            </div>
          </div>

          {geoStatus === "denied" ? (
            <div className="mt-3 rounded-xl border border-warning/30 bg-warning/10 p-3 text-sm">
              <div className="font-semibold">{t("planner.locationDeniedTitle")}</div>
              <div className="mt-1 opacity-80">{t("planner.locationDeniedBody")}</div>
            </div>
          ) : null}

          {geoStatus === "unsupported" ? (
            <div className="mt-3 rounded-xl border border-warning/30 bg-warning/10 p-3 text-sm">
              <div className="font-semibold">{t("planner.locationUnsupportedTitle")}</div>
              <div className="mt-1 opacity-80">{t("planner.locationUnsupportedBody")}</div>
            </div>
          ) : null}

          {geoStatus === "error" ? (
            <div className="mt-3 rounded-xl border border-warning/30 bg-warning/10 p-3 text-sm">
              <div className="font-semibold">{t("planner.locationErrorTitle")}</div>
              <div className="mt-1 opacity-80">{t("planner.locationErrorBody")}</div>
            </div>
          ) : null}

          <details className="mt-3">
            <summary className="cursor-pointer text-sm font-semibold opacity-80">
              {t("planner.manualEntry")}
            </summary>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <label className="form-control">
                <div className="label py-1">
                  <span className="label-text text-xs opacity-70">Lat</span>
                </div>
                <input
                  className="input input-sm input-bordered"
                  inputMode="decimal"
                  value={String(start.lat)}
                  onChange={(e) => {
                    setStart((prev) => clampLatLng({ lat: Number(e.target.value), lng: prev.lng }));
                  }}
                />
              </label>
              <label className="form-control">
                <div className="label py-1">
                  <span className="label-text text-xs opacity-70">Lng</span>
                </div>
                <input
                  className="input input-sm input-bordered"
                  inputMode="decimal"
                  value={String(start.lng)}
                  onChange={(e) => {
                    setStart((prev) => clampLatLng({ lat: prev.lat, lng: Number(e.target.value) }));
                  }}
                />
              </label>
            </div>
          </details>
        </div>

        <div className="join w-full">
          <button
            className={`btn btn-sm join-item flex-1 ${tab === "directions" ? "btn-primary" : "btn-outline"}`}
            type="button"
            onClick={() => setTab("directions")}
          >
            {t("property.map.directions")}
          </button>
          <button
            className={`btn btn-sm join-item flex-1 ${tab === "nearby" ? "btn-primary" : "btn-outline"}`}
            type="button"
            onClick={() => setTab("nearby")}
          >
            {t("property.map.nearby")}
          </button>
        </div>

        {tab === "directions" ? (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className={`btn btn-sm ${mode === "driving" ? "btn-secondary" : "btn-outline"}`}
              onClick={() => setMode("driving")}
            >
              {t("planner.modes.careem")}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${mode === "transit" ? "btn-secondary" : "btn-outline"}`}
              onClick={() => setMode("transit")}
            >
              {t("planner.modes.metro")}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${mode === "walking" ? "btn-secondary" : "btn-outline"}`}
              onClick={() => setMode("walking")}
            >
              {t("planner.walking")}
            </button>
            <a
              className="btn btn-sm btn-ghost ml-auto"
              href={googleMapsDirectionsUrl({ origin: start, destination, travelmode: mode })}
              target="_blank"
              rel="noreferrer"
              title={t("planner.openOnline")}
            >
              {t("planner.openOnline")}
            </a>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {NEARBY.map((c) => (
              <button
                key={c.key}
                type="button"
                className={`btn btn-sm ${nearbyKey === c.key ? "btn-secondary" : "btn-outline"}`}
                onClick={() => setNearbyKey(c.key)}
              >
                {t(`planner.categories.${c.key}`)}
              </button>
            ))}
            <a
              className="btn btn-sm btn-ghost ml-auto"
              href={googleMapsSearchNearbyUrl({
                near: destination,
                query: NEARBY.find((c) => c.key === nearbyKey)?.query ?? "tourist attractions",
              })}
              target="_blank"
              rel="noreferrer"
              title={t("planner.openOnline")}
            >
              {t("planner.openOnline")}
            </a>
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-base-200 bg-base-100">
          <iframe
            key={embedUrl}
            title={destinationLabel}
            src={embedUrl}
            className="h-90 w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>

        <div className="text-xs opacity-70">
          {t("property.map.note")}
        </div>
      </div>
    </div>
  );
}
