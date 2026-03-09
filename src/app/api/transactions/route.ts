import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

function mapTx(t: {
  id: string; listingId: string; listingTitle: string; buyerId: string; buyerName: string;
  farmerId: string; farmerName: string; amount: number; currency: string;
  commissionRate: number; commissionValue: number; status: string; createdAt: Date;
}) {
  return {
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
  };
}

// ─── GET /api/transactions ────────────────────────────────────────────────────
export async function GET(_req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const isAdmin = session.user.role === "admin";
    const where = isAdmin
      ? {}
      : {
          OR: [
            { buyerId: session.user.id },
            { farmerId: session.user.id },
          ],
        };

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(transactions.map(mapTx));
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── POST /api/transactions ───────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { listingId, amount, currency } = body;

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: { farmer: true },
    });
    if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });

    const buyer = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!buyer) return NextResponse.json({ error: "Buyer not found" }, { status: 404 });

    const commissionRate = 5; // 5%
    const txAmount = amount ?? listing.price;
    const commissionValue = parseFloat(((txAmount * commissionRate) / 100).toFixed(2));

    const transaction = await prisma.transaction.create({
      data: {
        listingId: listing.id,
        listingTitle: listing.title,
        buyerId: buyer.id,
        buyerName: buyer.name,
        farmerId: listing.farmerId,
        farmerName: listing.farmer.name,
        amount: txAmount,
        currency: currency ?? listing.currency,
        commissionRate,
        commissionValue,
        status: "pending",
      },
    });

    // Notify the farmer
    await prisma.notification.create({
      data: {
        userId: listing.farmerId,
        type: "new_contact",
        title: "New buyer contact",
        message: `${buyer.name} is interested in your listing: ${listing.title}`,
        href: `/dashboard/listings`,
      },
    });

    return NextResponse.json(mapTx(transaction), { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
