import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import SonnerToaster from "@/components/shared/Toaster";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL("https://lomboktransfer.com"),
  title: {
    default: "Lombok Transfer - Private Airport Transfer & Tours",
    template: "%s | Lombok Transfer",
  },
  description:
    "Book a private airport transfer, inter-city taxi, or day tour in Lombok, Indonesia. Transparent pricing per vehicle. Serving Lombok Airport (BIL), Kuta, Senggigi, Sembalun, Gili Islands & more.",
  keywords: [
    "lombok transfer",
    "lombok airport transfer",
    "private transfer lombok",
    "taxi lombok",
    "lombok taxi",
    "airport transfer lombok BIL",
    "kuta lombok transfer",
    "senggigi transfer",
    "gili islands transfer",
    "lombok tour",
    "rinjani transfer",
    "wisata lombok",
  ],
  authors: [{ name: "Lombok Transfer" }],
  creator: "Lombok Transfer",
  publisher: "Lombok Transfer",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "id_ID",
    url: "https://lomboktransfer.com",
    siteName: "Lombok Transfer",
    title: "Lombok Transfer - Private Airport Transfer & Tours",
    description:
      "Book a private airport transfer or day tour in Lombok. Transparent pricing, local drivers, instant confirmation via WhatsApp.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Lombok Transfer - Private Transfers & Tours in Lombok, Indonesia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lombok Transfer - Private Airport Transfer & Tours",
    description:
      "Book a private airport transfer or day tour in Lombok. Transparent pricing, local drivers, instant WhatsApp confirmation.",
    images: ["/og-image.jpg"],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Lombok Transfer",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={cn("font-sans", inter.variable)} suppressHydrationWarning>
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-GKM3VF0V1G"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-GKM3VF0V1G');
          `}
        </Script>
      </head>
      <body className="antialiased bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <SonnerToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
