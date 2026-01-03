import { useQuery } from "@tanstack/react-query";
import { getMyDeposits } from "@/services/deposits.service";

export const useMyDeposits = (page: number, limit = 10) =>
  useQuery({
    queryKey: ["my-deposits", page, limit],
    queryFn: () => getMyDeposits({ page, limit }),
  });
