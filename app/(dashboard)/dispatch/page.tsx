/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, User, Car, Loader2 } from "lucide-react";
import { format, addDays, subDays } from "date-fns";
import { id } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { useDispatch } from "@/hooks/useDispatch";

export default function DispatchPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("day");
  const [events, setEvents] = useState<any[]>([]);

  const { fetchDispatchEvents, isLoading } = useDispatch();

  useEffect(() => {
    const loadEvents = async () => {
      const dateStr = format(currentDate, "yyyy-MM-dd");
      const data = await fetchDispatchEvents(dateStr);
      setEvents(data || []);
    };
    loadEvents();
  }, [currentDate, fetchDispatchEvents]);

  const handlePrev = () => setCurrentDate(subDays(currentDate, 1));
  const handleNext = () => setCurrentDate(addDays(currentDate, 1));

  // Helper to determine status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_progress": return "border-blue-500 ring-blue-500/20";
      case "confirmed": return "border-emerald-500 ring-emerald-500/20";
      case "pending": return "border-amber-500 ring-amber-500/20";
      case "driver_assigned": return "border-indigo-500 ring-indigo-500/20";
      case "completed": return "border-gray-500 ring-gray-500/20 opacity-70";
      case "cancelled": return "border-red-500 ring-red-500/20 opacity-50";
      default: return "border-gray-500 ring-gray-500/20";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "in_progress": return "Berlangsung";
      case "confirmed": return "Terkonfirmasi";
      case "pending": return "Menunggu";
      case "driver_assigned": return "Supir Ditugaskan";
      case "completed": return "Selesai";
      case "cancelled": return "Dibatalkan";
      default: return status;
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case "in_progress": return "bg-blue-500";
      case "confirmed": return "bg-emerald-500";
      case "pending": return "bg-amber-500";
      case "driver_assigned": return "bg-indigo-500";
      case "completed": return "bg-gray-500";
      case "cancelled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
      <PageHeader 
        title="Kalender Dispatch" 
        subtitle="Pusat kontrol operasional harian. Pantau jadwal, tugaskan supir, dan hindari konflik waktu."
        actions={
          <div className="flex items-center gap-2 bg-background border rounded-lg p-1">
            <Button 
              variant={viewMode === "day" ? "secondary" : "ghost"} 
              size="sm" 
              onClick={() => setViewMode("day")}
            >
              Harian
            </Button>
            <Button 
              variant={viewMode === "week" ? "secondary" : "ghost"} 
              size="sm" 
              onClick={() => setViewMode("week")}
              disabled
              title="Segera Hadir"
            >
              Mingguan
            </Button>
            <Button 
              variant={viewMode === "month" ? "secondary" : "ghost"} 
              size="sm" 
              onClick={() => setViewMode("month")}
              disabled
              title="Segera Hadir"
            >
              Bulanan
            </Button>
          </div>
        }
      />

      <Card className="flex-1 flex flex-col min-h-0 overflow-hidden border-border/60 shadow-sm">
        <CardHeader className="py-4 px-6 border-b flex flex-row items-center justify-between shrink-0 bg-muted/20">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={handlePrev}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
              {format(currentDate, "EEEE, dd MMMM yyyy", { locale: id })}
              {isLoading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground ml-2" />}
            </h2>
            <Button variant="ghost" size="sm" onClick={() => setCurrentDate(new Date())}>
              Hari Ini
            </Button>
          </div>
          <div className="flex gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>Berlangsung</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>Supir Ditugaskan</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>Menunggu Supir</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>Terkonfirmasi</div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto p-0 relative bg-slate-50/50 dark:bg-slate-900/20">
          {/* Day View Timeline Layout */}
          <div className="flex min-w-[800px]">
            {/* Time labels axis */}
            <div className="w-20 shrink-0 border-r border-border/50 bg-card z-10 sticky left-0 py-4">
              {Array.from({ length: 18 }).map((_, i) => {
                const hour = i + 5; // Start at 5 AM
                return (
                  <div key={i} className="h-24 relative flex justify-center">
                    <span className="text-xs text-muted-foreground font-medium -mt-2 bg-card px-1">{hour.toString().padStart(2, '0')}:00</span>
                  </div>
                );
              })}
            </div>

            {/* Timeline content area */}
            <div className="flex-1 relative">
              {/* Grid lines */}
              {Array.from({ length: 18 }).map((_, i) => (
                <div key={i} className="h-24 border-t border-border/40 w-full" />
              ))}

              {/* Real Events overlay */}
              <div className="absolute top-0 left-0 w-full h-full p-4">
                <div className="max-w-2xl mx-auto w-full relative h-full">
                  {!isLoading && events.length === 0 && (
                    <div className="absolute top-1/4 left-0 w-full text-center text-muted-foreground">
                      <p>Tidak ada jadwal untuk tanggal ini.</p>
                    </div>
                  )}

                  {events.map((ev) => {
                    const date = new Date(ev.pickup_datetime);
                    const hours = date.getHours();
                    const minutes = date.getMinutes();
                    
                    // Position calculations
                    // Offset starts at 5 AM. h-24 is 6rem = 96px.
                    // Each hour is 96px.
                    // Offset = (hours - 5) * 96 + (minutes / 60) * 96 + 16 (for top padding)
                    // Let's use exact calculations with standard px
                    const topPos = ((hours - 5) + (minutes / 60)) * 96 + 16;
                    
                    // Default height to 1.5 hours (144px) to fit content, or min height
                    const height = 120;

                    const guestName = ev.guests?.full_name || "Tamu Tidak Diketahui";
                    const routeName = ev.routes?.name || "Custom Route";
                    const driverName = ev.drivers?.full_name || "Belum Ditugaskan";
                    const vehicleInfo = ev.vehicles ? `${ev.vehicles.brand} (${ev.vehicles.plate_number})` : "-";
                    
                    return (
                      <div 
                        key={ev.id} 
                        className="absolute w-full z-10 group" 
                        style={{ top: `${topPos}px`, minHeight: `${height}px` }}
                      >
                        <div className={`bg-card border-l-4 rounded-md shadow-sm border p-3 flex flex-col gap-2 hover:shadow-md transition-all cursor-pointer ring-1 ${getStatusColor(ev.status)}`}>
                          <div className="flex justify-between items-start">
                            <div className="font-semibold text-sm flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${getStatusDot(ev.status)}`} title={getStatusText(ev.status)}></span>
                              {guestName} {ev.pax_count > 1 ? `(+${ev.pax_count - 1})` : ''}
                            </div>
                            <Badge variant="outline" className="text-[10px] uppercase">{ev.booking_code}</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1.5 font-medium text-foreground">
                              <Clock className="w-3 h-3"/> 
                              {format(date, "HH:mm")}
                            </div>
                            <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3"/> {routeName}</div>
                            <div className={`flex items-center gap-1.5 ${!ev.drivers ? 'text-amber-600 font-medium' : ''}`}>
                              <User className="w-3 h-3"/> {driverName}
                            </div>
                            <div className="flex items-center gap-1.5"><Car className="w-3 h-3"/> {vehicleInfo}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
