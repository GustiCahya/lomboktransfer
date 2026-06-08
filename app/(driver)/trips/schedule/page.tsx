"use client";

import React from "react";
import { useDriverTrips } from "@/hooks/useDriverTrips";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Calendar as CalendarIcon, CalendarDays } from "lucide-react";
import Link from "next/link";
import StatusBadge from "@/components/shared/StatusBadge";

export default function TripsSchedulePage() {
  const { upcomingTrips, isLoading } = useDriverTrips();

  return (
    <div className="flex flex-col h-full bg-muted/10">
      <header className="bg-primary text-primary-foreground pt-12 pb-4 px-4 sticky top-0 z-10 shadow-sm flex justify-between items-end">
        <div>
          <h1 className="text-xl font-bold">Jadwal Mendatang</h1>
          <p className="text-primary-foreground/80 text-sm">7 hari ke depan</p>
        </div>
        <Link href="/trips/leave-request">
          <Button variant="secondary" size="sm" className="h-8 text-xs font-semibold">
            Request Cuti
          </Button>
        </Link>
      </header>

      {/* Mini Calendar Mockup (Normally a React-Calendar or Custom Grid) */}
      <div className="bg-card border-b p-4 mb-4 flex justify-between">
        {[...Array(5)].map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() + i + 1);
          const isSelected = i === 0;
          return (
            <div key={i} className={`flex flex-col items-center justify-center w-12 h-14 rounded-md ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              <span className="text-[10px] font-medium uppercase">{d.toLocaleDateString('id-ID', { weekday: 'short' })}</span>
              <span className="text-lg font-bold leading-none mt-1">{d.getDate()}</span>
              {/* Dot indicator for trips */}
              <div className={`w-1 h-1 rounded-full mt-1 ${isSelected ? 'bg-primary-foreground' : 'bg-primary'}`}></div>
            </div>
          );
        })}
      </div>

      <div className="flex-1 px-4 pb-4 overflow-y-auto space-y-4">
        {isLoading ? (
          <p className="text-center text-sm text-muted-foreground mt-8">Memuat jadwal...</p>
        ) : upcomingTrips.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center px-4 border border-dashed rounded-lg bg-card">
            <CalendarDays className="w-12 h-12 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground text-sm">Belum ada jadwal trip yang di-assign untuk 7 hari ke depan.</p>
          </div>
        ) : (
          upcomingTrips.map(trip => {
            const date = new Date(trip.pickup_datetime);
            const dateStr = date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });
            const timeStr = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
            const routeStart = trip.routes?.start_location || "Lokasi Jemput";
            const routeEnd = trip.routes?.end_location || "Lokasi Tujuan";

            return (
              <Card key={trip.id} className="overflow-hidden shadow-sm">
                <CardContent className="p-0">
                  <div className="p-3 border-b bg-muted/30 flex justify-between items-center">
                    <div className="flex items-center gap-2 font-medium">
                      <CalendarIcon className="w-4 h-4 text-primary" /> {dateStr}
                    </div>
                    <StatusBadge status={trip.status} />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-xl font-bold mb-3">
                      <Clock className="w-5 h-5 text-muted-foreground" /> {timeStr}
                    </div>
                    <h4 className="font-semibold mb-2">{trip.guests?.full_name || "Tamu"}</h4>
                    <div className="space-y-2 relative">
                      <div className="absolute left-[7px] top-[10px] bottom-[10px] w-0.5 bg-muted"></div>
                      <div className="flex gap-3 relative z-10">
                        <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shadow-sm">
                          <MapPin className="w-2.5 h-2.5" />
                        </div>
                        <p className="text-sm">{routeStart}</p>
                      </div>
                      <div className="flex gap-3 relative z-10">
                        <div className="w-4 h-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center shadow-sm">
                          <MapPin className="w-2.5 h-2.5" />
                        </div>
                        <p className="text-sm">{routeEnd}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
