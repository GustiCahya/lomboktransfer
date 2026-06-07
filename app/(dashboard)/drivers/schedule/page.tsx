"use client";

import React, { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import ScheduleCalendar from "@/components/drivers/ScheduleCalendar";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { format, addWeeks, subWeeks } from "date-fns";
import { id } from "date-fns/locale";

export default function DriverSchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  const handleNextWeek = () => setCurrentDate(addWeeks(currentDate, 1));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Jadwal & Shift Supir"
        subtitle="Kelola ketersediaan, cuti, dan penugasan supir dalam satu tampilan kalender."
        actions={
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-background border rounded-md px-3 py-2 text-sm">
              <CalendarIcon className="w-4 h-4 mr-2 text-muted-foreground" />
              Minggu, {format(currentDate, "dd MMM yyyy", { locale: id })}
            </div>
            <div className="flex items-center gap-1 border rounded-md bg-background overflow-hidden">
              <Button variant="ghost" size="icon" onClick={handlePrevWeek} className="rounded-none h-9 w-9">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setCurrentDate(new Date())} className="rounded-none h-9 border-l border-r">
                Hari Ini
              </Button>
              <Button variant="ghost" size="icon" onClick={handleNextWeek} className="rounded-none h-9 w-9">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        }
      />

      {/* Legend */}
      <div className="flex items-center gap-6 p-4 bg-card rounded-md border shadow-sm text-sm">
        <span className="font-medium">Keterangan:</span>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div> Tersedia</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Ada Trip</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500"></div> Cuti / Izin</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-destructive"></div> Tidak Tersedia</div>
      </div>

      {/* Calendar Component */}
      <div className="bg-card rounded-md border shadow-sm overflow-hidden">
        <ScheduleCalendar baseDate={currentDate} />
      </div>
    </div>
  );
}
