import { NextResponse } from "next/server"

export async function GET() {
  const API_KEY = process.env.YT_API_KEY
  const maxResults = 15
  const regionCode = "BD"

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&regionCode=${regionCode}&maxResults=${maxResults}&key=${API_KEY}`
    )

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 })
    }

    const data = await response.json()
    return NextResponse.json(data.items)
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}