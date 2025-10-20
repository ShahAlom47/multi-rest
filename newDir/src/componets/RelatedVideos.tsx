// components/RelatedVideos.tsx
import React from "react";
import Link from "next/link";
import Image from "next/image";

interface RelatedVideosProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  videos: any[];
}

const RelatedVideos: React.FC<RelatedVideosProps> = ({ videos }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {videos?.length === 0 && (
        <div className="flex items-center justify-center h-screen">
          <h1 className="text-2xl font-bold">No related videos found</h1>
        </div>
      )}
      {
        videos?.length > 0 && (
      
      videos?.map((video) => (
        <Link key={video.id.videoId} href={`/watch/${video.id.videoId}`}>
          <div className="bg-white shadow-md rounded p-2">
            <Image
              src={video.snippet.thumbnails.medium.url}
              alt={video.snippet.title}
              className="w-full h-48 object-cover rounded"
              width={300}
              height={200}
                unoptimized
            />
            <h2 className="font-semibold mt-2">{video.snippet.title}</h2>
            <p className="text-sm text-gray-500">{video.snippet.channelTitle}</p>
          </div>
        </Link>
      ))
       )}
      
      
    </div>
  );
};

export default RelatedVideos;
