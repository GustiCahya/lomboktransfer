"use client";

import React from "react";
import Image from "next/image";
import { Vehicle } from "@/hooks/useVehicles";
import { Card, CardContent } from "@/components/ui/card";
import { VehicleStatusBadge } from "./VehicleCard";
import { Car, Hash, Info, User, Tag, Cog } from "lucide-react";

interface VehicleIdentityProps {
  vehicle: Vehicle & { drivers?: { full_name: string } };
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="font-medium text-sm">{value || <span className="text-muted-foreground italic">-</span>}</div>
      </div>
    </div>
  );
}

export default function VehicleIdentity({ vehicle }: VehicleIdentityProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Photo Gallery (Simplified for now) */}
      <div className="space-y-4">
        <Card className="overflow-hidden">
          <div className="relative h-64 bg-muted flex items-center justify-center">
            {vehicle.photo_url ? (
              <Image src={vehicle.photo_url} alt={vehicle.brand} fill className="object-cover" />
            ) : (
              <Car className="w-24 h-24 text-muted-foreground/30" />
            )}
            <div className="absolute top-4 left-4">
              <VehicleStatusBadge status={vehicle.status} />
            </div>
          </div>
        </Card>
      </div>

      {/* Specifications */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><Info className="w-4 h-4 text-primary" /> Spesifikasi Utama</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow icon={Car} label="Merek & Model" value={`${vehicle.brand} ${vehicle.model}`} />
              <InfoRow icon={Tag} label="Tahun Pembuatan" value={vehicle.year} />
              <InfoRow icon={Hash} label="Kapasitas Penumpang" value={`${vehicle.capacity} Orang`} />
              <InfoRow icon={Car} label="Warna" value={vehicle.color} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><Cog className="w-4 h-4 text-primary" /> Detail Administrasi</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow icon={Hash} label="Nomor Polisi (TNKB)" value={<span className="font-mono bg-muted px-2 py-0.5 rounded">{vehicle.plate_number}</span>} />
              <InfoRow icon={Hash} label="Kode Unit Internal" value={vehicle.unit_code} />
              <InfoRow icon={User} label="Supir Default" value={vehicle.drivers?.full_name || "Belum ditentukan"} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
