/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function RevenueTable({ revenueList }: { revenueList: any[] }) {
  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tanggal</TableHead>
            <TableHead>Booking</TableHead>
            <TableHead>Tamu</TableHead>
            <TableHead>Rute</TableHead>
            <TableHead>Sumber</TableHead>
            <TableHead className="text-right">Tarif Gross</TableHead>
            <TableHead className="text-right">Komisi OTA</TableHead>
            <TableHead className="text-right">Nett</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {revenueList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                Tidak ada data pendapatan
              </TableCell>
            </TableRow>
          ) : (
            revenueList.map((item) => {
              // Calculate OTA commission logically (could be dynamic later)
              // For now, let's assume if source is OTA, commission is 20%
              let otaCommission = 0;
              if (item.source?.includes("ota") || item.source === "klook" || item.source === "viator") {
                otaCommission = item.gross_price * 0.20; // Example 20%
              }
              const nett = item.gross_price - otaCommission;

              return (
                <TableRow key={item.id}>
                  <TableCell>
                    {format(new Date(item.pickup_datetime), "dd MMM yyyy", { locale: id })}
                  </TableCell>
                  <TableCell className="font-medium">
                    <Link href={`/bookings/${item.id}`} className="text-primary hover:underline">
                      {item.booking_code}
                    </Link>
                  </TableCell>
                  <TableCell>{item.guests?.full_name || "-"}</TableCell>
                  <TableCell className="max-w-[150px] truncate" title={item.routes?.name}>
                    {item.routes?.name || "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">{item.source?.replace("_", " ")}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    Rp {item.gross_price?.toLocaleString("id-ID") || 0}
                  </TableCell>
                  <TableCell className="text-right text-destructive">
                    {otaCommission > 0 ? `-Rp ${otaCommission.toLocaleString("id-ID")}` : "-"}
                  </TableCell>
                  <TableCell className="text-right font-medium text-success">
                    Rp {nett.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.payment_status === "paid" ? "default" : "secondary"}>
                      {item.payment_status === "paid" ? "Lunas" : "Belum Lunas"}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
