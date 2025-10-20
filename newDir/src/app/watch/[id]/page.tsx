// app/watch/[id]/page.tsx

import VideoPage from "@/componets/VideoPage";

export default async function WatchPage({ params }: { params: { id: string } }) {
  const { id } = await params
  if (!id) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">No video ID provided</h1>
      </div>
    );
  }
  return <VideoPage videoId={id} />;
}
