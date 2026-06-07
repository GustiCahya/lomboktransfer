"use client";

import React, { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Download, Upload, CheckCircle } from "lucide-react";

export default function SOPPage() {
  const [activeTab, setActiveTab] = useState<"library" | "onboarding">("library");

  const SOPS = [
    { title: "SOP Keselamatan Berkendara", category: "Safety", date: "10 Mei 2026", size: "2.4 MB" },
    { title: "SOP Layanan Tamu VIP", category: "Service", date: "12 Mei 2026", size: "1.1 MB" },
    { title: "Prosedur Keadaan Darurat", category: "Safety", date: "15 Mei 2026", size: "800 KB" },
    { title: "Panduan Rute Utama Lombok", category: "Operations", date: "01 Jun 2026", size: "4.5 MB" },
  ];

  const ONBOARDING_CHECKLIST = [
    "Membaca SOP Keselamatan Berkendara",
    "Membaca SOP Layanan Tamu VIP",
    "Mengikuti Training Rute Utama",
    "Test Drive dengan Supervisor",
    "Pengecekan Seragam & Kelengkapan",
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="SOP & Pelatihan Supir"
        subtitle="Kelola standar operasional prosedur dan checklist onboarding supir baru."
        actions={
          <Button className="gap-2">
            <Upload className="w-4 h-4" /> Upload SOP Baru
          </Button>
        }
      />

      <div className="flex border-b gap-6">
        <button
          onClick={() => setActiveTab("library")}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "library" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          Library SOP
        </button>
        <button
          onClick={() => setActiveTab("onboarding")}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "onboarding" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          Checklist Onboarding
        </button>
      </div>

      {activeTab === "library" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SOPS.map((sop, i) => (
            <Card key={i} className="hover:border-primary/50 transition-colors cursor-pointer group">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate" title={sop.title}>{sop.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{sop.category} • {sop.size}</p>
                  <p className="text-xs text-muted-foreground">Diperbarui {sop.date}</p>
                </div>
                <Button variant="ghost" size="icon" className="flex-shrink-0">
                  <Download className="w-4 h-4 text-muted-foreground" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "onboarding" && (
        <Card className="max-w-2xl">
          <CardContent className="p-6 space-y-6">
            <div>
              <h3 className="font-semibold text-lg">Template Checklist Onboarding</h3>
              <p className="text-sm text-muted-foreground">Checklist ini akan otomatis ditugaskan ke setiap supir baru saat pertama kali ditambahkan ke sistem.</p>
            </div>
            
            <div className="space-y-3">
              {ONBOARDING_CHECKLIST.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-md border bg-muted/30">
                  <CheckCircle className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full border-dashed">
              + Tambah Item Checklist
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
