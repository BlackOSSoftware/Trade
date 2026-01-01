import { useQuery } from "@tanstack/react-query";
import { getAccountById } from "@/services/accounts.service";

export const useAccountById = (id: string, enabled: boolean) =>
  useQuery({
    queryKey: ["account", id],
    queryFn: () => getAccountById(id),
    enabled,                 // 👈 ONLY when expanded
    staleTime: 60_000,
  });
