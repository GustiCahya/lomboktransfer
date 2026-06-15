/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle, RefreshCw, Loader2, Clock, User, Car,
  CheckCircle2, ChevronRight, ShieldAlert, Calendar
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { format, addHours, isBefore } from "date-fns";
import { id } from "date-fns/locale";
import { toast } from "sonner";

type Booking = {
  id: string;
  booking_code: string;
  pickup_datetime: string;
  status: string;
  pax_count: number;
  driver_id: string | null;
  vehicle_id: string | null;
  estimated_duration_min: number | null;
  guests?: { full_name: string } | null;
  routes?: { name: string; estimated_duration_min: number | null } | null;
  drivers?: { full_name: string } | null;
  vehicles?: { plate_number: string; brand: string } | null;
};

type Conflict = {
  type: "driver" | "vehicle";
  resourceId: string;
  resourceName: string;
  bookingA: Booking;
  bookingB: Booking;
};

function detectConflicts(bookings: Booking[]): Conflict[] {
  const conflicts: Conflict[] = [];
  const active = bookings.filter((b) =>
    !["cancelled", "completed"].includes(b.status)
  );

  // Build map: driverId/vehicleId → bookings
  const byDriver = new Map<string, Booking[]>();
  const byVehicle = new Map<string, Booking[]>();

  for (const b of active) {
    if (b.driver_id) {
      if (!byDriver.has(b.driver_id)) byDriver.set(b.driver_id, []);
      byDriver.get(b.driver_id)!.push(b);
    }
    if (b.vehicle_id) {
      if (!byVehicle.has(b.vehicle_id)) byVehicle.set(b.vehicle_id, []);
      byVehicle.get(b.vehicle_id)!.push(b);
    }
  }

  const checkOverlap = (a: Booking, b: Booking) => {
    const startA = new Date(a.pickup_datetime);
    const durA = a.routes?.estimated_duration_min ?? 90;
    const endA = addHours(startA, durA / 60);

    const startB = new Date(b.pickup_datetime);
    const durB = b.routes?.estimated_duration_min ?? 90;
    const endB = addHours(startB, durB / 60);

    // overlap if startA < endB AND startB < endA
    return isBefore(startA, endB) && isBefore(startB, endA);
  };

  // Check driver conflicts
  Array.from(byDriver.entries()).forEach(([driverId, bkgs]) => {
    for (let i = 0; i < bkgs.length; i++) {
      for (let j = i + 1; j < bkgs.length; j++) {
        if (checkOverlap(bkgs[i], bkgs[j])) {
          conflicts.push({
            type: "driver",
            resourceId: driverId,
            resourceName: bkgs[i].drivers?.full_name ?? "Supir",
            bookingA: bkgs[i],
            bookingB: bkgs[j],
          });
        }
      }
    }
  });

  // Check vehicle conflicts
  Array.from(byVehicle.entries()).forEach(([vehicleId, bkgs]) => {
    for (let i = 0; i < bkgs.length; i++) {
      for (let j = i + 1; j < bkgs.length; j++) {
        if (checkOverlap(bkgs[i], bkgs[j])) {
          const alreadyAdded = conflicts.some(
            (c) =>
              c.type === "vehicle" &&
              c.resourceId === vehicleId &&
              ((c.bookingA.id === bkgs[i].id && c.bookingB.id === bkgs[j].id) ||
                (c.bookingA.id === bkgs[j].id && c.bookingB.id === bkgs[i].id))
          );
          if (!alreadyAdded) {
            conflicts.push({
              type: "vehicle",
              resourceId: vehicleId,
              resourceName: bkgs[i].vehicles
                ? `${bkgs[i].vehicles!.brand} (${bkgs[i].vehicles!.plate_number})`
                : "Kendaraan",
              bookingA: bkgs[i],
              bookingB: bkgs[j],
            });
          }
        }
      }
    }
  });

  return conflicts;
}

function BookingChip({ bk, label }: { bk: Booking; label: string }) {
  return (
    <div className="flex-1 rounded-lg bg-muted/50 border border-border/60 p-3 space-y-1.5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="flex items-center gap-1.5">
        <Badge variant="outline" className="text-[10px] font-mono">{bk.booking_code}</Badge>
        <Badge
          variant="outline"
          className={`text-[10px] ${bk.status === "in_progress" ? "border-blue-500 text-blue-600" :
              bk.status === "confirmed" ? "border-emerald-500 text-emerald-600" :
                "border-amber-500 text-amber-600"
            }`}
        >
          {bk.status}
        </Badge>
      </div>
      <p className="text-sm font-semibold truncate">{bk.guests?.full_name ?? "-"}</p>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Clock className="w-3 h-3 shrink-0" />
        {format(new Date(bk.pickup_datetime), "dd MMM, HH:mm", { locale: id })}
      </div>
      <p className="text-xs text-muted-foreground truncate">{bk.routes?.name ?? "Custom Route"}</p>
    </div>
  );
}

export default function ConflictsPage() {
  const supabase = createClient();
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [resolving, setResolving] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchAndDetect = useCallback(async () => {
    setIsLoading(true);
    // Fetch upcoming + active bookings (next 7 days)
    const now = new Date().toISOString();
    const next7 = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString();

    const { data, error } = await supabase
      .from("bookings")
      .select(`
        id, booking_code, pickup_datetime, status, pax_count,
        driver_id, vehicle_id,
        guests(full_name),
        routes(name, estimated_duration_min),
        drivers(full_name),
        vehicles(plate_number, brand)
      `)
      .gte("pickup_datetime", now)
      .lte("pickup_datetime", next7)
      .not("status", "in", '("cancelled","completed")');

    if (error) {
      toast.error("Gagal memuat data: " + error.message);
      setIsLoading(false);
      return;
    }

    const detected = detectConflicts((data ?? []) as any);
    setConflicts(detected);
    setLastRefresh(new Date());
    setIsLoading(false);
  }, [supabase]);

  useEffect(() => { fetchAndDetect(); }, [fetchAndDetect]);

  // Resolve: unassign driver from one booking
  const handleUnassignDriver = async (bookingId: string, conflictKey: string) => {
    setResolving(conflictKey);
    const { error } = await supabase
      .from("bookings")
      .update({ driver_id: null, status: "confirmed" })
      .eq("id", bookingId);
    if (error) toast.error("Gagal melepas supir: " + error.message);
    else {
      toast.success("Supir dilepas dari booking. Silakan reassign manual.");
      fetchAndDetect();
    }
    setResolving(null);
  };

  const handleUnassignVehicle = async (bookingId: string, conflictKey: string) => {
    setResolving(conflictKey);
    const { error } = await supabase
      .from("bookings")
      .update({ vehicle_id: null })
      .eq("id", bookingId);
    if (error) toast.error("Gagal melepas kendaraan: " + error.message);
    else {
      toast.success("Kendaraan dilepas. Silakan reassign manual.");
      fetchAndDetect();
    }
    setResolving(null);
  };

  const driverConflicts = conflicts.filter((c) => c.type === "driver");
  const vehicleConflicts = conflicts.filter((c) => c.type === "vehicle");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Conflict Resolution"
        subtitle="Deteksi otomatis tumpang tindih jadwal supir dan kendaraan dalam 7 hari ke depan."
        actions={
          <Button variant="outline" className="gap-2" onClick={fetchAndDetect} disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Refresh
          </Button>
        }
      />

      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Konflik", value: conflicts.length, icon: ShieldAlert, color: conflicts.length > 0 ? "text-rose-500" : "text-emerald-500" },
          { label: "Konflik Supir", value: driverConflicts.length, icon: User, color: "text-orange-500" },
          { label: "Konflik Kendaraan", value: vehicleConflicts.length, icon: Car, color: "text-amber-500" },
        ].map((s) => (
          <Card key={s.label} className="border-border/60">
            <CardContent className="p-4 flex items-center gap-3">
              <s.icon className={`w-8 h-8 ${s.color} opacity-80`} />
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Last updated */}
      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
        <Calendar className="w-3.5 h-3.5" />
        Terakhir diperbarui: {format(lastRefresh, "dd MMM yyyy, HH:mm:ss", { locale: id })}
      </p>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* No conflicts */}
      {!isLoading && conflicts.length === 0 && (
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 opacity-80" />
            <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">Tidak ada konflik terdeteksi!</p>
            <p className="text-sm text-muted-foreground">Semua jadwal supir dan kendaraan dalam 7 hari ke depan bersih dari tumpang tindih.</p>
          </CardContent>
        </Card>
      )}

      {/* Driver conflicts */}
      {!isLoading && driverConflicts.length > 0 && (
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 font-semibold text-sm text-orange-600 dark:text-orange-400">
            <AlertTriangle className="w-4 h-4" /> Konflik Supir ({driverConflicts.length})
          </h3>
          {driverConflicts.map((c, i) => {
            const key = `driver-${i}`;
            return (
              <Card key={key} className="border-orange-500/30 bg-orange-500/5">
                <CardHeader className="pb-2 pt-4 px-5">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <User className="w-4 h-4 text-orange-500" />
                    Supir <span className="font-bold">{c.resourceName}</span> dijadwalkan untuk 2 trip bersamaan
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Jadwal kedua trip bertumpang tindih. Lepas salah satu penugasan untuk menyelesaikan konflik.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-5 pb-5 space-y-4">
                  <div className="flex gap-3 items-stretch">
                    <BookingChip bk={c.bookingA} label="Booking A" />
                    <div className="flex items-center shrink-0">
                      <ChevronRight className="w-5 h-5 text-orange-400" />
                    </div>
                    <BookingChip bk={c.bookingB} label="Booking B" />
                  </div>
                  <div className="flex gap-2 justify-end pt-1">
                    <Button
                      size="sm" variant="outline"
                      className="text-orange-600 border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950 gap-1.5 text-xs"
                      disabled={!!resolving}
                      onClick={() => handleUnassignDriver(c.bookingA.id, key + "a")}
                    >
                      {resolving === key + "a" && <Loader2 className="w-3 h-3 animate-spin" />}
                      Lepas supir dari Booking A
                    </Button>
                    <Button
                      size="sm" variant="outline"
                      className="text-orange-600 border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950 gap-1.5 text-xs"
                      disabled={!!resolving}
                      onClick={() => handleUnassignDriver(c.bookingB.id, key + "b")}
                    >
                      {resolving === key + "b" && <Loader2 className="w-3 h-3 animate-spin" />}
                      Lepas supir dari Booking B
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Vehicle conflicts */}
      {!isLoading && vehicleConflicts.length > 0 && (
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 font-semibold text-sm text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-4 h-4" /> Konflik Kendaraan ({vehicleConflicts.length})
          </h3>
          {vehicleConflicts.map((c, i) => {
            const key = `vehicle-${i}`;
            return (
              <Card key={key} className="border-amber-500/30 bg-amber-500/5">
                <CardHeader className="pb-2 pt-4 px-5">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Car className="w-4 h-4 text-amber-500" />
                    Kendaraan <span className="font-bold">{c.resourceName}</span> dijadwalkan untuk 2 trip bersamaan
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Jadwal kedua trip bertumpang tindih. Lepas salah satu penugasan kendaraan.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-5 pb-5 space-y-4">
                  <div className="flex gap-3 items-stretch">
                    <BookingChip bk={c.bookingA} label="Booking A" />
                    <div className="flex items-center shrink-0">
                      <ChevronRight className="w-5 h-5 text-amber-400" />
                    </div>
                    <BookingChip bk={c.bookingB} label="Booking B" />
                  </div>
                  <div className="flex gap-2 justify-end pt-1">
                    <Button
                      size="sm" variant="outline"
                      className="text-amber-600 border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950 gap-1.5 text-xs"
                      disabled={!!resolving}
                      onClick={() => handleUnassignVehicle(c.bookingA.id, key + "a")}
                    >
                      {resolving === key + "a" && <Loader2 className="w-3 h-3 animate-spin" />}
                      Lepas kendaraan dari Booking A
                    </Button>
                    <Button
                      size="sm" variant="outline"
                      className="text-amber-600 border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950 gap-1.5 text-xs"
                      disabled={!!resolving}
                      onClick={() => handleUnassignVehicle(c.bookingB.id, key + "b")}
                    >
                      {resolving === key + "b" && <Loader2 className="w-3 h-3 animate-spin" />}
                      Lepas kendaraan dari Booking B
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
