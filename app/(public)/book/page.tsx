import type { Metadata } from "next";
import React from "react";
import BookingPageClient from "./BookingPageClient";

export const metadata: Metadata = {
  title: "Book a Transfer",
  description:
    "Book your private airport transfer or inter-city ride in Lombok online. Fast, transparent pricing, instant WhatsApp confirmation. Serving Lombok Airport (BIL), Kuta, Senggigi & all destinations.",
  openGraph: {
    title: "Book a Transfer | Lombok Transfer",
    description:
      "Book a private transfer in Lombok. Fixed pricing, local drivers, WhatsApp confirmation.",
    url: "https://lomboktransfer.com/book",
  },
  alternates: { canonical: "https://lomboktransfer.com/book" },
};

export default function BookingPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen pt-32 pb-24 bg-muted/20 flex items-center justify-center">
          <div className="text-muted-foreground">Loading booking form...</div>
        </div>
      }
    >
      <BookingPageClient />
    </React.Suspense>
  );
}
