"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useVehicle } from "@/hooks/useVehicles";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import VehicleIdentity from "@/components/fleet/VehicleIdentity";
import VehicleDocuments from "@/components/fleet/VehicleDocuments";
import ServiceHistory from "@/components/fleet/ServiceHistory";
import UsageLog from "@/components/fleet/UsageLog";
import IncidentLog from "@/components/fleet/IncidentLog";
import OperationalCost from "@/components/fleet/OperationalCost";
import { Car, FileText, Wrench, BarChart2, AlertTriangle, Banknote, Edit } from "lucide-react";

const TABS = [
  { id: "identity", label: "Identitas Unit", icon: Car },
  { id: "documents", label: "Dokumen", icon: FileText },
  { id: "services", label: "Riwayat Servis", icon: Wrench },
  { id: "usage", label: "Log Penggunaan", icon: BarChart2 },
  { id: "incidents", label: "Insiden", icon: AlertTriangle },
  { id: "costs", label: "Biaya Operasional", icon: Banknote },
];

export default function VehicleDetailPage() {
  const { id } = useParams();
  const vehicleId = id as string;
  const { vehicle, isLoading } = useVehicle(vehicleId);
  const [activeTab, setActiveTab] = useState("identity");

  if (isLoading) return <div className="p-12 text-center text-muted-foreground">Memuat detail kendaraan...</div>;
  if (!vehicle) return <div className="p-12 text-center text-destructive">Kendaraan tidak ditemukan.</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${vehicle.brand} ${vehicle.model} - ${vehicle.unit_code}`}
        subtitle={`Plat: ${vehicle.plate_number} • Tahun: ${vehicle.year} • Kapasitas: ${vehicle.capacity} Pax`}
        actions={
          <Link href={`/fleet/${vehicleId}/edit`}>
            <Button className="gap-2"><Edit className="w-4 h-4" /> Edit Unit</Button>
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
        {activeTab === "identity" && <VehicleIdentity vehicle={vehicle} />}
        {activeTab === "documents" && <VehicleDocuments vehicleId={vehicleId} />}
        {activeTab === "services" && <ServiceHistory vehicle={vehicle} />}
        {activeTab === "usage" && <UsageLog vehicleId={vehicleId} />}
        {activeTab === "incidents" && <IncidentLog vehicleId={vehicleId} />}
        {activeTab === "costs" && <OperationalCost vehicleId={vehicleId} />}
      </div>
    </div>
  );
}
