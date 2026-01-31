import { useInfiniteQuery } from "@tanstack/react-query";
import { getTradePositions } from "@/services/trade.service";

export const useTradePositions = () => {
  return useInfiniteQuery({
    queryKey: ["trade-positions"],
    queryFn: getTradePositions,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
    staleTime: 5000,
  });
};
