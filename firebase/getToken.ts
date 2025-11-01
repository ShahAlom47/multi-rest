// firebase/getToken.ts 
import { getToken } from "firebase/messaging";
import { messaging } from "./firebaseConfig";
import { saveNotificationToken } from "@/lib/allApiRequest/notificationRequest";

export const requestForToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted" && messaging) {
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY, // Firebase Console → Project Settings → Cloud Messaging → Web push certificates
      });
      console.log(token,'tokkkkkkkken')
      if (token) {
        console.log("✅ Device Token:", token);
        // 👉 এই টোকেনটা তোমার backend এ পাঠাও (restaurant_id সহ)
        
        const res = await saveNotificationToken(token, "your-tenant-id-here"); // তোমার tenantId এখানে পাঠাও
        console.log("Token saved response:", res);
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
