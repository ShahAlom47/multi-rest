"use client";

import { useState, useEffect, useCallback } from "react";
import { onMessage, getToken, isSupported } from "firebase/messaging";
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
  const [loading, setLoading] = useState(false);

  // ✅ Request permission + get FCM token
  const requestPermission = useCallback(async () => {
    if (typeof window === "undefined") return;

    try {
      const supported = await isSupported();
      console.log(supported,'sssssssssss')
      if (!supported || !messaging) {
        console.warn("🚫 Browser does not support Firebase Messaging.");
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const fcmToken = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });

        if (fcmToken) {
          setToken(fcmToken);
          console.log("✅ FCM Token:", fcmToken);

          // 👉 Backend এ পাঠাও (যদি দরকার হয়)
          await fetch("/api/save-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: fcmToken }),
          });
        }
      } else {
        console.warn("🚫 Notification permission denied");
      }
    } catch (error) {
      console.error("🔥 Error getting permission/token:", error);
    }
  }, []);

  // 🔄 Receive notifications (foreground)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const setupListener = async () => {
      const supported = await isSupported();
      if (!supported || !messaging) {
        console.warn("Browser not supported for onMessage listener.");
        return;
      }

      const unsubscribe = onMessage(messaging, (payload) => {
        console.log("📩 New message:", payload);

        const newNotification: NotificationData = {
          id: payload.messageId || Date.now().toString(),
          title: payload.notification?.title || "New Notification",
          message: payload.notification?.body || "",
          type: payload.data?.type,
          read: false,
          createdAt: new Date(),
          icon: payload.notification?.icon || "🔔",
        };

        setNotifications((prev) => [newNotification, ...prev]);
      });

      return unsubscribe;
    };

    setupListener();
  }, []);

  // ✅ Send custom notification (through backend)
  const sendNotification = useCallback(
    async (title: string, message: string, type?: string) => {
      try {
        setLoading(true);
        const res = await fetch("/api/send-notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, message, type }),
        });
        const data = await res.json();
        console.log("📤 Notification sent:", data);
      } catch (error) {
        console.error("❌ Error sending notification:", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // 🚀 Initialize permission when component mounts
  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  return {
    notifications,
    token,
    loading,
    sendNotification,
  };
};
