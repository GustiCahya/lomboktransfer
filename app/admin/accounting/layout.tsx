import React from "react";
import PageHeader from "@/components/shared/PageHeader";
import AccountingNav from "@/components/accounting/AccountingNav";

export default function AccountingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <PageHeader title="Keuangan & Akuntansi" subtitle="Kelola pendapatan, pengeluaran, payroll, dan laporan." />
      <AccountingNav />
      <div className="pb-8">
        {children}
      </div>
    </div>
  );
}
