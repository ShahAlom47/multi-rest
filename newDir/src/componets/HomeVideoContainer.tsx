import React from "react";
import VideoCard from "./VideoCard";
import { Video } from "@/interfaces/videoInterface";

interface HomeVideoContainerProps {
  videos: Video[];
}

const HomeVideoContainer: React.FC<HomeVideoContainerProps> = ({ videos }) => {
  if (!videos || videos.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">No videos found</h1>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
};

export default HomeVideoContainer;
