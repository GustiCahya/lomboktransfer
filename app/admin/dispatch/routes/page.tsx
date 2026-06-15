/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Plus, Pencil, Trash2, MapPin, Clock, Banknote,
  CheckCircle2, XCircle, Loader2, ArrowRightLeft, Search, AlertTriangle,
  ImageIcon, X, ExternalLink
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { IMAGES } from "@/lib/constants/images";

type Route = {
  id: string;
  name: string;
  origin: string;
  destination: string;
  base_price: number;
  is_active: boolean;
  estimated_duration_min: number | null;
  notes: string | null;
  image_url: string | null;
};

const EMPTY_FORM: Omit<Route, "id"> = {
  name: "",
  origin: "",
  destination: "",
  base_price: 0,
  is_active: true,
  estimated_duration_min: null,
  notes: "",
  image_url: "",
};

function formatIDR(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}

function formatDuration(min: number | null) {
  if (!min) return "-";
  if (min < 60) return `${min} menit`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m > 0 ? `${h} jam ${m} menit` : `${h} jam`;
}

/** Resolve a route's display image: prefer stored image_url, then keyword-match from IMAGES.DESTINATIONS */
function resolveImage(route: Pick<Route, "name" | "origin" | "destination" | "image_url">): string | null {
  if (route.image_url) return route.image_url;
  const text = `${route.name} ${route.origin} ${route.destination}`.toLowerCase();
  for (const [key, url] of Object.entries(IMAGES.DESTINATIONS)) {
    if (text.includes(key)) return url;
  }
  return null;
}

// ─── Lightbox ────────────────────────────────────────────────────────────────

function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/80 hover:text-white transition-colors flex items-center gap-1.5 text-sm"
        >
          <X className="w-4 h-4" /> Tutup (Esc)
        </button>
        <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl">
          <Image src={src} alt={alt} fill className="object-cover" unoptimized />
        </div>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-white/60 hover:text-white text-xs mt-3 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="w-3 h-3" /> Buka di tab baru
        </a>
      </div>
    </div>
  );
}

// ─── Image Preview Thumbnail ──────────────────────────────────────────────────

function ImageThumb({ src, alt }: { src: string; alt: string }) {
  const [lightbox, setLightbox] = useState(false);
  const [err, setErr] = useState(false);

  if (err) {
    return (
      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
        <ImageIcon className="w-4 h-4 text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setLightbox(true)}
        className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 ring-1 ring-border hover:ring-primary transition-all"
        title="Klik untuk memperbesar"
      >
        <Image src={src} alt={alt} fill className="object-cover" unoptimized onError={() => setErr(true)} />
      </button>
      {lightbox && <Lightbox src={src} alt={alt} onClose={() => setLightbox(false)} />}
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function RoutesPage() {
  const supabase = createClient();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [filtered, setFiltered] = useState<Route[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [previewLightbox, setPreviewLightbox] = useState(false);

  // Real-time duplicate detection for the open form
  const formDuplicate = useMemo(() => {
    if (!form.origin && !form.destination && !form.name) return null;
    return routes.find((r) => {
      if (editingId && r.id === editingId) return false;
      const sameOriginDest =
        form.origin.trim().toLowerCase() === r.origin.trim().toLowerCase() &&
        form.destination.trim().toLowerCase() === r.destination.trim().toLowerCase();
      const sameName = form.name.trim().toLowerCase() !== "" &&
        form.name.trim().toLowerCase() === r.name.trim().toLowerCase();
      return sameOriginDest || sameName;
    }) ?? null;
  }, [form.origin, form.destination, form.name, routes, editingId]);

  const fetchRoutes = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("routes")
      .select("*")
      .order("name", { ascending: true });
    if (error) toast.error("Gagal memuat rute: " + error.message);
    else {
      setRoutes(data ?? []);
      setFiltered(data ?? []);
    }
    setIsLoading(false);
  }, [supabase]);

  useEffect(() => { fetchRoutes(); }, [fetchRoutes]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      routes.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.origin.toLowerCase().includes(q) ||
          r.destination.toLowerCase().includes(q)
      )
    );
  }, [search, routes]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (r: Route) => {
    setEditingId(r.id);
    setForm({
      name: r.name,
      origin: r.origin,
      destination: r.destination,
      base_price: r.base_price,
      is_active: r.is_active,
      estimated_duration_min: r.estimated_duration_min,
      notes: r.notes ?? "",
      image_url: r.image_url ?? "",
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.origin || !form.destination) {
      toast.error("Nama, asal, dan tujuan wajib diisi.");
      return;
    }

    // ── Duplicate / distinct validation ──────────────────────────────────────
    const originNorm = form.origin.trim().toLowerCase();
    const destNorm = form.destination.trim().toLowerCase();
    const nameNorm = form.name.trim().toLowerCase();

    const duplicate = routes.find((r) => {
      if (editingId && r.id === editingId) return false;
      const sameOriginDest =
        r.origin.trim().toLowerCase() === originNorm &&
        r.destination.trim().toLowerCase() === destNorm;
      const sameName = r.name.trim().toLowerCase() === nameNorm;
      return sameOriginDest || sameName;
    });

    if (duplicate) {
      const reason =
        duplicate.name.trim().toLowerCase() === nameNorm
          ? `Nama rute "${duplicate.name}" sudah ada.`
          : `Rute ${duplicate.origin} → ${duplicate.destination} sudah terdaftar sebagai "${duplicate.name}".`;
      toast.error(`Duplikat terdeteksi! ${reason}`, { duration: 5000 });
      return;
    }

    setSaving(true);
    const payload = {
      name: form.name.trim(),
      origin: form.origin.trim(),
      destination: form.destination.trim(),
      base_price: Number(form.base_price),
      is_active: form.is_active,
      estimated_duration_min: form.estimated_duration_min ? Number(form.estimated_duration_min) : null,
      notes: form.notes || null,
      image_url: form.image_url?.trim() || null,
    };

    if (editingId) {
      const { error } = await supabase.from("routes").update(payload).eq("id", editingId);
      if (error) toast.error("Gagal memperbarui: " + error.message);
      else { toast.success("Rute berhasil diperbarui."); setShowForm(false); fetchRoutes(); }
    } else {
      const { error } = await supabase.from("routes").insert(payload);
      if (error) toast.error("Gagal menyimpan: " + error.message);
      else { toast.success("Rute baru berhasil ditambahkan."); setShowForm(false); fetchRoutes(); }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus rute ini? Tindakan ini tidak dapat dibatalkan.")) return;
    setDeletingId(id);
    const { error } = await supabase.from("routes").delete().eq("id", id);
    if (error) toast.error("Gagal menghapus: " + error.message);
    else { toast.success("Rute dihapus."); fetchRoutes(); }
    setDeletingId(null);
  };

  const handleToggleActive = async (r: Route) => {
    const { error } = await supabase
      .from("routes")
      .update({ is_active: !r.is_active })
      .eq("id", r.id);
    if (error) toast.error("Gagal mengubah status.");
    else fetchRoutes();
  };

  // Derived: resolved preview URL from current form state
  const formPreviewUrl = form.image_url?.trim() ||
    (() => {
      const text = `${form.name} ${form.origin} ${form.destination}`.toLowerCase();
      for (const [key, url] of Object.entries(IMAGES.DESTINATIONS)) {
        if (text.includes(key)) return url;
      }
      return null;
    })();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manajemen Rute"
        subtitle="Atur daftar rute perjalanan, harga dasar, dan estimasi waktu tempuh."
        actions={
          <Button className="gap-2" onClick={openCreate}>
            <Plus className="w-4 h-4" /> Tambah Rute
          </Button>
        }
      />

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Rute", value: routes.length, icon: MapPin, color: "text-primary" },
          { label: "Aktif", value: routes.filter((r) => r.is_active).length, icon: CheckCircle2, color: "text-emerald-500" },
          { label: "Nonaktif", value: routes.filter((r) => !r.is_active).length, icon: XCircle, color: "text-rose-500" },
        ].map((s) => (
          <Card key={s.label} className="border-border/60">
            <CardContent className="p-4 flex items-center gap-3">
              <s.icon className={`w-8 h-8 ${s.color} opacity-80`} />
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Inline Form */}
      {showForm && (
        <Card className="border-primary/30 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{editingId ? "Edit Rute" : "Tambah Rute Baru"}</CardTitle>
            <CardDescription>Isi detail rute perjalanan untuk digunakan pada sistem booking.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="r-name">Nama Rute <span className="text-destructive">*</span></Label>
                <Input id="r-name" placeholder="e.g. Bandara – Senggigi" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="r-origin">Asal <span className="text-destructive">*</span></Label>
                <Input id="r-origin" placeholder="e.g. BIL Airport" value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="r-dest">Tujuan <span className="text-destructive">*</span></Label>
                <Input id="r-dest" placeholder="e.g. Senggigi" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="r-price">Harga Dasar (IDR)</Label>
                <Input id="r-price" type="number" min={0} placeholder="350000" value={form.base_price || ""} onChange={(e) => setForm({ ...form, base_price: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="r-dur">Estimasi Durasi (menit)</Label>
                <Input id="r-dur" type="number" min={0} placeholder="45" value={form.estimated_duration_min ?? ""} onChange={(e) => setForm({ ...form, estimated_duration_min: e.target.value ? Number(e.target.value) : null })} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex items-center gap-3 h-10">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, is_active: !form.is_active })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${form.is_active ? "bg-primary" : "bg-muted-foreground/30"}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.is_active ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                  <span className="text-sm text-muted-foreground">{form.is_active ? "Aktif" : "Nonaktif"}</span>
                </div>
              </div>
            </div>

            {/* Image URL field with preview */}
            <div className="space-y-2">
              <Label htmlFor="r-image">URL Gambar (opsional)</Label>
              <div className="flex gap-3 items-start">
                <div className="flex-1">
                  <Input
                    id="r-image"
                    placeholder="https://..."
                    value={form.image_url ?? ""}
                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  />
                  {!form.image_url && formPreviewUrl && (
                    <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" />
                      Gambar otomatis dari keyword tujuan akan digunakan jika kosong.
                    </p>
                  )}
                </div>

                {/* Preview thumbnail */}
                {formPreviewUrl && (
                  <div className="shrink-0">
                    <button
                      type="button"
                      onClick={() => setPreviewLightbox(true)}
                      className="relative w-16 h-16 rounded-lg overflow-hidden ring-1 ring-border hover:ring-primary transition-all"
                      title="Klik untuk memperbesar preview"
                    >
                      <Image
                        src={formPreviewUrl}
                        alt="Preview"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Lightbox for form preview */}
            {previewLightbox && formPreviewUrl && (
              <Lightbox src={formPreviewUrl} alt={form.name || "Preview"} onClose={() => setPreviewLightbox(false)} />
            )}

            <div className="space-y-2">
              <Label htmlFor="r-notes">Catatan (opsional)</Label>
              <Input id="r-notes" placeholder="Catatan tambahan..." value={form.notes ?? ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>

            {formDuplicate && (
              <div className="flex items-start gap-2 rounded-lg border border-amber-400/50 bg-amber-50 dark:bg-amber-950/30 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
                <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>
                  <strong>Potensi duplikat terdeteksi:</strong>{" "}
                  Rute <em>{formDuplicate.origin} → {formDuplicate.destination}</em> sudah terdaftar sebagai{" "}
                  <strong>&quot;{formDuplicate.name}&quot;</strong>. Pastikan rute ini berbeda sebelum menyimpan.
                </span>
              </div>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>Batal</Button>
              <Button onClick={handleSave} disabled={saving || !!formDuplicate} className="gap-2">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Tambah Rute"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Route List */}
      <Card className="border-border/60">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base">Daftar Rute ({filtered.length})</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input className="pl-8 h-8 text-sm" placeholder="Cari rute..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <MapPin className="mx-auto mb-3 w-10 h-10 opacity-20" />
              <p className="font-medium">Belum ada rute</p>
              <p className="text-sm">Klik &quot;Tambah Rute&quot; untuk membuat rute pertama.</p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {filtered.map((r) => {
                const imgSrc = resolveImage(r);
                return (
                  <div key={r.id} className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors group">
                    <div className="flex items-center gap-4 min-w-0">
                      {/* Image thumbnail or fallback icon */}
                      {imgSrc ? (
                        <ImageThumb src={imgSrc} alt={r.name} />
                      ) : (
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 shrink-0">
                          <ArrowRightLeft className="w-4 h-4 text-primary" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">{r.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {r.origin} → {r.destination}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 shrink-0">
                      <div className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDuration(r.estimated_duration_min)}
                      </div>
                      <div className="hidden md:flex items-center gap-1.5 text-sm font-medium">
                        <Banknote className="w-3.5 h-3.5 text-muted-foreground" />
                        {formatIDR(r.base_price)}
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-[11px] cursor-pointer ${r.is_active ? "border-emerald-500 text-emerald-600 dark:text-emerald-400" : "border-muted-foreground/40 text-muted-foreground"}`}
                        onClick={() => handleToggleActive(r)}
                      >
                        {r.is_active ? "Aktif" : "Nonaktif"}
                      </Badge>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(r)}>
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(r.id)}
                          disabled={deletingId === r.id}
                        >
                          {deletingId === r.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
