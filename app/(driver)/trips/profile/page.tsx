"use client";

import React from "react";
import { useDriverProfile } from "@/hooks/useDriverProfile";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, LogOut, Star, TrendingUp, CheckCircle, Car } from "lucide-react";
import Link from "next/link";
import StatusBadge from "@/components/shared/StatusBadge";
import { formatRupiah } from "@/lib/utils/format";

export default function DriverProfilePage() {
  const { profile, isLoading } = useDriverProfile();

  if (isLoading) {
    return <div className="p-12 text-center text-muted-foreground text-sm">Memuat profil...</div>;
  }

  if (!profile) {
    return <div className="p-12 text-center text-destructive text-sm">Gagal memuat profil.</div>;
  }

  // Placeholder data for performance
  const performance = {
    totalTrips: 24,
    rating: 4.8,
    estKomisi: 1250000,
  };

  return (
    <div className="flex flex-col h-full bg-muted/10 pb-20">
      <header className="bg-primary text-primary-foreground pt-12 pb-16 px-4 relative shadow-sm">
        <h1 className="text-xl font-bold">Profile</h1>
      </header>

      <div className="px-4 -mt-10 relative z-10 space-y-4">
        {/* Profile Card */}
        <Card className="shadow-md border-muted">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-16 h-16 bg-muted rounded-full overflow-hidden flex items-center justify-center border-2 border-background">
              {profile.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.photo_url} alt={profile.full_name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-muted-foreground/50" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold leading-tight">{profile.full_name}</h2>
              <p className="text-sm text-muted-foreground mb-2">{profile.phone_wa}</p>
              <StatusBadge status={profile.status} />
            </div>
          </CardContent>
        </Card>

        {/* Performance Summary */}
        <h3 className="font-semibold px-1 mt-6 mb-2">Ringkasan Performa (Bulan Ini)</h3>
        <div className="grid grid-cols-2 gap-3">
          <Card className="shadow-sm">
            <CardContent className="p-3">
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <Car className="w-3 h-3" /> Total Trip
              </p>
              <p className="text-xl font-bold">{performance.totalTrips}</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-3">
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-500" /> Rating
              </p>
              <p className="text-xl font-bold">{performance.rating}</p>
            </CardContent>
          </Card>
          <Card className="col-span-2 shadow-sm bg-primary/5 border-primary/20">
            <CardContent className="p-3">
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-primary" /> Estimasi Komisi Sementara
              </p>
              <p className="text-2xl font-bold text-primary">{formatRupiah(performance.estKomisi)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Action List */}
        <div className="mt-6 space-y-3">
          <Link href="/trips/profile/documents" className="block">
            <Card className="shadow-sm hover:bg-muted/50 transition-colors">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div className="font-medium">Dokumen Saya</div>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/trips/profile/payroll" className="block">
            <Card className="shadow-sm hover:bg-muted/50 transition-colors">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div className="font-medium">Riwayat Payroll</div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="mt-8">
          <Button variant="outline" className="w-full gap-2 text-destructive border-destructive/20 hover:bg-destructive/10">
            <LogOut className="w-4 h-4" /> Keluar
          </Button>
          <p className="text-center text-xs text-muted-foreground mt-4">
            Lombok Transfer App v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}
