import HomeVideoContainer from "@/componets/HomeVideoContainer";

async function getVideos() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/videos`, {
      cache: "force-cache",
    });

    if (!res.ok) {
      console.error("Failed to fetch videos, status:", res.status);
      return []; // empty array fallback
    }

    return await res.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return []; // empty array fallback
  }
}

export default async function Home() {
  const videos = await getVideos();

  return (
    <div className="">
      {videos.length > 0 ? (
        <HomeVideoContainer videos={videos} />
      ) : (
        <div className="flex items-center justify-center h-screen">
          <h1 className="text-2xl font-bold">No videos found</h1>
        </div>
      )}
    </div>
  );
}
