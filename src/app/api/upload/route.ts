import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { uploadImage } from "@/lib/cloudinary";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string | null) ?? "zerowaste";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, and WebP images are allowed" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File size must not exceed 5 MB" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const url = await uploadImage(buffer, folder);

    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
