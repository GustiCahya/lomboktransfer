/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useGuests } from "@/hooks/useCRM";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Download, Search, User } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function CRMPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const { guests, isLoading } = useGuests({
    search: search ? search : undefined,
    status: statusFilter ? statusFilter : undefined
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari tamu..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select 
            className="flex h-10 w-[150px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="dormant">Dormant (&gt;6 bln)</option>
          </select>
        </div>
        <Button variant="outline" className="gap-2 shrink-0">
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-32 text-muted-foreground">Memuat database tamu...</div>
      ) : (
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Tamu</TableHead>
                <TableHead>Kontak</TableHead>
                <TableHead>Negara / Bhs</TableHead>
                <TableHead className="text-center">Total Booking</TableHead>
                <TableHead className="text-right">Nilai Transaksi</TableHead>
                <TableHead>Terakhir Booking</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center h-32 text-muted-foreground">
                    Tidak ada data tamu yang ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                guests.map((g: any) => (
                  <TableRow key={g.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {g.full_name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{g.phone || "-"}</p>
                        <p className="text-muted-foreground text-xs">{g.email || ""}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{g.nationality || "-"}</p>
                        <p className="text-muted-foreground text-xs">{g.language || "-"}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {g.totalBookings}
                    </TableCell>
                    <TableCell className="text-right font-medium text-primary">
                      {formatCurrency(g.totalSpend)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {g.lastBookingDate ? format(new Date(g.lastBookingDate), "dd MMM yyyy", { locale: id }) : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={g.status === "active" ? "text-success border-success/30 bg-success/10" : "text-muted-foreground"}>
                        {g.status === "active" ? "Aktif" : "Dormant"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/crm/guests/${g.id}`}>
                        <Button variant="ghost" size="sm">Profil</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
