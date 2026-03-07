import type { Listing, ListingFilters } from "@/types";
import { MOCK_LISTINGS } from "@/lib/mock-data/listings";

// Simulates async API call latency
const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export async function getListings(filters?: ListingFilters): Promise<Listing[]> {
  await delay();
  let results = [...MOCK_LISTINGS];

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.farmerName.toLowerCase().includes(q) ||
        l.location.city.toLowerCase().includes(q)
    );
  }

  if (filters?.category && filters.category !== "all") {
    results = results.filter((l) => l.category === filters.category);
  }

  if (filters?.urgency && filters.urgency !== "all") {
    results = results.filter((l) => l.urgency === filters.urgency);
  }

  if (filters?.country && filters.country !== "all") {
    results = results.filter((l) => l.location.country === filters.country);
  }

  if (filters?.province) {
    results = results.filter((l) => l.location.province === filters.province);
  }

  if (filters?.priceMin !== undefined) {
    results = results.filter((l) => l.price >= filters.priceMin!);
  }

  if (filters?.priceMax !== undefined) {
    results = results.filter((l) => l.price <= filters.priceMax!);
  }

  if (filters?.status) {
    results = results.filter((l) => l.status === filters.status);
  }

  // Sort
  const sortBy = filters?.sortBy ?? "newest";
  switch (sortBy) {
    case "newest":
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case "oldest":
      results.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      break;
    case "price_asc":
      results.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      results.sort((a, b) => b.price - a.price);
      break;
    case "urgency": {
      const order: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
      results.sort((a, b) => order[a.urgency] - order[b.urgency]);
      break;
    }
  }

  return results;
}

export async function getListingById(id: string): Promise<Listing | null> {
  await delay();
  return MOCK_LISTINGS.find((l) => l.id === id) ?? null;
}

export async function getFeaturedListings(limit = 6): Promise<Listing[]> {
  await delay();
  return MOCK_LISTINGS.filter((l) => l.isFeatured && l.status === "active").slice(0, limit);
}

export async function getListingsByFarmer(farmerId: string): Promise<Listing[]> {
  await delay();
  return MOCK_LISTINGS.filter((l) => l.farmerId === farmerId);
}

export async function createListing(data: Omit<Listing, "id" | "views" | "createdAt">): Promise<Listing> {
  await delay(500);
  const newListing: Listing = {
    ...data,
    id: `l${Date.now()}`,
    views: 0,
    createdAt: new Date().toISOString(),
  };
  // In real app: POST /api/listings
  return newListing;
}

export async function updateListing(id: string, data: Partial<Listing>): Promise<Listing> {
  await delay(400);
  const existing = MOCK_LISTINGS.find((l) => l.id === id);
  if (!existing) throw new Error("Listing not found");
  return { ...existing, ...data };
}

export async function deleteListing(id: string): Promise<void> {
  await delay(300);
  // In real app: DELETE /api/listings/:id
}
