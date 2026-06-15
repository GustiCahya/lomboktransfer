import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read our Privacy Policy to understand how Lombok Transfer collects, uses, and protects your personal information.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://lomboktransfer.com/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-background">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <h1 className="text-4xl font-extrabold text-foreground mb-8">Privacy Policy</h1>
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-6">Last updated: June 2026</p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">1. Information We Collect</h2>
          <p className="text-muted-foreground mb-6">We collect information necessary to process your booking, such as your name, contact details, flight information, and destination.</p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">2. How We Use Your Information</h2>
          <p className="text-muted-foreground mb-6">Your information is used strictly for operational purposes, such as coordinating your pickup with our drivers. We do not sell your data to third parties.</p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">3. Data Security</h2>
          <p className="text-muted-foreground mb-6">We implement appropriate security measures to protect your personal information.</p>
        </div>
      </div>
    </div>
  );
}
