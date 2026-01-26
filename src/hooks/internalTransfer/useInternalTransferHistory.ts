import { useQuery } from "@tanstack/react-query";
import { internalTransferService } from "@/services/internalTransfer.service";

export const useInternalTransferHistory = (
  page: number,
  limit: number
) => {
  return useQuery({
    queryKey: ["internal-transfer-history", page, limit],
    queryFn: () =>
      internalTransferService.getTransferHistory({ page, limit }),
    staleTime: 1000 * 30, // 30 seconds cache
  });
};
