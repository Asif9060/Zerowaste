import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

function mapNotif(n: {
  id: string; userId: string; type: string; title: string; message: string;
  isRead: boolean; href: string | null; createdAt: Date;
}) {
  return {
    id: n.id,
    userId: n.userId,
    type: n.type,
    title: n.title,
    message: n.message,
    isRead: n.isRead,
    href: n.href ?? undefined,
    createdAt: n.createdAt.toISOString(),
  };
}

// ─── GET /api/notifications ───────────────────────────────────────────────────
export async function GET(_req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const notifications = await prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(notifications.map(mapNotif));
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── PATCH /api/notifications — mark all as read ──────────────────────────────
export async function PATCH(_req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await prisma.notification.updateMany({
      where: { userId: session.user.id, isRead: false },
      data: { isRead: true },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
