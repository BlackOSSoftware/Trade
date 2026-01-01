import { useQuery } from "@tanstack/react-query";
import { getMyAccounts } from "@/services/accounts.service";

export const useMyAccounts = () =>
  useQuery({
    queryKey: ["my-accounts"],
    queryFn: getMyAccounts,
  });
