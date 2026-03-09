import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

function mapUser(u: {
  id: string; name: string; email: string; phone: string; role: string;
  country: string; province: string; city: string; profilePhoto: string | null;
  bio: string | null; isVerified: boolean; isSuspended: boolean; createdAt: Date;
}) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    role: u.role,
    location: { country: u.country, province: u.province, city: u.city },
    profilePhoto: u.profilePhoto ?? undefined,
    bio: u.bio ?? undefined,
    isVerified: u.isVerified,
    isSuspended: u.isSuspended,
    createdAt: u.createdAt.toISOString(),
  };
}

const USER_SELECT = {
  id: true, name: true, email: true, phone: true, role: true,
  country: true, province: true, city: true, profilePhoto: true,
  bio: true, isVerified: true, isSuspended: true, createdAt: true,
} as const;

// ─── GET /api/users/[id] ──────────────────────────────────────────────────────
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await prisma.user.findUnique({ where: { id }, select: USER_SELECT });
    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(mapUser(user));
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── PATCH /api/users/[id] ────────────────────────────────────────────────────
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    if (session.user.id !== id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { name, phone, bio, profilePhoto, location } = body;

    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(phone !== undefined && { phone }),
        ...(bio !== undefined && { bio }),
        ...(profilePhoto !== undefined && { profilePhoto }),
        ...(location !== undefined && {
          country: location.country,
          province: location.province,
          city: location.city,
        }),
      },
      select: USER_SELECT,
    });

    return NextResponse.json(mapUser(updated));
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
