import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

const USER_SELECT = {
  id: true, name: true, email: true, phone: true, role: true,
  country: true, province: true, city: true, profilePhoto: true,
  bio: true, isVerified: true, isSuspended: true, createdAt: true,
} as const;

function mapUser(u: {
  id: string; name: string; email: string; phone: string; role: string;
  country: string; province: string; city: string; profilePhoto: string | null;
  bio: string | null; isVerified: boolean; isSuspended: boolean; createdAt: Date;
}) {
  return {
    id: u.id, name: u.name, email: u.email, phone: u.phone, role: u.role,
    location: { country: u.country, province: u.province, city: u.city },
    profilePhoto: u.profilePhoto ?? undefined,
    bio: u.bio ?? undefined,
    isVerified: u.isVerified,
    isSuspended: u.isSuspended,
    createdAt: u.createdAt.toISOString(),
  };
}

// ─── GET /api/admin/users ─────────────────────────────────────────────────────
export async function GET(_req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: USER_SELECT,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(users.map(mapUser));
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── PATCH /api/admin/users — action: verify | suspend | unsuspend ──────────────
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { userId, action } = await req.json();
    if (!userId || !action) {
      return NextResponse.json({ error: "userId and action required" }, { status: 400 });
    }

    let data: Record<string, boolean> = {};
    if (action === "verify") data = { isVerified: true };
    else if (action === "suspend") data = { isSuspended: true };
    else if (action === "unsuspend") data = { isSuspended: false };
    else return NextResponse.json({ error: "Invalid action" }, { status: 400 });

    const updated = await prisma.user.update({
      where: { id: userId },
      data,
      select: USER_SELECT,
    });

    // Notify user when verified
    if (action === "verify") {
      await prisma.notification.create({
        data: {
          userId,
          type: "account_verified",
          title: "Account Verified",
          message: "Your account has been verified by the ZeroWaste Farm admin team.",
        },
      });
    }

    return NextResponse.json(mapUser(updated));
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
