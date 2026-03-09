import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";

// ─── Helper: map DB row → frontend Listing type ───────────────────────────────
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

// ─── GET /api/listings ────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const where: Prisma.ListingWhereInput = {};

    const search = searchParams.get("search");
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
        { farmer: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    const category = searchParams.get("category");
    if (category && category !== "all") where.category = category as Prisma.EnumProduceCategoryFilter;

    const urgency = searchParams.get("urgency");
    if (urgency && urgency !== "all") where.urgency = urgency as Prisma.EnumUrgencyFilter;

    const country = searchParams.get("country");
    if (country && country !== "all") where.country = country;

    const province = searchParams.get("province");
    if (province) where.province = province;

    const priceMin = searchParams.get("priceMin");
    const priceMax = searchParams.get("priceMax");
    if (priceMin || priceMax) {
      where.price = {};
      if (priceMin) where.price.gte = parseFloat(priceMin);
      if (priceMax) where.price.lte = parseFloat(priceMax);
    }

    const status = searchParams.get("status");
    if (status) {
      where.status = status as Prisma.EnumListingStatusFilter;
    } else {
      // Default: only show active listings to public
      where.status = "active";
    }

    // Sort
    const sortBy = searchParams.get("sortBy") ?? "newest";
    let orderBy: Prisma.ListingOrderByWithRelationInput = { createdAt: "desc" };
    if (sortBy === "oldest") orderBy = { createdAt: "asc" };
    else if (sortBy === "price_asc") orderBy = { price: "asc" };
    else if (sortBy === "price_desc") orderBy = { price: "desc" };
    else if (sortBy === "urgency") {
      // Postgres ENUM order: critical > high > medium > low — handled client-side or via raw
      orderBy = { urgency: "asc" };
    }

    const listings = await prisma.listing.findMany({
      where,
      orderBy,
      include: { farmer: true },
    });

    return NextResponse.json(listings.map(mapListing));
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── POST /api/listings ───────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.user.role !== "farmer" && session.user.role !== "admin") {
      return NextResponse.json({ error: "Only farmers can create listings" }, { status: 403 });
    }

    const body = await req.json();
    const {
      title, category, description, quantity, unit,
      price, currency, urgency, location, photos, expiresAt,
    } = body;

    const listing = await prisma.listing.create({
      data: {
        farmerId: session.user.id,
        title,
        category,
        description,
        quantity: parseFloat(quantity),
        unit,
        price: parseFloat(price),
        currency: currency ?? "ZAR",
        urgency: urgency ?? "medium",
        country: location.country,
        province: location.province,
        city: location.city,
        photos: photos ?? [],
        status: "pending_review",
        isFeatured: false,
        expiresAt: new Date(expiresAt),
      },
      include: { farmer: true },
    });

    return NextResponse.json(mapListing(listing), { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
