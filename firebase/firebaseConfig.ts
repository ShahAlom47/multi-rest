// firebase/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// const firebaseConfig = {
//   apiKey: "AIzaSyBi8KL8JCty2u4BOaUGrAQyf09hqD98yCI",
//   authDomain: "multi-tanent-website.firebaseapp.com",
//   projectId: "multi-tanent-website",
//   storageBucket: "multi-tanent-website.firebasestorage.app",
//   messagingSenderId: "345389543895",
//   appId: "1:345389543895:web:4a132227b8ea70d515db92"
// };

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
export default app;