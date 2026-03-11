import { ALL_LOCATIONS } from "@/lib/mock-data/locations";
import type { Country } from "@/types";

// Shape returned by /api/geocode/reverse (subset of Nominatim address object)
export interface NominatimAddress {
  country_code?: string;
  state?: string;
  state_district?: string;
  county?: string;
  city?: string;
  town?: string;
  village?: string;
  suburb?: string;
}

const COUNTRY_CODE_MAP: Record<string, Country> = {
  za: "ZA",
  zw: "ZW",
};

/**
 * Given a Nominatim address object, returns the best-matching province and city
 * from our canonical ALL_LOCATIONS data, or null if the country is not supported.
 */
export function matchToKnownLocation(
  address: NominatimAddress
): { country: Country; province: string; city: string } | null {
  const rawCode = address.country_code?.toLowerCase();
  if (!rawCode) return null;

  const country = COUNTRY_CODE_MAP[rawCode];
  if (!country) return null;

  const regionData = ALL_LOCATIONS[country];
  const provinces = Object.keys(regionData);

  // Strip common administrative suffixes so "Khulna" matches "Khulna Division" etc.
  const normalize = (s: string) =>
    s.toLowerCase().replace(/\s*(division|province|region|district)\s*$/i, "").trim();

  // ── Step 1: match province from state / state_district / county ──────────────
  const rawProvince =
    address.state ?? address.state_district ?? address.county ?? "";
  const normalizedRaw = normalize(rawProvince);

  // Note: `"".includes("")` is always true in JS, so guard against empty string
  let matchedProvince: string | null = normalizedRaw
    ? (
        provinces.find((p) => normalize(p) === normalizedRaw) ??
        provinces.find((p) => normalize(p).includes(normalizedRaw)) ??
        provinces.find((p) => normalizedRaw.includes(normalize(p))) ??
        null
      )
    : null;

  // ── Step 2: if state gave no match, look up province by city name ─────────────
  const rawCity = address.city ?? address.town ?? address.village ?? address.suburb ?? "";
  const normalizedCity = rawCity.toLowerCase().trim();

  if (!matchedProvince && normalizedCity) {
    for (const p of provinces) {
      const pCities = regionData[p] ?? [];
      const found = pCities.some(
        (c) =>
          c.toLowerCase() === normalizedCity ||
          c.toLowerCase().includes(normalizedCity) ||
          normalizedCity.includes(c.toLowerCase())
      );
      if (found) {
        matchedProvince = p;
        break;
      }
    }
  }

  // Cannot determine location at all
  if (!matchedProvince) return null;

  // ── Step 3: match city within the resolved province ───────────────────────────
  const cities = regionData[matchedProvince] ?? [];

  const matchedCity = normalizedCity
    ? (
        cities.find((c) => c.toLowerCase() === normalizedCity) ??
        cities.find((c) => c.toLowerCase().includes(normalizedCity)) ??
        cities.find((c) => normalizedCity.includes(c.toLowerCase())) ??
        cities[0]
      )
    : cities[0];

  return { country, province: matchedProvince, city: matchedCity };
}
