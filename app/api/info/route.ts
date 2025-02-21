import { NextRequest, NextResponse } from "next/server";
import ytdl from "@distube/ytdl-core";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const info = await ytdl.getInfo(url);
    const formats = info.formats;

    return NextResponse.json(formats);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to process video information" },
      { status: 500 }
    );
  }
}
