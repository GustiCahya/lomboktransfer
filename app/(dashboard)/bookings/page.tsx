import React from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import BookingTable from "@/components/bookings/BookingTable";
import BookingFilters from "@/components/bookings/BookingFilters";
import { Plus, Download } from "lucide-react";
import Link from "next/link";

export default function BookingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Daftar Booking" 
        subtitle="Kelola seluruh pesanan trip masuk, tugaskan supir, dan pantau status perjalanan."
        actions={
          <>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" /> Export CSV
            </Button>
            <Link href="/bookings/new">
              <Button className="gap-2">
                <Plus className="w-4 h-4" /> Booking Baru
              </Button>
            </Link>
          </>
        }
      />

      {/* Filters */}
      <BookingFilters />

      <BookingTable />
    </div>
  );
}
