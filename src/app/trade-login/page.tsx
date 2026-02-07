import { Suspense } from "react";
import TradeLoginContent from "./TradeLoginContent";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <TradeLoginContent />
    </Suspense>
  );
}
