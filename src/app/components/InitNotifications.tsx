"use client";

import { useEffect } from "react";
import { getFcmToken } from "@/lib/getFcmToken";
import { listenForegroundMessages } from "@/lib/listenForegroundMessages";
import { useSaveFcmToken } from "@/hooks/useNotification";

export default function InitNotifications() {
  const saveToken = useSaveFcmToken();

  useEffect(() => {
    getFcmToken().then((token) => {
      if (!token) return;
      saveToken.mutate(token);
    });

    listenForegroundMessages();
  }, []);

  return null;
}
