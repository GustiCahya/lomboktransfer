"use client";

import React, { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, User, Car } from "lucide-react";
import { format, addDays, subDays } from "date-fns";
import { id } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

export default function DispatchPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("day");

  // Placeholder data for demo purposes
  const demoEvents = [
    {
      id: "LT-2026-0012",
      time: "08:00",
      guest: "Mr. John Doe (+2)",
      route: "Airport (BIL) → Senggigi",
      driver: "Budi Santoso",
      vehicle: "Innova Zenix (DR 1234 XY)",
      status: "Berlangsung",
      color: "bg-blue-500",
    },
    {
      id: "LT-2026-0013",
      time: "10:30",
      guest: "Ms. Sarah Smith",
      route: "Senggigi → Bangsal (Gili)",
      driver: "Belum Ditugaskan",
      vehicle: "-",
      status: "Menunggu",
      color: "bg-amber-500",
    },
    {
      id: "LT-2026-0014",
      time: "14:00",
      guest: "Keluarga Bapak Andi (+4)",
      route: "Kuta Mandalika → Airport",
      driver: "Ahmad",
      vehicle: "Hiace Commuter (DR 9999 AA)",
      status: "Terkonfirmasi",
      color: "bg-emerald-500",
    }
  ];

  const handlePrev = () => setCurrentDate(subDays(currentDate, 1));
  const handleNext = () => setCurrentDate(addDays(currentDate, 1));

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
            </h2>
            <Button variant="ghost" size="sm" onClick={() => setCurrentDate(new Date())}>
              Hari Ini
            </Button>
          </div>
          <div className="flex gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>Berlangsung</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>Terkonfirmasi</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>Menunggu Supir</div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto p-0 relative bg-slate-50/50 dark:bg-slate-900/20">
          {/* Day View Timeline Layout */}
          <div className="flex min-w-[800px]">
            {/* Time labels axis */}
            <div className="w-20 shrink-0 border-r border-border/50 bg-card z-10 sticky left-0 py-4">
              {Array.from({ length: 15 }).map((_, i) => {
                const hour = i + 6; // Start at 6 AM
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
              {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="h-24 border-t border-border/40 w-full" />
              ))}

              {/* Demo Events overlay */}
              <div className="absolute top-0 left-0 w-full h-full p-4">
                <div className="max-w-2xl mx-auto w-full relative h-full">
                  
                  {/* Event 1: 08:00 */}
                  <div className="absolute top-[48px] w-full z-10 group">
                    <div className="bg-card border-l-4 border-l-blue-500 rounded-md shadow-sm border p-3 flex flex-col gap-2 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex justify-between items-start">
                        <div className="font-semibold text-sm">{demoEvents[0].guest}</div>
                        <Badge variant="outline" className="text-[10px] uppercase">{demoEvents[0].id}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5"><Clock className="w-3 h-3"/> 08:00 - 09:30</div>
                        <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3"/> {demoEvents[0].route}</div>
                        <div className="flex items-center gap-1.5"><User className="w-3 h-3 text-blue-500"/> {demoEvents[0].driver}</div>
                        <div className="flex items-center gap-1.5"><Car className="w-3 h-3"/> {demoEvents[0].vehicle}</div>
                      </div>
                    </div>
                  </div>

                  {/* Event 2: 10:30 */}
                  <div className="absolute top-[264px] w-full z-10 group">
                    <div className="bg-card border-l-4 border-l-amber-500 rounded-md shadow-sm border p-3 flex flex-col gap-2 hover:shadow-md transition-shadow cursor-pointer ring-1 ring-amber-500/20">
                      <div className="flex justify-between items-start">
                        <div className="font-semibold text-sm">{demoEvents[1].guest}</div>
                        <Badge variant="outline" className="text-[10px] uppercase">{demoEvents[1].id}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5"><Clock className="w-3 h-3"/> 10:30 - 12:00</div>
                        <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3"/> {demoEvents[1].route}</div>
                        <div className="flex items-center gap-1.5 text-amber-600 font-medium"><User className="w-3 h-3"/> {demoEvents[1].driver}</div>
                        <div className="flex items-center gap-1.5"><Car className="w-3 h-3"/> {demoEvents[1].vehicle}</div>
                      </div>
                    </div>
                  </div>

                  {/* Event 3: 14:00 */}
                  <div className="absolute top-[600px] w-full z-10 group">
                    <div className="bg-card border-l-4 border-l-emerald-500 rounded-md shadow-sm border p-3 flex flex-col gap-2 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex justify-between items-start">
                        <div className="font-semibold text-sm">{demoEvents[2].guest}</div>
                        <Badge variant="outline" className="text-[10px] uppercase">{demoEvents[2].id}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5"><Clock className="w-3 h-3"/> 14:00 - 14:45</div>
                        <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3"/> {demoEvents[2].route}</div>
                        <div className="flex items-center gap-1.5"><User className="w-3 h-3 text-emerald-500"/> {demoEvents[2].driver}</div>
                        <div className="flex items-center gap-1.5"><Car className="w-3 h-3"/> {demoEvents[2].vehicle}</div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
