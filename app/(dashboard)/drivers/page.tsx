"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useDrivers } from "@/hooks/useDrivers";
import { useExpiringDocuments } from "@/hooks/useDriverDocuments";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DriverCard from "@/components/drivers/DriverCard";
import DriverTable from "@/components/drivers/DriverTable";
import { Plus, LayoutGrid, List, Search } from "lucide-react";

export default function DriversPage() {
  const [view, setView] = useState<"table" | "grid">("table");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const { drivers, isLoading } = useDrivers({
    status: statusFilter || undefined,
    employment_type: typeFilter || undefined,
    search: search || undefined,
  });

  const { documents: expiringDocs } = useExpiringDocuments(30);
  const expiringDriverIds = new Set(expiringDocs.map(d => d.driver_id));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manajemen Supir"
        subtitle="Kelola profil, dokumen, jadwal, dan performa seluruh supir armada."
        actions={
          <Link href="/drivers/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Tambah Supir
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
            placeholder="Cari nama atau nomor HP supir..."
            className="pl-9 bg-background"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="flex h-9 w-full md:w-40 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Non-aktif</option>
            <option value="cuti">Cuti</option>
          </select>

          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="flex h-9 w-full md:w-44 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="">Semua Tipe</option>
            <option value="karyawan">Karyawan</option>
            <option value="mitra_lepas">Mitra Lepas</option>
          </select>

          {/* View toggle */}
          <div className="flex items-center border rounded-md bg-background overflow-hidden">
            <Button
              variant={view === "table" ? "default" : "ghost"}
              size="icon"
              onClick={() => setView("table")}
              className="rounded-none h-9 w-9"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => setView("grid")}
              className="rounded-none h-9 w-9"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>{drivers.length} supir ditemukan</span>
        {expiringDocs.length > 0 && (
          <span className="text-amber-500 font-medium">• {expiringDocs.length} dokumen perlu perhatian</span>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="p-12 text-center text-muted-foreground">Memuat data supir...</div>
      )}

      {/* Table view */}
      {!isLoading && view === "table" && (
        <DriverTable drivers={drivers} expiringDriverIds={expiringDriverIds} />
      )}

      {/* Grid view */}
      {!isLoading && view === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {drivers.length === 0 ? (
            <div className="col-span-full p-12 text-center border rounded-lg bg-card">
              <p className="text-muted-foreground">Tidak ada supir ditemukan.</p>
            </div>
          ) : (
            drivers.map(driver => (
              <DriverCard key={driver.id} driver={driver} hasExpiringDocs={expiringDriverIds.has(driver.id)} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
