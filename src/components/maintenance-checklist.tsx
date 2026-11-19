"use client";
import { useState } from "react";
import { Printer } from "lucide-react";
export function MaintenanceChecklist({ items }: { items: string[] }) {
  const [checked, setChecked] = useState<string[]>([]);
  return (
    <div className="checklist">
      <p className="checklist-count">
        {checked.length} of {items.length} completed in this session
      </p>
      {items.map((item) => (
        <label key={item}>
          <input
            type="checkbox"
            checked={checked.includes(item)}
            onChange={(e) =>
              setChecked(
                e.target.checked ? [...checked, item] : checked.filter((value) => value !== item),
              )
            }
          />
          <span>{item}</span>
        </label>
      ))}
      <button type="button" className="print-button" onClick={() => window.print()}>
        Print checklist <Printer size={17} />
      </button>
    </div>
  );
}
