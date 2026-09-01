"use client";

import React, { useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema, BookingFormValues } from "@/lib/validations/booking";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon, Loader2, PlusCircle, Trash2 } from "lucide-react";

export default function BookingForm({ onSubmit }: { onSubmit: (data: BookingFormValues) => Promise<void> }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit: rhfHandleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema) as any,
    defaultValues: {
      total_passengers: 1,
      total_luggage: 0,
      payment_method: "cash",
      source: "whatsapp",
      gross_price: 0,
      deposit_amount: 0,
      balance_due: 0,
      receipt_status: "pending",
      trips: [],
    },
  });

  const { fields: tripFields, append: appendTrip, remove: removeTrip } = useFieldArray({
    control,
    name: "trips",
  });

  // Auto-calculate gross_price from sum of trips
  const trips = watch("trips");
  React.useEffect(() => {
    const total = trips.reduce((sum, t) => sum + (t.price || 0), 0);
    if (total > 0) setValue("gross_price", total);
  }, [trips, setValue]);

  // Auto-calculate balance_due from gross_price - deposit_amount
  const grossPrice = watch("gross_price");
  const depositAmount = watch("deposit_amount");
  React.useEffect(() => {
    const balance = Math.max(0, (grossPrice || 0) - (depositAmount || 0));
    setValue("balance_due", balance);
  }, [grossPrice, depositAmount, setValue]);

  const onSubmitHandler = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={rhfHandleSubmit(onSubmitHandler as any)} className="space-y-8">

      {/* ─── SECTION 1: Informasi Tamu ─── */}
      <section className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h3 className="text-base font-semibold text-foreground border-b border-border pb-3">
          👤 Informasi Tamu
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="guest_name">Nama Tamu <span className="text-destructive">*</span></Label>
            <Input id="guest_name" {...register("guest_name")} placeholder="Contoh: Leslie LENORMAND" />
            {errors.guest_name && <p className="text-xs text-destructive">{errors.guest_name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} placeholder="guest@email.com" />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone_wa">No. WhatsApp</Label>
            <Input id="phone_wa" {...register("phone_wa")} placeholder="+62..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nationality">Kebangsaan</Label>
            <Input id="nationality" {...register("nationality")} placeholder="Contoh: French, Indonesian" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="source">Sumber Booking</Label>
            <Controller
              control={control}
              name="source"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="source" className="w-full bg-card">
                    <SelectValue placeholder="-- Pilih Sumber --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="direct">Direct</SelectItem>
                    <SelectItem value="klook">Klook</SelectItem>
                    <SelectItem value="viator">Viator</SelectItem>
                    <SelectItem value="traveloka">Traveloka</SelectItem>
                    <SelectItem value="getyourguide">GetYourGuide</SelectItem>
                    <SelectItem value="trip_com">Trip.com</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="language_pref">Bahasa Preferensi</Label>
            <Controller
              control={control}
              name="language_pref"
              render={({ field }) => (
                <Select value={field.value || ""} onValueChange={field.onChange}>
                  <SelectTrigger id="language_pref" className="w-full bg-card">
                    <SelectValue placeholder="-- Pilih Bahasa --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="id">Indonesia</SelectItem>
                    <SelectItem value="zh">中文</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>
      </section>

      {/* ─── SECTION 2: Daftar Trip ─── */}
      <section className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="text-base font-semibold text-foreground">🗺️ Daftar Trip</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              appendTrip({
                trip_date: new Date(),
                pickup_time: "",
                service_name: "",
                service_description: "",
                pickup_address: "",
                dropoff_address: "",
                price: 0,
              })
            }
          >
            <PlusCircle className="h-4 w-4 mr-1.5" />
            Tambah Trip
          </Button>
        </div>

        {tripFields.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">
            Belum ada trip. Klik "Tambah Trip" untuk mulai menambahkan.
          </p>
        )}

        <div className="space-y-4">
          {tripFields.map((field, index) => (
            <div
              key={field.id}
              className="border border-dashed border-border rounded-lg p-4 space-y-4 relative"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Trip {index + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive h-7 px-2"
                  onClick={() => removeTrip(index)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Trip Date */}
                <div className="space-y-2 flex flex-col">
                  <Label>Tanggal Trip <span className="text-destructive">*</span></Label>
                  <Controller
                    control={control}
                    name={`trips.${index}.trip_date`}
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger
                          className={cn(
                            "inline-flex items-center w-full h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="h-4 w-4 mr-2 opacity-50 shrink-0" />
                          {field.value ? format(field.value, "d MMM yyyy", { locale: id }) : <span>Pilih tanggal</span>}
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => field.onChange(date || new Date())}
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                  {errors.trips?.[index]?.trip_date && (
                    <p className="text-xs text-destructive">{errors.trips[index]?.trip_date?.message}</p>
                  )}
                </div>

                {/* Pickup Time */}
                <div className="space-y-2">
                  <Label htmlFor={`trips.${index}.pickup_time`}>Jam Jemput (HH:MM)</Label>
                  <Input
                    id={`trips.${index}.pickup_time`}
                    {...register(`trips.${index}.pickup_time`)}
                    placeholder="10:00"
                  />
                </div>

                {/* Service Name */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor={`trips.${index}.service_name`}>Nama Servis <span className="text-destructive">*</span></Label>
                  <Input
                    id={`trips.${index}.service_name`}
                    {...register(`trips.${index}.service_name`)}
                    placeholder="Contoh: Airport Transfer — LOP → El Tropico Hotel, Kuta Lombok"
                  />
                  {errors.trips?.[index]?.service_name && (
                    <p className="text-xs text-destructive">{errors.trips[index]?.service_name?.message}</p>
                  )}
                </div>

                {/* Pickup Address */}
                <div className="space-y-2">
                  <Label htmlFor={`trips.${index}.pickup_address`}>Alamat Penjemputan</Label>
                  <Input
                    id={`trips.${index}.pickup_address`}
                    {...register(`trips.${index}.pickup_address`)}
                    placeholder="Contoh: LOP Airport"
                  />
                </div>

                {/* Dropoff Address */}
                <div className="space-y-2">
                  <Label htmlFor={`trips.${index}.dropoff_address`}>Alamat Tujuan</Label>
                  <Input
                    id={`trips.${index}.dropoff_address`}
                    {...register(`trips.${index}.dropoff_address`)}
                    placeholder="Contoh: El Tropico Hotel, Kuta Lombok"
                  />
                </div>

                {/* Service Description */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor={`trips.${index}.service_description`}>Keterangan / Catatan Trip</Label>
                  <Input
                    id={`trips.${index}.service_description`}
                    {...register(`trips.${index}.service_description`)}
                    placeholder="Contoh: Flight IU762 · Arrival 10:00 AM · Driver with name sign"
                  />
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor={`trips.${index}.price`}>Harga Trip (IDR)</Label>
                  <Input
                    id={`trips.${index}.price`}
                    type="number"
                    {...register(`trips.${index}.price`, { valueAsNumber: true })}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SECTION 3: Penumpang & Pembayaran ─── */}
      <section className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h3 className="text-base font-semibold text-foreground border-b border-border pb-3">
          💳 Penumpang & Pembayaran
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="total_passengers">Total Penumpang</Label>
            <Input id="total_passengers" type="number" {...register("total_passengers", { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="total_luggage">Total Koper/Bagasi</Label>
            <Input id="total_luggage" type="number" {...register("total_luggage", { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="flight_number">Nomor Penerbangan</Label>
            <Input id="flight_number" {...register("flight_number")} placeholder="Contoh: IU762" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="payment_method">Metode Pembayaran</Label>
            <Controller
              control={control}
              name="payment_method"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="payment_method" className="w-full bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="transfer">Bank Transfer</SelectItem>
                    <SelectItem value="wise">Wise</SelectItem>
                    <SelectItem value="ota_settlement">OTA Settlement</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gross_price">Total Harga (IDR)</Label>
            <Input id="gross_price" type="number" {...register("gross_price", { valueAsNumber: true })} />
            <p className="text-xs text-muted-foreground">Auto-dihitung dari total harga trip</p>
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: Deposit & Status Kwitansi ─── */}
      <section className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h3 className="text-base font-semibold text-foreground border-b border-border pb-3">
          🧾 Deposit & Status Kwitansi
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="receipt_number">No. Kwitansi</Label>
            <Input id="receipt_number" {...register("receipt_number")} placeholder="Contoh: REC-2026-0038" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="receipt_status">Status Kwitansi</Label>
            <Controller
              control={control}
              name="receipt_status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="receipt_status" className="w-full bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="deposit_received">Deposit Diterima</SelectItem>
                    <SelectItem value="fully_paid">Lunas</SelectItem>
                    <SelectItem value="cancelled">Dibatalkan</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deposit_amount">Jumlah Deposit (IDR)</Label>
            <Input id="deposit_amount" type="number" {...register("deposit_amount", { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deposit_method">Metode Deposit</Label>
            <Controller
              control={control}
              name="deposit_method"
              render={({ field }) => (
                <Select value={field.value || ""} onValueChange={field.onChange}>
                  <SelectTrigger id="deposit_method" className="w-full bg-card">
                    <SelectValue placeholder="-- Pilih --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wise">Wise</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="ota">OTA</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="space-y-2 flex flex-col">
            <Label>Tanggal Deposit Diterima</Label>
            <Controller
              control={control}
              name="deposit_paid_at"
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger
                    className={cn(
                      "inline-flex items-center w-full h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="h-4 w-4 mr-2 opacity-50 shrink-0" />
                    {field.value ? format(field.value, "d MMM yyyy", { locale: id }) : <span>Pilih tanggal</span>}
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => field.onChange(date || undefined)}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="balance_due">Sisa Pembayaran (IDR)</Label>
            <Input id="balance_due" type="number" {...register("balance_due", { valueAsNumber: true })} />
            <p className="text-xs text-muted-foreground">Auto-dihitung dari Total − Deposit</p>
          </div>
        </div>
      </section>

      {/* ─── SECTION 5: Inclusions & Catatan ─── */}
      <section className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h3 className="text-base font-semibold text-foreground border-b border-border pb-3">
          📝 Inclusions & Catatan
        </h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="inclusions">Inclusions (1 item per baris)</Label>
            <Textarea
              id="inclusions"
              {...register("inclusions")}
              placeholder={"Private car (AC) for all land transfers\nDriver with name sign at LOP arrivals\nFuel & parking - fully included"}
              className="min-h-28"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="terms_notes">Terms & Catatan Kwitansi</Label>
            <Textarea
              id="terms_notes"
              {...register("terms_notes")}
              placeholder="Contoh: Sisa pembayaran IDR 1.200.000 dibayar tunai saat penjemputan pertama."
              className="min-h-20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Catatan Internal (tidak tampil di kwitansi)</Label>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder="Contoh: Deposit diterima via Wise tanggal 1 September 2026."
              className="min-h-16"
            />
          </div>
        </div>
      </section>

      {/* ─── SUBMIT ─── */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" type="button" onClick={() => window.history.back()}>
          Batal
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Simpan Booking
        </Button>
      </div>
    </form>
  );
}
