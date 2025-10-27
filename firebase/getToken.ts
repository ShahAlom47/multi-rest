// firebase/getToken.ts 
import { getToken } from "firebase/messaging";
import { messaging } from "./firebaseConfig";

export const requestForToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: "YOUR_VAPID_KEY", // Firebase Console → Project Settings → Cloud Messaging → Web push certificates
      });
      if (token) {
        console.log("✅ Device Token:", token);
        // 👉 এই টোকেনটা তোমার backend এ পাঠাও (restaurant_id সহ)
        await fetch("/api/save-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
      } else {
        console.log("No registration token available.");
      }
    } else {
      console.log("Notification permission denied.");
    }
  } catch (err) {
    console.error("Error getting token:", err);
  }
};
