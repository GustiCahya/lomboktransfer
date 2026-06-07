"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema, BookingFormValues } from "@/lib/validations/booking";
import { useRoutes } from "@/hooks/useRoutes";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon, Loader2 } from "lucide-react";

export default function BookingForm({ onSubmit }: { onSubmit: (data: BookingFormValues) => Promise<void> }) {
  const { routes } = useRoutes();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      pax_count: 1,
      luggage_count: 0,
      payment_method: "cash",
      source: "whatsapp",
      gross_price: 0,
    },
  });

  const selectedRouteId = watch("route_id");
  
  // Update price when route changes
  React.useEffect(() => {
    if (selectedRouteId && routes.length > 0) {
      const route = routes.find(r => r.id === selectedRouteId);
      if (route) {
        // You would normally set this via setValue, but for brevity we let user edit it
        // setValue("gross_price", route.base_price);
      }
    }
  }, [selectedRouteId, routes]);

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
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Guest Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium border-b pb-2">Informasi Tamu</h3>
          
          <div className="space-y-2">
            <Label htmlFor="guest_name">Nama Tamu <span className="text-destructive">*</span></Label>
            <Input id="guest_name" {...register("guest_name")} placeholder="Contoh: John Doe" />
            {errors.guest_name && <p className="text-xs text-destructive">{errors.guest_name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone_wa">No. WhatsApp</Label>
              <Input id="phone_wa" {...register("phone_wa")} placeholder="+62..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nationality">Kebangsaan</Label>
              <Input id="nationality" {...register("nationality")} placeholder="Contoh: ID, EN" />
            </div>
          </div>
        </div>

        {/* Trip Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium border-b pb-2">Detail Perjalanan</h3>

          <div className="space-y-2">
            <Label htmlFor="route_id">Pilih Rute <span className="text-destructive">*</span></Label>
            <select
              id="route_id"
              {...register("route_id")}
              className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">-- Pilih Rute --</option>
              {routes.map(r => (
                <option key={r.id} value={r.id}>{r.name} (Rp {r.base_price.toLocaleString("id-ID")})</option>
              ))}
            </select>
            {errors.route_id && <p className="text-xs text-destructive">{errors.route_id.message}</p>}
          </div>

          <div className="space-y-2 flex flex-col">
            <Label>Waktu Penjemputan <span className="text-destructive">*</span></Label>
            <Controller
              control={control}
              name="pickup_datetime"
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger>
                    <Button
                      variant={"outline"}
                      className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                    >
                      {field.value ? format(field.value, "PPP", { locale: id }) : <span>Pilih tanggal</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.pickup_datetime && <p className="text-xs text-destructive">{errors.pickup_datetime.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pax_count">Jumlah Penumpang</Label>
              <Input id="pax_count" type="number" {...register("pax_count", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gross_price">Harga (Rp)</Label>
              <Input id="gross_price" type="number" {...register("gross_price", { valueAsNumber: true })} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 border-t pt-6">
        <Button variant="outline" type="button" onClick={() => window.history.back()}>Batal</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Simpan Booking
        </Button>
      </div>
    </form>
  );
}
