// hooks/useFirebaseNotifications.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { onMessage, getToken } from "firebase/messaging";
import { messaging } from "../../firebase/firebaseConfig";

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type?: string;
  read?: boolean;
  createdAt?: Date;
  icon?: string;
}

export const useFirebaseNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [token, setToken] = useState<string | null>(null);

  // ✅ Request permission and get FCM token
  const requestPermission = useCallback(async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const fcmToken = await getToken(messaging, {
          vapidKey: "YOUR_VAPID_KEY",
        });
        setToken(fcmToken);
        console.log("FCM Token:", fcmToken);
        // 👉 Send token to backend if needed
      } else {
        console.warn("Notification permission denied");
      }
    } catch (error) {
      console.error("Error requesting permission:", error);
    }
  }, []);

  // 🔄 Listen for incoming messages
  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("📩 New FCM Message:", payload);

      const newNotification: NotificationData = {
        id: payload.messageId || Date.now().toString(),
        title: payload.notification?.title || "New Notification",
        message: payload.notification?.body || "",
        type: payload.data?.type,
        read: false,
        createdAt: new Date(),
        icon: "🔔",
      };

      setNotifications((prev) => [newNotification, ...prev]);
    });

    return unsubscribe;
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  return {
    notifications,
    markAsRead,
    deleteNotification,
    token,
  };
};
