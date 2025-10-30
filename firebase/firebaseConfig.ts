// firebase/firebaseConfig.ts
"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, isSupported, Messaging } from "firebase/messaging";

// আপনার Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBi8KL8JCty2u4BOaUGrAQyf09hqD98yCI",
  authDomain: "multi-tanent-website.firebaseapp.com",
  projectId: "multi-tanent-website",
  storageBucket: "multi-tanent-website.firebasestorage.app",
  messagingSenderId: "345389543895",
  appId: "1:345389543895:web:4a132227b8ea70d515db92",
};
// export const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
// };



// 🧩 initializeApp শুধুমাত্র একবার হবে
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ⚠️ messaging শুধুমাত্র browser (client) এ initialize হবে
let messaging: Messaging | null = null;

if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported) {
        messaging = getMessaging(app);
      } else {
        console.warn("❌ This browser does not support Firebase Cloud Messaging.");
      }
    })
    .catch((err) => console.error("FCM support check failed:", err));
}

export { app, messaging };



