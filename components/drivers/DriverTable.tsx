"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Driver } from "@/hooks/useDrivers";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatusBadge from "@/components/shared/StatusBadge";
import { StatusType } from "@/components/shared/StatusBadge";
import { Star, AlertTriangle } from "lucide-react";

interface DriverTableProps {
  drivers: Driver[];
  expiringDriverIds?: Set<string>;
}

export default function DriverTable({ drivers, expiringDriverIds = new Set() }: DriverTableProps) {
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
            <TableHead className="text-center">Rating</TableHead>
            <TableHead className="text-center">Komisi</TableHead>
            <TableHead className="text-center">Dokumen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {drivers.map((driver) => (
            <TableRow key={driver.id} className="hover:bg-muted/50">
              <TableCell>
                <Link href={`/drivers/${driver.id}`} className="flex items-center gap-3 hover:text-primary">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">
                    {driver.avatar_url ? (
                      <Image src={driver.avatar_url} alt={driver.full_name} width={36} height={36} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      driver.full_name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="font-medium">{driver.full_name}</span>
                </Link>
              </TableCell>
              <TableCell>
                <div className="text-sm">{driver.phone_wa}</div>
                {driver.email && <div className="text-xs text-muted-foreground">{driver.email}</div>}
              </TableCell>
              <TableCell>
                <StatusBadge status={driver.status as StatusType} label={driver.status === "cuti" ? "Cuti" : undefined} />
              </TableCell>
              <TableCell className="text-sm">
                {driver.employment_type === "karyawan" ? "Karyawan" : "Mitra Lepas"}
              </TableCell>
              <TableCell className="text-center">
                <span className="flex items-center justify-center gap-1 text-sm font-medium">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> 4.8
                </span>
              </TableCell>
              <TableCell className="text-center font-medium">{driver.commission_percentage}%</TableCell>
              <TableCell className="text-center">
                {expiringDriverIds.has(driver.id) ? (
                  <div title="Ada dokumen akan kadaluarsa" className="flex justify-center">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                  </div>
                ) : (
                  <span className="text-xs text-green-500 font-medium">✓ OK</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
