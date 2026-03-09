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

// ─── GET /api/listings/[id] ───────────────────────────────────────────────────
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const listing = await prisma.listing.update({
      where: { id },
      data: { views: { increment: 1 } },
      include: { farmer: true },
    });

    return NextResponse.json(mapListing(listing));
  } catch {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }
}

// ─── PATCH /api/listings/[id] ─────────────────────────────────────────────────
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const existing = await prisma.listing.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const isOwner = existing.farmerId === session.user.id;
    const isAdmin = session.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const {
      title, category, description, quantity, unit,
      price, currency, urgency, location, photos, status,
      expiresAt, isFeatured,
    } = body;

    const updated = await prisma.listing.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(category !== undefined && { category }),
        ...(description !== undefined && { description }),
        ...(quantity !== undefined && { quantity: parseFloat(quantity) }),
        ...(unit !== undefined && { unit }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(currency !== undefined && { currency }),
        ...(urgency !== undefined && { urgency }),
        ...(location !== undefined && {
          country: location.country,
          province: location.province,
          city: location.city,
        }),
        ...(photos !== undefined && { photos }),
        ...(status !== undefined && isAdmin && { status }),
        ...(expiresAt !== undefined && { expiresAt: new Date(expiresAt) }),
        ...(isFeatured !== undefined && isAdmin && { isFeatured }),
      },
      include: { farmer: true },
    });

    return NextResponse.json(mapListing(updated));
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── DELETE /api/listings/[id] ────────────────────────────────────────────────
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const existing = await prisma.listing.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const isOwner = existing.farmerId === session.user.id;
    const isAdmin = session.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.listing.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
