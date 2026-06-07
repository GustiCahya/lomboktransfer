/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";

export default function TodayBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchTodayBookings = async () => {
      setIsLoading(true);
      const todayStr = new Date().toLocaleDateString('sv-SE');
      const startOfToday = `${todayStr}T00:00:00.000Z`;
      const endOfToday = `${todayStr}T23:59:59.999Z`;

      const { data } = await supabase
        .from("bookings")
        .select("*, guests(full_name), routes(name), drivers(full_name)")
        .gte("pickup_datetime", startOfToday)
        .lte("pickup_datetime", endOfToday)
        .order("pickup_datetime", { ascending: true })
        .limit(5);
        
      setBookings(data || []);
      setIsLoading(false);
    };

    fetchTodayBookings();

    const channel = supabase
      .channel('today_bookings_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
        fetchTodayBookings();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  if (isLoading) {
    return <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">Memuat booking hari ini...</div>;
  }

  if (bookings.length === 0) {
    return (
      <div className="h-[200px] flex flex-col items-center justify-center border border-dashed rounded-md bg-muted/20">
        <p className="text-muted-foreground text-sm mb-4">Tidak ada jadwal keberangkatan untuk hari ini.</p>
        <Link href="/bookings/new"><Button size="sm">Buat Booking</Button></Link>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Jam</TableHead>
            <TableHead>Tamu</TableHead>
            <TableHead>Rute</TableHead>
            <TableHead>Supir</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map(booking => (
            <TableRow key={booking.id}>
              <TableCell className="font-medium">
                {new Date(booking.pickup_datetime).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}
              </TableCell>
              <TableCell className="text-sm">{(booking.guests as any)?.full_name || "-"}</TableCell>
              <TableCell className="text-sm max-w-[150px] truncate" title={(booking.routes as any)?.name}>
                {(booking.routes as any)?.name || "-"}
              </TableCell>
              <TableCell className="text-sm">
                {(booking.drivers as any)?.full_name || <span className="text-muted-foreground italic">Pending</span>}
              </TableCell>
              <TableCell><StatusBadge status={booking.status} /></TableCell>
              <TableCell className="text-right">
                <Link href={`/bookings/${booking.id}`}>
                  <Button size="sm" variant="ghost">Detail</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
