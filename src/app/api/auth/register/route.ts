import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, password, role, location, bio } = body;

    if (!name || !email || !phone || !password || !role || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const profilePhoto = `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        passwordHash,
        role,
        country: location.country,
        province: location.province,
        city: location.city,
        bio: bio ?? null,
        profilePhoto,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        country: true,
        province: true,
        city: true,
        profilePhoto: true,
        bio: true,
        isVerified: true,
        isSuspended: true,
        createdAt: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
