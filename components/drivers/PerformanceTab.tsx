"use client";

import React from "react";
import { useDriverPerformance } from "@/hooks/useDrivers";
import { Card, CardContent } from "@/components/ui/card";
import { Star, CheckCircle, Clock, AlertCircle, TrendingUp } from "lucide-react";

interface PerformanceTabProps {
  driverId: string;
}

function MetricCard({ icon: Icon, label, value, color = "text-primary", suffix = "" }: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  color?: string;
  suffix?: string;
}) {
  return (
    <Card>
      <CardContent className="pt-5 pb-4 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center ${color} flex-shrink-0`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className={`text-2xl font-bold ${color}`}>{value}{suffix}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PerformanceTab({ driverId }: PerformanceTabProps) {
  const { performance, isLoading } = useDriverPerformance(driverId);

  if (isLoading) return <p className="text-muted-foreground text-sm p-4">Memuat data performa...</p>;

  if (!performance) return <p className="text-center py-8 text-muted-foreground">Data performa belum tersedia.</p>;

  // Generate star display
  const fullStars = Math.floor(performance.avg_rating);
  const hasHalf = performance.avg_rating % 1 >= 0.5;

  return (
    <div className="space-y-6">
      {/* Scorecard */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="col-span-2 md:col-span-1">
          <CardContent className="pt-5 pb-4 text-center">
            <div className="flex justify-center gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 ${i < fullStars ? "fill-amber-400 text-amber-400" : i === fullStars && hasHalf ? "fill-amber-200 text-amber-400" : "text-muted-foreground"}`}
                />
              ))}
            </div>
            <p className="text-3xl font-bold text-amber-500">{performance.avg_rating || "-"}</p>
            <p className="text-xs text-muted-foreground mt-1">Rating Rata-rata Tamu</p>
          </CardContent>
        </Card>

        <MetricCard icon={CheckCircle} label="Completion Rate" value={performance.completion_rate} suffix="%" color="text-green-500" />
        <MetricCard icon={Clock} label="On-time Rate" value={performance.on_time_rate} suffix="%" color="text-blue-500" />
        <MetricCard icon={TrendingUp} label="Total Trip (All Time)" value={performance.total_trips} color="text-primary" />
        <MetricCard icon={CheckCircle} label="Trip Selesai" value={performance.completed_trips} color="text-green-500" />
        <MetricCard icon={AlertCircle} label="Total Komplain" value={performance.total_complaints} color="text-destructive" />
      </div>

      {/* Ranking placeholder */}
      <Card>
        <CardContent className="pt-5 pb-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Posisi Ranking</h3>
          <p className="text-muted-foreground text-sm">Fitur ranking antar supir akan tersedia setelah data lebih lengkap.</p>
        </CardContent>
      </Card>
    </div>
  );
}
