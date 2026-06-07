"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2 } from "lucide-react";


export default function LeaveRequestPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Simulate API call delay — real implementation: insert into driver_leaves table
      await new Promise(r => setTimeout(r, 1000));
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan.");
    } finally {
      setIsLoading(false);
    }
  };


  if (isSuccess) {
    return (
      <div className="flex flex-col h-[100dvh] bg-background items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-xl font-bold mb-2">Request Cuti Terkirim</h2>
        <p className="text-muted-foreground text-sm mb-8">Admin akan meninjau permintaan cuti Anda. Anda akan menerima notifikasi jika disetujui.</p>
        <Button onClick={() => router.back()} className="w-full">Kembali ke Jadwal</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-background">
      <header className="bg-card border-b pt-12 pb-4 px-4 flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-muted">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold">Request Cuti</h1>
      </header>

      <div className="p-4 flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Mulai Cuti</Label>
                <Input id="start_date" name="start_date" type="date" required className="h-12" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">Selesai Cuti</Label>
                <Input id="end_date" name="end_date" type="date" required className="h-12" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reason">Alasan Cuti</Label>
              <Textarea 
                id="reason" 
                name="reason" 
                placeholder="Contoh: Acara keluarga, Sakit, dll." 
                required 
                className="h-32 resize-none"
              />
            </div>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-400 p-3 rounded-md text-xs">
            <p className="font-semibold mb-1">Perhatian:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Pengajuan cuti maksimal H-3 sebelum tanggal cuti (kecuali darurat).</li>
              <li>Sistem tidak akan meng-assign trip pada tanggal cuti yang disetujui.</li>
            </ul>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full h-12 text-base font-bold shadow-md">
            {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {isLoading ? "Mengirim..." : "Kirim Request"}
          </Button>
        </form>
      </div>
    </div>
  );
}
