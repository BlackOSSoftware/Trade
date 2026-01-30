export const setTradeSession = (data: {
  tradeToken: string;
  sessionType: string;
  account_number: string;
  accountId?: string;
}) => {
  document.cookie = `tradeToken=${data.tradeToken}; path=/; max-age=900`;
  document.cookie = `tradeSessionType=${data.sessionType}; path=/; max-age=900`;
  document.cookie = `tradeAccount=${data.account_number}; path=/; max-age=900`;
};
