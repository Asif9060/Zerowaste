import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

// ─── GET /api/favorites ───────────────────────────────────────────────────────
export async function GET(_req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const favorites = await prisma.favorite.findMany({
      where: { userId: session.user.id },
      include: {
        listing: { include: { farmer: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const listings = favorites.map(({ listing: l }) => ({
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
    }));

    return NextResponse.json(listings);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── POST /api/favorites — toggle favorite ─────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { listingId } = await req.json();
    if (!listingId) return NextResponse.json({ error: "listingId required" }, { status: 400 });

    const existing = await prisma.favorite.findUnique({
      where: { userId_listingId: { userId: session.user.id, listingId } },
    });

    if (existing) {
      await prisma.favorite.delete({
        where: { userId_listingId: { userId: session.user.id, listingId } },
      });
      return NextResponse.json({ favorited: false });
    } else {
      await prisma.favorite.create({
        data: { userId: session.user.id, listingId },
      });
      return NextResponse.json({ favorited: true });
    }
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
