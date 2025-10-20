"use client";
import { useDownloadHistory } from "@/Hooks/useDownloadHistory";
import axios from "axios";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { LuLoaderCircle } from "react-icons/lu";

interface Format {
  format_id: string;
  format_note: string;
  ext: string;
  filesize?: number;
  url: string;
  acodec?: string;
  vcodec?: string;
  height?: number;
}

interface VideoData {
  title: string;
  thumbnail: string;
  formats: Format[];
  duration: number;
  url: string;
}

interface DownloadModalProps {
  videoId: string;
  videoTitle: string;
  children: React.ReactNode;
}

const DownloadModal: React.FC<DownloadModalProps> = ({
  videoId,
  videoTitle,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<Format | null>(null);
  const {addToDownloadHistory}= useDownloadHistory();

  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

  const openModal = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(true);
    setIsLoading(true);
    setVideoData(null);
    setSelectedFormat(null);

    try {
      const response = await axios.get(
        // `${process.env.NEXT_PUBLIC_BASE_URL}/api/videoInfo?url=${youtubeUrl}`
        `${process.env.NEXT_PUBLIC_YT_SERVER_BASE_URL}/video-info?url=${youtubeUrl}`
      );
      setVideoData(response.data);
    } catch (error) {
      console.error("Error fetching video info:", error);
      setVideoData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setVideoData(null);
    setSelectedFormat(null);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeModal();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  const formatFileSize = (bytes?: number) => {
    if (!bytes || bytes <= 0) return "N/A";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const shortTitle = (title: string) =>
    title.length > 50 ? title.slice(0, 47) + "..." : title;

  const handleDownload = () => {
    if (!selectedFormat || !videoData) return;

    const link = document.createElement("a");
    link.href = selectedFormat.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    const cleanTitle = videoData.title
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "_");

    link.download = `${cleanTitle}_${
      selectedFormat.format_note || selectedFormat.format_id
    }.${selectedFormat.ext}`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
addToDownloadHistory(videoId);
    closeModal();
  };

console.log(videoData)
  
  return (
    <>
      {/* Trigger button */}
      <div
        onClick={openModal}
        className="w-fit mt-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        aria-label={`Download ${videoTitle}`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.stopPropagation();
            setIsOpen(true);
            setIsLoading(true);
            setVideoData(null);
            setSelectedFormat(null);

            axios
              .get(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/videoInfo?url=${youtubeUrl}`
              )
              .then((response) => setVideoData(response.data))
              .catch((error) => {
                console.error("Error fetching video info:", error);
                setVideoData(null);
              })
              .finally(() => setIsLoading(false));
          }
        }}
      >
        {children}
      </div>

      {/* Modal */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity  ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div
          className="bg-red-100 rounded-md p-6 w-96 max-w-full shadow-lg transform transition-all border border-red-500"
          onClick={(e) => e.stopPropagation()}
        >
          {isLoading ? (
            <div className="flex flex-col items-center space-y-3">
              <LuLoaderCircle className="animate-spin text-2xl text-red-500" />
              <p>Please wait, fetching video info...</p>
            </div>
          ) : videoData ? (
            <>
              <div className="flex gap-3 mb-4 items-center">
                <Image
                  width={150}
                  height={84}
                  unoptimized
                  src={videoData.thumbnail}
                  alt={`Thumbnail of ${videoData.title}`}
                  className="rounded-md w-3/12"
                />
                <h3
                  id="modal-title"
                  className="text-base font-medium"
                  title={videoData.title}
                >
                  {shortTitle(videoData.title)}
                </h3>
              </div>

              <label htmlFor="formatSelect" className="block mb-1 font-medium">
                Select Format
              </label>
              <select
                id="formatSelect"
                className="w-full border border-gray-800 rounded px-2 py-2 mb-4 lg:text-sm text-xs overflow-y-scroll bg-red-500/90 text-white"
                value={selectedFormat?.format_id || ""}
                onChange={(e) => {
                  const format = videoData.formats.find(
                    (f) => f.format_id === e.target.value
                  );
                  setSelectedFormat(format || null);
                }}
              >
                <option value="" disabled className=" text-gray-100 bg-red-500">
                  Choose a format
                </option>
                {videoData.formats.map((format) => {
                  const isAudioOnly =
                    !format.height && (format.acodec && format.vcodec === "none");
                  const hasAudio =
                    format.acodec !== "none" && format.acodec !== undefined;
                  const resolution = format.height
                    ? `${format.height}p`
                    : "";
                  return (
                    <option key={format.format_id} value={format.format_id}>
                      {isAudioOnly
                        ? `Audio | ${format.ext.toUpperCase()} | Size: ${formatFileSize(
                            format.filesize
                          )}`
                        : `${resolution} | ${format?.ext?.toUpperCase()} | Size: ${formatFileSize(
                            format.filesize
                          )} `}
                      {/* Icon after text */}
                      {isAudioOnly ? (
                        " Audio"
                      ) : hasAudio ? (
                        " 🔊"
                      ) : (
                        " 🔇"
                      )}
                    </option>
                  );
                })}
              </select>

              <div className="flex justify-end space-x-4">
                <button
                  className="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 transition"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  className={`px-4 py-1 rounded text-white transition ${
                    selectedFormat
                      ? "bg-red-500 hover:bg-red-600 cursor-pointer"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                  onClick={handleDownload}
                  disabled={!selectedFormat}
                >
                  Download
                </button>
              </div>
            </>
          ) : (
            <p className="text-center text-red-500">
              Failed to load video info. Please try again.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default DownloadModal;
