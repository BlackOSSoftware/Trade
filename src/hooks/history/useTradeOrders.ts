import { useInfiniteQuery } from "@tanstack/react-query";
import { getTradeOrders } from "@/services/trade.service";

export const useTradeOrders = (options?: { symbol?: string | null }) => {
  return useInfiniteQuery({
    queryKey: ["trade-orders", options?.symbol ?? null],
    queryFn: ({ pageParam }) =>
      getTradeOrders({ pageParam, symbol: options?.symbol ?? undefined }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
    staleTime: 15000,
  });
};
