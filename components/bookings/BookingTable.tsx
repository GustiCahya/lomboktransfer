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
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";

interface BookingTableProps {
  search?: string;
  status?: string;
  routeId?: string;
  date?: string;
}

export default function BookingTable({ search, status, routeId, date }: BookingTableProps = {}) {
  const { fetchBookings, deleteBooking, isLoading } = useBookings();
  const [bookings, setBookings] = useState<Record<string, any>[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings().then((data) => {
      setBookings(data || []);
    });
  }, [fetchBookings]);

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Memuat data booking...</div>;
  }

  let filteredBookings = bookings;

  if (search) {
    const q = search.toLowerCase();
    filteredBookings = filteredBookings.filter(b => 
      b.booking_code?.toLowerCase().includes(q) ||
      b.guests?.full_name?.toLowerCase().includes(q)
    );
  }
  
  if (status) {
    filteredBookings = filteredBookings.filter(b => b.status === status);
  }

  if (routeId) {
    filteredBookings = filteredBookings.filter(b => b.route_id === routeId);
  }

  if (date) {
    filteredBookings = filteredBookings.filter(b => {
      if (!b.pickup_datetime) return false;
      const bDate = new Date(b.pickup_datetime).toISOString().split("T")[0];
      return bDate === date;
    });
  }

  if (filteredBookings.length === 0) {
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
            <TableHead className="text-center">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredBookings.map((booking: any) => (
            <TableRow key={booking.id}>
              <TableCell className="font-medium">
                <Link href={`/admin/bookings/${booking.id}`} className="text-primary hover:underline">
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
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Link href={`/admin/bookings/${booking.id}`}>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Detail</span>
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 gap-1 text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20"
                    disabled={deletingId === booking.id}
                    onClick={async () => {
                      if (window.confirm(`Apakah Anda yakin ingin menghapus booking ${booking.booking_code || ""}?`)) {
                        setDeletingId(booking.id);
                        try {
                          await deleteBooking(booking.id);
                          setBookings((prev) => prev.filter((b) => b.id !== booking.id));
                        } catch (err) {
                          console.error(err);
                          alert("Gagal menghapus booking.");
                        } finally {
                          setDeletingId(null);
                        }
                      }
                    }}
                    title="Hapus Booking"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Hapus</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
