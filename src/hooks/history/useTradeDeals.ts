import { useInfiniteQuery } from "@tanstack/react-query";
import { getTradeDeals } from "@/services/trade.service";

export const useTradeDeals = () => {
  return useInfiniteQuery({
    queryKey: ["trade-deals"],
    queryFn: getTradeDeals,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
    staleTime: 15000,
  });
};
