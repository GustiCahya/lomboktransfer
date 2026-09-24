import React from "react";
import PageHeader from "@/components/shared/PageHeader";
import LegalNav from "@/components/legal/LegalNav";
import MaintenanceBanner from "@/components/shared/MaintenanceBanner";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <PageHeader title="Legal & Compliance" subtitle="Kelola dokumen legal, masa berlaku, kontrak, dan kepatuhan data." />
      <LegalNav />
      <MaintenanceBanner />
      <div className="pb-8">
        {children}
      </div>
    </div>
  );
}

