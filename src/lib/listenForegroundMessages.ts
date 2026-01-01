import { getMessaging, onMessage } from "firebase/messaging";
import { app } from "./firebase";

export const listenForegroundMessages = () => {
  if (typeof window === "undefined") return;
  if (!("Notification" in window)) return;

  const messaging = getMessaging(app);

  onMessage(messaging, (payload) => {
    console.log("🔥 FCM RECEIVED:", payload);

    const type = payload.data?.type || "GENERAL";

    // 👇 TYPE VISIBLE IN TITLE
    const title = `[${type}] ${payload.data?.title || "Notification"}`;

    const body = payload.data?.body || "";

    if (Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: "/icon.png",
        data: {
          ...payload.data,
          type,
        },
      });
    }

    // Logic handling
    if (type === "KYC") {
      console.log("KYC STATUS:", payload.data?.status);
    }
  });
};
