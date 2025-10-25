"use client";

import React, { useState, useEffect } from "react";
import { IoIosNotificationsOutline } from "react-icons/io";
import { useConfirm } from "@/hooks/useConfirm";
import CustomDrawer from "../CustomDrawer";

const AdminNotification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const { ConfirmModal, confirm } = useConfirm();

  // 🧠 Dummy notification loader (তুমি চাইলে API থেকে আনতে পারো)
  const fetchNotifications = async (pageNum = 1) => {
    setLoading(true);
    try {
      // এখানে API কল করতে পারো — আপাতত dummy data দিচ্ছি
      await new Promise((r) => setTimeout(r, 800));
      const newData = Array.from({ length: 5 }, (_, i) => ({
        id: `${pageNum}-${i}`,
        title: `New Order #${pageNum}-${i}`,
        message: "A new order has been placed successfully.",
        time: "2 min ago",
        read: false,
      }));

      if (newData.length === 0) {
        setHasMore(false);
      } else {
        setNotifications((prev) => [...prev, ...newData]);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && notifications.length === 0) {
      fetchNotifications();
    }
  }, [isOpen]);

  // 🔄 Load more notifications
  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNotifications(nextPage);
  };

  // ✅ Render Notification Cards
  const renderNotifications = () => {
    if (loading && notifications.length === 0) {
      return (
        <div className="text-center text-gray-400 py-4">Loading...</div>
      );
    }

    if (notifications.length === 0 && !loading) {
      return (
        <div className="text-center text-gray-400 py-4">
          No notifications found.
        </div>
      );
    }

    return notifications.map((item) => (
      <div
        key={item.id}
        className={`p-3 rounded-lg border shadow-sm hover:bg-gray-50 transition cursor-pointer ${
          item.read ? "bg-white" : "bg-gray-100"
        }`}
      >
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-semibold text-gray-800">
            {item.title}
          </h4>
          <span className="text-[11px] text-gray-400">{item.time}</span>
        </div>
        <p className="text-xs text-gray-600 mt-1">{item.message}</p>

        <div className="flex gap-2 mt-2">
          <button
            onClick={() => handleView(item)}
            className="text-xs text-brandPrimary font-medium hover:underline"
          >
            View Details
          </button>
          <button
            onClick={() => handleDelete(item.id)}
            className="text-xs text-red-500 hover:underline"
          >
            Delete
          </button>
        </div>
      </div>
    ));
  };

  // 👁️ View handler (তুমি চাইলে order details modal খুলতে পারো)
  const handleView = async (item) => {
    await confirm({
      title: "Order Details",
      message: `Order ID: ${item.title}\n\n${item.message}`,
      confirmText: "OK",
      cancelText: "Close",
    });
  };

  // ❌ Delete handler
  const handleDelete = async (id) => {
    const ok = await confirm({
      title: "Delete Notification",
      message: "Are you sure you want to delete this notification?",
      confirmText: "Yes, Delete",
      cancelText: "Cancel",
    });
    if (ok) {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }
  };

  return (
    <div className="relative flex items-center">
      <button
        onClick={() => setIsOpen(true)}
        title="Notification"
        className="text-black md:text-3xl text-2xl font-light relative hover:scale-90 transition-transform"
      >
        <IoIosNotificationsOutline />
        {notifications.length > 0 && (
          <span className="md:h-5 md:w-5 h-4 w-4 bg-brandPrimary rounded-full absolute -top-2 -right-2 md:text-[9px] text-[8px] text-white flex items-center justify-center font-semibold shadow">
            {notifications.length > 99 ? "99+" : notifications.length}
          </span>
        )}
      </button>

      {/* Drawer */}
      <CustomDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        direction="right"
        width="w-[90%] md:w-[40%]"
      >
        <div className="p-4 max-h-[97vh] flex flex-col justify-between">
          <h3 className="text-lg font-semibold mb-2 border-b pb-2">
            Notifications
          </h3>

          <div className="overflow-y-scroll flex-1 space-y-2">
            {renderNotifications()}

            {/* 👉 See More Button */}
            {hasMore && !loading && notifications.length > 0 && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={loadMore}
                  className="text-sm text-brandPrimary hover:underline"
                >
                  See More
                </button>
              </div>
            )}

            {loading && notifications.length > 0 && (
              <div className="text-center text-xs text-gray-400 mt-2">
                Loading...
              </div>
            )}
          </div>
        </div>
      </CustomDrawer>

      {ConfirmModal}
    </div>
  );
};

export default AdminNotification;
