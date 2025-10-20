"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useDownloadHistory } from "@/Hooks/useDownloadHistory";
import { Video } from "@/interfaces/videoInterface";

const DownloadHistory = () => {
  const {ids, fetchVideoData, removeFromDownloadHistory } = useDownloadHistory();
  const [downloadData, setDownloadData] = React.useState<Video[]>([]);
  const router = useRouter();

useEffect(() => {
  const fetchData = async () => {
    const data = await fetchVideoData(ids);  
    if (data) {
      setDownloadData(data);
    }
  };
if (ids.length > 0) {

  fetchData();
}
}, [ids]);

  return (
    <div className="p-4 space-y-6 overflow-y-scroll h-[90vh]">
      {downloadData?.length > 0 ? (
        downloadData.map((item, index: number) => {
          const snippet = item.snippet;
          const title = snippet?.title;
          const image =
            snippet?.thumbnails?.medium?.url || snippet?.thumbnails?.high?.url;

          return (
            <div
              key={item.id || index}
              className="bg-white shadow-md rounded-xl p-4 flex flex-col md:flex-row gap-4 border-b-2 border-blue-500 border-opacity-40 hover:border-opacity-100 transition-all duration-300 ease-in-out"
            >
              <div
                onClick={() => router.push(`/watch/${item?.id}`)}
                className="flex gap-4 cursor-pointer flex-1"
              >
                <Image
                  width={80}
                  height={80}
                  unoptimized
                  src={image}
                  alt={title}
                  className="w-16 h-12 rounded-sm object-cover"
                />
                <div>
                  <h2 className="text-sm font-semibold line-clamp-2">{title}</h2>
                </div>
              </div>

              <button
                onClick={() => removeFromDownloadHistory(item.id)}
                className="text-blue-500 hover:text-blue-700 transition duration-200"
                title="Remove from download history"
              >
                <Trash2 size={18} />
              </button>
            </div>
          );
        })
      ) : (
        <div className="text-center text-gray-500">No Download History</div>
      )}
    </div>
  );
};

export default DownloadHistory;
