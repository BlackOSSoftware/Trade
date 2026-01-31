import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchWatchlist,
  searchInstruments,
  fetchBySegment,
  addToWatchlist,
  removeFromWatchlist,
} from "@/services/watchlist.service";

/* WATCHLIST */
function getTradeTokenFromStorage(): string | null {
  if (typeof window === "undefined") return null;
  const local = localStorage.getItem("accessToken");
  if (local) return local;
  const cookie = document.cookie.split("; ").find((r) => r.trim().startsWith("tradeToken="));
  return cookie ? cookie.split("=")[1] : null;
}

export function useWatchlist() {
  return useQuery({
    queryKey: ["watchlist"],
    queryFn: async () => {
      const token = getTradeTokenFromStorage();
      // helpful debug log to show whether token is present
      console.debug("[useWatchlist] token present?", !!token);
      const result = await fetchWatchlist(50, token ?? undefined);
      console.debug("[useWatchlist] fetch result length:", result?.length ?? "no result");
      return result;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

/* SEARCH */
export function useInstrumentSearch(query: string) {
  return useQuery({
    queryKey: ["instrument-search", query],
    queryFn: () => searchInstruments(query),
    enabled: query.length >= 2,
  });
}

/* SEGMENT */
export function useSegmentInstruments(segment: string | null) {
  return useQuery({
    queryKey: ["segment", segment],
    queryFn: () => fetchBySegment(segment!),
    enabled: !!segment,
  });
}

/* ACTIONS */
export function useWatchlistActions() {
  const qc = useQueryClient();

  const add = useMutation({
    mutationFn: addToWatchlist,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["watchlist"] });
    },
  });

  const remove = useMutation({
    mutationFn: removeFromWatchlist,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["watchlist"] });
    },
  });

  return { add, remove };
}
