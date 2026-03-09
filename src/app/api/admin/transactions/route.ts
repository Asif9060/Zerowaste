import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

// ─── GET /api/admin/transactions ──────────────────────────────────────────────
export async function GET(_req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const transactions = await prisma.transaction.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      transactions.map((t) => ({
        id: t.id,
        listingId: t.listingId,
        listingTitle: t.listingTitle,
        buyerId: t.buyerId,
        buyerName: t.buyerName,
        farmerId: t.farmerId,
        farmerName: t.farmerName,
        amount: t.amount,
        currency: t.currency,
        commissionRate: t.commissionRate,
        commissionValue: t.commissionValue,
        status: t.status,
        createdAt: t.createdAt.toISOString(),
      }))
    );
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
