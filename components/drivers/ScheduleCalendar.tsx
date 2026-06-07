"use client";

import React from "react";
import { startOfWeek, addDays, format, isSameDay } from "date-fns";
import { id } from "date-fns/locale";
import { useDrivers } from "@/hooks/useDrivers";
import { cn } from "@/lib/utils";

interface ScheduleCalendarProps {
  baseDate: Date;
}

// Dummy assignments for placeholder
const DUMMY_ASSIGNMENTS: Record<string, Record<string, "available" | "trip" | "cuti" | "unavailable">> = {
  // Driver ID -> Date string (yyyy-MM-dd) -> Status
};

export default function ScheduleCalendar({ baseDate }: ScheduleCalendarProps) {
  const { drivers, isLoading } = useDrivers();
  const startDate = startOfWeek(baseDate, { weekStartsOn: 1 }); // Monday

  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));

  if (isLoading) {
    return <div className="p-12 text-center text-muted-foreground">Memuat jadwal supir...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-muted text-muted-foreground uppercase">
          <tr>
            <th className="px-4 py-3 font-medium w-64 border-b border-r">Supir</th>
            {weekDays.map((day) => (
              <th key={day.toISOString()} className={cn("px-4 py-3 font-medium text-center border-b", isSameDay(day, new Date()) && "bg-primary/10 text-primary")}>
                <div className="text-xs">{format(day, "EEEE", { locale: id })}</div>
                <div className="text-lg font-bold">{format(day, "dd")}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver) => (
            <tr key={driver.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
              <td className="px-4 py-3 border-r">
                <div className="font-medium truncate">{driver.full_name}</div>
                <div className="text-xs text-muted-foreground capitalize">{driver.employment_type === "karyawan" ? "Karyawan Tetap" : "Mitra Lepas"}</div>
              </td>
              {weekDays.map((day) => {
                const dateKey = format(day, "yyyy-MM-dd");
                const status = DUMMY_ASSIGNMENTS[driver.id]?.[dateKey] || (driver.status === "cuti" ? "cuti" : "available");
                
                return (
                  <td key={dateKey} className="px-2 py-2 text-center border-r last:border-0">
                    <button 
                      className={cn(
                        "w-full py-2 rounded-md transition-colors text-xs font-medium cursor-pointer hover:opacity-80",
                        status === "available" && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                        status === "trip" && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                        status === "cuti" && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                        status === "unavailable" && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                      )}
                      title={`Ubah status untuk ${driver.full_name} pada ${format(day, "dd MMM yyyy", { locale: id })}`}
                    >
                      {status === "available" && "Available"}
                      {status === "trip" && "Trip"}
                      {status === "cuti" && "Cuti"}
                      {status === "unavailable" && "Off"}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
