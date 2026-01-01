"use client";

import { useState } from "react";
import { ChevronDown, Landmark, QrCode } from "lucide-react";
import CopyField from "./CopyField";
import { PaymentMethod } from "@/services/paymentMethods.service";

export default function PaymentMethodCard({ method }: { method: PaymentMethod }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="card overflow-hidden">
      {/* HEADER */}
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-4"
      >
        <div className="flex items-center gap-3">
          {method.type === "UPI" ? <QrCode size={20} /> : <Landmark size={20} />}
          <div className="font-medium">{method.title}</div>
        </div>
        <ChevronDown className={`transition ${open ? "rotate-180" : ""}`} />
      </button>

      {/* DETAILS */}
      {open && (
        <div className="animate-dropdown space-y-4 p-4">
          {method.image_url && (
            <div className="flex justify-center">
              <img
                src={method.image_url}
                alt={method.title}
                className="h-44 rounded-lg object-contain"
              />
            </div>
          )}

          {method.type === "UPI" && method.upi_id && (
            <CopyField label="UPI ID" value={method.upi_id} />
          )}

          {method.type === "BANK" && (
            <div className="space-y-3">
              <CopyField label="Account Name" value={method.account_name!} />
              <CopyField label="Account Number" value={method.account_number!} />
              <CopyField label="IFSC Code" value={method.ifsc!} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
