import type { Listing, ListingFilters } from "@/types";

// ─── Base URL (absolute required for server-side fetch) ───────────────────────
const BASE_URL =
  typeof window === "undefined"
    ? (process.env.NEXTAUTH_URL ??
       (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"))
    : "";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildQuery(filters?: ListingFilters): string {
  if (!filters) return "";
  const p = new URLSearchParams();
  if (filters.search) p.set("search", filters.search);
  if (filters.category && filters.category !== "all") p.set("category", filters.category);
  if (filters.urgency && filters.urgency !== "all") p.set("urgency", filters.urgency);
  if (filters.country && filters.country !== "all") p.set("country", filters.country);
  if (filters.province) p.set("province", filters.province);
  if (filters.city) p.set("city", filters.city);
  if (filters.priceMin !== undefined) p.set("priceMin", String(filters.priceMin));
  if (filters.priceMax !== undefined) p.set("priceMax", String(filters.priceMax));
  if (filters.currency) p.set("currency", filters.currency);
  if (filters.status) p.set("status", filters.status);
  if (filters.sortBy) p.set("sortBy", filters.sortBy);
  const qs = p.toString();
  return qs ? `?${qs}` : "";
}

// ─── Service functions ────────────────────────────────────────────────────────

export async function getListings(filters?: ListingFilters): Promise<Listing[]> {
  const res = await fetch(`${BASE_URL}/api/listings${buildQuery(filters)}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch listings");
  return res.json();
}

export async function getListingById(id: string): Promise<Listing | null> {
  const res = await fetch(`${BASE_URL}/api/listings/${id}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch listing");
  return res.json();
}

export async function getFeaturedListings(limit = 6): Promise<Listing[]> {
  const res = await fetch(`${BASE_URL}/api/listings/featured?limit=${limit}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch featured listings");
  return res.json();
}

export async function getListingsByFarmer(farmerId: string): Promise<Listing[]> {
  const res = await fetch(`${BASE_URL}/api/listings/farmer/${farmerId}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch farmer listings");
  return res.json();
}

export async function createListing(data: Omit<Listing, "id" | "views" | "createdAt">): Promise<Listing> {
  const res = await fetch(`${BASE_URL}/api/listings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? "Failed to create listing");
  }
  return res.json();
}

export async function updateListing(id: string, data: Partial<Listing>): Promise<Listing> {
  const res = await fetch(`${BASE_URL}/api/listings/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? "Failed to update listing");
  }
  return res.json();
}

export async function deleteListing(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/listings/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? "Failed to delete listing");
  }
}

