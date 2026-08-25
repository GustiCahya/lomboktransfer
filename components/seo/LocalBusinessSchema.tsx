/**
 * JSON-LD Structured Data component for SEO
 * Supports LocalBusiness schema and FAQPage schema
 */

interface FAQ {
  q: string;
  a: string;
}

interface LocalBusinessSchemaProps {
  pageType?: "home" | "faq" | "contact";
  faqs?: FAQ[];
}

const LOCAL_BUSINESS_SCHEMA = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "TravelAgency"],
  "@id": "https://lomboktransfer.com/#organization",
  name: "Lombok Transfer",
  description:
    "Private airport transfer, inter-city taxi, and day tour services across Lombok Island, Indonesia. Transparent pricing, local drivers, instant WhatsApp confirmation.",
  url: "https://lomboktransfer.com",
  logo: "https://lomboktransfer.com/logo.svg",
  image: "https://lomboktransfer.com/og-image.jpg",
  telephone: "+6281907397667",
  email: "hello@lomboktransfer.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Jl. Langko 70",
    addressLocality: "Mataram",
    addressRegion: "Nusa Tenggara Barat",
    postalCode: "83114",
    addressCountry: "ID",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -8.5833,
    longitude: 116.1167,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday", "Tuesday", "Wednesday", "Thursday",
      "Friday", "Saturday", "Sunday",
    ],
    opens: "00:00",
    closes: "23:59",
  },
  priceRange: "IDR 175,000 – 1,000,000",
  currenciesAccepted: "IDR",
  paymentAccepted: "Cash, Bank Transfer",
  areaServed: {
    "@type": "GeoCircle",
    geoMidpoint: {
      "@type": "GeoCoordinates",
      latitude: -8.5833,
      longitude: 116.1167,
    },
    geoRadius: "150000",
  },
  sameAs: [
    "https://wa.me/6281907397667",
  ],
};

export default function LocalBusinessSchema({
  pageType = "home",
  faqs,
}: LocalBusinessSchemaProps) {
  const schemas: object[] = [LOCAL_BUSINESS_SCHEMA];

  if (pageType === "faq" && faqs && faqs.length > 0) {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.a,
        },
      })),
    };
    schemas.push(faqSchema);
  }

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
