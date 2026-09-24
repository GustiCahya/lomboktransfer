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
import { useBookings } from "@/hooks/useBookings";
import { Loader2 } from "lucide-react";

import { useCreateExpense } from "@/hooks/useExpenses";

interface AssignDriverModalProps {
  bookingId: string;
  bookingDetails?: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AssignDriverModal({ bookingId, bookingDetails, isOpen, onClose, onSuccess }: AssignDriverModalProps) {
  const { drivers, isLoading: isLoadingDrivers } = useDrivers({ status: "active" });
  const { updateBooking, isLoading: isUpdating } = useBookings();
  const { createExpense } = useCreateExpense();
  const [selectedDriverId, setSelectedDriverId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAssign = async () => {
    if (!selectedDriverId) {
      alert("Pilih supir terlebih dahulu.");
      return;
    }
    
    const driver = drivers.find(d => d.id === selectedDriverId);
    
    setIsProcessing(true);
    try {
      await updateBooking(bookingId, { 
        driver_id: selectedDriverId,
        vehicle_id: driver?.vehicle_id || null,
        status: "confirmed"
      });

      // Automatically create an expense for driver's fee if the booking is already paid
      if (bookingDetails?.payment_status === "paid" && driver && driver.commission_percentage) {
        const fee = (bookingDetails.gross_price || 0) * (driver.commission_percentage / 100);
        if (fee > 0) {
          await createExpense({
            expense_date: new Date().toISOString().split("T")[0], // today
            category: "commission",
            description: `Fee Supir (${driver.full_name}) untuk Booking ${bookingDetails.booking_code}`,
            amount: fee,
            payment_method: "transfer",
            notes: "Otomatis dibuat saat penugasan supir pada booking yang sudah lunas",
          });
        }
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      alert("Gagal menugaskan supir: " + err?.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tugaskan Supir</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="driver">Pilih Supir</Label>
            <select
              id="driver"
              value={selectedDriverId}
              onChange={(e) => setSelectedDriverId(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
              disabled={isLoadingDrivers}
            >
              <option value="">-- Pilih Supir --</option>
              {drivers.map(d => (
                <option key={d.id} value={d.id}>{d.full_name}</option>
              ))}
            </select>
            {isLoadingDrivers && <p className="text-xs text-muted-foreground">Memuat data supir...</p>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>Batal</Button>
          <Button onClick={handleAssign} disabled={isProcessing || !selectedDriverId}>
            {isProcessing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
