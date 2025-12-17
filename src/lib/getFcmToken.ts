import { getMessaging, getToken } from "firebase/messaging";
import { app } from "./firebase";

export const getFcmToken = async (): Promise<string | null> => {
  // ✅ SSR / build safety
  if (typeof window === "undefined") return null;

  // ✅ Browser support check
  if (!("Notification" in window)) {
    console.warn("Notifications not supported");
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;

    const messaging = getMessaging(app);

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    return token ?? null;
  } catch (error) {
    console.error("FCM error:", error);
    return null;
  }
};
