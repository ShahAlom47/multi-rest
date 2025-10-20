import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } =await  params;
    const API_KEY = process.env.YT_API_KEY;

    if (!id || !/^[a-zA-Z0-9_-]{11}$/.test(id)) {
      return NextResponse.json({ error: "Invalid YouTube Video ID" }, { status: 400 });
    }

    if (!API_KEY) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=${API_KEY}`
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch video" }, { status: res.status });
    }

    const data = await res.json();
    
    if (!data.items?.length) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json(data.items[0]);

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}