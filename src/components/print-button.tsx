"use client";
import { Printer } from "lucide-react";
export function PrintButton({ label = "Print or save this page" }: { label?: string }) {
  return (
    <button type="button" className="print-button" onClick={() => window.print()}>
      {label} <Printer size={17} />
    </button>
  );
}
