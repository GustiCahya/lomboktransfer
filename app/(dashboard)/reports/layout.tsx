import React from "react";
import PageHeader from "@/components/shared/PageHeader";
import ReportsNav from "@/components/reports/ReportsNav";

export default function ReportsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Laporan & Analitik"
        subtitle="Visualisasi data bisnis secara menyeluruh, analisis performa, dan ekspor laporan manajemen."
      />
      <ReportsNav />
      <div className="pb-8">{children}</div>
    </div>
  );
}
