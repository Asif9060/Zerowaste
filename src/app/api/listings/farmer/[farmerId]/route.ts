import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";

function mapListing(l: Prisma.ListingGetPayload<{ include: { farmer: true } }>) {
  return {
    id: l.id,
    farmerId: l.farmerId,
    farmerName: l.farmer.name,
    farmerPhone: l.farmer.phone,
    title: l.title,
    category: l.category,
    description: l.description,
    quantity: l.quantity,
    unit: l.unit,
    price: l.price,
    currency: l.currency,
    urgency: l.urgency,
    location: { country: l.country, province: l.province, city: l.city },
    photos: l.photos,
    status: l.status,
    views: l.views,
    isFeatured: l.isFeatured,
    expiresAt: l.expiresAt.toISOString(),
    createdAt: l.createdAt.toISOString(),
  };
}

// ─── GET /api/listings/farmer/[farmerId] ──────────────────────────────────────
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ farmerId: string }> }
) {
  try {
    const { farmerId } = await params;

    const listings = await prisma.listing.findMany({
      where: { farmerId },
      orderBy: { createdAt: "desc" },
      include: { farmer: true },
    });

    return NextResponse.json(listings.map(mapListing));
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
