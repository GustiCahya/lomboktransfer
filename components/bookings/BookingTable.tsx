/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useBookings } from "@/hooks/useBookings";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import StatusBadge from "@/components/shared/StatusBadge";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function BookingTable() {
  const { fetchBookings, isLoading } = useBookings();
  const [bookings, setBookings] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    fetchBookings().then((data) => {
      setBookings(data || []);
    });
  }, [fetchBookings]);

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Memuat data booking...</div>;
  }

  if (bookings.length === 0) {
    return (
      <div className="p-12 text-center border rounded-lg bg-card mt-4">
        <h3 className="text-lg font-medium text-card-foreground">Belum ada booking</h3>
        <p className="text-muted-foreground mt-2">Buat booking baru untuk melihat daftar di sini.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Kode Booking</TableHead>
            <TableHead>Tamu</TableHead>
            <TableHead>Rute</TableHead>
            <TableHead>Waktu Jemput</TableHead>
            <TableHead>Supir</TableHead>
            <TableHead>Sumber</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Harga</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking: any) => (
            <TableRow key={booking.id}>
              <TableCell className="font-medium">
                <Link href={`/bookings/${booking.id}`} className="text-primary hover:underline">
                  {booking.booking_code}
                </Link>
              </TableCell>
              <TableCell>
                <div>{booking.guests?.full_name || "-"}</div>
                <div className="text-xs text-muted-foreground">{booking.guests?.nationality || "-"}</div>
              </TableCell>
              <TableCell className="max-w-[200px] truncate" title={booking.routes?.name}>
                {booking.routes?.name || "-"}
              </TableCell>
              <TableCell>
                <div>{format(new Date(booking.pickup_datetime), "dd MMM yyyy", { locale: id })}</div>
                <div className="text-xs text-muted-foreground">{format(new Date(booking.pickup_datetime), "HH:mm")}</div>
              </TableCell>
              <TableCell>{booking.drivers?.full_name || <span className="text-muted-foreground italic">Belum assign</span>}</TableCell>
              <TableCell className="capitalize">{booking.source}</TableCell>
              <TableCell>
                <StatusBadge status={booking.status} />
              </TableCell>
              <TableCell className="text-right font-medium">
                Rp {booking.gross_price.toLocaleString("id-ID")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
