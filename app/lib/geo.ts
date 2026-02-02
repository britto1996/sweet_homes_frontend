export type LatLng = { lat: number; lng: number };

export type TravelMode = "careem" | "metro";

export function haversineKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const dLat = degToRad(b.lat - a.lat);
  const dLng = degToRad(b.lng - a.lng);
  const lat1 = degToRad(a.lat);
  const lat2 = degToRad(b.lat);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);

  const h =
    sinDLat * sinDLat +
    Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;

  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return R * c;
}

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function estimateTravelMinutes(
  km: number,
  mode: TravelMode,
  options?: { timeOfDay?: "peak" | "offpeak" }
): number {
  const timeOfDay = options?.timeOfDay ?? "offpeak";

  if (mode === "careem") {
    // Simple approximation: average in-city speed + pickup/parking overhead.
    const baseSpeedKmh = timeOfDay === "peak" ? 24 : 34;
    const overheadMin = timeOfDay === "peak" ? 7 : 5;
    const minutes = (km / baseSpeedKmh) * 60 + overheadMin;
    return clampMinutes(minutes);
  }

  // Metro/transit: higher line speed but extra walking/waiting.
  // If very short, transit is often not efficient.
  const lineSpeedKmh = 42;
  const accessOverheadMin = km < 2 ? 14 : 12;
  const minutes = (km / lineSpeedKmh) * 60 + accessOverheadMin;
  return clampMinutes(minutes);
}

function clampMinutes(minutes: number): number {
  if (!Number.isFinite(minutes)) return 0;
  return Math.max(1, Math.round(minutes));
}

export function formatKm(km: number): string {
  if (!Number.isFinite(km)) return "0 km";
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
}

export function googleMapsDirectionsUrl(args: {
  origin: LatLng;
  destination: LatLng;
  travelmode: "driving" | "transit" | "walking";
}): string {
  const origin = `${args.origin.lat},${args.origin.lng}`;
  const destination = `${args.destination.lat},${args.destination.lng}`;
  const params = new URLSearchParams({
    api: "1",
    origin,
    destination,
    travelmode: args.travelmode,
  });
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

export function googleMapsEmbedDirectionsUrl(args: {
  origin: LatLng;
  destination: LatLng;
  travelmode: "driving" | "transit" | "walking";
}): string {
  // No API key embed approach.
  // Uses the classic Maps parameters which generally work in iframes.
  // dirflg: d=driving, r=transit, w=walking
  const origin = `${args.origin.lat},${args.origin.lng}`;
  const destination = `${args.destination.lat},${args.destination.lng}`;
  const dirflg = args.travelmode === "driving" ? "d" : args.travelmode === "walking" ? "w" : "r";

  const params = new URLSearchParams({
    output: "embed",
    saddr: origin,
    daddr: destination,
    dirflg,
  });

  return `https://www.google.com/maps?${params.toString()}`;
}

export function googleMapsEmbedSearchUrl(args: { near: LatLng; query: string }): string {
  const near = `${args.near.lat},${args.near.lng}`;
  const q = `${args.query} near ${near}`;
  const params = new URLSearchParams({
    output: "embed",
    q,
  });
  return `https://www.google.com/maps?${params.toString()}`;
}

export function googleMapsSearchNearbyUrl(args: { near: LatLng; query: string }): string {
  // Using the public Maps search URL (no API key). Google Maps UI will show places + distances.
  // Example query: "hospitals near 25.2,55.27"
  const near = `${args.near.lat},${args.near.lng}`;
  const q = `${args.query} near ${near}`;
  const params = new URLSearchParams({
    api: "1",
    query: q,
  });
  return `https://www.google.com/maps/search/?${params.toString()}`;
}

export function googleMapsOpenAtUrl(args: { center: LatLng; zoom?: number }): string {
  const { center } = args;
  const z = Math.max(1, Math.min(21, Math.round(args.zoom ?? 14)));
  // Uses a standard Maps URL that opens centered at the given location.
  return `https://www.google.com/maps/@${center.lat},${center.lng},${z}z`;
}
