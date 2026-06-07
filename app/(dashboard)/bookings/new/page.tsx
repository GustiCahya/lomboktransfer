"use client";

import React from "react";
import PageHeader from "@/components/shared/PageHeader";
import BookingForm from "@/components/bookings/BookingForm";
import { BookingFormValues } from "@/lib/validations/booking";
import { useBookings } from "@/hooks/useBookings";
import { useRouter } from "next/navigation";

export default function NewBookingPage() {
  const { createBooking } = useBookings();
  const router = useRouter();

  const handleSubmit = async (data: BookingFormValues) => {
    // In a real implementation, you would first check if the guest exists
    // or create a new guest, getting their guest_id. 
    // For this boilerplate, we'll assume a dummy guest ID or handle it via RPC.
    const DUMMY_GUEST_ID = "00000000-0000-0000-0000-000000000000"; 
    
    try {
      const newBooking = await createBooking(data, DUMMY_GUEST_ID);
      if (newBooking) {
        router.push(`/bookings/${newBooking.id}`);
      }
    } catch (error) {
      console.error("Gagal membuat booking:", error);
      alert("Gagal membuat booking. Silakan periksa koneksi atau data form.");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader 
        title="Buat Booking Baru" 
        subtitle="Masukkan detail pesanan manual dari tamu atau partner (Klook, Traveloka, WhatsApp, dll)."
      />

      <div className="bg-card border shadow-sm rounded-lg p-6">
        <BookingForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
