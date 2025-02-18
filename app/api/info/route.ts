import { NextResponse } from "next/server";
import ytdl from "@distube/ytdl-core";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const info = await ytdl.getInfo(url);
    const formats = info.formats;

    return NextResponse.json(formats);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch video info" },
      { status: 500 }
    );
  }
}
