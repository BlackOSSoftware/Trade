import api from "@/api/axios";

export const notificationService = {
  saveFcmToken: async (token: string) => {
    const res = await api.post("/user/save-fcm-token", {
      token,
    });
    return res.data;
  },
};
