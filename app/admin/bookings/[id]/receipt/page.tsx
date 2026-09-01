"use client";

import React, { useEffect, useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { ExternalLink, Printer } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminReceiptPage({ params }: { params: { id: string } }) {
  const [bookingCode, setBookingCode] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBooking() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("bookings")
        .select("booking_code")
        .eq("id", params.id)
        .single();
      
      if (!error && data) {
        setBookingCode(data.booking_code);
      }
    }
    fetchBooking();
  }, [params.id]);

  const receiptUrl = bookingCode ? `/verify/${bookingCode}` : null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Booking Receipt"
        subtitle="View and print the public receipt for this booking."
        actions={
          <>
            {receiptUrl && (
              <>
                <Button variant="outline" className="gap-2" onClick={() => window.open(receiptUrl, "_blank")}>
                  <ExternalLink className="w-4 h-4" /> Open Public Link
                </Button>
                <Button className="gap-2" onClick={() => {
                  const printWindow = window.open(receiptUrl, "_blank");
                  if (printWindow) {
                    printWindow.onload = () => {
                      printWindow.print();
                    };
                  }
                }}>
                  <Printer className="w-4 h-4" /> Print Receipt
                </Button>
              </>
            )}
          </>
        }
      />

      <div className="bg-white rounded-lg border shadow-sm p-4 min-h-[600px] flex items-center justify-center bg-gray-50">
        {receiptUrl ? (
          <iframe 
            src={receiptUrl} 
            className="w-full h-[800px] border-0 rounded-md shadow-md max-w-[800px] bg-white" 
            title="Receipt Preview" 
          />
        ) : (
          <div className="text-gray-500">Loading receipt preview...</div>
        )}
      </div>
    </div>
  );
}
