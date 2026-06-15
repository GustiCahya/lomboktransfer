import type { Metadata } from "next";
import React from "react";
import HomePageClient from "./HomePageClient";
import LocalBusinessSchema from "@/components/seo/LocalBusinessSchema";

export const metadata: Metadata = {
  title: "Lombok Transfer - Private Airport Transfer & Tours",
  description:
    "Book a private airport transfer, inter-city ride, or day tour in Lombok, Indonesia. Fixed pricing per vehicle. Serving Lombok Airport (BIL), Kuta, Senggigi, Gili Islands, Sembalun & more.",
  alternates: { canonical: "https://lomboktransfer.com" },
  openGraph: {
    title: "Lombok Transfer - Private Airport Transfer & Tours",
    description:
      "Private transfers & day tours across Lombok. Fixed pricing, local drivers, instant WhatsApp confirmation.",
    url: "https://lomboktransfer.com",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Lombok Transfer - Private Airport Transfers & Tours",
      },
    ],
  },
};

export default function PublicHomePage() {
  return (
    <>
      <LocalBusinessSchema pageType="home" />
      <HomePageClient />
    </>
  );
}
