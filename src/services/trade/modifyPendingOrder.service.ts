import tradeApi from "@/api/tradeApi";

export type ModifyPendingPayload = {
  orderId: string;
  price: number;
  stopLoss: number;
  takeProfit: number;
};

export const modifyPendingOrder = async (
  payload: ModifyPendingPayload
) => {
  const res = await tradeApi.patch(
    "/api/v1/trade/position/modify",
    payload
  );
  return res.data;
};
