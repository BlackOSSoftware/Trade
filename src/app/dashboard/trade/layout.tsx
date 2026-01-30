// src/app/dashboard/trade/layout.tsx (server)
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import TradeLayoutClient from "./components/TradeLayoutClient";

export default async function TradeLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();

  const userToken = cookieStore.get("accessToken")?.value;
  const tradeToken = cookieStore.get("tradeToken")?.value;
  const accountId = cookieStore.get("accountId")?.value;

  // do NOT redirect if only tradeToken present - allow client to resolve accountId
  return <TradeLayoutClient>{children}</TradeLayoutClient>;
}
