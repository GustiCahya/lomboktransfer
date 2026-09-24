/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useBookings } from "@/hooks/useBookings";
import { createClient } from "@/lib/supabase/client";
import PageHeader from "@/components/shared/PageHeader";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BookingTimeline from "@/components/bookings/BookingTimeline";
import StatusBadge from "@/components/shared/StatusBadge";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
  MapPin, User, Car, Banknote, Printer, MessageCircle,
  ChevronRight, Clock, ListOrdered, CheckCircle, XCircle,
  Edit, AlertTriangle, RotateCcw, Trash2
} from "lucide-react";
import AssignDriverModal from "@/components/bookings/AssignDriverModal";
import Link from "next/link";

// Status flow: pending → confirmed → in_progress → completed
const STATUS_FLOW: Record<string, { next: string; label: string } | null> = {
  pending:        { next: "confirmed",    label: "Konfirmasi Booking" },
  confirmed:      { next: "in_progress",  label: "Mulai Perjalanan" },
  driver_assigned:{ next: "in_progress",  label: "Mulai Perjalanan" },
  in_progress:    { next: "completed",    label: "Selesaikan Booking" },
  completed:      null,
  cancelled:      null,
};

const getRevertAction = (status: string, hasDriver: boolean) => {
  switch (status) {
    case "confirmed": return { prev: "pending", label: "Kembali ke Pending" };
    case "driver_assigned": return { prev: "confirmed", label: "Batal Penugasan" };
    case "in_progress": return { prev: hasDriver ? "driver_assigned" : "confirmed", label: "Batal Mulai" };
    case "completed": return { prev: "in_progress", label: "Batal Selesai" };
    case "cancelled": return { prev: "pending", label: "Pulihkan Booking" };
    default: return null;
  }
};

const PAYMENT_STATUS_NEXT: Record<string, { next: string; label: string } | null> = {
  unpaid:           { next: "deposit_received", label: "Tandai Deposit Diterima" },
  deposit_received: { next: "paid",              label: "Tandai Lunas" },
  paid:             null,
};

export default function BookingDetailPage() {
  const { id } = useParams();
  const { fetchBooking, updateBooking, deleteBooking, isLoading } = useBookings();
  const [booking, setBooking] = useState<Record<string, unknown> | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const router = useRouter();

  const handleRefresh = useCallback(() => {
    if (id) {
      fetchBooking(id as string).then(setBooking);
    }
  }, [id, fetchBooking]);

  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  const handleCancel = async () => {
    if (!window.confirm("Apakah Anda yakin ingin membatalkan booking ini?")) return;
    setIsCancelling(true);
    try {
      await updateBooking(id as string, { status: "cancelled" });
      handleRefresh();
    } catch (err) {
      console.error(err);
      alert("Gagal membatalkan booking.");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Peringatan: Apakah Anda yakin ingin menghapus permanen data booking ini? Aksi ini tidak dapat dibatalkan!")) return;
    setIsCancelling(true);
    try {
      await deleteBooking(id as string);
      router.push("/admin/bookings");
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus booking.");
      setIsCancelling(false);
    }
  };

  const handleAdvanceStatus = async () => {
    const currentStatus = booking?.status as string;
    const next = STATUS_FLOW[currentStatus];
    if (!next) return;
    
    let confirmMessage = `Ubah status ke "${next.label}"?`;
    if (next.next === "completed") {
      confirmMessage = `Menyelesaikan booking ini juga akan otomatis menandai tagihan sebagai "Lunas" (Paid). Anda yakin ingin melanjutkan?`;
    }
    
    if (!window.confirm(confirmMessage)) return;
    setIsUpdatingStatus(true);
    try {
      const updates: Record<string, any> = { status: next.next };
      if (next.next === "completed") {
        updates.payment_status = "paid";
      }
      await updateBooking(id as string, updates);
      
      // Auto-insert driver fee expense if booking is completed
      if (next.next === "completed" && booking?.driver_id) {
        const feeType = (booking.drivers as any)?.fee_type || "percentage";
        let driverFee = 0;
        
        if (feeType === "fixed") {
          const trips = (booking.booking_trips as any[]) || [];
          const tripsCount = trips.length > 0 ? trips.length : 1;
          driverFee = ((booking.drivers as any)?.fixed_fee || 0) * tripsCount;
        } else if (feeType === "daily") {
          const dailyFee = (booking.drivers as any)?.daily_fee || 0;
          const trips = (booking.booking_trips as any[]) || [];
          let uniqueDays = 1;
          
          if (trips.length > 0) {
            uniqueDays = new Set(trips.map(t => {
              const d = new Date(t.trip_date || t.pickup_time);
              return !isNaN(d.getTime()) ? d.toISOString().split('T')[0] : null;
            }).filter(Boolean)).size || 1;
          }
          
          driverFee = dailyFee * uniqueDays;
        } else {
          const commissionPct = (booking.drivers as any)?.commission_pct || 60;
          driverFee = (booking.gross_price as number || 0) * (commissionPct / 100);
        }
        
        const descriptionMatch = `Fee Supir%Booking ${booking.booking_code}`;
        
        const supabase = createClient();
        
        // Cek duplicate
        const { data: existing } = await supabase
          .from("expenses")
          .select("id")
          .ilike("description", descriptionMatch)
          .maybeSingle();
          
        if (!existing) {
          await supabase.from("expenses").insert({
            expense_date: new Date().toISOString().split("T")[0],
            category: "commission",
            description: `Fee Supir (${(booking.drivers as any)?.full_name || "Tanpa Nama"}) - Booking ${booking.booking_code}`,
            amount: driverFee,
            payment_method: "cash",
            notes: "Otomatis digenerate saat booking diselesaikan."
          });
        }
      }
      
      handleRefresh();
    } catch (err) {
      console.error(err);
      alert("Gagal mengubah status.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleRevertStatus = async () => {
    const currentStatus = booking?.status as string;
    const revert = getRevertAction(currentStatus, !!booking?.driver_id);
    if (!revert) return;
    
    if (!window.confirm(`Anda yakin ingin ${revert.label.toLowerCase()} dan mengembalikan status ke "${revert.prev}"?`)) return;
    setIsUpdatingStatus(true);
    try {
      await updateBooking(id as string, { status: revert.prev });
      handleRefresh();
    } catch (err) {
      console.error(err);
      alert("Gagal membalikkan status.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleAdvancePayment = async () => {
    const currentPay = (booking?.payment_status as string) || "unpaid";
    const next = PAYMENT_STATUS_NEXT[currentPay];
    if (!next) return;
    setIsUpdatingStatus(true);
    try {
      await updateBooking(id as string, { payment_status: next.next });
      handleRefresh();
    } catch (err) {
      console.error(err);
      alert("Gagal mengubah status pembayaran.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (isLoading || !booking) {
    return <div className="p-12 text-center text-muted-foreground">Memuat detail booking...</div>;
  }

  const currentStatus = booking.status as string;
  const nextStatusAction = STATUS_FLOW[currentStatus];
  const revertAction = getRevertAction(currentStatus, !!booking.driver_id);
  const currentPayStatus = (booking.payment_status as string) || "unpaid";
  const nextPayAction = PAYMENT_STATUS_NEXT[currentPayStatus];
  const trips = (booking.booking_trips as any[]) || [];
  const waNumber = (booking.guests as any)?.phone_wa;
  const waMessage = waNumber
    ? `https://wa.me/${waNumber.replace(/^0/, "62").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hello, we have received the confirmation for your booking ${booking.booking_code}. Thank you!`)}`
    : null;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Booking ${booking.booking_code}`}
        subtitle="Detail perjalanan, informasi tamu, dan status penugasan supir."
        actions={
          <>
            {/* WhatsApp shortcut */}
            {waMessage && (
              <a
                href={waMessage}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "gap-2 text-green-600 hover:bg-green-50 border-green-300"
                )}
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
            )}
            {/* Receipt */}
            <Link
              href={`/admin/bookings/${id}/receipt`}
              className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
            >
              <Printer className="w-4 h-4" /> Kwitansi
            </Link>
            {/* Batalkan */}
            <Button
              variant="outline"
              className="gap-2 text-warning hover:bg-warning hover:text-white border-warning"
              onClick={handleCancel}
              disabled={isCancelling || booking.status === "cancelled" || booking.status === "completed"}
            >
              {isCancelling ? "Membatalkan..." : <><XCircle className="w-4 h-4" /> Batalkan</>}
            </Button>
            {/* Edit */}
            <Button
              className="gap-2"
              onClick={() => router.push(`/admin/bookings/${id}/edit`)}
              disabled={booking.status === "cancelled" || booking.status === "completed"}
            >
              <Edit className="w-4 h-4" /> Edit Booking
            </Button>
          </>
        }
      />

      {/* Timeline Status */}
      <Card>
        <CardContent className="pt-6 pb-8">
          <BookingTimeline status={booking.status as string} />
        </CardContent>
        {/* Advance status banner */}
        {(nextStatusAction || revertAction) && currentStatus !== "completed" && currentStatus !== "cancelled" && (
          <div className="border-t px-6 py-3 bg-muted/30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>
                {nextStatusAction ? (
                  <>Langkah berikutnya: <span className="font-medium text-foreground">{nextStatusAction.label}</span></>
                ) : (
                  <>Status saat ini: <span className="font-medium text-foreground">{currentStatus}</span></>
                )}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {revertAction && (
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5"
                  onClick={handleRevertStatus}
                  disabled={isUpdatingStatus}
                >
                  <RotateCcw className="w-3.5 h-3.5" /> {revertAction.label}
                </Button>
              )}
              {nextStatusAction && (
                <Button
                  size="sm"
                  className="gap-1.5"
                  onClick={handleAdvanceStatus}
                  disabled={isUpdatingStatus}
                >
                  {nextStatusAction.label} <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          </div>
        )}
        {currentStatus === "completed" && (
          <div className="border-t px-6 py-3 bg-green-50 dark:bg-green-950/30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400 text-sm">
              <CheckCircle className="w-4 h-4" /> Booking telah selesai
            </div>
            {revertAction && (
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 border-green-200 text-green-700 hover:bg-green-100 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/50"
                onClick={handleRevertStatus}
                disabled={isUpdatingStatus}
              >
                <RotateCcw className="w-3.5 h-3.5" /> {revertAction.label}
              </Button>
            )}
          </div>
        )}
        {currentStatus === "cancelled" && (
          <div className="border-t px-6 py-3 bg-destructive/10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertTriangle className="w-4 h-4" /> Booking telah dibatalkan
            </div>
            {revertAction && (
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 border-red-200 text-red-700 hover:bg-red-100 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/50"
                onClick={handleRevertStatus}
                disabled={isUpdatingStatus}
              >
                <RotateCcw className="w-3.5 h-3.5" /> {revertAction.label}
              </Button>
            )}
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri: Info Tamu, Trip, dan Jadwal */}
        <div className="lg:col-span-2 space-y-6">

          {/* Info Tamu */}
          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-primary" /> Informasi Tamu
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <p className="text-sm text-muted-foreground">Nama Tamu</p>
                <p className="font-medium">{(booking.guests as any)?.full_name || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">No. WhatsApp</p>
                <p className="font-medium">{(booking.guests as any)?.phone_wa || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{(booking.guests as any)?.email || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Penumpang / Bagasi</p>
                <p className="font-medium">{booking.pax_count as number || booking.total_passengers as number || 1} Pax / {booking.luggage_count as number || booking.total_luggage as number || 0} Koper</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sumber Booking</p>
                <p className="font-medium capitalize">{booking.source as string || "-"}</p>
              </div>
              {booking.flight_number ? (
                <div>
                  <p className="text-sm text-muted-foreground">Nomor Penerbangan</p>
                  <p className="font-medium">{booking.flight_number as string}</p>
                </div>
              ) : null}
              {booking.notes ? (
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Catatan Internal</p>
                  <p className="text-sm bg-muted/50 rounded-md p-2 mt-1">{booking.notes as string}</p>
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* Daftar Trip */}
          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <ListOrdered className="w-5 h-5 text-primary" /> Daftar Trip
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {trips.length === 0 ? (
                /* fallback ke info rute tunggal jika tidak ada booking_trips */
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Rute</p>
                    <p className="font-medium">{(booking.routes as any)?.name || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Waktu Jemput</p>
                    <p className="font-medium">
                      {booking.pickup_datetime
                        ? format(new Date(booking.pickup_datetime as string), "dd MMM yyyy, HH:mm", { locale: localeId })
                        : "-"}
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
                </div>
              ) : (
                <div className="space-y-4">
                  {trips.sort((a, b) => a.trip_order - b.trip_order).map((trip: any, idx: number) => (
                    <div key={trip.id || idx} className="border rounded-lg p-4 space-y-3 bg-muted/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                            {trip.trip_order || idx + 1}
                          </div>
                          <span className="font-medium text-sm">{trip.service_name}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {trip.price ? `Rp ${Number(trip.price).toLocaleString("id-ID")}` : "-"}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs">Tanggal & Jam</p>
                          <p className="font-medium">
                            {format(new Date(trip.trip_date), "dd MMM yyyy", { locale: localeId })}
                            {trip.pickup_time && ` · ${trip.pickup_time}`}
                          </p>
                        </div>
                        {trip.pickup_address && (
                          <div>
                            <p className="text-muted-foreground text-xs">Jemput</p>
                            <p className="font-medium">{trip.pickup_address}</p>
                          </div>
                        )}
                        {trip.dropoff_address && (
                          <div>
                            <p className="text-muted-foreground text-xs">Antar</p>
                            <p className="font-medium">{trip.dropoff_address}</p>
                          </div>
                        )}
                        {trip.service_description && (
                          <div className="col-span-2">
                            <p className="text-muted-foreground text-xs">Keterangan</p>
                            <p className="text-sm text-muted-foreground">{trip.service_description}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Kolom Kanan: Supir, Pembayaran, Aksi */}
        <div className="space-y-6">
          {/* Penugasan Supir */}
          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Car className="w-5 h-5 text-primary" /> Penugasan Supir
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {booking.drivers ? (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-lg">
                    {((booking.drivers as any)?.full_name as string)?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{(booking.drivers as any)?.full_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(booking.drivers as any)?.phone_wa}
                      {(booking.vehicles as any)?.plate_number && ` · ${(booking.vehicles as any)?.plate_number}`}
                    </p>
                  </div>
                  {currentStatus !== "cancelled" && currentStatus !== "completed" && (
                    <Button size="sm" variant="outline" onClick={() => setIsAssignModalOpen(true)}>Ubah</Button>
                  )}
                </div>
              ) : (
                <div className="text-center p-4 border border-dashed rounded-md bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-2">Belum ada supir yang ditugaskan</p>
                  {currentStatus !== "cancelled" && currentStatus !== "completed" && (
                    <Button size="sm" className="w-full" onClick={() => setIsAssignModalOpen(true)}>
                      Tugaskan Supir
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pembayaran */}
          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Banknote className="w-5 h-5 text-primary" /> Pembayaran
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Metode</span>
                <span className="font-medium uppercase">{booking.payment_method as string || "-"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <StatusBadge status={((booking.payment_status as string) || "unpaid") as import("@/components/shared/StatusBadge").StatusType} />
              </div>
              {(booking.deposit_amount as number) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Deposit</span>
                  <span className="font-medium">Rp {(booking.deposit_amount as number).toLocaleString("id-ID")}</span>
                </div>
              )}
              {(booking.balance_due as number) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sisa Tagihan</span>
                  <span className="font-medium text-amber-600">Rp {(booking.balance_due as number).toLocaleString("id-ID")}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span>Rp {(booking.gross_price as number)?.toLocaleString("id-ID")}</span>
              </div>
              {/* Update payment status */}
              {nextPayAction && currentStatus !== "cancelled" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full mt-2"
                  onClick={handleAdvancePayment}
                  disabled={isUpdatingStatus}
                >
                  {nextPayAction.label}
                </Button>
              )}
              {/* Link kwitansi */}
              <Link
                href={`/admin/bookings/${id}/receipt`}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "w-full gap-2 text-muted-foreground"
                )}
              >
                <Printer className="w-3.5 h-3.5" /> Lihat & Cetak Kwitansi
              </Link>
            </CardContent>
          </Card>

          {/* Inclusions jika ada */}
          {Array.isArray(booking.inclusions) && (booking.inclusions as string[]).length > 0 && (
            <Card>
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Inclusions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3">
                <ul className="space-y-1.5">
                  {(booking.inclusions as string[]).map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <AssignDriverModal
        bookingId={booking.id as string}
        bookingDetails={booking}
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onSuccess={handleRefresh}
      />
    </div>
  );
}
