import React from "react";
import PageHeader from "@/components/shared/PageHeader";
import CRMNav from "@/components/crm/CRMNav";
import CRMMaintenanceBanner from "@/components/crm/CRMMaintenanceBanner";

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <PageHeader title="Customer Relationship Management" subtitle="Kelola database tamu, manajemen review, dan program re-engagement." />
      <CRMNav />
      <CRMMaintenanceBanner />
      <div className="pb-8">
        {children}
      </div>
    </div>
  );
}

