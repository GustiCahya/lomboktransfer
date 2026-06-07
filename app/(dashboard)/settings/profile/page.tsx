"use client";

import React, { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Upload, Building2, MapPin, Phone, Mail } from "lucide-react";

export default function SettingsProfilePage() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Profil Perusahaan" 
        subtitle="Kelola informasi identitas, alamat, dan kontak resmi Lombok Transfer."
      />

      <div className="grid gap-6 md:grid-cols-3">
        {/* Logo & Branding */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Logo Perusahaan</CardTitle>
              <CardDescription>Logo ini akan muncul di invoice, email, dan aplikasi driver.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-4">
              <div className="h-40 w-40 rounded-xl border-2 border-dashed border-border/60 flex items-center justify-center bg-muted/20 relative overflow-hidden group">
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Upload className="h-8 w-8 text-white mb-2" />
                  <span className="text-xs text-white font-medium">Ubah Logo</span>
                </div>
                <Building2 className="h-16 w-16 text-muted-foreground/30" />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Format yang disarankan: PNG atau SVG transparan, minimal 512x512px.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Informasi Utama */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informasi Legal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nama Perusahaan (Legal)</Label>
                  <Input id="companyName" defaultValue="PT Lombok Transfer Pariwisata" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brandName">Nama Brand (Operasional)</Label>
                  <Input id="brandName" defaultValue="Lombok Transfer" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="npwp">NPWP Perusahaan</Label>
                  <Input id="npwp" defaultValue="12.345.678.9-000.000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nib">Nomor Induk Berusaha (NIB)</Label>
                  <Input id="nib" defaultValue="1234567890123" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Kontak & Alamat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2"><Mail className="h-3 w-3"/> Email Resmi</Label>
                  <Input id="email" type="email" defaultValue="info@lomboktransfer.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2"><Phone className="h-3 w-3"/> Nomor Telepon (WA CS)</Label>
                  <Input id="phone" defaultValue="+62 812-3456-7890" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2"><MapPin className="h-3 w-3"/> Alamat Kantor</Label>
                <Textarea id="address" rows={3} defaultValue="Jl. Pariwisata No. 123, Senggigi, Batu Layar, Kabupaten Lombok Barat, Nusa Tenggara Barat 83355" />
              </div>
            </CardContent>
            <CardFooter className="bg-muted/20 px-6 py-4 border-t flex justify-end">
              <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                {isSaving ? <span className="animate-spin text-lg">↻</span> : <Save className="h-4 w-4" />}
                {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
