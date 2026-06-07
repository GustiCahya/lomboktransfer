/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import { useExpiryTracker } from "@/hooks/useLegal";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, ShieldAlert, CheckCircle2 } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { id } from "date-fns/locale";

export default function ExpiryTrackerPage() {
  const [threshold, setThreshold] = useState(60);
  const { expiringItems, isLoading } = useExpiryTracker(threshold);

  const { companyDocs, contracts } = expiringItems;
  
  // Nanti jika ada integrasi dengan vehicle docs dan driver docs (SIM/STNK) bisa digabung di sini
  // const allExpiring = [...companyDocs, ...contracts, ...vehicleDocs, ...driverDocs]
  // Untuk mockup, kita gabung dari companyDocs & contracts saja:
  
  const allExpiring = [
    ...companyDocs.map((d: any) => ({ ...d, _type: "Dokumen Perusahaan", _ref: d.name, _date: d.expiry_date })),
    ...contracts.map((c: any) => ({ ...c, _type: "Kontrak Mitra", _ref: `${c.party_name} (${c.contract_type})`, _date: c.end_date })),
  ].sort((a, b) => new Date(a._date).getTime() - new Date(b._date).getTime());

  const getDaysLeft = (expiryDate: string) => {
    const days = differenceInDays(new Date(expiryDate), new Date());
    return days;
  };

  const getStatusConfig = (days: number) => {
    if (days < 0) return { label: "Expired", className: "bg-destructive/10 text-destructive border-destructive/30" };
    if (days <= 30) return { label: "Kritis (H-30)", className: "bg-destructive/10 text-destructive border-destructive/30" };
    if (days <= 60) return { label: "Warning (H-60)", className: "bg-warning/10 text-warning border-warning/30" };
    return { label: "Aman", className: "bg-success/10 text-success border-success/30" };
  };

  const expiredCount = allExpiring.filter((i) => getDaysLeft(i._date) < 0).length;
  const criticalCount = allExpiring.filter((i) => {
    const d = getDaysLeft(i._date);
    return d >= 0 && d <= 30;
  }).length;
  const warningCount = allExpiring.filter((i) => {
    const d = getDaysLeft(i._date);
    return d > 30 && d <= 60;
  }).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Expiry Tracker Konsolidasi</h2>
        <div className="flex items-center gap-2">
          <label className="text-sm">Filter:</label>
          <select 
            value={threshold} 
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="flex h-9 w-40 items-center rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
          >
            <option value={30}>Expire dalam 30 Hari</option>
            <option value={60}>Expire dalam 60 Hari</option>
            <option value={90}>Expire dalam 90 Hari</option>
            <option value={365}>Tampilkan Semua (1 Tahun)</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                <ShieldAlert className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Sudah Expired</p>
                <p className="text-xl font-bold text-destructive">{expiredCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Kritis (&le; 30 Hari)</p>
                <p className="text-xl font-bold text-destructive">{criticalCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/10">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Warning (&le; 60 Hari)</p>
                <p className="text-xl font-bold text-warning">{warningCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Semua Aman</p>
                <p className="text-xl font-bold text-success">
                  {allExpiring.length === 0 ? "Ya" : "Perlu Aksi"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-32 text-muted-foreground">Memuat data expiry...</div>
      ) : (
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kategori</TableHead>
                <TableHead>Referensi Dokumen</TableHead>
                <TableHead>Tanggal Berlaku</TableHead>
                <TableHead>Sisa Waktu</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allExpiring.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-32 text-muted-foreground">
                    Tidak ada dokumen yang akan expired dalam {threshold} hari ke depan.
                  </TableCell>
                </TableRow>
              ) : (
                allExpiring.map((item, i) => {
                  const daysLeft = getDaysLeft(item._date);
                  const statusCfg = getStatusConfig(daysLeft);
                  return (
                    <TableRow key={i}>
                      <TableCell>
                        <Badge variant="secondary" className="font-normal">{item._type}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{item._ref}</TableCell>
                      <TableCell>
                        {format(new Date(item._date), "dd MMM yyyy", { locale: id })}
                      </TableCell>
                      <TableCell className="font-mono">
                        {daysLeft < 0 ? "Expired" : `${daysLeft} hari`}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusCfg.className}>
                          {statusCfg.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <a href="#" className="text-xs text-primary hover:underline">Lihat Detail</a>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
