"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Upload, MapPin, Phone, Mail, Trash2, ImagePlus, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const BUCKET = "company-assets";
const LOGO_PATH = "logo/company-logo";

export default function SettingsProfilePage() {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    company_name: "",
    brand_name: "",
    npwp: "",
    nib: "",
    email: "",
    phone_wa: "",
    address: "",
    logo_url: "/logo.svg"
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

  // ── Logo Upload ─────────────────────────────────────────────────────────────

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const allowed = ["image/png", "image/svg+xml", "image/jpeg", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast.error("Format tidak didukung. Gunakan PNG, SVG, JPG, atau WebP.");
      return;
    }

    // Validate size (max 2 MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file terlalu besar. Maksimal 2 MB.");
      return;
    }

    // Show local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setLogoPreview(objectUrl);

    setIsUploadingLogo(true);
    try {
      // Determine file extension
      const ext = file.name.split(".").pop() ?? "png";
      const storagePath = `${LOGO_PATH}.${ext}`;

      // Upload (upsert) to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(storagePath);

      const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;

      // Immediately persist to DB
      const { error: dbError } = await supabase
        .from('company_settings')
        .upsert({ id: 1, logo_url: publicUrl, updated_at: new Date().toISOString() });

      if (dbError) throw dbError;

      setFormData(prev => ({ ...prev, logo_url: publicUrl }));
      setLogoPreview(null); // use the stored URL now
      toast.success("Logo berhasil diperbarui!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      toast.error("Gagal upload logo: " + msg);
      setLogoPreview(null); // revert preview
    } finally {
      setIsUploadingLogo(false);
      // Reset input so the same file can be re-selected if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveLogo = async () => {
    setIsUploadingLogo(true);
    try {
      // Reset to default logo
      const defaultLogo = "/logo.svg";
      const { error } = await supabase
        .from('company_settings')
        .upsert({ id: 1, logo_url: defaultLogo, updated_at: new Date().toISOString() });

      if (error) throw error;

      setFormData(prev => ({ ...prev, logo_url: defaultLogo }));
      setLogoPreview(null);
      toast.success("Logo berhasil direset ke default.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      toast.error("Gagal menghapus logo: " + msg);
    } finally {
      setIsUploadingLogo(false);
    }
  };

  // ── Save Form ───────────────────────────────────────────────────────────────

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

  const displayLogoSrc = logoPreview ?? formData.logo_url ?? "/logo.svg";
  const isDefaultLogo = !logoPreview && (formData.logo_url === "/logo.svg" || !formData.logo_url);

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

              {/* Logo preview container */}
              <div
                className="h-40 w-40 rounded-xl border border-border flex items-center justify-center bg-muted/10 relative overflow-hidden group cursor-pointer"
                onClick={!isUploadingLogo ? handleLogoClick : undefined}
                title="Klik untuk mengganti logo"
              >
                {/* Hover overlay */}
                {!isUploadingLogo && (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 rounded-xl">
                    <Upload className="h-8 w-8 text-white mb-2" />
                    <span className="text-xs text-white font-medium">Ubah Logo</span>
                  </div>
                )}

                {/* Loading overlay while uploading */}
                {isUploadingLogo && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-10 rounded-xl">
                    <Loader2 className="h-8 w-8 text-white animate-spin mb-2" />
                    <span className="text-xs text-white font-medium">Mengupload...</span>
                  </div>
                )}

                {/* Logo image */}
                <Image
                  src={displayLogoSrc}
                  alt="Logo Lombok Transfer"
                  fill
                  className="object-contain p-3"
                  unoptimized={displayLogoSrc.startsWith("blob:")}
                />
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/svg+xml,image/jpeg,image/webp"
                className="hidden"
                onChange={handleLogoFileChange}
                disabled={isUploadingLogo}
              />

              {/* Action buttons */}
              <div className="flex gap-2 w-full">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1.5"
                  onClick={handleLogoClick}
                  disabled={isUploadingLogo}
                >
                  <ImagePlus className="h-3.5 w-3.5" />
                  Pilih File
                </Button>
                {!isDefaultLogo && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-destructive hover:text-destructive hover:border-destructive"
                    onClick={handleRemoveLogo}
                    disabled={isUploadingLogo}
                    title="Reset ke logo default"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Format: PNG, SVG, JPG, WebP · Maks. 2 MB<br />
                Disarankan minimal 512×512 px, transparan.
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
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
