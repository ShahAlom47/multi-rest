"use client";

import React, { useState, useEffect } from "react";
import { IoIosNotificationsOutline } from "react-icons/io";
import { useConfirm } from "@/hooks/useConfirm";
import CustomDrawer from "../CustomDrawer";
import { useFirebaseNotifications } from "@/hooks/useFirebaseNotifications";

// 🧱 Notification Interface
export interface NotificationData {
  _id?: string;
  tenantId: string;
  tenantName?: string;
  tenantDomain?: string;
  tenantLogo?: string;
  title: string;
  message: string;
  type: "order" | "payment" | "review" | "system" | "custom";
  priority?: "low" | "normal" | "high";
  orderId?: string;
  userId?: string;
  createdBy?: string;
  read: boolean;
  readAt?: Date;
  delivered: boolean;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
  url?: string;
  icon?: string;
}

const AdminNotification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationsData, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const { ConfirmModal, confirm } = useConfirm();


    const {
    notifications,
    sendNotification,
  } = useFirebaseNotifications();

  console.log(notifications, sendNotification);

  // 🧠 Dummy data loader
  const fetchNotifications = async (pageNum = 1) => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));

      const newData: NotificationData[] = Array.from({ length: 5 }, (_, i) => ({
        _id: `${pageNum}-${i}`,
        tenantId: "restaurant_123",
        tenantName: "Kabab House",
        tenantDomain: "orders.kababhouse.com",
        tenantLogo: "../../assets/images/defaultUserWhite.webp",
        title: `New Order #${pageNum}-${i}`,
        message: "A new order has been placed successfully!",
        type: "order",
        priority: "high",
        read: false,
        delivered: true,
        createdAt: new Date(),
        url: `/orders/${pageNum}-${i}`,
        icon: "🛒",
      }));

      if (newData.length === 0) setHasMore(false);
      else setNotifications((prev) => [...prev, ...newData]);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load when Drawer opens
  useEffect(() => {
    if (isOpen && notificationsData.length === 0) {
      fetchNotifications();
    }
  }, [isOpen]);

  // 🔄 Load more
  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNotifications(nextPage);
  };

  // 👁️ View handler
  const handleView = async (item: NotificationData) => {
    await confirm({
      title: item.title,
      message: `${item.message}\n\nRestaurant: ${
        item.tenantName || "N/A"
      }\nOrder ID: ${item.orderId || "N/A"}`,
      confirmText: "OK",
      cancelText: "Close",
    });

    // Mark as read (demo update)
    setNotifications((prev) =>
      prev.map((n) =>
        n._id === item._id ? { ...n, read: true, readAt: new Date() } : n
      )
    );
  };

  // ❌ Delete handler
  const handleDelete = async (id?: string) => {
    const ok = await confirm({
      title: "Delete Notification",
      message: "Are you sure you want to delete this notification?",
      confirmText: "Yes, Delete",
      cancelText: "Cancel",
    });
    if (ok && id) {
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    }
  };

  // 🧩 Render notifications
  const renderNotifications = () => {
    if (loading && notificationsData.length === 0) {
      return <div className="text-center text-gray-400 py-4">Loading...</div>;
    }

    if (!loading && notificationsData.length === 0) {
      return (
        <div className="text-center text-gray-400 py-4">
          No notifications found.
        </div>
      );
    }

    return notificationsData.map((item) => (
      <div
        key={item._id}
        className={`p-3 rounded-lg border shadow-sm hover:bg-gray-50 transition cursor-pointer ${
          item.read ? "bg-white" : "bg-gray-100"
        }`}
      >
        <div className="flex items-start gap-3">
          {/* ✅ Tenant Logo */}
        
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                {item.icon && <span>{item.icon}</span>}
                {item.title}
              </h4>
              <span className="text-[11px] text-gray-400">
                {new Date(item.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <p className="text-xs text-gray-600 mt-1">{item.message}</p>
            {item.tenantName && (
              <p className="text-[11px] text-gray-400 mt-0.5">
                {item.tenantName}
              </p>
            )}

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleView(item)}
                className="text-xs text-brandPrimary font-medium hover:underline"
              >
                View
              </button>
              <button
                onClick={() => handleDelete(item._id)}
                className="text-xs text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="relative flex items-center">
      <button
        onClick={() => setIsOpen(true)}
        title="Notification"
        className="text-black md:text-3xl text-2xl font-light relative hover:scale-90 transition-transform"
      >
        <IoIosNotificationsOutline />
        {notificationsData.length > 0 && (
          <span className="md:h-5 md:w-5 h-4 w-4 bg-brandPrimary rounded-full absolute -top-2 -right-2 md:text-[9px] text-[8px] text-white flex items-center justify-center font-semibold shadow">
            {notificationsData.length > 99 ? "99+" : notificationsData.length}
          </span>
        )}
      </button>

      {/* Drawer */}
      {isOpen && (
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

            <div className="overflow-y-auto flex-1 space-y-2">
              {renderNotifications()}

              {hasMore && !loading && notificationsData.length > 0 && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={loadMore}
                    className="text-sm text-brandPrimary hover:underline"
                  >
                    See More
                  </button>
                </div>
              )}

              {loading && notificationsData.length > 0 && (
                <div className="text-center text-xs text-gray-400 mt-2">
                  Loading...
                </div>
              )}
            </div>
          </div>
        </CustomDrawer>
      )}

      {ConfirmModal}
    </div>
  );
};

export default AdminNotification;
