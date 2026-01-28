import { useQuery } from "@tanstack/react-query";
import { getWithdrawals } from "@/services/withdrawal.service";

export const useWithdrawals = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["withdrawals", page, limit],
    queryFn: () => getWithdrawals(page, limit),
  });
};
