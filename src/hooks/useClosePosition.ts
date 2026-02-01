import { ClosePositionPayload, closePositionService } from "@/services/trade/closePosition.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useClosePosition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ClosePositionPayload) =>
      closePositionService(payload),

    onSuccess: () => {
      // Positions refetch karwa do
      queryClient.invalidateQueries({ queryKey: ["livePositions"] });
      queryClient.invalidateQueries({ queryKey: ["account"] });
    },
  });
};
