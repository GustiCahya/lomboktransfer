"use client";

import React from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, Clock, FileText, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const legalModules = [
  {
    title: "Dokumen Perusahaan",
    description: "Kelola legalitas perusahaan (SIUP, NPWP, Akta, dll) beserta file arsip digitalnya.",
    icon: <Scale className="h-6 w-6 text-emerald-500" />,
    href: "/admin/legal/company-docs",
  },
  {
    title: "Expiry Tracker",
    description: "Konsolidasi masa berlaku dokumen supir, kendaraan, dan perusahaan dalam satu dashboard.",
    icon: <Clock className="h-6 w-6 text-rose-500" />,
    href: "/admin/legal/expiry-tracker",
  },
  {
    title: "Kontrak Mitra",
    description: "Lacak masa kontrak kerja sama dengan supir mitra, agen travel, dan hotel.",
    icon: <FileText className="h-6 w-6 text-blue-500" />,
    href: "/admin/legal/contracts",
  },
  {
    title: "Kepatuhan Data (Privacy)",
    description: "Log akses data sensitif dan manajemen retensi penghapusan data tamu.",
    icon: <Lock className="h-6 w-6 text-indigo-500" />,
    href: "/admin/legal/data-compliance",
  }
];

export default function LegalPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Legal & Compliance"
        subtitle="Pusat kepatuhan hukum operasi, peringatan kadaluarsa dokumen, dan manajemen kontrak."
      />

      <div className="grid gap-6 md:grid-cols-2">
        {legalModules.map((mod, idx) => (
          <Card key={idx} className="group relative overflow-hidden transition-all hover:shadow-md border-border/50 hover:border-primary/30">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-background border shadow-sm group-hover:scale-110 transition-transform">
                  {mod.icon}
                </div>
                <div>
                  <CardTitle className="text-xl">{mod.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base mb-6">
                {mod.description}
              </CardDescription>
              <Link href={mod.href} className="w-full">
                <Button className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors" variant="outline">
                  Buka Modul <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-6 rounded-xl border bg-muted/30 border-dashed">
        <h3 className="font-medium text-lg mb-2">💡 Info Kepatuhan Operasional</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Sistem akan memberikan peringatan otomatis via notifikasi dan WhatsApp ketika dokumen perusahaan, STNK kendaraan, atau SIM supir mendekati masa kadaluarsa dalam 60 hari. Pastikan semua file scan terbaru telah diunggah ke dalam sistem.
        </p>
      </div>
    </div>
  );
}
