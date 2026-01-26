"use client";

type PaginationProps = {
  page: number;
  totalPages: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
};

export default function Pagination({
  page,
  totalPages,
  limit,
  onPageChange,
  onLimitChange,
}: PaginationProps) {
  return (
    <div
      className="
        mt-6
        flex flex-col gap-4
        rounded-2xl
        border border-[var(--card-border)]
        bg-[var(--card-bg)]
        p-4
        sm:flex-row sm:items-center sm:justify-between
      "
    >
      {/* LEFT — LIMIT */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-[var(--text-muted)]">
          Rows
        </span>

        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="
            rounded-xl px-3 py-2 text-sm font-medium
            bg-[var(--input-bg)]
            border border-[var(--input-border)]
            focus:outline-none
            focus:ring-2 focus:ring-[var(--primary)]/30
          "
        >
          {[10, 20, 50].map((n) => (
            <option key={n} value={n}>
              {n} / page
            </option>
          ))}
        </select>
      </div>

      {/* RIGHT — PAGINATION */}
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        {/* PAGE INFO */}
        <span className="text-xs text-[var(--text-muted)]">
          Page <span className="font-semibold">{page}</span> of{" "}
          <span className="font-semibold">{totalPages}</span>
        </span>

        {/* CONTROLS */}
        <div className="flex items-center gap-1">
          <PageBtn
            disabled={page === 1}
            onClick={() => onPageChange(1)}
            label="First"
          >
            ≪
          </PageBtn>

          <PageBtn
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            label="Previous"
          >
            ‹
          </PageBtn>

          {/* CURRENT PAGE */}
          <div
            className="
              mx-1 min-w-[40px]
              rounded-xl
              bg-[var(--primary)]
              px-3 py-2
              text-center text-sm font-semibold
              text-white
              shadow
            "
          >
            {page}
          </div>

          <PageBtn
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
            label="Next"
          >
            ›
          </PageBtn>

          <PageBtn
            disabled={page === totalPages}
            onClick={() => onPageChange(totalPages)}
            label="Last"
          >
            ≫
          </PageBtn>
        </div>
      </div>
    </div>
  );
}

/* ================= BUTTON ================= */

function PageBtn({
  children,
  disabled,
  onClick,
  label,
}: {
  children: React.ReactNode;
  disabled: boolean;
  onClick: () => void;
  label?: string;
}) {
  return (
    <button
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="
        min-w-[36px]
        rounded-xl px-3 py-2
        text-sm font-medium
        bg-[var(--input-bg)]
        border border-[var(--input-border)]
        transition
        hover:bg-[var(--hover-bg)]
        active:scale-95
        disabled:opacity-40
        disabled:cursor-not-allowed
      "
    >
      {children}
    </button>
  );
}
