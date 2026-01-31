import tradeApi from "@/api/tradeApi";

export const getTradeSummary = async () => {
  const { data } = await tradeApi.get("/trade/summary");
  return data.summary;
};

export const getTradePositions = async ({ pageParam = 1 }) => {
  const { data } = await tradeApi.get(
    `/trade/positions?page=${pageParam}&limit=20`
  );

  return {
    positions: data.positions,
    nextPage:
      pageParam < data.pagination.totalPages
        ? pageParam + 1
        : undefined,
  };
};

export const getTradeOrders = async ({ pageParam = 1 }) => {
  const { data } = await tradeApi.get(
    `/trade/orders?page=${pageParam}&limit=20`
  );

  return {
    orders: data.orders,
    summary: data.summary,
    nextPage:
      pageParam < data.pagination.totalPages
        ? pageParam + 1
        : undefined,
  };
};


export const getTradeDeals = async ({ pageParam = 1 }) => {
  const { data } = await tradeApi.get(
    `/trade/deals?page=${pageParam}&limit=20`
  );

  return {
    deals: data.deals,
    nextPage:
      pageParam < data.pagination.totalPages
        ? pageParam + 1
        : undefined,
  };
};
