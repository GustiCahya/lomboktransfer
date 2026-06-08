/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  Car,
  Loader2,
} from "lucide-react";
import {
  format,
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  isToday,
} from "date-fns";
import { id } from "date-fns/locale";
import { useDispatch } from "@/hooks/useDispatch";

type ViewMode = "day" | "week" | "month";

// ─── helpers ────────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, { border: string; ring: string; dot: string; badge: string }> = {
  in_progress:     { border: "border-blue-500",   ring: "ring-blue-500/20",   dot: "bg-blue-500",   badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  confirmed:       { border: "border-emerald-500", ring: "ring-emerald-500/20", dot: "bg-emerald-500", badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  pending:         { border: "border-amber-500",   ring: "ring-amber-500/20",   dot: "bg-amber-500",   badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  driver_assigned: { border: "border-indigo-500",  ring: "ring-indigo-500/20",  dot: "bg-indigo-500",  badge: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" },
  completed:       { border: "border-gray-400",    ring: "ring-gray-400/20",    dot: "bg-gray-400",    badge: "bg-gray-400/10 text-gray-500" },
  cancelled:       { border: "border-red-400",     ring: "ring-red-400/20",     dot: "bg-red-400",     badge: "bg-red-400/10 text-red-500" },
};

function getColor(status: string) {
  return STATUS_COLORS[status] ?? STATUS_COLORS.completed;
}

const STATUS_LABELS: Record<string, string> = {
  in_progress: "Berlangsung",
  confirmed: "Terkonfirmasi",
  pending: "Menunggu",
  driver_assigned: "Supir Ditugaskan",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

// ─── sub-components ──────────────────────────────────────────────────────────

function EventCard({ ev }: { ev: any }) {
  const c = getColor(ev.status);
  const guestName = ev.guests?.full_name ?? "Tamu Tidak Diketahui";
  const routeName  = ev.routes?.name ?? "Custom Route";
  const driverName = ev.drivers?.full_name ?? "Belum Ditugaskan";
  const vehicleInfo = ev.vehicles
    ? `${ev.vehicles.brand} (${ev.vehicles.plate_number})`
    : "-";
  const date = new Date(ev.pickup_datetime);

  return (
    <div
      className={`bg-card border-l-4 rounded-md shadow-sm border p-3 flex flex-col gap-2 hover:shadow-md transition-all cursor-pointer ring-1 ${c.border} ${c.ring}`}
    >
      <div className="flex justify-between items-start gap-2">
        <div className="font-semibold text-sm flex items-center gap-2 min-w-0">
          <span className={`w-2 h-2 shrink-0 rounded-full ${c.dot}`} title={STATUS_LABELS[ev.status]} />
          <span className="truncate">{guestName} {ev.pax_count > 1 ? `(+${ev.pax_count - 1})` : ""}</span>
        </div>
        <Badge variant="outline" className="text-[10px] uppercase shrink-0">{ev.booking_code}</Badge>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5 font-medium text-foreground">
          <Clock className="w-3 h-3 shrink-0" />
          {format(date, "HH:mm")}
        </div>
        <div className="flex items-center gap-1.5 truncate"><MapPin className="w-3 h-3 shrink-0" /> <span className="truncate">{routeName}</span></div>
        <div className={`flex items-center gap-1.5 ${!ev.drivers ? "text-amber-600 font-medium" : ""}`}>
          <User className="w-3 h-3 shrink-0" /> <span className="truncate">{driverName}</span>
        </div>
        <div className="flex items-center gap-1.5 truncate"><Car className="w-3 h-3 shrink-0" /> <span className="truncate">{vehicleInfo}</span></div>
      </div>
    </div>
  );
}

/** Compact chip used in week / month cells */
function EventChip({ ev }: { ev: any }) {
  const c = getColor(ev.status);
  const guestName = ev.guests?.full_name ?? "Tamu";
  const date = new Date(ev.pickup_datetime);
  return (
    <div
      className={`flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium cursor-pointer truncate ${c.badge} border-l-2 ${c.border}`}
      title={`${guestName} — ${STATUS_LABELS[ev.status]}`}
    >
      <span className="shrink-0 tabular-nums">{format(date, "HH:mm")}</span>
      <span className="truncate">{guestName}</span>
    </div>
  );
}

// ─── Day View ────────────────────────────────────────────────────────────────

function DayView({ events, isLoading }: { events: any[]; isLoading: boolean }) {
  const HOURS = Array.from({ length: 18 }, (_, i) => i + 5); // 05:00 – 22:00
  const PX_PER_HOUR = 96;

  return (
    <div className="flex min-w-[600px]">
      {/* Time axis */}
      <div className="w-20 shrink-0 border-r border-border/50 bg-card sticky left-0 z-10 py-4">
        {HOURS.map((h) => (
          <div key={h} className="h-24 relative flex justify-center">
            <span className="text-xs text-muted-foreground font-medium -mt-2 bg-card px-1">
              {h.toString().padStart(2, "0")}:00
            </span>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 relative">
        {HOURS.map((h) => (
          <div key={h} className="h-24 border-t border-border/40 w-full" />
        ))}
        <div className="absolute top-0 left-0 w-full h-full p-4">
          <div className="max-w-2xl mx-auto w-full relative h-full">
            {!isLoading && events.length === 0 && (
              <div className="absolute top-1/4 left-0 w-full text-center text-muted-foreground">
                <CalendarIcon className="mx-auto mb-2 w-8 h-8 opacity-30" />
                <p>Tidak ada jadwal untuk tanggal ini.</p>
              </div>
            )}
            {events.map((ev) => {
              const d = new Date(ev.pickup_datetime);
              const topPos = ((d.getHours() - 5) + d.getMinutes() / 60) * PX_PER_HOUR + 16;
              return (
                <div
                  key={ev.id}
                  className="absolute w-full z-10"
                  style={{ top: `${topPos}px`, minHeight: "112px" }}
                >
                  <EventCard ev={ev} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Week View ────────────────────────────────────────────────────────────────

function WeekView({
  weekStart,
  events,
  isLoading,
  onDayClick,
}: {
  weekStart: Date;
  events: any[];
  isLoading: boolean;
  onDayClick: (d: Date) => void;
}) {
  const days = eachDayOfInterval({ start: weekStart, end: addDays(weekStart, 6) });
  const HOURS = Array.from({ length: 18 }, (_, i) => i + 5);
  const PX_PER_HOUR = 72;

  return (
    <div className="flex min-w-[700px]">
      {/* Time axis */}
      <div className="w-16 shrink-0 border-r border-border/50 bg-card sticky left-0 z-10">
        {/* header spacer */}
        <div className="h-12 border-b border-border/50" />
        {HOURS.map((h) => (
          <div key={h} style={{ height: `${PX_PER_HOUR}px` }} className="relative flex justify-center">
            <span className="text-xs text-muted-foreground font-medium -mt-2 bg-card px-1">
              {h.toString().padStart(2, "0")}:00
            </span>
          </div>
        ))}
      </div>

      {/* Day columns */}
      <div className="flex flex-1 divide-x divide-border/50">
        {days.map((day) => {
          const dayEvents = events.filter((ev) => isSameDay(new Date(ev.pickup_datetime), day));
          return (
            <div key={day.toISOString()} className="flex-1 flex flex-col min-w-[80px]">
              {/* Day header */}
              <button
                onClick={() => onDayClick(day)}
                className={`h-12 border-b border-border/50 flex flex-col items-center justify-center shrink-0 hover:bg-muted/50 transition-colors ${
                  isToday(day) ? "bg-primary/5" : ""
                }`}
              >
                <span className="text-[10px] text-muted-foreground uppercase font-medium">
                  {format(day, "EEE", { locale: id })}
                </span>
                <span
                  className={`text-sm font-bold leading-tight ${
                    isToday(day)
                      ? "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center"
                      : ""
                  }`}
                >
                  {format(day, "d")}
                </span>
              </button>

              {/* Hour rows */}
              <div className="relative flex-1">
                {HOURS.map((h) => (
                  <div
                    key={h}
                    style={{ height: `${PX_PER_HOUR}px` }}
                    className="border-t border-border/30 w-full"
                  />
                ))}
                {/* Events positioned absolutely */}
                <div className="absolute top-0 left-0 w-full h-full px-1 pt-1 space-y-0.5">
                  {dayEvents.map((ev) => {
                    const d = new Date(ev.pickup_datetime);
                    const topPx = ((d.getHours() - 5) + d.getMinutes() / 60) * PX_PER_HOUR;
                    const c = getColor(ev.status);
                    const guest = ev.guests?.full_name ?? "Tamu";
                    return (
                      <div
                        key={ev.id}
                        className={`absolute left-1 right-1 rounded px-1.5 py-1 text-[11px] font-medium cursor-pointer truncate ${c.badge} border-l-2 ${c.border}`}
                        style={{ top: `${topPx}px`, minHeight: "28px" }}
                        title={`${guest} — ${STATUS_LABELS[ev.status]}`}
                      >
                        <span className="tabular-nums mr-1">{format(d, "HH:mm")}</span>
                        <span className="truncate">{guest}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/60 z-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
}

// ─── Month View ────────────────────────────────────────────────────────────────

function MonthView({
  currentDate,
  events,
  isLoading,
  onDayClick,
}: {
  currentDate: Date;
  events: any[];
  isLoading: boolean;
  onDayClick: (d: Date) => void;
}) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });
  const DAY_LABELS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

  return (
    <div className="flex flex-col h-full">
      {/* Day-of-week header */}
      <div className="grid grid-cols-7 border-b border-border/50 shrink-0">
        {DAY_LABELS.map((d) => (
          <div key={d} className="py-2 text-center text-xs font-semibold text-muted-foreground uppercase">
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 flex-1 divide-y divide-border/40">
        {days.map((day) => {
          const dayEvents = events.filter((ev) => isSameDay(new Date(ev.pickup_datetime), day));
          const inMonth = isSameMonth(day, currentDate);
          return (
            <div
              key={day.toISOString()}
              className={`border-r border-border/40 last:border-r-0 p-1.5 flex flex-col gap-0.5 min-h-[90px] cursor-pointer hover:bg-muted/30 transition-colors ${
                !inMonth ? "opacity-40" : ""
              } ${isToday(day) ? "bg-primary/5" : ""}`}
              onClick={() => onDayClick(day)}
            >
              {/* Date number */}
              <span
                className={`text-sm font-semibold self-start leading-tight px-1 rounded-full ${
                  isToday(day)
                    ? "bg-primary text-primary-foreground w-6 h-6 flex items-center justify-center"
                    : "text-foreground"
                }`}
              >
                {format(day, "d")}
              </span>

              {/* Event chips — show max 3 + overflow */}
              {dayEvents.slice(0, 3).map((ev) => (
                <EventChip key={ev.id} ev={ev} />
              ))}
              {dayEvents.length > 3 && (
                <span className="text-[10px] text-muted-foreground pl-1">
                  +{dayEvents.length - 3} lainnya
                </span>
              )}
            </div>
          );
        })}
      </div>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/60 z-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DispatchPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("day");
  const [events, setEvents] = useState<any[]>([]);

  const { fetchDispatchEvents, isLoading } = useDispatch();

  // ── Compute date range based on current view ──
  const getRange = useCallback(
    (date: Date, mode: ViewMode) => {
      if (mode === "day") {
        return {
          start: new Date(`${format(date, "yyyy-MM-dd")}T00:00:00`),
          end: new Date(`${format(date, "yyyy-MM-dd")}T23:59:59.999`),
        };
      }
      if (mode === "week") {
        const ws = startOfWeek(date, { weekStartsOn: 1 });
        return { start: ws, end: endOfWeek(date, { weekStartsOn: 1 }) };
      }
      // month
      return { start: startOfMonth(date), end: endOfMonth(date) };
    },
    []
  );

  useEffect(() => {
    const { start, end } = getRange(currentDate, viewMode);
    fetchDispatchEvents(start.toISOString(), end.toISOString()).then((data) =>
      setEvents(data ?? [])
    );
  }, [currentDate, viewMode, fetchDispatchEvents, getRange]);

  // ── Navigation ──
  const handlePrev = () => {
    if (viewMode === "day")   setCurrentDate((d) => subDays(d, 1));
    if (viewMode === "week")  setCurrentDate((d) => subWeeks(d, 1));
    if (viewMode === "month") setCurrentDate((d) => subMonths(d, 1));
  };
  const handleNext = () => {
    if (viewMode === "day")   setCurrentDate((d) => addDays(d, 1));
    if (viewMode === "week")  setCurrentDate((d) => addWeeks(d, 1));
    if (viewMode === "month") setCurrentDate((d) => addMonths(d, 1));
  };

  // When user clicks a day in week/month view → switch to day view
  const handleDayClick = (day: Date) => {
    setCurrentDate(day);
    setViewMode("day");
  };

  // ── Title string ──
  const titleStr =
    viewMode === "day"
      ? format(currentDate, "EEEE, dd MMMM yyyy", { locale: id })
      : viewMode === "week"
      ? (() => {
          const ws = startOfWeek(currentDate, { weekStartsOn: 1 });
          const we = endOfWeek(currentDate, { weekStartsOn: 1 });
          return `${format(ws, "d MMM", { locale: id })} – ${format(we, "d MMM yyyy", { locale: id })}`;
        })()
      : format(currentDate, "MMMM yyyy", { locale: id });

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });

  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
      <PageHeader
        title="Kalender Dispatch"
        subtitle="Pusat kontrol operasional harian. Pantau jadwal, tugaskan supir, dan hindari konflik waktu."
        actions={
          <div className="flex items-center gap-2 bg-background border rounded-lg p-1">
            {(["day", "week", "month"] as ViewMode[]).map((m) => (
              <Button
                key={m}
                variant={viewMode === m ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode(m)}
              >
                {{ day: "Harian", week: "Mingguan", month: "Bulanan" }[m]}
              </Button>
            ))}
          </div>
        }
      />

      <Card className="flex-1 flex flex-col min-h-0 overflow-hidden border-border/60 shadow-sm">
        {/* ── Header bar ── */}
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
              {titleStr}
              {isLoading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground ml-2" />}
            </h2>
            <Button variant="ghost" size="sm" onClick={() => setCurrentDate(new Date())}>
              Hari Ini
            </Button>
          </div>

          {/* Legend */}
          <div className="flex gap-4 text-xs font-medium flex-wrap">
            {Object.entries(STATUS_LABELS).slice(0, 4).map(([key, label]) => (
              <div key={key} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${getColor(key).dot}`} />
                {label}
              </div>
            ))}
          </div>
        </CardHeader>

        {/* ── Calendar body ── */}
        <CardContent
          className={`flex-1 p-0 relative bg-slate-50/50 dark:bg-slate-900/20 ${
            viewMode === "day" || viewMode === "week" ? "overflow-y-auto" : "overflow-hidden flex flex-col"
          }`}
        >
          {viewMode === "day" && <DayView events={events} isLoading={isLoading} />}
          {viewMode === "week" && (
            <WeekView
              weekStart={weekStart}
              events={events}
              isLoading={isLoading}
              onDayClick={handleDayClick}
            />
          )}
          {viewMode === "month" && (
            <MonthView
              currentDate={currentDate}
              events={events}
              isLoading={isLoading}
              onDayClick={handleDayClick}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
