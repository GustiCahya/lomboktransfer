/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import PageHeader from "@/components/shared/PageHeader";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Plus, Pencil, Trash2, Map, Clock, Banknote,
  CheckCircle2, XCircle, Loader2, Search, X, ExternalLink, ImageIcon,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tour = {
  id: string;
  title: string;
  duration: string;
  base_price: number;
  description: string;
  image_url: string;
  is_active: boolean;
};

const EMPTY_FORM: Omit<Tour, "id"> = {
  title: "",
  duration: "",
  base_price: 0,
  description: "",
  image_url: "",
  is_active: true,
};

// Seed data — will be inserted if the table is empty
const SEED_TOURS: Omit<Tour, "id">[] = [
  {
    title: "Waterfalls & Monkey Forest",
    duration: "Full Day (8-10h)",
    base_price: 750000,
    description:
      "Explore the stunning Sendang Gile and Tiu Kelep waterfalls at the foot of Mount Rinjani.",
    image_url:
      "https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_1200,h_630/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/p31do24ksdcrouegn6at/Lombok%20Waterfalls%20and%20Monkey%20Forest%20Private%20Day%20Tour.jpg",
    is_active: true,
  },
  {
    title: "Sasak Traditional Village",
    duration: "Half Day (4-6h)",
    base_price: 500000,
    description:
      "Immerse yourself in the local Sasak culture, visit traditional weaving villages and pristine southern beaches.",
    image_url:
      "https://tse3.mm.bing.net/th/id/OIP.DOTssNxV_Wp3hTrVYnIZggHaE6?rs=1&pid=ImgDetMain&o=7&rm=3",
    is_active: true,
  },
  {
    title: "Gili Islands Snorkeling",
    duration: "Full Day (8-10h)",
    base_price: 850000,
    description:
      "Private boat tour to snorkel with sea turtles around the famous three Gili islands.",
    image_url:
      "https://s-light.tiket.photos/t/01E25EBZS3W0FY9GTG6C42E1SE/rsfit19201280gsm/events/2020/10/09/8120d8e6-0629-4303-8301-dcb4c8dbbf71-1602223746140-38935a774877b5b56d0177e01576113b.jpg",
    is_active: true,
  },
];

function formatIDR(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────

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

// ─── Image Thumbnail with lightbox ───────────────────────────────────────────

function ImageThumb({ src, alt }: { src: string; alt: string }) {
  const [lightbox, setLightbox] = useState(false);
  const [err, setErr] = useState(false);

  if (err || !src) {
    return (
      <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center shrink-0">
        <ImageIcon className="w-5 h-5 text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setLightbox(true)}
        className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 ring-1 ring-border hover:ring-primary transition-all"
        title="Klik untuk memperbesar"
      >
        <Image src={src} alt={alt} fill className="object-cover" unoptimized onError={() => setErr(true)} />
      </button>
      {lightbox && <Lightbox src={src} alt={alt} onClose={() => setLightbox(false)} />}
    </>
  );
}

// ─── Tour Card (grid view) ───────────────────────────────────────────────────

function TourCard({
  tour,
  onEdit,
  onDelete,
  onToggle,
  deleting,
}: {
  tour: Tour;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
  deleting: boolean;
}) {
  const [lightbox, setLightbox] = useState(false);

  return (
    <div className="group rounded-2xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
      {/* Image */}
      <div className="aspect-[4/3] relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors z-10" />
        {tour.image_url ? (
          <Image
            src={tour.image_url}
            alt={tour.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Map className="w-12 h-12 text-muted-foreground opacity-30" />
          </div>
        )}

        {/* Price badge */}
        <div className="absolute top-3 right-3 z-20 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold">
          from {formatIDR(tour.base_price)}
        </div>

        {/* Status badge */}
        <div className="absolute top-3 left-3 z-20">
          <Badge
            variant="outline"
            className={`text-[10px] cursor-pointer backdrop-blur-sm bg-background/80 ${tour.is_active ? "border-emerald-500 text-emerald-600" : "border-muted-foreground/40 text-muted-foreground"}`}
            onClick={onToggle}
          >
            {tour.is_active ? "Aktif" : "Nonaktif"}
          </Badge>
        </div>

        {/* Lightbox trigger */}
        {tour.image_url && (
          <button
            type="button"
            onClick={() => setLightbox(true)}
            className="absolute bottom-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white px-2 py-1 rounded text-[10px] flex items-center gap-1"
          >
            <ExternalLink className="w-3 h-3" /> Lihat Gambar
          </button>
        )}
      </div>

      {lightbox && tour.image_url && (
        <Lightbox src={tour.image_url} alt={tour.title} onClose={() => setLightbox(false)} />
      )}

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-foreground mb-1 flex items-center gap-2">
          <Map className="h-4 w-4 text-primary shrink-0" />
          {tour.title}
        </h3>
        <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-primary" /> {tour.duration}
        </p>
        <p className="text-sm text-muted-foreground mb-5 flex-1 leading-relaxed">{tour.description}</p>

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-border">
          <Button size="sm" variant="outline" className="flex-1 gap-1.5" onClick={onEdit}>
            <Pencil className="w-3.5 h-3.5" /> Edit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={onDelete}
            disabled={deleting}
          >
            {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ToursManagementPage() {
  const supabase = createClient();
  const [tours, setTours] = useState<Tour[]>([]);
  const [filtered, setFiltered] = useState<Tour[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Tour, "id">>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [previewLightbox, setPreviewLightbox] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const fetchTours = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("tours")
      .select("*")
      .order("title", { ascending: true });
    if (error) {
      toast.error("Gagal memuat paket tour: " + error.message);
    } else {
      setTours(data ?? []);
      setFiltered(data ?? []);
    }
    setIsLoading(false);
  }, [supabase]);

  useEffect(() => { fetchTours(); }, [fetchTours]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(tours.filter((t) =>
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.duration.toLowerCase().includes(q)
    ));
  }, [search, tours]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (t: Tour) => {
    setEditingId(t.id);
    setForm({
      title: t.title,
      duration: t.duration,
      base_price: t.base_price,
      description: t.description,
      image_url: t.image_url ?? "",
      is_active: t.is_active,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.duration) {
      toast.error("Judul dan durasi wajib diisi.");
      return;
    }
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      duration: form.duration.trim(),
      base_price: Number(form.base_price),
      description: form.description.trim(),
      image_url: form.image_url?.trim() || null,
      is_active: form.is_active,
    };

    if (editingId) {
      const { error } = await supabase.from("tours").update(payload).eq("id", editingId);
      if (error) toast.error("Gagal memperbarui: " + error.message);
      else { toast.success("Paket tour berhasil diperbarui."); setShowForm(false); fetchTours(); }
    } else {
      const { error } = await supabase.from("tours").insert(payload);
      if (error) toast.error("Gagal menyimpan: " + error.message);
      else { toast.success("Paket tour baru berhasil ditambahkan."); setShowForm(false); fetchTours(); }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus paket tour ini?")) return;
    setDeletingId(id);
    const { error } = await supabase.from("tours").delete().eq("id", id);
    if (error) toast.error("Gagal menghapus: " + error.message);
    else { toast.success("Paket tour dihapus."); fetchTours(); }
    setDeletingId(null);
  };

  const handleToggle = async (t: Tour) => {
    const { error } = await supabase.from("tours").update({ is_active: !t.is_active }).eq("id", t.id);
    if (error) toast.error("Gagal mengubah status.");
    else fetchTours();
  };

  const handleSeedData = async () => {
    setSeeding(true);
    const { error } = await supabase.from("tours").insert(SEED_TOURS);
    if (error) toast.error("Gagal menambahkan data awal: " + error.message);
    else { toast.success("3 paket tour berhasil ditambahkan."); fetchTours(); }
    setSeeding(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manajemen Paket Tour"
        subtitle="Kelola daftar paket wisata yang ditawarkan kepada tamu."
        actions={
          <div className="flex gap-2">
            {tours.length === 0 && !isLoading && (
              <Button variant="outline" className="gap-2" onClick={handleSeedData} disabled={seeding}>
                {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Map className="w-4 h-4" />}
                Seed Data Awal
              </Button>
            )}
            <Button className="gap-2" onClick={openCreate}>
              <Plus className="w-4 h-4" /> Tambah Tour
            </Button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Paket", value: tours.length, icon: Map, color: "text-primary" },
          { label: "Aktif", value: tours.filter((t) => t.is_active).length, icon: CheckCircle2, color: "text-emerald-500" },
          { label: "Nonaktif", value: tours.filter((t) => !t.is_active).length, icon: XCircle, color: "text-rose-500" },
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
            <CardTitle className="text-base">{editingId ? "Edit Paket Tour" : "Tambah Paket Tour Baru"}</CardTitle>
            <CardDescription>Isi detail paket wisata untuk ditampilkan pada halaman publik.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="t-title">Judul Paket <span className="text-destructive">*</span></Label>
                <Input id="t-title" placeholder="e.g. Waterfalls & Monkey Forest" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="t-dur">Durasi <span className="text-destructive">*</span></Label>
                <Input id="t-dur" placeholder="e.g. Full Day (8-10h)" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="t-price">Harga Dasar (IDR)</Label>
                <Input id="t-price" type="number" min={0} placeholder="750000" value={form.base_price || ""} onChange={(e) => setForm({ ...form, base_price: Number(e.target.value) })} />
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

            <div className="space-y-2">
              <Label htmlFor="t-desc">Deskripsi</Label>
              <Input id="t-desc" placeholder="Deskripsi singkat paket tour..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>

            {/* Image URL + Preview */}
            <div className="space-y-2">
              <Label htmlFor="t-img">URL Gambar</Label>
              <div className="flex gap-3 items-start">
                <div className="flex-1">
                  <Input
                    id="t-img"
                    placeholder="https://..."
                    value={form.image_url}
                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  />
                </div>
                {form.image_url && (
                  <button
                    type="button"
                    onClick={() => setPreviewLightbox(true)}
                    className="relative w-16 h-16 rounded-lg overflow-hidden ring-1 ring-border hover:ring-primary transition-all shrink-0"
                    title="Klik untuk memperbesar"
                  >
                    <Image src={form.image_url} alt="Preview" fill className="object-cover" unoptimized />
                  </button>
                )}
              </div>
            </div>

            {previewLightbox && form.image_url && (
              <Lightbox src={form.image_url} alt={form.title || "Preview"} onClose={() => setPreviewLightbox(false)} />
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>Batal</Button>
              <Button onClick={handleSave} disabled={saving} className="gap-2">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Tambah Tour"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tour List */}
      <Card className="border-border/60">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base">Daftar Paket Tour ({filtered.length})</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input className="pl-8 h-8 text-sm" placeholder="Cari tour..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Map className="mx-auto mb-3 w-10 h-10 opacity-20" />
              <p className="font-medium">Belum ada paket tour</p>
              <p className="text-sm mb-4">Klik &quot;Tambah Tour&quot; atau gunakan &quot;Seed Data Awal&quot; untuk memulai.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((t) => (
                <TourCard
                  key={t.id}
                  tour={t}
                  onEdit={() => openEdit(t)}
                  onDelete={() => handleDelete(t.id)}
                  onToggle={() => handleToggle(t)}
                  deleting={deletingId === t.id}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
