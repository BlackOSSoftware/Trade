import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  searchInstruments,
  fetchBySegment,
  addToWatchlist,
  removeFromWatchlist,
  fetchWatchlist,
} from "@/services/watchlist.service";

/* SEARCH */
export function useInstrumentSearch(query: string) {
  return useQuery({
    queryKey: ["instrument-search", query],
    queryFn: () => searchInstruments(query),
    enabled: query.length >= 2,
  });
}

/* SEGMENT */
export function useSegmentInstruments(
  segment: string | null,
  accountId: string
) {
  return useQuery({
    queryKey: ["segment", segment],
    queryFn: () => fetchBySegment(segment!, accountId),
    enabled: !!segment,
  });
}

/* ADD / REMOVE */
export function useWatchlistActions(accountId: string) {
  const qc = useQueryClient();

  const add = useMutation({
    mutationFn: (code: string) =>
      addToWatchlist(accountId, code),
    onMutate: async (code) => {
      await qc.cancelQueries({ queryKey: ["watchlist", accountId] });
      const prev = qc.getQueryData<any[]>(["watchlist", accountId]);

      qc.setQueryData(["watchlist", accountId], (old: any[] = []) => [
        ...old,
        { code },
      ]);

      return { prev };
    },
    onError: (_, __, ctx) => {
      qc.setQueryData(["watchlist", accountId], ctx?.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["watchlist", accountId] });
    },
  });

  const remove = useMutation({
    mutationFn: (code: string) =>
      removeFromWatchlist(accountId, code),
    onMutate: async (code) => {
      await qc.cancelQueries({ queryKey: ["watchlist", accountId] });
      const prev = qc.getQueryData<any[]>(["watchlist", accountId]);

      qc.setQueryData(["watchlist", accountId], (old: any[] = []) =>
        old.filter((i) => i.code !== code)
      );

      return { prev };
    },
    onError: (_, __, ctx) => {
      qc.setQueryData(["watchlist", accountId], ctx?.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["watchlist", accountId] });
    },
  });

  return { add, remove };
}

export function useWatchlist(accountId: string) {
  return useQuery({
    queryKey: ["watchlist", accountId],
    queryFn: () => fetchWatchlist(accountId),
  });
}
