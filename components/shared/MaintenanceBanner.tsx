import React from "react";
import { Wrench } from "lucide-react";

interface MaintenanceBannerProps {
  title?: string;
  message?: string;
  className?: string;
}

export default function MaintenanceBanner({
  title = "Modul Dalam Pemeliharaan (Under Maintenance)",
  message = "Fitur ini sedang dalam tahap pengujian & sinkronisasi data. Seluruh tampilan di bawah dapat diakses sebagai pratinjau.",
  className = "",
}: MaintenanceBannerProps) {
  return (
    <div
      className={`rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-800 dark:text-amber-200 flex items-center gap-3 ${className}`}
    >
      <Wrench className="h-5 w-5 text-amber-500 shrink-0" />
      <div>
        <h4 className="font-semibold text-sm">{title}</h4>
        <p className="text-xs opacity-90">{message}</p>
      </div>
    </div>
  );
}
