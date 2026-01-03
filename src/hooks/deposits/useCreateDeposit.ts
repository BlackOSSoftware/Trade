import { useMutation } from "@tanstack/react-query";
import { createDeposit } from "@/services/deposits.service";

export const useCreateDeposit = () =>
  useMutation({
    mutationFn: createDeposit,
  });
