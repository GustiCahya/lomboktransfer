"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useDrivers } from "@/hooks/useDrivers";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

interface AssignTripDriverModalProps {
  tripId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AssignTripDriverModal({
  tripId,
  isOpen,
  onClose,
  onSuccess,
}: AssignTripDriverModalProps) {
  const { drivers, isLoading: isLoadingDrivers } = useDrivers({ status: "active" });
  const [selectedDriverId, setSelectedDriverId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAssign = async () => {
    setIsProcessing(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("booking_trips")
        .update({ driver_id: selectedDriverId || null })
        .eq("id", tripId);

      if (error) throw error;

      onSuccess();
    } catch (err: any) {
      alert("Gagal menugaskan supir ke trip: " + err?.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemove = async () => {
    if (!window.confirm("Hapus penugasan supir dari trip ini?")) return;
    setIsProcessing(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("booking_trips")
        .update({ driver_id: null })
        .eq("id", tripId);

      if (error) throw error;

      onSuccess();
    } catch (err: any) {
      alert("Gagal menghapus penugasan supir: " + err?.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tugaskan Supir ke Trip</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Pilih supir yang akan menjalankan trip ini. Fee supir akan dihitung otomatis saat booking diselesaikan.
          </p>
          <div className="space-y-2">
            <Label htmlFor="trip-driver">Pilih Supir</Label>
            <select
              id="trip-driver"
              value={selectedDriverId}
              onChange={(e) => setSelectedDriverId(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
              disabled={isLoadingDrivers}
            >
              <option value="">-- Tidak ada / Hapus --</option>
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.full_name}
                  {d.fee_type === "percentage" && ` (${d.commission_pct}%)`}
                  {d.fee_type === "fixed" && ` (Rp ${(d.fixed_fee || 0).toLocaleString("id-ID")}/trip)`}
                  {d.fee_type === "daily" && ` (Rp ${(d.daily_fee || 0).toLocaleString("id-ID")}/hari)`}
                </option>
              ))}
            </select>
            {isLoadingDrivers && (
              <p className="text-xs text-muted-foreground">Memuat data supir...</p>
            )}
          </div>
        </div>
        <DialogFooter className="gap-2 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            disabled={isProcessing}
            className="text-destructive hover:text-destructive mr-auto"
          >
            Hapus Supir dari Trip
          </Button>
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Batal
          </Button>
          <Button onClick={handleAssign} disabled={isProcessing || !selectedDriverId}>
            {isProcessing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
