"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Driver } from "@/hooks/useDrivers";
import { Card, CardContent } from "@/components/ui/card";
import StatusBadge from "@/components/shared/StatusBadge";
import { Phone, Star, AlertTriangle } from "lucide-react";
import { StatusType } from "@/components/shared/StatusBadge";

interface DriverCardProps {
  driver: Driver;
  hasExpiringDocs?: boolean;
}

export default function DriverCard({ driver, hasExpiringDocs }: DriverCardProps) {
  const statusLabel = driver.status === "cuti" ? "Cuti" : undefined;

  return (
    <Link href={`/drivers/${driver.id}`}>
      <Card className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group relative">
        {hasExpiringDocs && (
          <div className="absolute top-3 right-3 z-10" title="Ada dokumen yang akan kadaluarsa">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
        )}
        <CardContent className="pt-5 pb-4">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg flex-shrink-0 ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all">
              {driver.avatar_url ? (
                <Image src={driver.avatar_url} alt={driver.full_name} width={56} height={56} className="w-full h-full rounded-full object-cover" />
              ) : (
                driver.full_name.charAt(0).toUpperCase()
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{driver.full_name}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                <Phone className="w-3 h-3" />
                <span>{driver.phone_wa}</span>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <StatusBadge status={driver.status as StatusType} label={statusLabel} />
                <span className="text-xs text-muted-foreground capitalize">
                  {driver.employment_type === "karyawan" ? "Karyawan" : "Mitra Lepas"}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Komisi</p>
              <p className="font-semibold text-sm">{driver.commission_percentage}%</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Rating</p>
              <p className="font-semibold text-sm flex items-center justify-center gap-1">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> 4.8
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Bergabung</p>
              <p className="font-semibold text-sm">
                {driver.joined_at ? new Date(driver.joined_at).getFullYear() : "-"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
