import { useEffect, useState } from "react";

const WATCH_HISTORY_KEY = "watch_history_ids";

const useWatchHistory = () => {
  const [ids, setIds] = useState<string[]>([]);

  // ✅ Add to watch history
  const addToWatchHistory = (id: string) => {
    const existing: string[] = JSON.parse(localStorage.getItem(WATCH_HISTORY_KEY) || "[]");

    if (!existing.includes(id)) {
      if (existing.length >= 12) {
        existing.pop();
      }

      const updated = [id, ...existing];
      localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(updated));
      setIds(updated);
    }
  };

  // ✅ Remove from watch history
  const removeFromWatchHistory = (id: string) => {
    const existing: string[] = JSON.parse(localStorage.getItem(WATCH_HISTORY_KEY) || "[]");
    const updated = existing.filter((storedId) => storedId !== id);
    localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(updated));
    setIds(updated);
  };

  // ✅ Only return data, no state update
  const fetchWatchHistoryData = async (ids: string[]) => {
    if (ids.length === 0) return [];

    try {
      const query = ids.map((id) => `ids=${id}`).join("&");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/getHistory?${query}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Fetch error:", error);
      return [];
    }
  };

  // ✅ Only load IDs on mount
  useEffect(() => {
    const saved: string[] = JSON.parse(localStorage.getItem(WATCH_HISTORY_KEY) || "[]");
    setIds(saved);
  }, []);

  return {
    ids,
    addToWatchHistory,
    removeFromWatchHistory,
    fetchWatchHistoryData,
  };
};

export default useWatchHistory;
