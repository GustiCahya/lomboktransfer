"use client";

import React from "react";
import Image from "next/image";
import { Driver } from "@/hooks/useDrivers";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/shared/StatusBadge";
import { StatusType } from "@/components/shared/StatusBadge";
import { formatTanggal, formatPhone } from "@/lib/utils/format";
import { Phone, Mail, MapPin, CreditCard, User, Briefcase, Calendar } from "lucide-react";

interface DriverProfileProps {
  driver: Driver & { vehicles?: { brand: string; model: string; plate_number: string } };
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string | null }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium text-sm">{value || <span className="text-muted-foreground italic">Belum diisi</span>}</p>
      </div>
    </div>
  );
}

export default function DriverProfile({ driver }: DriverProfileProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left col: Avatar + quick stats */}
      <div className="space-y-4">
        <Card>
          <CardContent className="pt-6 flex flex-col items-center text-center gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold ring-4 ring-primary/20">
                {driver.avatar_url ? (
                  <Image src={driver.avatar_url} alt={driver.full_name} width={96} height={96} className="w-full h-full rounded-full object-cover" />
                ) : (
                  driver.full_name.charAt(0).toUpperCase()
                )}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold">{driver.full_name}</h2>
              <p className="text-sm text-muted-foreground capitalize">
                {driver.employment_type === "karyawan" ? "Karyawan Tetap" : "Mitra Lepas"}
              </p>
              <div className="mt-2">
                <StatusBadge status={driver.status as StatusType} label={driver.status === "cuti" ? "Sedang Cuti" : undefined} />
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full">Edit Profil</Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Info Cepat</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Komisi</span>
                <span className="font-bold text-primary">{driver.commission_percentage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bergabung</span>
                <span className="font-medium">{driver.joined_at ? formatTanggal(driver.joined_at) : "-"}</span>
              </div>
              {driver.vehicles && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Kendaraan</span>
                  <span className="font-medium">{driver.vehicles.plate_number}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right col: Detail fields */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><User className="w-4 h-4 text-primary" /> Data Pribadi</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow icon={User} label="NIK" value={driver.nik} />
              <InfoRow icon={Calendar} label="Tanggal Lahir" value={driver.date_of_birth ? formatTanggal(driver.date_of_birth) : null} />
              <InfoRow icon={MapPin} label="Alamat" value={driver.address} />
              <InfoRow icon={Phone} label="WhatsApp" value={driver.phone_wa ? formatPhone(driver.phone_wa) : null} />
              <InfoRow icon={Mail} label="Email" value={driver.email} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><CreditCard className="w-4 h-4 text-primary" /> Rekening Bank</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow icon={Briefcase} label="Nama Bank" value={driver.bank_name} />
              <InfoRow icon={CreditCard} label="No. Rekening" value={driver.bank_account} />
              <InfoRow icon={User} label="Atas Nama" value={driver.bank_account_name} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> Kontak Darurat</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow icon={User} label="Nama" value={driver.emergency_contact_name} />
              <InfoRow icon={Phone} label="Nomor HP" value={driver.emergency_contact_phone ? formatPhone(driver.emergency_contact_phone) : null} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
