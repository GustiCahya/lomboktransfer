"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Driver, useDeleteDriver } from "@/hooks/useDrivers";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatusBadge from "@/components/shared/StatusBadge";
import { StatusType } from "@/components/shared/StatusBadge";
import { Star, AlertTriangle, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DriverTableProps {
  drivers: Driver[];
  expiringDriverIds?: Set<string>;
  onRefetch?: () => void;
}

export default function DriverTable({ drivers, expiringDriverIds = new Set(), onRefetch }: DriverTableProps) {
  const { deleteDriver } = useDeleteDriver();
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Yakin ingin menghapus supir ${name}?`)) return;
    setDeletingId(id);
    try {
      await deleteDriver(id);
      if (onRefetch) onRefetch();
    } catch (e) {
      alert("Gagal menghapus supir");
    } finally {
      setDeletingId(null);
    }
  };

  if (drivers.length === 0) {
    return (
      <div className="p-12 text-center border rounded-lg bg-card">
        <p className="text-muted-foreground">Tidak ada supir ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Supir</TableHead>
            <TableHead>Kontak</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tipe</TableHead>
            <TableHead className="text-center">Skema Fee</TableHead>
            <TableHead className="text-center">Dokumen</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {drivers.map((driver) => {
            let feeDisplay = `${driver.commission_pct ?? 0}%`;
            if (driver.fee_type === "fixed") {
              feeDisplay = `Rp ${Number(driver.fixed_fee || 0).toLocaleString("id-ID")} / trip`;
            } else if (driver.fee_type === "daily") {
              feeDisplay = `Rp ${Number(driver.daily_fee || 0).toLocaleString("id-ID")} / hari`;
            }

            return (
              <TableRow key={driver.id} className="hover:bg-muted/50">
                <TableCell>
                  <Link href={`/admin/drivers/${driver.id}`} className="flex items-center gap-3 hover:text-primary">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">
                      {driver.full_name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium">{driver.full_name}</span>
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{driver.phone_wa}</div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={driver.status as StatusType} label={driver.status === "cuti" ? "Cuti" : undefined} />
                </TableCell>
                <TableCell className="text-sm">
                  {driver.driver_type === "karyawan" ? "Karyawan" : "Mitra Lepas"}
                </TableCell>
                <TableCell className="text-center font-medium text-sm">
                  {feeDisplay}
                </TableCell>
                <TableCell className="text-center">
                  {expiringDriverIds.has(driver.id) ? (
                    <div title="Ada dokumen akan kadaluarsa" className="flex justify-center">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    </div>
                  ) : (
                    <span className="text-xs text-green-500 font-medium">✓ OK</span>
                  )}
                </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-3">
                  <Link href={`/admin/drivers/${driver.id}/edit`} className="text-primary hover:underline text-sm font-medium">
                    Edit
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleDelete(driver.id, driver.full_name)}
                    disabled={deletingId === driver.id}
                  >
                    {deletingId === driver.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
        </TableBody>
      </Table>
    </div>
  );
}
