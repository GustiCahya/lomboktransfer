"use client";

import React, { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import BookingForm from "@/components/bookings/BookingForm";
import { BookingFormValues } from "@/lib/validations/booking";
import { useBookings } from "@/hooks/useBookings";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function NewBookingPage() {
  const { createBooking } = useBookings();
  const router = useRouter();

  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (data: BookingFormValues) => {
    setIsCreating(true);
    try {
      const supabase = createClient();
      let guestId: string | null = null;
      
      const email = data.email?.trim() || null;
      const phone = data.phone_wa?.trim() || null;

      // 1. Cek guest yang sudah ada berdasarkan email atau phone
      if (email) {
        const { data: existingGuests } = await supabase
          .from("guests")
          .select("id")
          .eq("email", email)
          .limit(1);
        if (existingGuests && existingGuests.length > 0) guestId = existingGuests[0].id;
      }
      if (!guestId && phone) {
        const { data: existingGuests } = await supabase
          .from("guests")
          .select("id")
          .eq("phone_wa", phone)
          .limit(1);
        if (existingGuests && existingGuests.length > 0) guestId = existingGuests[0].id;
      }

      // 2. Buat guest baru jika belum ada
      if (!guestId) {
        const { data: newGuest, error: guestError } = await supabase
          .from("guests")
          .insert({
            full_name: data.guest_name,
            email: email,
            phone_wa: phone,
            nationality: data.nationality,
            source_first: data.source
          })
          .select("id")
          .single();

        if (guestError) throw guestError;
        guestId = newGuest.id;
      }

      // 3. Buat Booking
      const newBooking = await createBooking(data, guestId!);
      if (newBooking) {
        router.push(`/admin/bookings/${newBooking.id}`);
      }
    } catch (error) {
      console.error("Gagal membuat booking:", error);
      alert("Gagal membuat booking. Silakan periksa koneksi atau data form.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader 
        title="Buat Booking Baru" 
        subtitle="Masukkan detail pesanan manual dari tamu atau partner (Klook, Traveloka, WhatsApp, dll)."
      />
      <BookingForm onSubmit={handleSubmit} />
    </div>
  );
}
