"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useVehicles } from "@/hooks/useVehicles";
import { useExpiringVehicleDocs } from "@/hooks/useVehicleDocuments";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import VehicleCard from "@/components/fleet/VehicleCard";
import VehicleTable from "@/components/fleet/VehicleTable";
import { Plus, LayoutGrid, List, Search } from "lucide-react";

export default function FleetPage() {
  const [view, setView] = useState<"table" | "grid">("grid");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { vehicles, isLoading } = useVehicles({
    status: statusFilter || undefined,
    search: search || undefined,
  });

  const { documents: expiringDocs } = useExpiringVehicleDocs(30);
  const expiringVehicleIds = new Set(expiringDocs.map(d => d.vehicle_id));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manajemen Armada"
        subtitle="Kelola inventaris kendaraan, pantau jadwal servis, dan dokumen."
        actions={
          <Link href="/admin/fleet/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Tambah Kendaraan
            </Button>
          </Link>
        }
      />

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-card p-4 rounded-md border shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari kode unit atau plat nomor..."
            className="pl-9 bg-background"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="flex h-9 w-full md:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="maintenance">Dalam Perawatan</option>
            <option value="inactive">Tidak Aktif</option>
            <option value="sold">Terjual</option>
          </select>

          {/* View toggle */}
          <div className="flex items-center border rounded-md bg-background overflow-hidden">
            <Button
              variant={view === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => setView("grid")}
              className="rounded-none h-9 w-9"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "table" ? "default" : "ghost"}
              size="icon"
              onClick={() => setView("table")}
              className="rounded-none h-9 w-9"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>{vehicles.length} kendaraan ditemukan</span>
        {expiringDocs.length > 0 && (
          <span className="text-amber-500 font-medium">• {expiringDocs.length} dokumen perlu diperbarui</span>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="p-12 text-center text-muted-foreground">Memuat data armada...</div>
      )}

      {/* Table view */}
      {!isLoading && view === "table" && (
        <VehicleTable vehicles={vehicles} />
      )}

      {/* Grid view */}
      {!isLoading && view === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {vehicles.length === 0 ? (
            <div className="col-span-full p-12 text-center border rounded-lg bg-card">
              <p className="text-muted-foreground">Tidak ada kendaraan ditemukan.</p>
            </div>
          ) : (
            vehicles.map(vehicle => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} hasAlert={expiringVehicleIds.has(vehicle.id)} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
