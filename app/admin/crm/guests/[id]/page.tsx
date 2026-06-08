/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useGuest, useGuestBookings } from "@/hooks/useCRM";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Edit, User, MapPin, Phone, Mail, Globe, CalendarDays, MessageSquare, Plus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

export default function GuestProfilePage() {
  const params = useParams();
  const router = useRouter();
  const guestId = params.id as string;
  
  const { guest, isLoading: loadingGuest } = useGuest(guestId);
  const { bookings, isLoading: loadingBookings } = useGuestBookings(guestId);

  if (loadingGuest) {
    return <div className="p-6 text-center text-muted-foreground">Memuat profil tamu...</div>;
  }

  if (!guest) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-lg font-medium text-destructive mb-4">Tamu tidak ditemukan</h2>
        <Button variant="outline" onClick={() => router.push("/crm")}>Kembali ke Database</Button>
      </div>
    );
  }

  const totalSpend = bookings.reduce((sum: number, b: any) => sum + (Number(b.total_price) || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/crm")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-lg font-medium">Profil Tamu</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Plus className="h-4 w-4" /> Tambah Tag
          </Button>
          <Button className="gap-2">
            <Edit className="h-4 w-4" /> Edit Profil
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Kolom Kiri: Profil Singkat */}
        <div className="space-y-6 md:col-span-1">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-xl">{guest.full_name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{guest.nationality || "Kebangsaan belum diisi"}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {guest.guest_tags?.map((t: any, i: number) => (
                  <Badge key={i} variant="secondary">{t.tag_name}</Badge>
                ))}
                {(!guest.guest_tags || guest.guest_tags.length === 0) && (
                  <span className="text-xs text-muted-foreground italic">Belum ada tag</span>
                )}
              </div>

              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-sm">{guest.phone || "-"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-sm">{guest.email || "-"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-sm">{guest.language || "-"}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total Booking</p>
                  <p className="text-lg font-semibold">{bookings.length}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Lifetime Value</p>
                  <p className="text-lg font-semibold text-primary">{formatCurrency(totalSpend)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                Catatan Internal
              </CardTitle>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Plus className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {guest.guest_notes && guest.guest_notes.length > 0 ? (
                <div className="space-y-3">
                  {guest.guest_notes.map((note: any) => (
                    <div key={note.id} className="text-sm border-b border-border pb-2 last:border-0 last:pb-0">
                      <p>{note.note}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(note.created_at), "dd MMM yy", { locale: localeId })}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">Tidak ada catatan untuk tamu ini.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Kolom Kanan: Timeline & Bookings */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
              Riwayat Transaksi & Interaksi
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingBookings ? (
              <div className="text-center py-8 text-muted-foreground">Memuat riwayat booking...</div>
            ) : (
              <div className="rounded-md border bg-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Rute / Layanan</TableHead>
                      <TableHead>Supir</TableHead>
                      <TableHead className="text-right">Harga</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center h-32 text-muted-foreground">
                          Belum ada riwayat booking untuk tamu ini.
                        </TableCell>
                      </TableRow>
                    ) : (
                      bookings.map((b: any) => (
                        <TableRow key={b.id}>
                          <TableCell className="text-sm">
                            {format(new Date(b.pickup_datetime), "dd MMM yyyy", { locale: localeId })}
                            <div className="text-xs text-muted-foreground">
                              {format(new Date(b.pickup_datetime), "HH:mm")}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 font-medium">
                              <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                              {b.routes?.name || "Custom Route"}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {b.source}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            {b.drivers?.full_name || "-"}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(b.total_price)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={
                              b.status === "completed" ? "text-success border-success/30 bg-success/10" :
                              b.status === "cancelled" ? "text-destructive border-destructive/30 bg-destructive/10" :
                              "text-warning border-warning/30 bg-warning/10"
                            }>
                              {b.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
