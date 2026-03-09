import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
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

// ─── GET /api/admin/listings ──────────────────────────────────────────────────
export async function GET(_req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const listings = await prisma.listing.findMany({
      orderBy: { createdAt: "desc" },
      include: { farmer: true },
    });

    return NextResponse.json(listings.map(mapListing));
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── PATCH /api/admin/listings — action: approve | remove | feature ────────────
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { listingId, action } = await req.json();
    if (!listingId || !action) {
      return NextResponse.json({ error: "listingId and action required" }, { status: 400 });
    }

    let data: Prisma.ListingUpdateInput = {};
    if (action === "approve") data = { status: "active" };
    else if (action === "remove") data = { status: "removed" };
    else if (action === "feature") data = { isFeatured: true };
    else if (action === "unfeature") data = { isFeatured: false };
    else return NextResponse.json({ error: "Invalid action" }, { status: 400 });

    const updated = await prisma.listing.update({
      where: { id: listingId },
      data,
      include: { farmer: true },
    });

    // Notify farmer when listing is approved
    if (action === "approve") {
      await prisma.notification.create({
        data: {
          userId: updated.farmerId,
          type: "admin_action",
          title: "Listing Approved",
          message: `Your listing "${updated.title}" has been approved and is now live on the marketplace.`,
          href: `/marketplace/${updated.id}`,
        },
      });
    }

    return NextResponse.json(mapListing(updated));
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
