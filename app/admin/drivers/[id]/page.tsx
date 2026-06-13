"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useDriver, Driver } from "@/hooks/useDrivers";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import DriverProfile from "@/components/drivers/DriverProfile";
import DocumentsTab from "@/components/drivers/DocumentsTab";
import TripHistoryTab from "@/components/drivers/TripHistoryTab";
import PerformanceTab from "@/components/drivers/PerformanceTab";
import PayrollTab from "@/components/drivers/PayrollTab";
import { User, FileText, Car, BarChart2, Banknote, Edit } from "lucide-react";

const TABS = [
  { id: "info", label: "Informasi Pribadi", icon: User },
  { id: "documents", label: "Dokumen", icon: FileText },
  { id: "trips", label: "Riwayat Trip", icon: Car },
  { id: "performance", label: "Performa", icon: BarChart2 },
  { id: "payroll", label: "Payroll", icon: Banknote },
];

export default function DriverDetailPage() {
  const { id } = useParams();
  const driverId = id as string;
  const { driver, isLoading } = useDriver(driverId);
  const [activeTab, setActiveTab] = useState("info");

  if (isLoading) return <div className="p-12 text-center text-muted-foreground">Memuat profil supir...</div>;
  if (!driver) return <div className="p-12 text-center text-destructive">Supir tidak ditemukan.</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        title={driver.full_name}
        subtitle={`ID: ${driver.id.slice(0, 8).toUpperCase()} • ${driver.employment_type === "karyawan" ? "Karyawan Tetap" : "Mitra Lepas"}`}
        actions={
          <Link href={`/drivers/${driverId}/edit`}>
            <Button className="gap-2"><Edit className="w-4 h-4" /> Edit</Button>
          </Link>
        }
      />

      {/* Tab navigation */}
      <div className="border-b flex overflow-x-auto scrollbar-hide gap-0">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "info" && <DriverProfile driver={driver as Driver & { vehicles?: { brand: string; model: string; plate_number: string } }} />}
        {activeTab === "documents" && <DocumentsTab driverId={driverId} />}
        {activeTab === "trips" && <TripHistoryTab driverId={driverId} />}
        {activeTab === "performance" && <PerformanceTab driverId={driverId} />}
        {activeTab === "payroll" && <PayrollTab driverId={driverId} />}
      </div>
    </div>
  );
}
