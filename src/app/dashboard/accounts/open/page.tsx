"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Toast } from "@/app/components/ui/Toast";
import { useActiveAccountPlans } from "@/hooks/useActiveAccountPlans";
import { useCreateAccount } from "@/hooks/useCreateAccount";
import AccountPlanCard from "../../components/account/AccountPlanCard";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import GlobalLoader from "@/app/components/ui/GlobalLoader";
import { PremiumInput } from "@/app/components/ui/TextInput";

export default function OpenAccountPage() {
  const router = useRouter();
  const { data, isLoading } = useActiveAccountPlans();
  const createAccount = useCreateAccount();
  const [createdAccount, setCreatedAccount] = useState<any>(null);

  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
 const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleContinue = () => {
    if (!selectedPlan) return;
    setConfirmOpen(true);
  };

  const handleConfirmCreate = async () => {
  try {
    const res = await createAccount.mutateAsync({
      account_plan_id: selectedPlan._id,
      account_type: "live",
    });

    setConfirmOpen(false);

    // 🔥 SAVE FULL RESPONSE
    setCreatedAccount(res.data);

  } catch (err: any) {
    setConfirmOpen(false);

    if (err?.response?.status === 400) {
      setErrorMsg("You have reached the account creation limit.");
    } else {
      setErrorMsg("Something went wrong. Please try again.");
    }
  }
};


  return (
    <div className="p-6 space-y-8">
      {/* BACK */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-[var(--text-muted)]"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <h1 className="text-2xl font-semibold">Open account</h1>

      {isLoading ? (
        <div><GlobalLoader /></div>
      ) : (
        <>
          {/* DESKTOP LIST */}
          <div className="hidden lg:block space-y-4">
            {data?.map((plan) => (
              <AccountPlanCard
                key={plan._id}
                plan={plan}
                selected={selectedPlan?._id === plan._id}
                onSelect={() => setSelectedPlan(plan)}
              />
            ))}
          </div>

          {/* MOBILE SLIDER */}
          <div className="lg:hidden">
            <div
              className="
                hide-scrollbar
                flex gap-4 overflow-x-scroll
                snap-x snap-mandatory
                scroll-smooth
                touch-pan-x
                [-webkit-overflow-scrolling:touch]
                pb-4
              "
            >
              {data?.map((plan) => (
                <div
                  key={plan._id}
                  className="snap-center flex-shrink-0 w-[90%]"
                >
                  <AccountPlanCard
                    plan={plan}
                    selected={selectedPlan?._id === plan._id}
                    onSelect={() => setSelectedPlan(plan)}
                  />
                </div>
              ))}
            </div>

            {/* DOTS */}
            <div className="mt-4 flex justify-center gap-2">
              {data?.map((plan) => (
                <span
                  key={plan._id}
                  className={`h-2.5 w-2.5 rounded-full transition ${
                    selectedPlan?._id === plan._id
                      ? "bg-[var(--primary)] scale-110"
                      : "bg-[var(--border-soft)]"
                  }`}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* CONTINUE */}
      <div className="mt-6 flex justify-center lg:justify-start">
        <button
          disabled={!selectedPlan}
          onClick={handleContinue}
          className={`w-full max-w-xs lg:w-64 rounded-lg py-3 font-medium transition-all ${
            selectedPlan
              ? "bg-[var(--primary)] text-[var(--text-main)] hover:scale-[1.02]"
              : "bg-[var(--bg-glass)] text-[var(--text-muted)]"
          }`}
        >
          Continue
        </button>
      </div>

          {/* 🔥 ACCOUNT CREATED MODAL */}
{createdAccount && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
    <div className="bg-[var(--bg-card)] w-full max-w-md rounded-2xl p-6 space-y-5 shadow-2xl">

      <h2 className="text-xl font-semibold text-center">
        Account Created Successfully
      </h2>

      <div className="space-y-4">

        <PremiumInput
          label="Account Number"
          value={createdAccount.account_number}
          onChange={() => {}}
        />

        <PremiumInput
          label="Account Type"
          value={createdAccount.account_type}
          onChange={() => {}}
        />

        <PremiumInput
          label="Plan Name"
          value={createdAccount.plan_name}
          onChange={() => {}}
        />

        <PremiumInput
          label="Currency"
          value={createdAccount.currency}
          onChange={() => {}}
        />

        <PremiumInput
          label="Leverage"
          value={`1:${createdAccount.leverage}`}
          onChange={() => {}}
        />

        <PremiumInput
          label="Trade Password"
          type="password"
          value={createdAccount.trade_password}
          onChange={() => {}}
        />

        <PremiumInput
          label="Watch Password"
          type="password"
          value={createdAccount.watch_password}
          onChange={() => {}}
        />

      </div>

      <div className="text-xs text-red-500 text-center">
        Please save these credentials. They will not be shown again.
      </div>

      <button
        onClick={() => {
          setCreatedAccount(null);   // 🔥 CLEAR (one time view)
          router.push("/dashboard/accounts");
        }}
        className="w-full rounded-lg py-3 bg-[var(--primary)] text-[var(--text-main)] font-medium"
      >
        Okay
      </button>

    </div>
  </div>
)}

      {/* ✅ CONFIRM MODAL */}
      {confirmOpen && selectedPlan && (
        <ConfirmModal
          title="Create trading account?"
          description={`You are about to create a ${selectedPlan.name} account.`}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={handleConfirmCreate}
          loading={createAccount.isPending}
        />
      )}

      {/* ✅ ERROR TOAST */}
      {errorMsg && (
        <Toast
          message={errorMsg}  type="error"
        />
      )}

      {/* ✅ SUCCESS TOAST */}
      {toast && (
        <Toast
          message={toast.message} type="success"
        />
      )}
    </div>
  );
}
