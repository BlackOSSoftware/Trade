import api from "@/api/axios";

export interface PaymentMethod {
  _id: string;
  type: "UPI" | "BANK";
  title: string;
  upi_id?: string;
  bank_name?: string;
  account_name?: string;
  account_number?: string;
  ifsc?: string;
  image_url?: string;
}

export const getActivePaymentMethods = async (): Promise<PaymentMethod[]> => {
  const res = await api.get("/payment-methods/active");
  return res.data.data;
};
