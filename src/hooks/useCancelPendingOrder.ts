import { useMutation } from "@tanstack/react-query";
import { cancelPendingOrder } from "@/services/trade/cancelPendingOrder.service";

export const useCancelPendingOrder = () => {
  return useMutation({
    mutationFn: (orderId: string) =>
      cancelPendingOrder(orderId),
  });
};
