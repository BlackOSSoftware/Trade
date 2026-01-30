import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const tradeToken = cookieStore.get("tradeToken")?.value;
  const accountId = cookieStore.get("accountId")?.value;

  if (accessToken) {
    return redirect("/dashboard");
  }

  if (tradeToken && accountId) {
    return redirect(`/dashboard/trade/${accountId}`);
  }

  return redirect("/login");
}
