/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, MessageCircle, Clock, Navigation, CheckCircle, Car } from "lucide-react";
import StatusUpdateButton from "./StatusUpdateButton";

interface TripCardProps {
  trip: any;
  onStatusUpdate: (id: string, status: string) => Promise<void>;
}

export default function TripCard({ trip, onStatusUpdate }: TripCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const pickupTime = new Date(trip.pickup_datetime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  const guestName = trip.guests?.full_name || "Tamu";
  const guestPhone = trip.guests?.phone_wa || "";
  const routeStart = trip.routes?.start_location || "Lokasi Jemput";
  const routeEnd = trip.routes?.end_location || "Lokasi Tujuan";
  
  // Format phone number for WA link (remove leading 0 and add 62)
  const formatWaNumber = (num: string) => {
    if (!num) return "";
    let formatted = num.replace(/\D/g, "");
    if (formatted.startsWith("0")) formatted = "62" + formatted.substring(1);
    return formatted;
  };

  const waLink = `https://wa.me/${formatWaNumber(guestPhone)}`;
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(routeStart)}`;

  // Determine next status action
  let nextActionLabel = "";
  let nextStatus = "";
  let ActionIcon = Car;

  if (trip.status === "driver_assigned") {
    nextActionLabel = "Menuju Lokasi Tamu";
    nextStatus = "in_progress"; // Sub-status ideally handled by backend
    ActionIcon = Navigation;
  } else if (trip.status === "in_progress") {
    // Assuming we don't have sub-status implemented yet, we jump to completed
    // In a real app, we'd check sub-status to show "Tamu Sudah Dijemput"
    nextActionLabel = "Selesaikan Trip";
    nextStatus = "completed";
    ActionIcon = CheckCircle;
  }

  const handleAction = async () => {
    if (!nextStatus) return;
    setIsUpdating(true);
    await onStatusUpdate(trip.id, nextStatus);
    setIsUpdating(false);
  };

  return (
    <Card className="overflow-hidden shadow-md border-muted">
      <div className={`h-2 ${trip.status === 'completed' ? 'bg-green-500' : trip.status === 'in_progress' ? 'bg-blue-500' : 'bg-primary'}`} />
      <CardContent className="p-0">
        <div className="p-4 border-b">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2 text-primary font-bold text-xl">
              <Clock className="w-5 h-5" />
              {pickupTime}
            </div>
            <div className="px-2.5 py-1 text-xs font-semibold rounded-full bg-muted capitalize">
              {trip.status.replace("_", " ")}
            </div>
          </div>
          
          <h3 className="text-lg font-bold mb-1">{guestName}</h3>
          <p className="text-sm text-muted-foreground flex items-center gap-2 mb-3">
            <span className="bg-secondary px-2 py-0.5 rounded text-xs">{trip.pax_count} Pax</span>
            <span className="bg-secondary px-2 py-0.5 rounded text-xs">{trip.luggage_count} Koper</span>
          </p>

          <div className="flex flex-col gap-2 relative">
            <div className="absolute left-[9px] top-[14px] bottom-[14px] w-0.5 bg-muted-foreground/30"></div>
            <div className="flex items-start gap-3 relative z-10">
              <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mt-0.5 shadow-sm">
                <MapPin className="w-3 h-3" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Jemput</p>
                <p className="font-medium text-sm leading-tight">{routeStart}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 relative z-10">
              <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center mt-0.5 shadow-sm">
                <MapPin className="w-3 h-3" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Antar</p>
                <p className="font-medium text-sm leading-tight">{routeEnd}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex p-2 bg-muted/30">
          <a href={`tel:${guestPhone}`} className="flex-1 px-1">
            <Button variant="outline" className="w-full gap-2 text-blue-600 border-blue-200 hover:bg-blue-50" disabled={!guestPhone}>
              <Phone className="w-4 h-4" /> Telepon
            </Button>
          </a>
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex-1 px-1">
            <Button variant="outline" className="w-full gap-2 text-green-600 border-green-200 hover:bg-green-50" disabled={!guestPhone}>
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </Button>
          </a>
          <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="flex-1 px-1">
            <Button variant="outline" className="w-full gap-2 text-primary border-primary/20 hover:bg-primary/5">
              <Navigation className="w-4 h-4" /> Maps
            </Button>
          </a>
        </div>

        {nextActionLabel && (
          <div className="p-4 bg-muted/10 border-t">
            <StatusUpdateButton 
              label={nextActionLabel} 
              icon={ActionIcon} 
              onClick={handleAction} 
              isLoading={isUpdating} 
              colorClass={trip.status === 'in_progress' ? 'bg-green-600 hover:bg-green-700' : 'bg-primary hover:bg-primary/90'}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
