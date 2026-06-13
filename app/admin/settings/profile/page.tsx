"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Upload, MapPin, Phone, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function SettingsProfilePage() {
  const supabase = createClient();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    company_name: "",
    brand_name: "",
    npwp: "",
    nib: "",
    email: "",
    phone_wa: "",
    address: "",
    logo_url: "/logo.png"
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('company_settings')
        .select('*')
        .eq('id', 1)
        .single();
        
      if (data) {
        setFormData(data);
      } else if (error && error.code !== 'PGRST116') {
        toast.error("Gagal memuat pengaturan");
      }
      setIsLoading(false);
    };
    
    fetchSettings();
  }, [supabase]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const { error } = await supabase
      .from('company_settings')
      .upsert({ id: 1, ...formData, updated_at: new Date().toISOString() });
      
    if (error) {
      toast.error("Gagal menyimpan pengaturan: " + error.message);
    } else {
      toast.success("Pengaturan berhasil disimpan");
    }
    setIsSaving(false);
  };

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Memuat data...</div>;

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
              <div className="h-40 w-40 rounded-xl border border-border flex items-center justify-center bg-muted/10 relative overflow-hidden group">
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10">
                  <Upload className="h-8 w-8 text-white mb-2" />
                  <span className="text-xs text-white font-medium">Ubah Logo</span>
                </div>
                <Image 
                  src={formData.logo_url || "/logo.png"} 
                  alt="Logo Lombok Transfer" 
                  fill
                  className="object-cover"
                />
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
                  <Input id="companyName" value={formData.company_name} onChange={(e) => handleChange('company_name', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brandName">Nama Brand (Operasional)</Label>
                  <Input id="brandName" value={formData.brand_name} onChange={(e) => handleChange('brand_name', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="npwp">NPWP Perusahaan</Label>
                  <Input id="npwp" value={formData.npwp} onChange={(e) => handleChange('npwp', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nib">Nomor Induk Berusaha (NIB)</Label>
                  <Input id="nib" value={formData.nib} onChange={(e) => handleChange('nib', e.target.value)} />
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
                  <Input id="email" type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2"><Phone className="h-3 w-3"/> Nomor Telepon (WA CS)</Label>
                  <Input id="phone" value={formData.phone_wa} onChange={(e) => handleChange('phone_wa', e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2"><MapPin className="h-3 w-3"/> Alamat Kantor</Label>
                <Textarea id="address" rows={3} value={formData.address} onChange={(e) => handleChange('address', e.target.value)} />
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
