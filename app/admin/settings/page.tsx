"use client";

import React from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Shield, Bell, Key, Users, Sliders } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const settingsModules = [
  {
    title: "Profil Perusahaan",
    description: "Atur nama, alamat, kontak, dan logo perusahaan Lombok Transfer.",
    icon: <Settings className="h-6 w-6 text-blue-500" />,
    href: "/admin/settings/profile",
    status: "active"
  },
  {
    title: "Audit Logs",
    description: "Pantau seluruh rekam jejak aktivitas, perubahan data, dan akses sistem.",
    icon: <Shield className="h-6 w-6 text-emerald-500" />,
    href: "/admin/settings/audit-logs",
    status: "active"
  },
  {
    title: "Manajemen Pengguna",
    description: "Kelola hak akses admin, operator, dan batasan peran masing-masing.",
    icon: <Users className="h-6 w-6 text-indigo-500" />,
    href: "/admin/settings/users",
    status: "coming_soon"
  },
  {
    title: "API & Integrasi",
    description: "Konfigurasi token Fonnte, n8n webhook, dan kunci API OpenRouter.",
    icon: <Key className="h-6 w-6 text-amber-500" />,
    href: "/admin/settings/integrations",
    status: "coming_soon"
  },
  {
    title: "Notifikasi Sistem",
    description: "Atur template pesan WA dan trigger notifikasi otomatis.",
    icon: <Bell className="h-6 w-6 text-rose-500" />,
    href: "/admin/settings/notifications",
    status: "coming_soon"
  },
  {
    title: "Preferensi Tampilan",
    description: "Sesuaikan tema, bahasa, dan format tanggal default sistem.",
    icon: <Sliders className="h-6 w-6 text-purple-500" />,
    href: "/admin/settings/preferences",
    status: "coming_soon"
  }
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Pengaturan Sistem"
        subtitle="Kelola konfigurasi global, keamanan, dan integrasi Lombok Transfer."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {settingsModules.map((mod, idx) => (
          <Card key={idx} className={`relative overflow-hidden transition-all hover:shadow-md ${mod.status === 'coming_soon' ? 'opacity-70 grayscale-[30%]' : ''}`}>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-muted/50 border">
                  {mod.icon}
                </div>
                <div>
                  <CardTitle className="text-lg">{mod.title}</CardTitle>
                  {mod.status === 'coming_soon' && (
                    <span className="inline-block mt-1 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      Coming Soon
                    </span>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-6 h-10">
                {mod.description}
              </CardDescription>
              {mod.status === "active" ? (
                <Link href={mod.href} className="w-full">
                  <Button variant="outline" className="w-full bg-background hover:bg-muted">
                    Buka Pengaturan
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" className="w-full" disabled>
                  Dalam Pengembangan
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
