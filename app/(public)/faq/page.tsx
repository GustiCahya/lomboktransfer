import React from "react";

export default function FAQPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-background">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <h1 className="text-4xl font-extrabold text-foreground mb-12 text-center">Frequently Asked Questions</h1>
        
        <div className="space-y-6">
          <div className="p-6 bg-card border border-border rounded-xl">
            <h3 className="font-bold text-lg mb-2">How do I book a transfer?</h3>
            <p className="text-muted-foreground">You can book online through our website or send us a message on WhatsApp. We will confirm your booking instantly.</p>
          </div>
          <div className="p-6 bg-card border border-border rounded-xl">
            <h3 className="font-bold text-lg mb-2">Are your prices per person or per vehicle?</h3>
            <p className="text-muted-foreground">All our prices are per vehicle, not per person. The maximum capacity depends on the vehicle you choose.</p>
          </div>
          <div className="p-6 bg-card border border-border rounded-xl">
            <h3 className="font-bold text-lg mb-2">Can I pay in cash to the driver?</h3>
            <p className="text-muted-foreground">Yes, you can pay in cash (IDR) directly to your driver upon arrival at your destination.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
