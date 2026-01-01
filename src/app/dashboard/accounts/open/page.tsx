"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Toast } from "@/app/components/ui/Toast";
import { useActiveAccountPlans } from "@/hooks/useActiveAccountPlans";
import { useCreateAccount } from "@/hooks/useCreateAccount";
import AccountPlanCard from "../../components/account/AccountPlanCard";
import ConfirmModal from "../../components/account/ConfirmModal";
import GlobalLoader from "@/app/components/ui/GlobalLoader";

export default function OpenAccountPage() {
  const router = useRouter();
  const { data, isLoading } = useActiveAccountPlans();
  const createAccount = useCreateAccount();

  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toast, setToast] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleContinue = () => {
    if (!selectedPlan) return;
    setConfirmOpen(true);
  };

  const handleConfirmCreate = async () => {
    try {
      await createAccount.mutateAsync({
        account_plan_id: selectedPlan._id,
        account_type: "live",
      });

      setConfirmOpen(false);
      setToast({ message: "Account created successfully" });

      setTimeout(() => {
        router.push("/dashboard/accounts");
      }, 1200);
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
              ? "bg-[var(--primary)] text-white hover:scale-[1.02]"
              : "bg-[var(--bg-glass)] text-[var(--text-muted)]"
          }`}
        >
          Continue
        </button>
      </div>

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
          message={errorMsg}
        />
      )}

      {/* ✅ SUCCESS TOAST */}
      {toast && (
        <Toast
          message={toast.message}
        />
      )}
    </div>
  );
}
