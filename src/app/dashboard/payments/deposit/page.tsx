"use client";

import { useActivePaymentMethods } from "@/hooks/useActivePaymentMethods";
import PaymentMethodCard from "../../components/payments/PaymentMethodCard";
import MobileBottomBar from "../../components/payments/MobileBottomBar";
import GlobalLoader from "@/app/components/ui/GlobalLoader";

export default function DepositPage() {
  const { data, isLoading } = useActivePaymentMethods();

  return (
    <div className="space-y-6 p-4 md:p-6 pb-28 md:pb-6">
      <h1 className="text-2xl font-semibold">Deposit funds</h1>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <GlobalLoader />
        </div>
      ) : (
        <div className="space-y-4">
          {data?.map((method) => (
            <PaymentMethodCard key={method._id} method={method} />
          ))}
        </div>
      )}

      {/* 👇 ALWAYS BOTTOM, NEVER OVERLAP */}
      <MobileBottomBar />
    </div>
  );
}
