import { Video } from "@/interfaces/videoInterface";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface VideoCardProps {
  video: Video;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  return (
    <Link href={`/watch/${video.id}`}>
      <div className="bg-white shadow-md rounded p-2 cursor-pointer hover:shadow-lg transition">
        <Image
          width={300}
          height={200}
          unoptimized
          src={video.snippet.thumbnails.medium.url}
          alt={video.snippet.title}
          className="w-full h-48 object-cover rounded"
        />
        <h2 className="font-semibold mt-2">{video.snippet.title}</h2>
        <p className="text-sm text-gray-500">{video.snippet.channelTitle}</p>
      </div>
    </Link>
  );
};

export default VideoCard;
