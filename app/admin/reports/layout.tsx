import React from "react";
import PageHeader from "@/components/shared/PageHeader";
import ReportsNav from "@/components/reports/ReportsNav";
import MaintenanceBanner from "@/components/shared/MaintenanceBanner";

export default function ReportsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Laporan & Analitik"
        subtitle="Visualisasi data bisnis secara menyeluruh, analisis performa, dan ekspor laporan manajemen."
      />
      <ReportsNav />
      <MaintenanceBanner />
      <div className="pb-8">{children}</div>
    </div>
  );
}

