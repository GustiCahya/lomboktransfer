/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import Link from "next/link";
import { useHotelPartners } from "@/hooks/useVendors";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Plus, Hotel, Target } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function HotelPartnersPage() {
  const { partners, isLoading } = useHotelPartners();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="outline" className="text-success border-success/30 bg-success/10">Aktif</Badge>;
      case "negotiating":
        return <Badge variant="outline" className="text-warning border-warning/30 bg-warning/10">Dalam Negosiasi</Badge>;
      case "inactive":
        return <Badge variant="outline" className="text-muted-foreground border-muted">Non-aktif</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Hotel & Travel Partner</h2>
        <Link href="/admin/vendors/partners/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Tambah Partner
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Hotel className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Total Partner Aktif</h3>
          </div>
          <p className="mt-4 text-3xl font-bold">{partners.filter((p: any) => p.partnership_status === "active").length}</p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-warning" />
            <h3 className="font-medium">Dalam Negosiasi</h3>
          </div>
          <p className="mt-4 text-3xl font-bold">{partners.filter((p: any) => p.partnership_status === "negotiating").length}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-32 text-muted-foreground">Memuat data partner...</div>
      ) : (
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Partner</TableHead>
                <TableHead>Kontak Reservasi</TableHead>
                <TableHead>Komisi / Referral</TableHead>
                <TableHead>Total Booking</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {partners.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-32 text-muted-foreground">
                    Belum ada hotel / travel partner.
                  </TableCell>
                </TableRow>
              ) : (
                partners.map((partner: any) => (
                  <TableRow key={partner.id}>
                    <TableCell className="font-medium">
                      {partner.vendors?.name || "Unknown"}
                      <div className="text-xs text-muted-foreground mt-0.5">{partner.vendors?.category}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{partner.vendors?.pic_name || "-"}</p>
                        <p className="text-muted-foreground text-xs">{partner.vendors?.phone || partner.vendors?.email || ""}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {partner.commission_rate ? `${partner.commission_rate}%` : 
                       partner.commission_fixed ? formatCurrency(partner.commission_fixed) : "-"}
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground">-</span> {/* TODO: integrasi dgn tabel bookings */}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(partner.partnership_status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Detail</Button>
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
