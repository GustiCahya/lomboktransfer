/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useRevenue } from "@/hooks/useRevenue";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { FileText, Download } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Link from "next/link";

let invoiceCounter = 1;

function generateInvoiceNumber(date: Date): string {
  const year = date.getFullYear();
  return `INV-LT-${year}-${String(invoiceCounter++).padStart(4, "0")}`;
}

export default function InvoicesPage() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const lastDay = new Date(currentYear, currentMonth, 0).getDate();
  const [startDate, setStartDate] = useState(`${currentYear}-${String(currentMonth).padStart(2, "0")}-01`);
  const [endDate, setEndDate] = useState(`${currentYear}-${String(currentMonth).padStart(2, "0")}-${lastDay}`);
  const [paymentStatus, setPaymentStatus] = useState("");

  const { revenueList, isLoading } = useRevenue({
    startDate,
    endDate,
    payment_status: paymentStatus || undefined,
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-end gap-4">
        <div className="space-y-2">
          <Label>Dari Tanggal</Label>
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-44" />
        </div>
        <div className="space-y-2">
          <Label>Hingga Tanggal</Label>
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-44" />
        </div>
        <div className="space-y-2">
          <Label>Status Pembayaran</Label>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className="flex h-9 w-40 items-center rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
          >
            <option value="">Semua</option>
            <option value="paid">Lunas</option>
            <option value="unpaid">Belum Lunas</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-32 text-muted-foreground">
          Memuat data invoice...
        </div>
      ) : (
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No. Invoice</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Tamu</TableHead>
                <TableHead>Rute</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {revenueList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    Tidak ada data invoice
                  </TableCell>
                </TableRow>
              ) : (
                revenueList.map((item: any) => {
                  const invoiceNum = generateInvoiceNumber(new Date(item.pickup_datetime));
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-mono text-sm">{invoiceNum}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(item.pickup_datetime), "dd MMM yyyy", { locale: id })}
                      </TableCell>
                      <TableCell>{item.guests?.full_name || "-"}</TableCell>
                      <TableCell className="max-w-[150px] truncate" title={item.routes?.name}>
                        {item.routes?.name || "-"}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        Rp {item.gross_price?.toLocaleString("id-ID") || 0}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={item.payment_status === "paid"
                            ? "text-green-600 border-green-600/30 bg-green-500/10"
                            : "text-orange-500 border-orange-500/30 bg-orange-500/10"}
                        >
                          {item.payment_status === "paid" ? "Lunas" : "Belum Lunas"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link
                          href={`/bookings/${item.id}`}
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          <Download className="h-3 w-3" />
                          Lihat Booking
                        </Link>
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
