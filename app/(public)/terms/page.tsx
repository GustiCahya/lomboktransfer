import React from "react";

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-background">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <h1 className="text-4xl font-extrabold text-foreground mb-8">Terms of Service</h1>
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-6">Last updated: June 2026</p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground mb-6">By booking a service with Lombok Transfer, you agree to these terms and conditions.</p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">2. Booking and Payment</h2>
          <p className="text-muted-foreground mb-6">Bookings are confirmed once you receive a confirmation message via WhatsApp or Email. Payment can be made online or in cash to the driver.</p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">3. Cancellations</h2>
          <p className="text-muted-foreground mb-6">Free cancellation up to 24 hours before the scheduled pickup time. Cancellations within 24 hours may incur a fee.</p>
        </div>
      </div>
    </div>
  );
}
