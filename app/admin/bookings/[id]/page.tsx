/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useBookings } from "@/hooks/useBookings";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BookingTimeline from "@/components/bookings/BookingTimeline";
import StatusBadge from "@/components/shared/StatusBadge";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { MapPin, User, Car, DollarSign } from "lucide-react";

export default function BookingDetailPage() {
  const { id } = useParams();
  const { fetchBooking, isLoading } = useBookings();
  const [booking, setBooking] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (id) {
      fetchBooking(id as string).then(setBooking);
    }
  }, [id, fetchBooking]);

  if (isLoading || !booking) {
    return <div className="p-12 text-center text-muted-foreground">Memuat detail booking...</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title={`Booking ${booking.booking_code}`} 
        subtitle="Detail perjalanan, informasi tamu, dan status penugasan supir."
        actions={
          <>
            <Button variant="outline" className="gap-2 text-destructive hover:bg-destructive hover:text-white border-destructive">
              Batalkan
            </Button>
            <Button className="gap-2">Edit Booking</Button>
          </>
        }
      />

      <Card className="mb-6">
        <CardContent className="pt-6">
          <BookingTimeline status={booking.status as string} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri: Info Tamu & Trip */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" /> Rute & Jadwal
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Rute</p>
                <p className="font-medium">{(booking.routes as any)?.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Waktu Jemput</p>
                <p className="font-medium">
                  {format(new Date(booking.pickup_datetime as string), "dd MMM yyyy, HH:mm", { locale: localeId })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Alamat Jemput</p>
                <p className="font-medium">{(booking.pickup_address as string) || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Alamat Antar</p>
                <p className="font-medium">{(booking.dropoff_address as string) || "-"}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-primary" /> Informasi Tamu
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nama Tamu</p>
                <p className="font-medium">{(booking.guests as any)?.full_name}</p>
                <p className="text-sm text-muted-foreground">{(booking.guests as any)?.email}</p>
                <p className="text-sm text-muted-foreground">{(booking.guests as any)?.phone_wa || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Penumpang / Bagasi</p>
                <p className="font-medium">{booking.pax_count as number} Pax / {booking.luggage_count as number} Koper</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sumber Booking</p>
                <p className="font-medium capitalize">{booking.source as string}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kolom Kanan: Supir, Harga, Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Car className="w-5 h-5 text-primary" /> Penugasan Supir
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {booking.drivers ? (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{(booking.drivers as any)?.full_name}</p>
                    <p className="text-sm text-muted-foreground">{(booking.drivers as any)?.phone_wa} • {(booking.vehicles as any)?.plate_number}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center p-4 border border-dashed rounded-md bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-2">Belum ada supir yang ditugaskan</p>
                  <Button size="sm" className="w-full">Tugaskan Supir</Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" /> Pembayaran
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Metode</span>
                <span className="font-medium uppercase">{booking.payment_method as string}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <StatusBadge status={(booking.payment_status as string || "unpaid") as import("@/components/shared/StatusBadge").StatusType} />
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                <span>Total</span>
                <span>Rp {(booking.gross_price as number)?.toLocaleString("id-ID")}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
