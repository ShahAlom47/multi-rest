// components/VideoPage.tsx
"use client";

import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import RelatedVideos from "./RelatedVideos";
import Loading from "@/app/loading";
import { IoMdDownload } from "react-icons/io";
import DownloadModal from "./DownloadModal";
import  useWatchHistory  from "@/Hooks/useWatchHistory";

interface VideoPageProps {
  videoId: string;
}

const VideoPage: React.FC<VideoPageProps> = ({ videoId }) => {
  const { addToWatchHistory}=useWatchHistory();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [videoData, setVideoData] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [relatedVideos, setRelatedVideos] = useState<any[]>([]);



 useEffect(() => {
  const fetchVideoData = async () => {
    const res = await fetch(`/api/videos/${videoId}`);
    const data = await res.json();
    setVideoData(data);
    addToWatchHistory(videoId);

    // ভিডিও শিরোনাম পেয়ে তারপর related ভিডিও ফেচ
    if (data?.snippet?.title) {
      const relatedRes = await fetch(
        `/api/related?title=${encodeURIComponent(data.snippet.title)}`
      );
      const relatedData = await relatedRes.json();
      setRelatedVideos(relatedData.items || []);
    }
  };

  fetchVideoData();
}, [videoId]);


  if (!videoData) {
    return <Loading />;
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <ReactPlayer
        className="rounded-lg w-full " 
          url={`https://www.youtube.com/watch?v=${videoId}`}
          width="100%"
        //   height="500px"
          controls
        />
        <h1 className="text-2xl font-bold mt-2">{videoData?.snippet?.title}</h1>
          <DownloadModal videoId={videoId} videoTitle={videoData?.snippet?.title} >
          <button className=" flex items-center gap-2">
            Download <IoMdDownload />
          </button>
        </DownloadModal>

      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Related Videos</h2>
        <RelatedVideos videos={relatedVideos} />
      </div>
    </div>
  );
};

export default VideoPage;
