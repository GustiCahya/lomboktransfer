"use client";

import React, { useState, useCallback } from "react";
import { Sparkles, X, Loader2, CheckCircle, AlertCircle, ClipboardPaste, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export type AIFormType = "booking" | "driver" | "vehicle";

interface AIAssistantFABProps {
  formType: AIFormType;
  onFill: (data: Record<string, unknown>) => void;
  className?: string;
}

type Status = "idle" | "loading" | "success" | "error";

const FORM_LABELS: Record<AIFormType, string> = {
  booking: "Booking",
  driver: "Data Supir",
  vehicle: "Data Kendaraan",
};

const PLACEHOLDERS: Record<AIFormType, string> = {
  booking: `Contoh chat WhatsApp atau email:

"Halo, saya mau booking transfer dari airport ke Senggigi Hotel. Nama saya John Smith, WA 081234567890. Tanggal 15 Maret 2024, pukul 10:00. 2 orang. Bayar cash."

Atau paste teks booking Klook, Viator, email konfirmasi, dll.`,
  driver: `Contoh data supir:

"Nama: Ahmad Fauzi
NIK: 5201011234560001
HP/WA: 081234567890
Alamat: Jl. Raya Senggigi No. 10, Lombok Barat
Bank: BCA, Rek: 1234567890 a.n. Ahmad Fauzi
Tipe: Mitra Lepas, Komisi 25%"`,
  vehicle: `Contoh data kendaraan:

"Toyota Innova Reborn 2022, warna hitam
Plat: DR 1234 AB
Kode Unit: LT-05
Kapasitas: 7 penumpang
Odometer: 45.000 KM"`,
};

export default function AIAssistantFAB({ formType, onFill, className }: AIAssistantFABProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rawText, setRawText] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [previewData, setPreviewData] = useState<Record<string, unknown> | null>(null);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setStatus("idle");
    setRawText("");
    setPreviewData(null);
    setErrorMsg("");
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!rawText.trim()) return;
    setStatus("loading");
    setErrorMsg("");
    setPreviewData(null);

    try {
      const res = await fetch("/api/ai/form-fill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText, formType }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Gagal menganalisis teks.");
      }

      setPreviewData(json.data);
      setStatus("success");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan tidak terduga.";
      setErrorMsg(message);
      setStatus("error");
    }
  }, [rawText, formType]);

  const handleApply = useCallback(() => {
    if (!previewData) return;
    onFill(previewData);
    setIsOpen(false);
    setRawText("");
    setPreviewData(null);
    setStatus("idle");
  }, [previewData, onFill]);

  const handleRetry = useCallback(() => {
    setStatus("idle");
    setPreviewData(null);
    setErrorMsg("");
  }, []);

  // Format a value for preview display
  const formatPreviewValue = (key: string, val: unknown): string => {
    if (val === null || val === undefined) return "-";
    if (Array.isArray(val)) {
      if (key === "trips" && val.length > 0) return `${val.length} trip(s)`;
      return JSON.stringify(val);
    }
    if (typeof val === "object") return JSON.stringify(val);
    return String(val);
  };

  const previewEntries = previewData
    ? Object.entries(previewData).filter(([, v]) => v !== null && v !== undefined && v !== "")
    : [];

  return (
    <>
      {/* FAB Button */}
      <button
        onClick={handleOpen}
        className={cn(
          "fixed bottom-6 right-6 z-50 group",
          "flex items-center gap-2 px-4 py-3 rounded-2xl",
          "bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600",
          "text-white font-semibold text-sm shadow-lg shadow-purple-500/40",
          "hover:shadow-xl hover:shadow-purple-500/50 hover:scale-105",
          "active:scale-95 transition-all duration-200",
          "before:absolute before:inset-0 before:rounded-2xl before:bg-white/10 before:opacity-0",
          "hover:before:opacity-100 before:transition-opacity",
          "ring-2 ring-purple-400/30",
          className
        )}
        title={`AI Auto-fill ${FORM_LABELS[formType]}`}
      >
        <Sparkles className="h-4 w-4 animate-pulse" />
        <span>AI Auto-fill</span>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        />
      )}

      {/* Modal Drawer */}
      <div
        className={cn(
          "fixed bottom-0 right-0 z-50 h-auto max-h-[90vh] w-full sm:w-[480px]",
          "bg-background border border-border rounded-t-3xl sm:rounded-3xl sm:bottom-6 sm:right-6",
          "shadow-2xl flex flex-col overflow-hidden",
          "transition-all duration-300 ease-out",
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-8 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b bg-gradient-to-r from-violet-600/10 via-purple-600/10 to-indigo-600/10">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-md shadow-purple-500/30">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">AI Auto-fill</h3>
              <p className="text-xs text-muted-foreground">Isi form {FORM_LABELS[formType]} otomatis</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="rounded-xl p-2 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Input Step */}
          {(status === "idle" || status === "error") && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <ClipboardPaste className="h-3.5 w-3.5 text-muted-foreground" />
                  Paste teks chat / email di bawah ini
                </label>
                <Textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder={PLACEHOLDERS[formType]}
                  className="min-h-[180px] text-sm resize-none font-mono leading-relaxed"
                  autoFocus
                />
              </div>

              {status === "error" && (
                <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-3">
                  <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                  <div className="text-sm text-destructive">
                    <p className="font-medium">Gagal menganalisis</p>
                    <p className="text-xs opacity-80 mt-0.5">{errorMsg}</p>
                  </div>
                </div>
              )}

              <div className="text-xs text-muted-foreground bg-muted/50 rounded-xl p-3 space-y-1">
                <p className="font-medium">💡 Tips:</p>
                <ul className="space-y-0.5 ml-2">
                  <li>• Paste langsung screenshot teks, chat WA, atau email</li>
                  <li>• AI akan mengekstrak field yang relevan saja</li>
                  <li>• Preview tampil sebelum diaplikasikan ke form</li>
                </ul>
              </div>
            </>
          )}

          {/* Loading */}
          {status === "loading" && (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="relative">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 animate-ping opacity-20" />
              </div>
              <div className="text-center">
                <p className="font-medium text-sm">AI sedang menganalisis...</p>
                <p className="text-xs text-muted-foreground mt-1">Mengekstrak data dari teks yang diberikan</p>
              </div>
            </div>
          )}

          {/* Success — Preview */}
          {status === "success" && previewData && (
            <>
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {previewEntries.length} field berhasil diekstrak
                </span>
              </div>

              <div className="rounded-xl border overflow-hidden">
                <div className="bg-muted/50 px-3 py-2 text-xs font-medium text-muted-foreground border-b">
                  Preview Data
                </div>
                <div className="divide-y max-h-[300px] overflow-y-auto">
                  {previewEntries.length === 0 ? (
                    <p className="text-sm text-muted-foreground p-4 text-center">
                      Tidak ada data yang berhasil diekstrak. Coba dengan teks yang lebih detail.
                    </p>
                  ) : (
                    previewEntries.map(([key, val]) => (
                      <div key={key} className="flex items-start gap-3 px-3 py-2.5 hover:bg-muted/30 transition-colors">
                        <span className="text-xs font-mono text-purple-600 dark:text-purple-400 pt-0.5 shrink-0 min-w-[120px]">
                          {key}
                        </span>
                        <span className="text-xs text-foreground flex-1 break-all">
                          {formatPreviewValue(key, val)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {previewEntries.length === 0 && (
                <p className="text-xs text-muted-foreground text-center">
                  Teks tidak mengandung informasi yang dapat diekstrak.
                </p>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t bg-background/80 backdrop-blur flex gap-3">
          {(status === "idle" || status === "error") && (
            <>
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Batal
              </Button>
              <Button
                onClick={handleAnalyze}
                disabled={!rawText.trim()}
                className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-0 shadow-md shadow-purple-500/30"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Analisis & Isi Form
              </Button>
            </>
          )}

          {status === "loading" && (
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Batalkan
            </Button>
          )}

          {status === "success" && (
            <>
              <Button variant="outline" onClick={handleRetry} className="flex-1">
                Ulangi
              </Button>
              <Button
                onClick={handleApply}
                disabled={previewEntries.length === 0}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-0 shadow-md shadow-emerald-500/30"
              >
                <ChevronRight className="mr-2 h-4 w-4" />
                Terapkan ke Form
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
