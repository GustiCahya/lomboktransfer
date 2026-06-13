import React from "react";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col font-sans">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}
