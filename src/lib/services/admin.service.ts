import type { AdminStats, User, Listing, Transaction } from "@/types";

const BASE_URL =
  typeof window === "undefined"
    ? (process.env.NEXTAUTH_URL ??
       (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"))
    : "";

export async function getAdminStats(): Promise<AdminStats> {
  const res = await fetch(`${BASE_URL}/api/admin/stats`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch admin stats");
  return res.json();
}

export async function getAdminUsers(): Promise<User[]> {
  const res = await fetch(`${BASE_URL}/api/admin/users`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch admin users");
  return res.json();
}

export async function getAdminListings(): Promise<Listing[]> {
  const res = await fetch(`${BASE_URL}/api/admin/listings`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch admin listings");
  return res.json();
}

export async function getAdminTransactions(): Promise<Transaction[]> {
  const res = await fetch(`${BASE_URL}/api/admin/transactions`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch admin transactions");
  return res.json();
}

export async function verifyUser(userId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/admin/users`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, action: "verify" }),
  });
  if (!res.ok) throw new Error("Failed to verify user");
}

export async function suspendUser(userId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/admin/users`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, action: "suspend" }),
  });
  if (!res.ok) throw new Error("Failed to suspend user");
}

export async function approveListing(listingId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/admin/listings`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ listingId, action: "approve" }),
  });
  if (!res.ok) throw new Error("Failed to approve listing");
}

export async function removeListing(listingId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/admin/listings`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ listingId, action: "remove" }),
  });
  if (!res.ok) throw new Error("Failed to remove listing");
}

