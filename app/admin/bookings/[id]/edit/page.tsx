"use client";

import React, { useEffect, useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import BookingForm from "@/components/bookings/BookingForm";
import { BookingFormValues } from "@/lib/validations/booking";
import { useBookings } from "@/hooks/useBookings";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function EditBookingPage() {
  const { id } = useParams();
  const { fetchBooking, updateBooking } = useBookings();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [initialData, setInitialData] = useState<Partial<BookingFormValues> | null>(null);

  useEffect(() => {
    async function loadBooking() {
      if (!id) return;
      const data = await fetchBooking(id as string);
      if (data) {
        // Map data from db to form values
        const mappedData: Partial<BookingFormValues> = {
          guest_name: data.guests?.full_name || "",
          email: data.guests?.email || "",
          phone_wa: data.guests?.phone_wa || "",
          nationality: data.guests?.nationality || "",
          source: data.source || "whatsapp",
          language_pref: data.language_pref || "en",
          total_passengers: data.total_passengers || data.pax_count || 1,
          total_luggage: data.total_luggage || data.luggage_count || 0,
          flight_number: data.flight_number || "",
          payment_method: data.payment_method || "cash",
          gross_price: data.gross_price || 0,
          receipt_number: data.receipt_number || "",
          receipt_status: data.receipt_status || "pending",
          deposit_amount: data.deposit_amount || 0,
          deposit_method: data.deposit_method || "",
          deposit_paid_at: data.deposit_paid_at ? new Date(data.deposit_paid_at) : undefined,
          balance_due: data.balance_due || 0,
          inclusions: data.inclusions ? (Array.isArray(data.inclusions) ? data.inclusions.join('\n') : data.inclusions) : "",
          terms_notes: data.terms_notes || "",
          notes: data.notes || "",
          trips: (data.booking_trips || []).sort((a: any, b: any) => a.trip_order - b.trip_order).map((t: any) => ({
            trip_date: new Date(t.trip_date),
            pickup_time: t.pickup_time || "",
            service_name: t.service_name || "",
            service_description: t.service_description || "",
            pickup_address: t.pickup_address || "",
            dropoff_address: t.dropoff_address || "",
            price: t.price || 0,
          })),
        };
        setInitialData(mappedData);
      }
      setIsLoading(false);
    }
    loadBooking();
  }, [id, fetchBooking]);

  const handleSubmit = async (formData: BookingFormValues) => {
    try {
      const supabase = createClient();

      // update guest if necessary
      if (formData.email || formData.phone_wa || formData.guest_name) {
        // Fetch booking to get guest_id
        const booking = await fetchBooking(id as string);
        if (booking && booking.guest_id) {
          await supabase.from("guests").update({
            full_name: formData.guest_name,
            email: formData.email,
            phone_wa: formData.phone_wa,
            nationality: formData.nationality
          }).eq("id", booking.guest_id);
        }
      }

      // update booking
      await updateBooking(id as string, {
        source: formData.source,
        language_pref: formData.language_pref,
        total_passengers: formData.total_passengers,
        total_luggage: formData.total_luggage,
        pax_count: formData.total_passengers,
        luggage_count: formData.total_luggage,
        flight_number: formData.flight_number,
        payment_method: formData.payment_method,
        gross_price: formData.gross_price,
        net_price: formData.gross_price,
        receipt_number: formData.receipt_number || null,
        receipt_status: formData.receipt_status,
        deposit_amount: formData.deposit_amount,
        deposit_method: formData.deposit_method || null,
        deposit_paid_at: formData.deposit_paid_at?.toISOString() || null,
        balance_due: formData.balance_due,
        inclusions: formData.inclusions ? formData.inclusions.split('\n').filter(i => i.trim() !== '') : [],
        terms_notes: formData.terms_notes || null,
        notes: formData.notes || null,
        
        // update legacy fallback fields if needed
        pickup_datetime: formData.trips.length > 0 ? formData.trips[0].trip_date.toISOString() : undefined,
        pickup_address: formData.trips.length > 0 ? formData.trips[0].pickup_address : undefined,
        dropoff_address: formData.trips.length > 0 ? formData.trips[formData.trips.length - 1].dropoff_address : undefined,
      });

      // Update trips: delete existing and insert new ones
      await supabase.from("booking_trips").delete().eq("booking_id", id as string);
      
      if (formData.trips && formData.trips.length > 0) {
        const tripsToInsert = formData.trips.map((trip, idx) => ({
          booking_id: id,
          trip_order: idx + 1,
          trip_date: trip.trip_date.toISOString(),
          pickup_time: trip.pickup_time || null,
          service_name: trip.service_name,
          service_description: trip.service_description || null,
          pickup_address: trip.pickup_address || null,
          dropoff_address: trip.dropoff_address || null,
          price: trip.price
        }));

        const { error: tripsErr } = await supabase.from("booking_trips").insert(tripsToInsert);
        if (tripsErr) throw tripsErr;
      }

      router.push(`/admin/bookings/${id}`);
      router.refresh();
    } catch (error) {
      console.error("Gagal mengupdate booking:", error);
      alert("Gagal mengupdate booking.");
    }
  };

  if (isLoading) {
    return <div className="p-12 text-center text-muted-foreground">Memuat form edit...</div>;
  }

  if (!initialData) {
    return <div className="p-12 text-center text-destructive">Booking tidak ditemukan.</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader 
        title="Edit Booking" 
        subtitle={`Perbarui data untuk booking ID: ${id}`}
      />
      <BookingForm onSubmit={handleSubmit} initialData={initialData} />
    </div>
  );
}
