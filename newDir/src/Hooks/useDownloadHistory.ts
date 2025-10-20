import { Video } from "@/interfaces/videoInterface";
import axios from "axios";
import { useEffect, useState } from "react";

const DOWNLOAD_HISTORY_KEY = "download_history_ids";

export const useDownloadHistory = () => {
  const [ids, setIds] = useState<string[]>([]);

  const addToDownloadHistory = (id: string) => {
    const existing: string[] = JSON.parse(
      localStorage.getItem(DOWNLOAD_HISTORY_KEY) || "[]"
    );

    if (!existing.includes(id)) {
      if (existing.length >= 12) {
        existing.pop(); // Remove the oldest (last one)
      }

      const updated = [id, ...existing]; // Newest at the front
      localStorage.setItem(DOWNLOAD_HISTORY_KEY, JSON.stringify(updated));
      setIds(updated);
      // fetchVideoData(updated);
    }
  };

  const fetchVideoData = async (ids: string[]) => {
    if (!ids.length) {
      return;
    }
    try {
      const query = ids.map((id) => `ids=${id}`).join("&");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/getHistory?${query}`
      );

      const data: Video[] = response?.data;
      return data;
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const removeFromDownloadHistory = (id: string) => {
    const existing: string[] = JSON.parse(
      localStorage.getItem(DOWNLOAD_HISTORY_KEY) || "[]"
    );
    const updated = existing.filter((storedId) => storedId !== id);
    localStorage.setItem(DOWNLOAD_HISTORY_KEY, JSON.stringify(updated));
    fetchVideoData(updated);
  };

  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem(DOWNLOAD_HISTORY_KEY) || "[]"
    );
    // if (saved.length) fetchVideoData(saved);
    if (saved.length) setIds(saved);
  }, []);

  return {
    ids,
    fetchVideoData,
    addToDownloadHistory,
    removeFromDownloadHistory,
  };
};
