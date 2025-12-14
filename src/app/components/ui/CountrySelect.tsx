"use client";

import { useMemo, useState } from "react";
import { useCountries } from "@/hooks/useCountries";
import { Country } from "@/types/country";
import { Search } from "lucide-react";

type Props = {
  value: Country;
  onChange: (c: Country) => void;
};

export function CountrySelect({ value, onChange }: Props) {
  const { data: countries } = useCountries();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!countries) return [];
    const q = search.toLowerCase();
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dialCode.includes(q)
    );
  }, [countries, search]);

  return (
    <div className="relative w-28">
      {/* SELECT BUTTON */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="
          flex w-full items-center gap-2 rounded-lg
          border border-[var(--border-glass)]
          bg-[var(--bg-card)] px-3 py-2 text-sm
        "
      >
        <img
          src={value.flag}
          alt={value.name}
          className="h-4 w-6 rounded-sm"
        />
        <span>{value.dialCode}</span>
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="
          absolute z-50 mt-2 w-72 rounded-xl
          border border-[var(--border-glass)]
          bg-[var(--bg-card)] shadow-2xl
        ">
          {/* SEARCH */}
          <div className="flex items-center gap-2 border-b border-[var(--border-glass)] px-3 py-2">
            <Search size={14} className="text-[var(--text-muted)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country"
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          {/* LIST */}
          <div className="max-h-64 overflow-auto">
            {filtered.map((c) => (
              <button
                key={c.name}
                onClick={() => {
                  onChange(c);
                  setOpen(false);
                  setSearch("");
                }}
                className="
                  flex w-full items-center gap-3 px-3 py-2 text-sm
                  hover:bg-white/5
                "
              >
                <img src={c.flag} className="h-4 w-6 rounded-sm" />
                <span className="flex-1">{c.name}</span>
                <span className="text-[var(--text-muted)]">
                  {c.dialCode}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
