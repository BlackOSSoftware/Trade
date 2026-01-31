import { useQuery } from "@tanstack/react-query";
import { fetchTradeAccount, getAccountById } from "@/services/accounts.service";

export const useAccountById = (id: string, enabled: boolean) =>
  useQuery({
    queryKey: ["account", id],
    queryFn: () => getAccountById(id),
    enabled,                 // 👈 ONLY when expanded
    staleTime: 60_000,
  });
export const useTradeAccount = () =>
  useQuery({
    queryKey: ["trade-account"],
    queryFn: fetchTradeAccount,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });