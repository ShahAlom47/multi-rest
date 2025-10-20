import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ids = searchParams.getAll("ids"); // collect multiple ?ids=abc&ids=def

  const API_KEY = process.env.YT_API_KEY;

  if (!ids || ids.length === 0) {
    return NextResponse.json({ error: "Video IDs are required" }, { status: 400 });
  }

  try {
    const videoIdString = ids.join(",");
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIdString}&key=${API_KEY}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: "Failed to fetch video data", details: errorData }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json(data.items); // data.items will be an array of video info
  } catch (error) {
    return NextResponse.json({ error: "Server error", details: String(error) }, { status: 500 });
  }
}
