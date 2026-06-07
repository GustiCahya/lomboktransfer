"use client";

import React, { useState } from "react";
import { useDriverTrips } from "@/hooks/useDriverTrips";
import TripCard from "@/components/driver/TripCard";
import { Loader2 } from "lucide-react";

export default function TripsHomePage() {
  const { todayTrips, isLoading, refetch, updateTripStatus } = useDriverTrips();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const handleStatusUpdate = async (tripId: string, newStatus: string) => {
    await updateTripStatus(tripId, newStatus);
  };

  return (
    <div className="flex flex-col h-full bg-muted/10">
      <header className="bg-primary text-primary-foreground pt-12 pb-4 px-4 sticky top-0 z-10 shadow-sm">
        <h1 className="text-xl font-bold">Trip Hari Ini</h1>
        <p className="text-primary-foreground/80 text-sm">{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </header>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {/* Simple pull to refresh mockup button since native pull-to-refresh requires complex touch handling */}
        <div className="flex justify-center mb-2">
          <button 
            onClick={handleRefresh}
            className="text-xs text-muted-foreground bg-card border rounded-full px-3 py-1 shadow-sm flex items-center gap-2"
          >
            {isRefreshing ? <Loader2 className="w-3 h-3 animate-spin" /> : "↓"} {isRefreshing ? "Memuat ulang..." : "Tarik untuk refresh"}
          </button>
        </div>

        {isLoading && !isRefreshing ? (
          <div className="flex flex-col items-center justify-center h-48 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Mencari trip hari ini...</p>
          </div>
        ) : todayTrips.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center px-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 text-2xl">🎉</div>
            <h3 className="text-lg font-semibold mb-1">Tidak ada trip hari ini</h3>
            <p className="text-muted-foreground text-sm">Selamat beristirahat atau tunggu notifikasi penugasan baru dari dispatcher.</p>
          </div>
        ) : (
          todayTrips.map(trip => (
            <TripCard key={trip.id} trip={trip} onStatusUpdate={handleStatusUpdate} />
          ))
        )}
      </div>
    </div>
  );
}
