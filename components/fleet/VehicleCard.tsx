"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Vehicle } from "@/hooks/useVehicles";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, AlertTriangle, PenTool, Wrench } from "lucide-react";

export function VehicleStatusBadge({ status }: { status: Vehicle["status"] }) {
  const map: Record<string, { label: string; className: string }> = {
    active: { label: "Aktif", className: "bg-green-500/10 text-green-600 border-green-200" },
    maintenance: { label: "Perawatan", className: "bg-amber-500/10 text-amber-600 border-amber-200" },
    inactive: { label: "Tidak Aktif", className: "bg-muted text-muted-foreground" },
    sold: { label: "Dijual", className: "bg-destructive/10 text-destructive border-destructive/20" },
  };
  const { label, className } = map[status] || map.inactive;
  return <Badge variant="outline" className={`font-medium ${className}`}>{label}</Badge>;
}

export default function VehicleCard({ vehicle, hasAlert = false }: { vehicle: Vehicle; hasAlert?: boolean }) {
  const serviceProgress = vehicle.next_service_km && vehicle.last_service_km
    ? Math.min(100, Math.max(0, ((vehicle.current_km - vehicle.last_service_km) / (vehicle.next_service_km - vehicle.last_service_km)) * 100))
    : 0;

  const isServiceDueSoon = serviceProgress > 90;

  return (
    <Link href={`/fleet/${vehicle.id}`}>
      <Card className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group overflow-hidden">
        {/* Photo area */}
        <div className="relative h-40 bg-muted flex items-center justify-center overflow-hidden">
          {vehicle.photo_url ? (
            <Image src={vehicle.photo_url} alt={vehicle.brand} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <Car className="w-16 h-16 text-muted-foreground/30" />
          )}
          <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold shadow-sm">
            {vehicle.unit_code}
          </div>
          {(hasAlert || isServiceDueSoon) && (
            <div className="absolute top-3 right-3 bg-amber-500 text-white p-1.5 rounded-full shadow-sm">
              <AlertTriangle className="w-4 h-4" />
            </div>
          )}
        </div>

        <CardContent className="pt-4 space-y-4">
          <div>
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-bold text-lg leading-tight truncate">{vehicle.brand} {vehicle.model}</h3>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="font-mono">{vehicle.plate_number}</Badge>
              <VehicleStatusBadge status={vehicle.status} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm border-t pt-3">
            <div>
              <p className="text-xs text-muted-foreground">Tahun</p>
              <p className="font-medium">{vehicle.year}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Kapasitas</p>
              <p className="font-medium">{vehicle.capacity} Pax</p>
            </div>
          </div>

          {/* Service Progress */}
          <div className="bg-muted/50 rounded-md p-3">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="flex items-center gap-1 text-muted-foreground"><PenTool className="w-3 h-3" /> KM Saat Ini</span>
              <span className="font-medium">{vehicle.current_km.toLocaleString()}</span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full ${isServiceDueSoon ? 'bg-destructive' : 'bg-primary'}`} 
                style={{ width: `${serviceProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs mt-1.5">
              <span className="text-muted-foreground flex items-center gap-1"><Wrench className="w-3 h-3" /> Next Service</span>
              <span className="font-medium">{vehicle.next_service_km ? vehicle.next_service_km.toLocaleString() : "-"}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
