"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, AlertTriangle } from "lucide-react";
import { formatRupiah } from "@/lib/utils/format";

interface IncidentLogProps {
  vehicleId: string;
}

const DUMMY_INCIDENTS = [
  { 
    id: "1", 
    date: "2026-03-15", 
    driver: "Budi Santoso", 
    description: "Terserempet motor di perempatan Cakranegara, lecet bumper depan kiri.", 
    claim_status: "approved", 
    cost: 450000, 
    status: "selesai" 
  },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function IncidentLog({ vehicleId }: IncidentLogProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-destructive" /> Riwayat Insiden & Kerusakan
        </h3>
        <Button size="sm" variant="destructive" className="gap-2"><Plus className="w-4 h-4" /> Lapor Insiden Baru</Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Supir</TableHead>
              <TableHead className="w-1/3">Deskripsi</TableHead>
              <TableHead>Klaim Asuransi</TableHead>
              <TableHead className="text-right">Biaya Perbaikan</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {DUMMY_INCIDENTS.map(inc => (
              <TableRow key={inc.id}>
                <TableCell className="font-medium">{new Date(inc.date).toLocaleDateString("id-ID")}</TableCell>
                <TableCell>{inc.driver}</TableCell>
                <TableCell className="text-sm">{inc.description}</TableCell>
                <TableCell>
                  {inc.claim_status === "approved" ? (
                    <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">Disetujui</Badge>
                  ) : (
                    <Badge variant="outline">{inc.claim_status}</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right font-medium">{formatRupiah(inc.cost)}</TableCell>
                <TableCell>
                  <Badge variant={inc.status === "selesai" ? "secondary" : "default"}>
                    {inc.status === "selesai" ? "Selesai" : "Dalam Perbaikan"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
