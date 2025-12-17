import { getMessaging, onMessage } from "firebase/messaging";
import { app } from "./firebase";

export const listenForegroundMessages = () => {
  if (typeof window === "undefined") return;
  if (!("Notification" in window)) return;

  try {
    const messaging = getMessaging(app);

    onMessage(messaging, (payload) => {
      console.log("🔥 FOREGROUND FCM RECEIVED:", payload);

      if (Notification.permission === "granted") {
        new Notification(
          payload.data?.title || "Notification",
          {
            body: payload.data?.body || "",
            icon: "/icon.png",
          }
        );
      }
    });
  } catch (err) {
    console.error("Foreground FCM error:", err);
  }
};
