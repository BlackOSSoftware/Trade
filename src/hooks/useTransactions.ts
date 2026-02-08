import { useQuery } from "@tanstack/react-query";
import { fetchTransactions } from "@/services/transactions.service";

export const useTransactions = (params: {
  page: number;
  limit: number;
  type?: string;
  fromDate?: string;
}) => {
  return useQuery({
    queryKey: ["transactions", params],
    queryFn: () => fetchTransactions(params),
  });
};
