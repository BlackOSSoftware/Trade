import { useInfiniteQuery } from "@tanstack/react-query";
import { getTradeOrders } from "@/services/trade.service";

export const useTradeOrders = () => {
  return useInfiniteQuery({
    queryKey: ["trade-orders"],
    queryFn: getTradeOrders,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
    staleTime: 15000,
  });
};
