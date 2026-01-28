import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWithdrawal } from "@/services/withdrawal.service";

export const useCreateWithdrawal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWithdrawal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["withdrawals"] });
    },
  });
};
