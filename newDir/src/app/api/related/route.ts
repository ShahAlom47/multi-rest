import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title");
    const API_KEY = process.env.YT_API_KEY;

    if (!title) {
      return NextResponse.json({ error: "title not found" }, { status: 400 });
    }
    if (!API_KEY) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const searchRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        title
      )}&type=video&maxResults=9&key=${API_KEY}`
    );

    if (!searchRes.ok) {
      const errorData = await searchRes.json().catch(() => null);
      return NextResponse.json(
        {
          error: "YouTube API error",
          message: errorData?.error?.message || "Unknown error",
          status: searchRes.status,
        },
        { status: searchRes.status }
      );
    }

    const searchData = await searchRes.json();
    return NextResponse.json(searchData);
  } catch (error: unknown) {
    let message = "Unknown error";
    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === "string") {
      message = error;
    }
    return NextResponse.json(
      { error: "Internal Server Error", message },
      { status: 500 }
    );
  }
};
