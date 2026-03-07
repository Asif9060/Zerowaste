import type { AdminStats, User, Listing, Transaction } from "@/types";
import { MOCK_USERS } from "@/lib/mock-data/users";
import { MOCK_LISTINGS } from "@/lib/mock-data/listings";
import { MOCK_TRANSACTIONS } from "@/lib/mock-data/transactions";

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export async function getAdminStats(): Promise<AdminStats> {
  await delay();
  const totalUsers = MOCK_USERS.length;
  const totalFarmers = MOCK_USERS.filter((u) => u.role === "farmer").length;
  const totalBuyers = MOCK_USERS.filter((u) => u.role === "buyer").length;
  const activeListings = MOCK_LISTINGS.filter((l) => l.status === "active").length;
  const totalTransactions = MOCK_TRANSACTIONS.length;
  const totalCommissionRevenue = MOCK_TRANSACTIONS.reduce((sum, t) => sum + t.commissionValue, 0);
  const pendingVerifications = MOCK_USERS.filter((u) => !u.isVerified && u.role !== "admin").length;
  const listingsThisMonth = MOCK_LISTINGS.filter((l) => {
    const d = new Date(l.createdAt);
    return d.getMonth() === 2 && d.getFullYear() === 2026; // March 2026
  }).length;

  return {
    totalUsers,
    totalFarmers,
    totalBuyers,
    activeListings,
    totalTransactions,
    totalCommissionRevenue,
    pendingVerifications,
    listingsThisMonth,
  };
}

export async function getAdminUsers(): Promise<User[]> {
  await delay();
  return [...MOCK_USERS].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getAdminListings(): Promise<Listing[]> {
  await delay();
  return [...MOCK_LISTINGS].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getAdminTransactions(): Promise<Transaction[]> {
  await delay();
  return [...MOCK_TRANSACTIONS].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function verifyUser(userId: string): Promise<void> {
  await delay(300);
  // In real app: PATCH /api/admin/users/:id/verify
}

export async function suspendUser(userId: string): Promise<void> {
  await delay(300);
  // In real app: PATCH /api/admin/users/:id/suspend
}

export async function approveListing(listingId: string): Promise<void> {
  await delay(300);
  // In real app: PATCH /api/admin/listings/:id/approve
}

export async function removeListing(listingId: string): Promise<void> {
  await delay(300);
  // In real app: DELETE /api/admin/listings/:id
}
