"use client";

import { useMemo, useState } from "react";
import { useMyAccounts } from "@/hooks/useMyAccounts";
import { useInternalTransfer } from "@/hooks/internalTransfer/useInternalTransfer";
import { useInternalTransferHistory } from "@/hooks/internalTransfer/useInternalTransferHistory";
import Select from "@/app/components/ui/Select";
import GlobalLoader from "@/app/components/ui/GlobalLoader";
import Pagination from "@/app/components/ui/pagination";
import MobileBottomBar from "../../components/payments/MobileBottomBar";

export default function InternalFundTransfer() {
  const { data: accounts, isLoading } = useMyAccounts();

  const {
    mutate,
    isPending,
    error: transferError,
    isSuccess,
  } = useInternalTransfer();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const {
    data: history,
    isLoading: historyLoading,
    error: historyError,
  } = useInternalTransferHistory(page, limit);

  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [formError, setFormError] = useState("");

  const liveAccounts = useMemo(() => {
    if (!accounts) return [];
    return accounts.filter((acc: any) => acc.account_type === "live");
  }, [accounts]);

  const accountOptions = liveAccounts.map((acc: any) => ({
    label: `${acc.plan_name} - $${acc.balance.toFixed(2)}`,
    value: acc._id,
  }));

  const selectedFromAccount = liveAccounts.find(
    (acc: any) => acc._id === fromAccount
  );

  const handleTransfer = () => {
    setFormError("");

    if (!fromAccount || !toAccount || !amount) {
      setFormError("All fields are required.");
      return;
    }

    if (fromAccount === toAccount) {
      setFormError("From and To accounts cannot be the same.");
      return;
    }

    const numericAmount = Number(amount);

    if (numericAmount <= 0) {
      setFormError("Amount must be greater than zero.");
      return;
    }

    if (
      selectedFromAccount &&
      numericAmount > selectedFromAccount.balance
    ) {
      setFormError("Insufficient balance.");
      return;
    }

    mutate(
      { fromAccount, toAccount, amount: numericAmount },
      {
        onSuccess: () => {
          setAmount("");
          setFormError("");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <GlobalLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] p-4 md:p-6 space-y-6">

      <h1 className="text-2xl font-semibold">
        Internal Fund Transfer
      </h1>

      {/* TRANSFER CARD */}
      <div className="card p-6 rounded-2xl space-y-6">

        <div className="grid md:grid-cols-3 gap-4 items-end">

          <Select
            label="From Account"
            options={accountOptions}
            value={fromAccount}
            onChange={setFromAccount}
          />

          <Select
            label="To Account"
            options={accountOptions.filter(
              (opt) => opt.value !== fromAccount
            )}
            value={toAccount}
            onChange={setToAccount}
          />

          <div>
            <p className="text-xs mb-2 text-[var(--text-muted)]">
              Amount
            </p>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full rounded-xl border border-[var(--border-soft)] bg-[var(--bg-card)] px-4 py-3 text-sm"
            />
          </div>
        </div>

        {formError && (
          <p className="text-sm text-red-500">{formError}</p>
        )}

        {transferError && (
          <p className="text-sm text-red-500">
            {(transferError as any)?.response?.data?.message ||
              "Transfer failed. Please try again."}
          </p>
        )}

        {isSuccess && (
          <p className="text-sm text-green-500">
            Transfer completed successfully.
          </p>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleTransfer}
            disabled={isPending}
            className="px-6 py-3 rounded-xl text-sm font-medium bg-[var(--primary)] text-[var(--text-invert)] transition hover:opacity-90 disabled:opacity-50"
          >
            {isPending ? "Processing..." : "Transfer Funds"}
          </button>
        </div>
      </div>

      {/* HISTORY CARD */}
      <div className="card p-6 rounded-2xl space-y-4">

        <h2 className="text-lg font-semibold">
          Transfer History
        </h2>

        {historyLoading && <GlobalLoader />}

        {historyError && (
          <p className="text-sm text-red-500">
            Failed to load transfer history.
          </p>
        )}

        {!historyLoading && !historyError && (
          <>
            <div className="space-y-3">
              {history?.data?.length === 0 && (
                <p className="text-sm text-[var(--text-muted)]">
                  No transfer history found.
                </p>
              )}

              {history?.data?.map((item: any) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center p-4 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-glass)]"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {item.type === "INTERNAL_TRANSFER_IN"
                        ? "Transfer In"
                        : "Transfer Out"}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      ${item.amount}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      Balance: ${item.balanceAfter}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* ✅ Proper Pagination Component */}
            <Pagination
              page={page}
              totalPages={history?.pagination?.totalPages || 1}
              limit={limit}
              onPageChange={setPage}
              onLimitChange={(newLimit) => {
                setLimit(newLimit);
                setPage(1);
              }}
            />
          </>
        )}
      </div>
       <MobileBottomBar />
    </div>
  );
}
