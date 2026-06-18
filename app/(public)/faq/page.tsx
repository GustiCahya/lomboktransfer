import React from "react";
import type { Metadata } from "next";
import LocalBusinessSchema from "@/components/seo/LocalBusinessSchema";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Common questions about booking a private transfer or tour in Lombok. Learn about pricing, payment, cancellation, and how to book via WhatsApp.",
  openGraph: {
    title: "Frequently Asked Questions | Lombok Transfer",
    description:
      "Find answers to common questions about Lombok Transfer - pricing, payment, cancellation policy & more.",
    url: "https://lomboktransfer.com/faq",
  },
  alternates: { canonical: "https://lomboktransfer.com/faq" },
};

const FAQS = [
  {
    q: "How do I book a transfer?",
    a: "You can book online through our website by filling in the booking form, or send us a message directly on WhatsApp. We will confirm your booking instantly.",
  },
  {
    q: "Are your prices per person or per vehicle?",
    a: "All our prices are per vehicle, not per person. Maximum capacity is 1–4 passengers per sedan/MPV. This makes us great value for families and small groups.",
  },
  {
    q: "Can I pay in cash to the driver?",
    a: "Yes, you can pay in cash (IDR) directly to your driver upon arrival at your destination. We also accept bank transfer for advance payment.",
  },
  {
    q: "Do you provide meet & greet at the airport?",
    a: "Yes! For all airport pickup bookings, your driver will wait in the arrivals hall holding a name sign. We track your flight so delays are never a problem.",
  },
  {
    q: "What is your cancellation policy?",
    a: "Cancellations made more than 24 hours before your transfer are fully refundable. Cancellations within 24 hours may incur a 50% fee. No-shows are non-refundable.",
  },
  {
    q: "Do you cover all areas in Lombok?",
    a: "Yes! We cover the entire island of Lombok including Mataram, Senggigi, Kuta Lombok, Sembalun, Selong Belanak, Bangsal, and all Gili Islands via boat connection.",
  },
  {
    q: "How far in advance should I book?",
    a: "We recommend booking at least 24 hours in advance. For peak season (July–August, Christmas, New Year) please book 3–5 days ahead to guarantee availability.",
  },
  {
    q: "Is the driver English-speaking?",
    a: "Most of our drivers have basic English communication skills. For guests who require a fluent English-speaking guide, please let us know at the time of booking.",
  },
];

export default function FAQPage() {
  return (
    <>
      <LocalBusinessSchema pageType="faq" faqs={FAQS} />
      <div className="min-h-screen pt-32 pb-24 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold text-foreground mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about booking a private transfer or tour in Lombok.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="p-6 bg-card border border-border rounded-xl hover:border-primary/30 transition-colors">
                <h2 className="font-bold text-lg mb-2 text-foreground">{faq.q}</h2>
                <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center p-8 bg-primary/5 border border-primary/10 rounded-2xl">
            <p className="text-muted-foreground mb-4 text-lg">Still have questions?</p>
            <a
              href="https://wa.me/6285102633994"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              Chat with us on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
