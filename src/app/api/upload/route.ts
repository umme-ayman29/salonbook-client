import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("image");

    if (!(file instanceof File)) {
      return NextResponse.json({ message: "No image provided" }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ message: "Only image files are allowed" }, { status: 400 });
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ message: "Image must be under 5MB" }, { status: 400 });
    }

    const key = process.env.IMGBB_API_KEY;
    if (!key) {
      return NextResponse.json({ message: "Upload is not configured" }, { status: 500 });
    }

    const body = new FormData();
    body.append("image", file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
      method: "POST",
      body,
    });
    const json = await res.json();

    if (!res.ok || !json?.data?.url) {
      return NextResponse.json({ message: "Image upload failed" }, { status: 502 });
    }
    return NextResponse.json({ url: json.data.url });
  } catch {
    return NextResponse.json({ message: "Image upload failed" }, { status: 500 });
  }
}