/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";
import { useContracts } from "@/hooks/useLegal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Plus, Users, Building, Briefcase } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { id } from "date-fns/locale";

const PARTY_TYPE_LABELS: Record<string, string> = {
  driver: "Supir Mitra",
  hotel: "Hotel Partner",
  travel_agent: "Travel Agent",
  ota: "Online Travel Agent",
  other: "Lainnya"
};

const PARTY_TYPE_ICONS: Record<string, any> = {
  driver: <Users className="h-4 w-4 text-muted-foreground" />,
  hotel: <Building className="h-4 w-4 text-muted-foreground" />,
  travel_agent: <Briefcase className="h-4 w-4 text-muted-foreground" />,
  ota: <Briefcase className="h-4 w-4 text-muted-foreground" />,
  other: <Briefcase className="h-4 w-4 text-muted-foreground" />
};

export default function ContractsPage() {
  const { contracts, isLoading } = useContracts();

  const getStatusBadge = (contract: any) => {
    if (contract.status === "expired") {
      return <Badge variant="outline" className="text-destructive border-destructive/30 bg-destructive/10">Expired</Badge>;
    }
    if (contract.status === "negotiating") {
      return <Badge variant="outline" className="text-warning border-warning/30 bg-warning/10">Negosiasi</Badge>;
    }
    if (contract.status === "terminated") {
      return <Badge variant="outline" className="text-muted-foreground border-muted">Dihentikan</Badge>;
    }

    const daysLeft = differenceInDays(new Date(contract.end_date), new Date());
    if (daysLeft < 0) {
      return <Badge variant="outline" className="text-destructive border-destructive/30 bg-destructive/10">Expired</Badge>;
    }
    if (daysLeft <= 60) {
      return <Badge variant="outline" className="text-warning border-warning/30 bg-warning/10">Perlu Perpanjangan</Badge>;
    }
    return <Badge variant="outline" className="text-success border-success/30 bg-success/10">Aktif</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Manajemen Kontrak Mitra</h2>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Tambah Kontrak
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-32 text-muted-foreground">Memuat data kontrak...</div>
      ) : (
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Mitra</TableHead>
                <TableHead>Jenis Mitra</TableHead>
                <TableHead>Jenis Kontrak</TableHead>
                <TableHead>Mulai</TableHead>
                <TableHead>Berakhir s/d</TableHead>
                <TableHead>Sisa Waktu</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-32 text-muted-foreground">
                    Belum ada data kontrak.
                  </TableCell>
                </TableRow>
              ) : (
                contracts.map((contract: any) => {
                  const daysLeft = differenceInDays(new Date(contract.end_date), new Date());
                  return (
                    <TableRow key={contract.id}>
                      <TableCell className="font-medium">
                        {contract.party_name}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {PARTY_TYPE_ICONS[contract.party_type] || PARTY_TYPE_ICONS.other}
                          {PARTY_TYPE_LABELS[contract.party_type] || contract.party_type}
                        </div>
                      </TableCell>
                      <TableCell>{contract.contract_type}</TableCell>
                      <TableCell>{format(new Date(contract.start_date), "dd MMM yy", { locale: id })}</TableCell>
                      <TableCell>{format(new Date(contract.end_date), "dd MMM yy", { locale: id })}</TableCell>
                      <TableCell className="font-mono text-sm">
                        <span className={daysLeft <= 60 && daysLeft >= 0 ? "text-warning" : daysLeft < 0 ? "text-destructive" : ""}>
                          {daysLeft < 0 ? "Expired" : `${daysLeft} hari`}
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(contract)}</TableCell>
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
