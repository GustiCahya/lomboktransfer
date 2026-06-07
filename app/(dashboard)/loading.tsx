import React from "react";
import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full gap-4 text-muted-foreground animate-fade-in">
      <div className="relative flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <div className="absolute inset-0 h-10 w-10 rounded-full border-2 border-primary/20 animate-pulse" />
      </div>
      <p className="text-sm font-medium tracking-wide">Memuat halaman...</p>
    </div>
  );
}
