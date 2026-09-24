import React from "react";
import PageHeader from "@/components/shared/PageHeader";
import VendorNav from "@/components/vendors/VendorNav";
import MaintenanceBanner from "@/components/shared/MaintenanceBanner";

export default function VendorsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <PageHeader title="Vendor & Procurement" subtitle="Kelola direktori vendor, mitra hotel, dan persetujuan pengeluaran (PO)." />
      <VendorNav />
      <MaintenanceBanner />
      <div className="pb-8">
        {children}
      </div>
    </div>
  );
}

