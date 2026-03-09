import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

// ─── GET /api/admin/stats ─────────────────────────────────────────────────────
export async function GET(_req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalUsers,
      totalFarmers,
      totalBuyers,
      activeListings,
      totalTransactions,
      commissionAggregate,
      pendingVerifications,
      listingsThisMonth,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "farmer" } }),
      prisma.user.count({ where: { role: "buyer" } }),
      prisma.listing.count({ where: { status: "active" } }),
      prisma.transaction.count(),
      prisma.transaction.aggregate({ _sum: { commissionValue: true } }),
      prisma.user.count({ where: { isVerified: false, role: { not: "admin" } } }),
      prisma.listing.count({ where: { createdAt: { gte: startOfMonth } } }),
    ]);

    return NextResponse.json({
      totalUsers,
      totalFarmers,
      totalBuyers,
      activeListings,
      totalTransactions,
      totalCommissionRevenue: commissionAggregate._sum.commissionValue ?? 0,
      pendingVerifications,
      listingsThisMonth,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
