import { getActivePaymentMethods } from "@/services/paymentMethods.service";
import { useQuery } from "@tanstack/react-query";

export const useActivePaymentMethods = () =>
  useQuery({
    queryKey: ["active-payment-methods"],
    queryFn: getActivePaymentMethods,
    staleTime: 5 * 60 * 1000,
  });
