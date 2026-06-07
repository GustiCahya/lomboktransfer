"use client";

import React from "react";
import { useRoutes } from "@/hooks/useRoutes";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

export default function BookingFilters() {
  const { routes } = useRoutes();

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 bg-card p-4 rounded-md border shadow-sm">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Cari kode booking, nama tamu..."
          className="pl-9 w-full bg-background"
        />
      </div>
      
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Input 
            type="date" 
            className="w-full md:w-auto bg-background"
            title="Pilih tanggal jemput"
          />
        </div>

        <select
          className="flex h-9 w-full md:w-40 items-center justify-between whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Semua Status</option>
          <option value="pending">Menunggu</option>
          <option value="confirmed">Dikonfirmasi</option>
          <option value="in_progress">Berlangsung</option>
          <option value="completed">Selesai</option>
          <option value="cancelled">Batal</option>
        </select>

        <select
          className="flex h-9 w-full md:w-48 items-center justify-between whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Semua Rute</option>
          {routes.map((route) => (
            <option key={route.id} value={route.id}>
              {route.name}
            </option>
          ))}
        </select>

        <Button variant="outline" size="icon" title="Reset Filters">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
