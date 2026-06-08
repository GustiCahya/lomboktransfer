# PRD — External Presence & Digital Channels Lombok Transfer
**Versi:** 1.0  
**Tanggal:** Juni 2026  
**Status:** Draft  
**Pemilik:** Tim Marketing & Produk — Lombok Transfer  

---

## Daftar Isi

1. [Overview & Tujuan](#1-overview--tujuan)
2. [Segmentasi Pasar & Bahasa](#2-segmentasi-pasar--bahasa)
3. [Channel Strategy Matrix](#3-channel-strategy-matrix)
4. [Modul 1 — Website & Landing Page](#4-modul-1--website--landing-page)
5. [Modul 2 — Online Booking Engine (Publik)](#5-modul-2--online-booking-engine-publik)
6. [Modul 3 — SEO & Content Marketing](#6-modul-3--seo--content-marketing)
7. [Modul 4 — Google Business Profile & Maps](#7-modul-4--google-business-profile--maps)
8. [Modul 5 — OTA Platforms](#8-modul-5--ota-platforms)
9. [Modul 6 — WhatsApp Business & AI Chatbot](#9-modul-6--whatsapp-business--ai-chatbot)
10. [Modul 7 — Social Media (EN/ID Market)](#10-modul-7--social-media-enid-market)
11. [Modul 8 — China Market (Xiaohongshu, WeChat, Trip.com)](#11-modul-8--china-market)
12. [Modul 9 — Email Marketing](#12-modul-9--email-marketing)
13. [Modul 10 — Review & Reputasi](#13-modul-10--review--reputasi)
14. [Modul 11 — Hotel & Partner Network (B2B)](#14-modul-11--hotel--partner-network-b2b)
15. [Integrasi Antar Channel](#15-integrasi-antar-channel)
16. [Analytics & KPI](#16-analytics--kpi)
17. [Non-Functional Requirements](#17-non-functional-requirements)
18. [Roadmap Implementasi](#18-roadmap-implementasi)

---

## 1. Overview & Tujuan

### 1.1 Konteks

Lombok Transfer adalah layanan transportasi wisata premium yang menghubungkan wisatawan dari Bandara Internasional Lombok (BIL) ke seluruh destinasi wisata utama di Lombok. Dua pasar utama yang disasar adalah wisatawan mancanegara berbahasa Inggris dan Mandarin, serta wisatawan domestik Indonesia.

Dokumen ini mendefinisikan semua sistem dan channel **eksternal** — yaitu semua titik kontak yang dilihat dan digunakan oleh calon tamu sebelum, selama, dan setelah perjalanan mereka.

### 1.2 Tujuan

- Membangun kehadiran digital yang kuat dan konsisten di semua channel yang relevan
- Mengkonversi pencarian online menjadi booking aktif
- Memastikan tamu mendapatkan pengalaman pre-trip dan post-trip yang seamless
- Membangun reputasi dan social proof yang menghasilkan booking organik jangka panjang
- Membuka channel akuisisi yang terdiversifikasi — tidak bergantung pada satu platform saja

### 1.3 Prinsip Desain External Channel

- **Satu tone, banyak bahasa:** Karakter brand Lombok Transfer — warm, lokal, terpercaya — harus konsisten di semua channel meski bahasa berbeda
- **Frictionless conversion:** Dari manapun tamu menemukan Lombok Transfer, jalur menuju booking harus sesedikit mungkin langkah
- **Mobile-first:** Mayoritas tamu riset dan booking dari HP, seringkali saat sudah di perjalanan
- **Trust building:** Di bisnis transportasi wisata, kepercayaan adalah produk utama — setiap channel harus menampilkan elemen trust (foto nyata, review asli, harga transparan, info supir)
- **Local expertise:** Positioning Lombok Transfer bukan sekadar "antar-jemput" tapi sebagai local authority yang tahu Lombok lebih baik dari siapapun

---

## 2. Segmentasi Pasar & Bahasa

### 2.1 Segmen Utama

| Segmen | Bahasa | Platform Utama | Karakteristik Booking |
|---|---|---|---|
| Wisatawan Inggris-speaking (Australia, UK, US, Eropa) | English | Google, Viator, GetYourGuide, Klook | Booking advance 2–4 minggu, riset panjang, baca review |
| Wisatawan China (Mainland, HK, Taiwan) | 中文 (Mandarin) | Xiaohongshu, Trip.com, WeChat | Booking advance 1–2 minggu, sangat visual, peer recommendation kuat |
| Wisatawan Asia Tenggara & Asia Lain (Jepang, Korea, dll) | English sebagai jembatan | Klook, Google | Booking via Klook dalam bahasa mereka |
| Wisatawan Domestik Indonesia | Bahasa Indonesia | Traveloka, Instagram, Google, WA | Booking lebih spontan, WhatsApp sebagai channel utama |

### 2.2 Kebijakan Bahasa

**Website:** EN + 中文 + ID (3 bahasa wajib)  
**Konten sosial media:** EN + ID untuk Instagram/TikTok; 中文 untuk Xiaohongshu  
**OTA listing:** EN (platform handle terjemahan ke bahasa lokal masing-masing)  
**WhatsApp chatbot:** Deteksi bahasa otomatis — EN / 中文 / ID  
**WeChat:** 中文 penuh  

---

## 3. Channel Strategy Matrix

### 3.1 Peta Channel per Funnel

```
AWARENESS (Sadar ada Lombok Transfer)
├── Google Search (SEO organik)
├── Google Ads (SEM — fase lanjutan)
├── Instagram Reels & TikTok (konten viral)
├── Xiaohongshu posts (pasar China)
├── Klook / Viator / Trip.com discovery
└── Referral dari hotel & travel agent

CONSIDERATION (Pertimbangkan untuk booking)
├── Website (info lengkap, harga, armada, testimoni)
├── Google Business Profile (review, foto, info)
├── OTA listing detail (review, rating, foto)
├── WhatsApp tanya-jawab pra-booking
└── WeChat inquiry (pasar China)

CONVERSION (Booking & bayar)
├── Website booking form (direct)
├── Klook / Viator / Traveloka / GetYourGuide / Trip.com
├── WhatsApp booking langsung
└── WeChat booking (pasar China)

LOYALTY & ADVOCACY (Ulang & rekomendasikan)
├── WhatsApp follow-up & review request
├── Email newsletter (pasar EN)
├── Review di Google / Klook / TripAdvisor
├── User-generated content di IG/TikTok/Xiaohongshu
└── Referral dari tamu ke teman
```

### 3.2 Prioritas Channel (ROI vs Effort)

| Channel | ROI Estimasi | Effort Setup | Prioritas |
|---|---|---|---|
| Google Business Profile | ⭐⭐⭐⭐⭐ | Rendah | 🔴 Wajib Pertama |
| WhatsApp Business | ⭐⭐⭐⭐⭐ | Rendah | 🔴 Wajib Pertama |
| Website + Booking Form | ⭐⭐⭐⭐ | Tinggi | 🔴 Wajib Pertama |
| Klook | ⭐⭐⭐⭐⭐ | Sedang | 🔴 Wajib Pertama |
| Traveloka Xperience | ⭐⭐⭐⭐ | Sedang | 🔴 Wajib Pertama |
| SEO Blog | ⭐⭐⭐⭐ | Sedang (jangka panjang) | 🟡 Fase 2 |
| Viator / GetYourGuide | ⭐⭐⭐⭐ | Sedang | 🟡 Fase 2 |
| Instagram & TikTok | ⭐⭐⭐ | Sedang (konsisten) | 🟡 Fase 2 |
| Xiaohongshu | ⭐⭐⭐⭐ | Sedang | 🟡 Fase 2 |
| Trip.com | ⭐⭐⭐⭐ | Sedang | 🟡 Fase 2 |
| WeChat Official Account | ⭐⭐⭐ | Tinggi | 🟢 Fase 3 |
| Hotel & Partner Network | ⭐⭐⭐⭐⭐ | Tinggi (relasi) | 🟢 Fase 3 |
| Email Marketing | ⭐⭐⭐ | Sedang | 🟢 Fase 3 |
| TripAdvisor | ⭐⭐⭐ | Rendah | 🟢 Fase 3 |

---

## 4. Modul 1 — Website & Landing Page

### 4.1 Deskripsi

Website resmi Lombok Transfer adalah hub digital utama — tempat semua channel lain mengarahkan tamu. Website harus mengkonversi pengunjung menjadi booking, membangun kepercayaan, dan mencerminkan posisi premium brand.

**Domain:** lomboktransfer.com (atau variasi yang tersedia)  
**Tech stack:** Next.js 14 + Tailwind CSS + Supabase  
**Bahasa:** EN / 中文 / ID (switcher di header)  
**Deployment:** Vercel  

### 4.2 Struktur Halaman

#### 4.2.1 Homepage (`/`)

**Hero Section:**
- Headline kuat yang menjual: "Lombok, Beautifully Delivered" (EN) / "让您的龙目岛之旅从落地就开始" (ZH) / "Lombok di Ujung Jari Anda" (ID)
- Sub-headline: proposisi nilai dalam 1 kalimat (24/7, professional local drivers, instant confirmation)
- CTA primer: tombol "Book Your Transfer" → langsung scroll ke / buka booking form
- CTA sekunder: "See Our Routes & Prices" → anchor ke section harga
- Background: video atau foto berkualitas tinggi armada, supir, destinasi Lombok (bukan stock photo)
- Trust badges: "1000+ Happy Travelers", "4.9★ Rating", "Trusted Since [tahun]"

**Why Choose Us Section (3–4 poin):**
- Professional Local Drivers — supir asli Lombok, berpengalaman, sopan
- Transparent Pricing — no hidden fees, harga konfirmasi di depan
- 24/7 Including Early Flights — penjemputan jam berapapun
- Instant Confirmation via WhatsApp — konfirmasi langsung setelah booking

**Destinasi Populer Section:**
- Card setiap destinasi: foto, nama, jarak/waktu dari BIL, harga mulai dari
- Destinasi: Gili Trawangan, Kuta Lombok, Senggigi, Mandalika, Tetebatu, Sembalun
- Klik card → buka booking form dengan destinasi ter-pre-fill

**Cara Kerja (How It Works) — 3 Langkah:**
1. Book Online atau via WhatsApp
2. Terima konfirmasi + detail supir
3. Dijemput tepat waktu di bandara

**Testimoni / Review Section:**
- 6–8 review nyata dari Google/Klook/Viator (dengan nama, kebangsaan, foto profil jika ada)
- Review dalam bahasa sesuai versi website (EN/ZH/ID)
- Link ke halaman review lengkap

**Armada Section:**
- Foto interior dan eksterior kendaraan
- Spesifikasi: merk, kapasitas, fasilitas (AC, bottled water, clean)
- Tidak perlu nama/plat kendaraan, cukup model dan kesan premium

**FAQ Section:**
- 8–10 pertanyaan paling umum (embedded structured FAQ untuk SEO)
- Pertanyaan: metode pembayaran, kebijakan cancel, bagasi, bayi, early morning, dll

**Footer:**
- Logo + tagline
- Navigasi cepat
- Nomor WhatsApp (klik langsung buka WA)
- Email
- Alamat kantor / area operasional
- Link: Terms of Service, Privacy Policy, Cookie Policy
- Ikon media sosial (IG, TikTok, Facebook, Xiaohongshu)

#### 4.2.2 Halaman Rute & Harga (`/routes` atau `/prices`)

Tabel atau card grid semua rute yang tersedia:
- Rute asal → tujuan
- Harga per kendaraan (max 4 pax)
- Estimasi durasi
- Keterangan surcharge (dini hari/malam, high season)
- Tombol "Book This Route" per rute

Catatan pricing yang transparan:
- Harga per mobil privat, bukan per orang
- Termasuk apa saja (air mineral, meets-greets di bandara, dll)
- Tidak termasuk apa (tiket feri Gili, dll)
- Kebijakan cancellation

#### 4.2.3 Halaman Tentang Kami (`/about`)

- Cerita singkat: siapa kami, kenapa kami ada, apa yang membuat kami berbeda
- Foto tim dan supir nyata (nama, foto, "sudah X tahun di Lombok")
- Misi: menghubungkan dunia dengan keajaiban Lombok melalui perjalanan yang nyaman dan terpercaya
- Sertifikat / izin usaha (thumbnail, tidak perlu detail) — membangun kepercayaan
- Komitmen: keselamatan, kejujuran, kenyamanan

#### 4.2.4 Halaman Paket Tour (`/tours`)

Selain airport transfer, halaman ini menampilkan paket wisata sehari (day tour):

Per paket:
- Nama paket (misal: "West Lombok Explorer", "Gili Island Transfer + Tour")
- Foto highlight destinasi dalam paket
- Itinerary singkat: destinasi yang dikunjungi
- Durasi
- Harga per mobil
- Apa yang termasuk / tidak termasuk
- Min/max pax
- Tombol "Book This Tour"

Paket contoh:
- West Lombok (Senggigi + Tanjung Aan + Batu Bolong)
- East Lombok (Tetebatu + Air Terjun + Sembalun)
- South Lombok (Kuta + Mawun + Selong Belanak + Tanjung Aan)
- Full Day Lombok Highlights
- Gili Hop (transfer + brief island hopping)

#### 4.2.5 Halaman Blog / Travel Guide (`/blog`)

Konten SEO yang menarik tamu dari Google. Minimal 1–2 artikel per bulan.

Contoh artikel:
- "How to Get from Lombok Airport to Gili Trawangan — Complete Guide 2026"
- "Best Beaches in South Lombok: A Local's Guide"
- "Lombok vs Bali: Which Island is Right for You?"
- "What to Expect at Lombok International Airport (BIL)"
- "Top 10 Things to Do in Kuta Lombok"
- 龙目岛机场到吉利的最佳出行方式（中文版）

#### 4.2.6 Halaman Konfirmasi Booking (`/booking/confirmation/[id]`)

Setelah booking berhasil:
- Ringkasan booking (nomor booking, nama tamu, rute, tanggal/jam, supir yang ditugaskan)
- Instruksi meeting point di BIL (foto gate / area penjemputan)
- Tombol: Download PDF itinerary, Share via WhatsApp, Add to Google Calendar
- Info penting: nomor WA supir, apa yang perlu dibawa, kebijakan cancel

#### 4.2.7 Halaman Status Booking (`/booking/status/[code]`)

Tamu bisa cek status booking mereka sendiri:
- Input: booking code + nomor HP
- Tampil: status saat ini, detail supir (nama + foto + nomor WA), progress tracker
- Cocok untuk tamu yang ingin update real-time sebelum dijemput

#### 4.2.8 Halaman Legal

- `/terms` — Syarat & Ketentuan (EN/ID/ZH)
- `/privacy` — Kebijakan Privasi (GDPR-compliant)
- `/cookies` — Cookie Policy

### 4.3 Fitur Website Teknis

**Multi-language:**
- URL structure: `/en/`, `/id/`, `/zh/` atau sub-domain `en.lomboktransfer.com`
- Fallback: default ke EN jika bahasa tidak terdeteksi
- Language switcher di header (persisten via cookie)
- `hreflang` tag untuk SEO masing-masing bahasa

**Performance:**
- Target Lighthouse score: 90+ semua kategori
- Image optimization: WebP, lazy load, responsive srcset
- Core Web Vitals: LCP < 2.5s, CLS < 0.1, FID < 100ms
- Static generation (SSG) untuk halaman statis, SSR untuk halaman dinamis

**SEO On-page:**
- Meta title dan description unik per halaman per bahasa
- Open Graph tags (preview di WhatsApp, Facebook, WeChat)
- Structured data: `LocalBusiness`, `TouristTrip`, `FAQPage`, `BreadcrumbList`
- Canonical URL
- XML sitemap otomatis
- `robots.txt` yang benar

**Tracking & Analytics:**
- Google Analytics 4 (GA4)
- Google Search Console
- Facebook Pixel (untuk retargeting)
- Hotjar atau Microsoft Clarity (heatmap, session recording)
- Konversi tracking: booking form submit, WA button click, phone click

**Security:**
- HTTPS wajib (SSL via Vercel)
- CAPTCHA atau honeypot di form booking (anti-spam)
- Rate limiting pada booking API
- Input sanitization di semua form

---

## 5. Modul 2 — Online Booking Engine (Publik)

### 5.1 Deskripsi

Form booking yang terintegrasi di website — bisa muncul sebagai modal, section di homepage, atau halaman tersendiri di `/book`.

### 5.2 Alur Booking (4 Langkah)

#### Step 1 — Pilih Layanan & Rute

**Tipe layanan:**
- Airport Transfer (BIL → Destinasi)
- Transfer ke Bandara (Destinasi → BIL)
- Point-to-point (antar destinasi di Lombok)
- Day Tour / Paket Wisata

**Pilih Rute:**
- Dropdown atau search "titik jemput → titik antar"
- Jika BIL sebagai titik jemput: muncul field "Nomor Penerbangan" (opsional, untuk flight tracking)
- Harga otomatis muncul setelah rute dipilih
- Estimasi durasi perjalanan

#### Step 2 — Pilih Tanggal & Detail

- Date picker (tanggal penjemputan)
- Time picker (jam penjemputan) — dengan keterangan surcharge dini hari jika jam 00:00–06:00
- Jumlah penumpang (1–7, dibatasi kapasitas kendaraan)
- Jumlah bagasi besar (untuk estimasi kendaraan yang cocok)
- Catatan khusus (child seat, tamu dengan kebutuhan khusus, dll)
- Harga otomatis update (termasuk surcharge jika applicable)

#### Step 3 — Data Tamu

- Nama lengkap (required)
- Nomor WhatsApp aktif (required) — format internasional
- Email (optional, untuk kirim invoice)
- Kebangsaan / preferensi bahasa (untuk supir)
- Nomor penerbangan jika dari bandara (untuk flight tracking)

**Ringkasan booking sebelum konfirmasi:**
- Rute, tanggal, jam
- Jumlah pax
- Harga final (breakdown: base + surcharge jika ada)
- Kebijakan cancellation ringkas

#### Step 4 — Pembayaran & Konfirmasi

**Opsi pembayaran:**
- Bayar saat tiba (Cash/Transfer) — default untuk booking langsung
- Bayar online via Midtrans (kartu kredit, transfer bank, GoPay, OVO, Dana)

**Setelah submit:**
- Loading state: "Sedang memproses booking Anda..."
- Sukses: redirect ke `/booking/confirmation/[id]`
- Error: pesan error yang jelas dan actionable

**Konfirmasi dikirim via:**
- WA ke tamu (otomatis via n8n + Fonnte)
- Email ke tamu (jika email diisi)
- Notif ke admin dashboard

### 5.3 Embedded Booking Widget

Selain halaman `/book`, booking form tersedia sebagai widget yang bisa di-embed:
- Di homepage sebagai hero section atau sticky bar
- Di halaman rute masing-masing
- Di artikel blog yang relevan

### 5.4 Booking via WhatsApp (Alternative Flow)

Untuk tamu yang tidak mau isi form, WA button di website langsung membuka chat dengan pesan pre-filled:
```
"Hi! I'd like to book a transfer from [origin] to [destination] on [date]. 
How much is it?"
```
Flow dilanjutkan oleh Claude AI chatbot atau admin.

---

## 6. Modul 3 — SEO & Content Marketing

### 6.1 Deskripsi

Strategi untuk mendapatkan traffic organik dari Google — tamu yang sedang riset perjalanan ke Lombok sebelum booking. Ini channel akuisisi paling murah jangka panjang.

### 6.2 Target Keywords

#### 6.2.1 High Intent (langsung cari jasa)

| Keyword | Volume Est. | Bahasa |
|---|---|---|
| lombok airport transfer | Tinggi | EN |
| BIL airport to gili trawangan | Tinggi | EN |
| lombok airport to kuta | Sedang | EN |
| private driver lombok | Tinggi | EN |
| airport transfer lombok price | Sedang | EN |
| 龙目岛机场接送 | Sedang | ZH |
| 龙目岛机场到吉利交通 | Sedang | ZH |
| transfer bandara lombok | Sedang | ID |
| supir private lombok | Sedang | ID |

#### 6.2.2 Research Intent (riset destinasi)

| Keyword | Bahasa |
|---|---|
| how to get from lombok airport to gili | EN |
| lombok to gili trawangan transport | EN |
| best way to travel in lombok | EN |
| lombok travel guide | EN |
| what to do in kuta lombok | EN |
| 龙目岛交通攻略 | ZH |
| 吉利海岛怎么去 | ZH |
| wisata lombok itinerary | ID |

### 6.3 Strategi Konten Blog

**Frekuensi:** 2 artikel/bulan minimal, target 1 per minggu saat sudah punya resource

**Struktur artikel SEO:**
- Judul mengandung keyword utama
- H2 dan H3 terstruktur dengan pertanyaan natural
- Panjang: 1.200–2.500 kata untuk artikel utama
- Internal link ke halaman rute, booking form, artikel lain
- 1–2 gambar original per artikel (foto nyata dari Lombok, bukan stock)
- FAQ section di bawah (FAQ structured data)
- CTA di dalam artikel dan di akhir: "Book your transfer now"

**Kalender Konten (12 artikel prioritas pertama):**

1. How to Get from Lombok Airport to Gili Trawangan: Complete Guide [EN]
2. How to Get from Lombok Airport to Kuta Lombok [EN]
3. Lombok Airport (BIL) Guide: Arrivals, Facilities & Transport Options [EN]
4. Best Beaches in South Lombok: A Local Driver's Picks [EN]
5. Lombok vs Bali: Honest Comparison for Travelers in 2026 [EN]
6. 龙目岛机场到吉利群岛交通全攻略 [ZH]
7. 龙目岛自由行交通指南：包车还是自驾？[ZH]
8. Cara Menuju Gili Trawangan dari Bandara Lombok [ID]
9. Rekomendasi Supir Wisata Lombok yang Terpercaya [ID]
10. Private vs Shared Transfer in Lombok: Which Is Right for You? [EN]
11. What to See in Kuta Lombok: A 2-Day Itinerary [EN]
12. Lombok in 3 Days: The Perfect Itinerary with Transport Tips [EN]

### 6.4 Local SEO

**Optimasi untuk pencarian lokal:**
- NAP consistency (Name, Address, Phone) identik di semua platform
- "Lombok airport transfer" di title dan meta semua halaman utama
- Schema LocalBusiness dengan area served: Lombok
- Embed Google Maps di halaman Kontak

**Link building:**
- Submit ke direktori wisata (Lonely Planet, Rough Guides, travel blogs)
- Guest post di travel blog yang menulis tentang Lombok / Indonesia
- Dapatkan mention di forum Tripadvisor / Reddit r/solotravel / r/indonesia

### 6.5 Technical SEO Checklist

- [ ] XML sitemap di-submit ke Google Search Console
- [ ] `hreflang` benar untuk EN/ZH/ID
- [ ] Canonical URL di semua halaman
- [ ] 301 redirect untuk URL yang berubah
- [ ] Tidak ada broken link (monitoring bulanan)
- [ ] Core Web Vitals dalam batas Google (monitor via Search Console)
- [ ] Schema markup: LocalBusiness, FAQPage, BreadcrumbList, TouristTrip
- [ ] Image alt text deskriptif di semua gambar

---

## 7. Modul 4 — Google Business Profile & Maps

### 7.1 Deskripsi

Google Business Profile (GBP) adalah salah satu asset digital paling berharga untuk bisnis lokal. Ini yang muncul di Google Maps dan di panel kanan ketika seseorang search "lombok airport transfer" atau nama brand.

### 7.2 Setup & Optimasi

**Informasi Wajib:**
- Nama bisnis: Lombok Transfer (konsisten, tidak diubah-ubah)
- Kategori utama: Airport Shuttle Service
- Kategori tambahan: Tour Operator, Transportation Service
- Alamat: alamat kantor / operasional di Lombok
- Area layanan: Lombok Island (set radius layanan, bukan pin alamat saja)
- Jam operasional: 24 jam, 7 hari (karena melayani early morning flight)
- Nomor telepon: nomor WA utama
- Website: lomboktransfer.com
- Deskripsi (750 karakter): mencakup keyword utama, USP, layanan utama

**Foto yang Harus Diupload:**
- Logo (format persegi, JPG/PNG)
- Cover photo (landscape, kendaraan atau destinasi Lombok)
- 10–15 foto: armada kendaraan (interior + eksterior), supir profesional, tamu puas (dengan izin), destinasi wisata
- Foto diupdate minimal sebulan sekali — Google memberi prioritas pada profil aktif

**Posting GBP:**
- Buat "update" / post baru setiap 1–2 minggu
- Konten: promosi, tips perjalanan, foto baru, high season info
- Ini meningkatkan visibility di Google Maps

### 7.3 Review Management di Google

- **Target:** minimum 50 review dalam 3 bulan pertama, minimum 100 dalam 6 bulan
- **Rating target:** pertahankan 4.7+ bintang
- Setiap trip selesai → n8n kirim WA ke tamu berisi link Google review langsung
- Admin wajib balas SEMUA review (positif dan negatif) dalam 24 jam
- Template respons untuk review positif dan negatif (lihat Modul 10)

### 7.4 Google Maps Integration

**Di website:**
- Embed peta Google Maps di halaman Contact/About dengan pin lokasi kantor
- Link "Get Directions" ke Google Maps

**Di komunikasi tamu:**
- Kirim Google Maps pin lokasi meeting point di BIL saat konfirmasi booking
- Supir bisa share live location via WA saat menuju tamu

### 7.5 Google Analytics & Search Console

**Google Analytics 4:**
- Setup GA4 property di website
- Event tracking: booking_initiated, booking_completed, whatsapp_click, phone_click
- Goal: booking form submission = konversi
- Audience: buat audience dari pengunjung yang belum booking untuk retargeting

**Google Search Console:**
- Verify ownership website
- Submit sitemap
- Monitor: keyword yang membawa traffic, CTR, posisi rata-rata
- Alert: crawl errors, manual penalties

---

## 8. Modul 5 — OTA Platforms

### 8.1 Deskripsi

OTA (Online Travel Agency) adalah channel distribusi yang membawa tamu yang sudah niat beli — mereka aktif mencari layanan di platform, bukan perlu diedukasi lagi. Komisi OTA (15–25%) sepadan dengan kualitas lead-nya.

### 8.2 Platform Prioritas

#### 8.2.1 Klook

**Target market:** Asia-Pacific (terbesar di Asia untuk activities & transfers)  
**Komisi:** ~20%  
**Setup:**

- Daftar sebagai supplier di Klook Merchant Portal
- Buat listing: "Lombok Airport Private Transfer"
- Buat listing terpisah per rute utama (BIL→Gili, BIL→Kuta, dll) — lebih banyak listing = lebih banyak surface
- Foto: minimum 8 foto profesional (armada, supir, destinasi)
- Deskripsi: EN, detail, keyword-rich, highlight USP (24/7, meet-greet, etc.)
- Set harga: gross price (Klook potong komisi otomatis)
- Availability: connect via API atau update manual (realtime preferred)
- Booking cutoff: minimum 2 jam sebelum pickup
- Cancellation policy: Full refund jika cancel 24 jam sebelum

**Optimasi listing Klook:**
- Tanggapi semua review di Klook Merchant Portal
- Aktifkan Klook Deals untuk periode high season
- Request Klook untuk featured placement setelah mencapai 50+ review

#### 8.2.2 Viator (by TripAdvisor)

**Target market:** English-speaking (US, UK, Australia, Eropa Barat)  
**Komisi:** ~20–25%  
**Setup:**

- Daftar sebagai experience provider di Viator Supplier Portal
- Listing "Lombok Airport Private Transfer & Tours"
- Viator memiliki program "Book on TripAdvisor" — listing otomatis muncul di TripAdvisor
- Foto: minimum 6 foto
- Deskripsi EN profesional, temukan tone yang tepat (bukan terlalu formal)
- Harga dalam USD (Viator convert otomatis)
- Viator memiliki program review generation — manfaatkan

#### 8.2.3 Traveloka Xperience

**Target market:** Indonesia + Asia Tenggara (Malaysia, Thailand, Philippines)  
**Komisi:** ~15–20%  
**Setup:**

- Daftar sebagai partner Traveloka di traveloka.com/id/explore/host
- Buat listing "Transfer Bandara Lombok" dalam Bahasa Indonesia
- Traveloka Xperience muncul di aplikasi Traveloka yang digunakan jutaan orang Indonesia
- Pastikan listing juga tersedia dalam EN untuk turis asing yang pakai Traveloka
- Integrasi notifikasi booking ke sistem internal via webhook atau email forwarding ke n8n

#### 8.2.4 GetYourGuide

**Target market:** Eropa (terutama Jerman, Belanda, Prancis)  
**Komisi:** ~20–25%  
**Setup:**

- Daftar di GetYourGuide Supplier Center
- Listing "Lombok Airport Transfer — Private & Comfortable"
- GetYourGuide punya traffic sangat besar dari Eropa
- Harga dalam EUR
- Foto dan deskripsi serupa dengan Viator

#### 8.2.5 Trip.com (Ctrip)

**Target market:** China (paling dominan), juga global  
**Komisi:** ~15–20%  
**Setup:**

- Daftar di Trip.com Partner Portal (trip.com/partner)
- Listing dalam 中文 (wajib untuk pasar China)
- Ini adalah OTA yang paling dipakai turis China untuk transport internasional
- Minta bantuan penerjemah profesional untuk deskripsi Mandarin jika perlu
- Harga dalam CNY dan IDR

### 8.3 Manajemen OTA (Operational)

**Channel Manager:**
Idealnya gunakan channel manager untuk sinkronisasi availability dan harga ke semua OTA sekaligus. Opsi: BookingKit, Fareharbor, Rezdy. Namun sebagai fase awal, update manual bisa dilakukan.

**Proses booking dari OTA:**
1. Booking masuk di OTA → notif email ke admin
2. n8n pickup notif → buat booking di Supabase → proses dispatch normal
3. Settlement: OTA transfer nett setiap 2 minggu atau bulanan — upload ke modul Accounting untuk rekonsiliasi

**Kebijakan harga OTA:**
- Harga di semua OTA harus sama (price parity) — OTA akan penalti jika ada perbedaan harga
- Harga direct booking di website boleh lebih murah karena tidak ada komisi
- Tidak disarankan publikasikan harga yang lebih murah secara terbuka di OTA vs website

### 8.4 TripAdvisor

TripAdvisor lebih berfungsi sebagai review platform daripada booking platform untuk transport, tapi tetap penting:
- Klaim listing di TripAdvisor Business Center
- Lengkapi profil dan upload foto
- Respond semua review dalam 48 jam
- Viator booking otomatis terkoneksi ke TripAdvisor Experiences

---

## 9. Modul 6 — WhatsApp Business & AI Chatbot

### 9.1 Deskripsi

WhatsApp adalah channel konversi tertinggi di Indonesia dan sangat populer di Asia. Hampir semua tamu — baik domestik maupun mancanegara dari Asia — lebih nyaman tanya via WA sebelum booking. Ini wajib dioptimalkan.

### 9.2 WhatsApp Business Account Setup

**Akun:** WhatsApp Business API (bukan WhatsApp Business app biasa)  
**Gateway:** Fonnte (provider lokal, lebih murah dari Meta langsung)  
**Nomor:** Nomor khusus bisnis, bukan nomor pribadi  

**Profil WhatsApp Business:**
- Nama: Lombok Transfer
- Foto profil: logo
- Deskripsi: "Lombok's Premier Airport Transfer & Tour Service | 24/7 | EN/ID/中文"
- Kategori: Travel & Transportation
- Email: hello@lomboktransfer.com
- Website: lomboktransfer.com
- Jam: 24/7 (dengan catatan response time)

**Katalog Produk (WhatsApp Catalog):**
- Daftar layanan utama dengan foto, deskripsi singkat, harga mulai dari
- Tamu bisa browse dan share katalog

### 9.3 Link & Entry Points

**Link WA custom:** `wa.me/628xxxxxxxxxx?text=Hi!%20I'd%20like%20to%20book%20a%20transfer`

**Entry points ke WA:**
- Tombol "Book via WhatsApp" / "Chat with Us" di semua halaman website
- Floating button WA di pojok kanan bawah website (mobile-friendly)
- Link di bio Instagram dan TikTok
- QR code di brosur fisik, kartu nama, mobil
- Tombol di konfirmasi booking OTA
- "Contact Driver" di halaman status booking

### 9.4 AI Chatbot (Claude API)

**Fungsi:**
Auto-reply untuk tamu yang mengirim pesan di luar jam kerja atau untuk pertanyaan-pertanyaan umum. Chatbot mengurangi beban admin sambil tetap memberikan respons cepat.

**Kemampuan Chatbot:**

Level 1 — Informasi & FAQ:
- Harga transfer per rute
- Cara booking
- Jam operasional
- Kebijakan cancellation
- Informasi meeting point di BIL
- Pertanyaan umum tentang Lombok (apakah bisa ke Gili hari ini, berapa lama perjalanan, dll)

Level 2 — Pengumpulan Data Booking:
- Tanya rute yang diinginkan
- Tanya tanggal dan jam
- Tanya jumlah penumpang
- Konfirmasi harga
- Arahkan ke booking form atau proses booking langsung di WA

Level 3 — Eskalasi ke Manusia:
- Jika pertanyaan di luar kemampuan AI (komplain, kondisi khusus, negosiasi harga)
- Jika tamu eksplisit minta bicara dengan manusia
- Chatbot kirim notif ke admin: "Ada tamu yang perlu dihandle manual"

**Bahasa:**
- Deteksi otomatis bahasa tamu (EN / ID / ZH)
- Chatbot reply dalam bahasa yang sama
- Zhongwen chatbot untuk pasar China

**Sistem Prompt Chatbot (ringkasan):**
```
Kamu adalah asisten Lombok Transfer, layanan transportasi wisata premium di Lombok, Indonesia.
Tugasmu: bantu calon tamu mendapatkan informasi dan booking.
Karakter: ramah, helpful, professional, singkat dan jelas.
Bahasa: sesuaikan dengan bahasa tamu (EN/ID/ZH).
Jangan berikan informasi yang tidak kamu tahu — arahkan ke admin.
Selalu coba arahkan menuju booking.
Data harga dan rute: [embed dari database]
```

**Teknis:**
- Webhook Fonnte → n8n → Claude API → n8n → Fonnte → WA tamu
- Riwayat percakapan per nomor WA disimpan di Supabase (context window)
- Rate limit: max 10 reply otomatis per sesi sebelum eskalasi ke manusia
- Fallback: jika API error, kirim pesan default "Tim kami akan segera menghubungi Anda"

### 9.5 Template Pesan (Message Templates)

Untuk pesan outbound (keluar dari bisnis ke tamu) via WA API, Meta mewajibkan template yang sudah diapprove. Daftarkan template:

| Template | Trigger | Bahasa |
|---|---|---|
| `booking_confirmation_en` | Booking dikonfirmasi | EN |
| `booking_confirmation_id` | Booking dikonfirmasi | ID |
| `booking_confirmation_zh` | Booking dikonfirmasi | ZH |
| `driver_assigned_en` | Supir ditugaskan | EN |
| `trip_reminder_en` | H-1 sebelum trip | EN |
| `post_trip_review_en` | Post trip (minta review) | EN |
| `cancellation_confirm_en` | Konfirmasi pembatalan | EN |

Versi ID dan ZH untuk semua template di atas.

---

## 10. Modul 7 — Social Media (EN/ID Market)

### 10.1 Deskripsi

Social media berfungsi untuk membangun brand awareness, konten yang bisa di-share, dan merangsang "dream travel" tamu potensial yang belum tahu mau ke mana. Fokus: Instagram dan TikTok untuk jangkauan organik, Facebook untuk komunitas dan grup travel.

### 10.2 Instagram

**Handle:** @lomboktransfer (atau yang tersedia)  
**Bio:** "🌴 Lombok's Premier Airport Transfer & Tours | 24/7 | Airport to Gili, Kuta, Senggigi & More | 🔗 Book via link below"  
**Link in bio:** linktree / linktr.ee / direct ke website  

**Content Pillars (4 tema utama):**

1. **Destination Eye-candy** (40%)
   - Foto dan Reels destinasi Lombok yang memukau
   - Format: landscape, pantai, sawah, sunset, Gili
   - Tujuan: membuat orang mimpi pergi ke Lombok

2. **Social Proof & Testimoni** (25%)
   - Screenshot review Google/Klook yang bagus
   - Foto tamu (dengan izin) di dalam mobil atau di destinasi
   - "Tamu dari [negara] habis jalan-jalan ke [destinasi] bareng kami"

3. **Behind the Scenes & Tim** (20%)
   - Supir kami yang ramah, persiapan pagi sebelum penjemputan
   - Cerita lokal dari supir (pengetahuan tentang Lombok)
   - "Did you know? Tips wisata Lombok dari driver kami"

4. **Edukasi & Tips Travel** (15%)
   - "Cara ke Gili dari BIL: 3 opsi dan perbandingannya"
   - "5 hal yang harus tahu sebelum ke Lombok"
   - FAQ dalam format carousel

**Format Konten:**
- Reels (15–60 detik): jangkauan terluas, prioritas utama
- Carousel (3–10 slide): bagus untuk tips & edukasi, bisa di-save
- Single photo: untuk visual kuat (sunrise, pantai)
- Stories: update harian, behind the scenes, polling tamu
- Highlights: Destinasi / Armada / Testimoni / FAQ / Booking Guide

**Frekuensi:**
- 4–5 post per minggu (minimal)
- Stories: setiap hari jika memungkinkan
- Reels: 3 per minggu

**Hashtag Strategy:**
```
#LombokTransfer #LombokAirportTransfer #VisitLombok #LombokIsland
#GiliTrawangan #KutaLombok #Senggigi #MandalikaN #LombokTravel
#IndonesiaTravel #AirportTransfer #PrivateDriver #LombokTourism
#GiliIsland #LombokBeach #ExploreIndonesia
```

**Posting Best Practices:**
- Caption dalam EN + ID (bilingual lebih baik)
- Selalu ada CTA: "Book now via link in bio" / "DM or WhatsApp to book"
- Tag lokasi (geotag) di setiap post
- Balas semua komentar dan DM dalam 4 jam

### 10.3 TikTok

**Handle:** @lomboktransfer  
**Bio:** "Lombok's #1 Airport Transfer 🏝️ | Book via link"  

**Content Strategy TikTok:**
TikTok algoritma sangat mengutamakan konten yang entertain dan informatif, bukan promosi langsung.

Format yang works:
- "POV: dijemput di Bandara Lombok jam 4 pagi" (storytelling + emotional)
- "Gili Trawangan trip dari BIL — full experience" (vlog gaya)
- "3 pantai tersembunyi di Lombok yang hanya driver lokal tahu" (hook kuat)
- "Berapa harga transfer Lombok yang wajar? Jangan kena tipu" (konten warning)
- Duet atau reply ke video turis yang ke Lombok
- Before/after: dari bandara sampai destinasi impian dalam 60 detik

**Teknis TikTok:**
- Vertical video 9:16
- Hook dalam 3 detik pertama
- Musik trending yang relevan
- Caption pendek di layar
- Caption video: bahasa sesuai konten (EN untuk konten yang mau jangkau global)
- 3–5 TikTok per minggu

### 10.4 Facebook

**Halaman:** Lombok Transfer  
**Fungsi utama:** komunitas, grup travel, tamu yang lebih senior  

**Strategi:**
- Cross-post konten dari Instagram
- Aktif di grup: "Lombok Travelers", "Backpackers Indonesia", "Expats in Lombok", "Visit Lombok"
- Bukan iklan langsung di grup — bantu dengan konten berguna, sertakan brand mention natural
- Facebook Events untuk high season / paket khusus

**Facebook Pixel:**
- Pasang Facebook Pixel di website untuk retargeting pengunjung yang belum booking
- Fase lanjutan: buat lookalike audience dari tamu yang sudah booking

---

## 11. Modul 8 — China Market

### 11.1 Deskripsi

Pasar China adalah segmen dengan yield tinggi dan membutuhkan pendekatan yang sama sekali berbeda dari pasar EN karena ekosistem digital China yang tertutup (Google, Instagram, WhatsApp tidak bisa diakses di China daratan).

### 11.2 Xiaohongshu (小红书 / RedNote)

**Handle:** 龙目岛出行 atau lombok_transfer  
**Bio dalam Mandarin:** "龙目岛专业机场接送服务 | 24小时 | 专业司机 | 安全舒适"  

**Kenapa Xiaohongshu:**
- Platform utama untuk riset travel Gen Z dan Millennial China
- Konten berfungsi seperti Pinterest + Instagram + review blog sekaligus
- Turis China sangat bergantung pada Xiaohongshu sebelum memilih layanan di destinasi asing

**Jenis Konten:**
- Photo essay: "从龙目岛机场到吉利群岛的完整攻略" (panduan lengkap dari BIL ke Gili)
- Review style: tulis seperti travel note, bukan iklan
- Real photo: foto armada, supir, jalan menuju Gili, pantai Kuta
- Tips: "龙目岛旅行必知交通信息" (info transportasi wajib tahu di Lombok)
- Konten video pendek (Xiaohongshu juga mendukung video)

**Frekuensi:** 3–4 post per minggu  
**Bahasa:** Mandarin (Simplified Chinese) penuh  

**Kolaborasi KOL/KOC:**
- Ajak travel KOC (Key Opinion Consumer) China yang sedang ke Lombok untuk review
- KOC lebih kecil tapi lebih authentic dari KOL besar
- Kompensasi: layanan gratis atau diskon significant sebagai imbalan konten jujur

### 11.3 WeChat Official Account

**Nama:** 龙目岛出行 (Lombok Transfer)  
**Tipe:** Service Account (lebih banyak fitur, bisa broadcast bulanan)  

**Kenapa WeChat:**
- Turis China yang sudah landing di Lombok masih pakai WeChat untuk komunikasi
- WeChat Pay juga bisa dijadikan opsi pembayaran untuk tamu China
- Official Account bisa jadi pengganti website mini untuk pasar China

**Konten WeChat:**
- Artikel bulanan: tips wisata Lombok dalam Mandarin
- Mini-program sederhana (opsional fase lanjutan): booking form dalam Mandarin
- Broadcast pesan ke subscribers untuk high season offers

**WeChat Customer Service:**
- Set up WeChat sebagai channel CS parallel dengan WhatsApp
- Chatbot Claude dalam Mandarin untuk reply otomatis di WeChat
- Admin yang bisa Mandarin atau dengan Google Translate untuk backup

### 11.4 Trip.com / Ctrip (携程)

Sudah dibahas di Modul OTA (Modul 5), namun ada strategi tambahan untuk pasar China:

**Konten listing dalam Mandarin:**
- Deskripsi harus ditulis dalam Mandarin oleh native speaker atau diterjemahkan profesional
- Tidak cukup machine translate — tamu China sangat sensitif dengan kualitas Mandarin
- Sertakan tips yang relevan untuk tamu China (halal food nearby? Muslim prayer room di BIL? dll)

**Harga dalam CNY:**
- Set harga di Trip.com dalam CNY (Yuan)
- Perbarui jika ada perubahan kurs signifikan

**Review response dalam Mandarin:**
- Balas review dari tamu China di Trip.com dalam Mandarin
- Ini sangat mempengaruhi keputusan booking tamu China lainnya

---

## 12. Modul 9 — Email Marketing

### 12.1 Deskripsi

Email marketing untuk follow-up tamu pasca-trip, newsletter, dan re-engagement tamu yang belum booking ulang. Relevan terutama untuk pasar EN (Eropa, Australia, US).

### 12.2 Setup

**Platform:** Mailchimp (gratis hingga 500 kontak) atau Resend.com (lebih developer-friendly, murah)  
**Integrasi:** Supabase → n8n → Email platform  

### 12.3 Automated Email Sequences

#### Sequence 1 — Post Booking

| Email | Waktu | Konten |
|---|---|---|
| Booking Confirmation | Segera setelah booking | Detail booking, info supir, meeting point, tips BIL arrival |
| Pre-Trip Reminder | H-1 | Reminder jadwal, kontak supir, info cuaca Lombok |
| Day-Of | Hari H (2 jam sebelum) | Reminder final, link live status tracking |

#### Sequence 2 — Post Trip

| Email | Waktu | Konten |
|---|---|---|
| Thank You | H+1 | Ucapan terima kasih, minta review Google/Klook |
| Review Reminder | H+3 (jika belum review) | Follow-up minta review, dengan link langsung |
| Travel Tips | H+7 | "Enjoyed Lombok? Here are more tips for your next visit" |

#### Sequence 3 — Re-engagement

| Email | Waktu | Konten |
|---|---|---|
| We Miss You | 3 bulan setelah trip terakhir | "Planning another visit? Here's what's new in Lombok" |
| Referral Ask | 1 bulan setelah trip | "Loved your trip? Share with friends and get 10% off" |

### 12.4 Newsletter Bulanan (Opsional — Fase Lanjutan)

Untuk tamu yang opt-in newsletter:
- Konten: what's new di Lombok, tips musiman, penawaran khusus
- Frekuensi: 1x per bulan
- Subject line: harus compelling, tidak generik
- Unsubscribe link wajib ada (CAN-SPAM compliance)

### 12.5 Ketentuan Email

- Jangan kirim email tanpa opt-in dari tamu (GDPR)
- Saat booking, tamu bisa centang "Send me travel tips and offers"
- Unsubscribe harus diproses dalam 10 hari (legal requirement)
- Semua email harus ada nama bisnis, alamat, dan unsubscribe link (CAN-SPAM / GDPR)

---

## 13. Modul 10 — Review & Reputasi

### 13.1 Deskripsi

Review adalah mata uang bisnis transportasi wisata. Tamu internasional hampir 100% mengecek review sebelum booking. Strategi reputasi yang baik adalah investasi yang menghasilkan booking pasif tanpa biaya iklan.

### 13.2 Platform Review

| Platform | Prioritas | Aksi |
|---|---|---|
| Google | ⭐⭐⭐⭐⭐ | Kumpulkan dan balas semua review |
| Klook | ⭐⭐⭐⭐⭐ | Monitor + balas di Merchant Portal |
| Viator / TripAdvisor | ⭐⭐⭐⭐ | Monitor + balas di Supplier Portal |
| Traveloka | ⭐⭐⭐⭐ | Monitor + balas |
| Trip.com | ⭐⭐⭐⭐ | Monitor + balas dalam Mandarin |
| Facebook | ⭐⭐ | Monitor + balas |

### 13.3 Review Collection Workflow

**Automated (via n8n):**
1. Trip status berubah ke "Completed" di dashboard
2. Tunggu 2 jam
3. n8n kirim WA ke tamu:
   - EN: "Thank you for traveling with Lombok Transfer! We'd love to hear about your experience. Would you mind leaving us a quick review? [link Google] It really helps us a lot. 🙏"
   - ZH: "感谢您选择龙目岛出行！如果您满意我们的服务，请花1分钟为我们留下评价：[link] 非常感谢！🙏"
   - ID: "Terima kasih sudah menggunakan Lombok Transfer! Boleh kami minta review singkat dari Anda? Sangat berarti buat kami 🙏 [link Google]"
4. Jika dalam 3 hari belum ada review: kirim follow-up WA sekali lagi (tidak lebih)

**Link review yang dikirim:** disesuaikan platform. Untuk tamu yang booking via Klook → link review Klook. Via Viator → Viator. Direct booking → Google.

### 13.4 Respons Review

**Kebijakan:**
- Semua review (positif dan negatif) wajib dibalas
- Waktu respons: positif dalam 48 jam, negatif dalam 24 jam
- Bahasa respons: sesuai bahasa review
- Jangan defensif atau berdalih di respons review negatif — akui dan tawarkan solusi

**Template Respons Review Positif (EN):**
```
Thank you so much, [Name]! 🌴 We're thrilled you had a great experience with us.
[Nama supir] is truly one of our best — we'll be sure to pass along your kind words.
We hope to see you again on your next Lombok adventure!
— Team Lombok Transfer
```

**Template Respons Review Negatif (EN):**
```
Hi [Name], thank you for taking the time to share your feedback. 
We sincerely apologize for [specific issue]. This is not the standard we hold ourselves to.
We've already taken steps to address this with our team.
We'd love the opportunity to make it right — please contact us directly at [WA link].
— Team Lombok Transfer
```

### 13.5 Monitoring Reputasi

**Tools:**
- Google Alerts: set alert untuk "Lombok Transfer" — notif email setiap ada mention baru di web
- Manual monitoring: cek semua platform review minimal 2x per minggu
- n8n workflow: jika ada review baru dengan rating ≤3 → alert ke admin via WA segera

**KPI Reputasi:**
- Google rating: target 4.7+ (maintain)
- Klook rating: target 4.8+
- Total review Google: target +10 review per bulan
- Review response rate: 100% (semua dibalas)

---

## 14. Modul 11 — Hotel & Partner Network (B2B)

### 14.1 Deskripsi

Hotel concierge dan travel agent lokal adalah mesin booking pasif yang sangat powerful. Tamu yang ditangani hotel bintang 4–5 cenderung high-value dan tidak menawar harga. Partnership ini adalah akuisisi pelanggan tanpa biaya iklan.

### 14.2 Target Hotel Partner

**Hotel bintang 4–5 di Lombok yang menjadi target:**

Area Senggigi:
- The Oberoi Beach Resort Lombok
- Sheraton Senggigi Beach Resort
- Aruna Resort Senggigi
- Qunci Villas

Area Mandalika / Kuta:
- Pullman Lombok Merujani Mandalika
- Novotel Lombok Mandalika
- Paramount Hotel & Resort Lombok
- Club Med Lombok

Area Gili:
- Hotel Tugu Lombok (Gili Meno)
- Slow Lombok (Gili Air)
- Ayana Villas Bali (jika ada cabang Gili)

Semua boutique resort & villa dengan tamu internasional di seluruh Lombok.

### 14.3 Value Proposition ke Hotel

Apa yang ditawarkan Lombok Transfer ke hotel:

1. **Layanan terpercaya untuk tamu mereka:** Hotel bisa recommend dengan percaya diri karena armada profesional, tepat waktu, supir berpengalaman
2. **Komisi referral:** 10–15% dari setiap booking yang datang dari hotel tersebut
3. **Seamless experience untuk tamu:** Konfirmasi instan, komunikasi EN + ZH, tidak ada momen awkward soal harga
4. **Co-branding optional:** "Recommended by [Hotel Name]" di konfirmasi booking jika diinginkan hotel
5. **Priority booking:** Tamu hotel mendapat prioritas assign supir terbaik

### 14.4 Proses Onboarding Hotel Partner

**Tahap 1 — Approach:**
- Kunjungi hotel secara langsung, minta meeting dengan Guest Relations Manager atau Concierge Manager
- Bawa proposal tertulis: profil Lombok Transfer, armada, harga, skema komisi
- Bawa kartu nama dan brosur fisik berkualitas

**Tahap 2 — Perjanjian:**
- Tandatangani perjanjian referral sederhana (1–2 halaman)
- Tetapkan skema komisi (% atau flat per booking)
- Tetapkan proses: hotel email/WA booking request → konfirmasi dalam X jam

**Tahap 3 — Aktivasi:**
- Berikan materi fisik ke concierge desk: rate card, kartu nama, QR code ke WA
- Training singkat untuk concierge: cara booking, cara communicate ke tamu
- Setup email atau WA khusus untuk channel dari hotel partner ini

### 14.5 Travel Agent Lokal

**Target:** DMC (Destination Management Company) dan travel agent lokal di Lombok yang melayani grup turis

**Value prop:** Bisa handle grup besar dengan armada multiple, harga khusus untuk volume, prioritas konfirmasi

**Skema:** Komisi 10–15% atau harga nett yang bisa di-markup oleh agent

### 14.6 Tracking Partnership

Di modul internal (Vendor & Procurement):
- Setiap booking yang masuk dari hotel partner harus diberi tag sumber
- Laporan bulanan: berapa booking dari masing-masing partner, berapa komisi yang dibayarkan
- Review partnership: evaluasi setiap 3 bulan, apakah worth dilanjutkan

---

## 15. Integrasi Antar Channel

### 15.1 Alur Data Terpusat

```
SEMUA BOOKING MASUK (dari berbagai channel)
         │
         ├── Website direct booking
         ├── WhatsApp (chatbot collect data)
         ├── Klook notif (email/API)
         ├── Viator notif (email/API)
         ├── Traveloka notif
         ├── Trip.com notif
         └── Hotel partner (email/WA)
         │
         ▼
    n8n Processing Hub
         │
         ├── Create booking record di Supabase
         ├── Auto-assign supir
         ├── Kirim WA konfirmasi ke tamu
         ├── Kirim WA notif ke supir
         └── Update admin dashboard (realtime)
```

### 15.2 UTM Tracking

Semua link ke website dari channel eksternal harus pakai UTM parameter untuk tracking sumber:

| Channel | UTM Campaign |
|---|---|
| Instagram bio | `utm_source=instagram&utm_medium=social&utm_campaign=bio` |
| TikTok bio | `utm_source=tiktok&utm_medium=social` |
| Klook listing | `utm_source=klook&utm_medium=ota` |
| Hotel partner email | `utm_source=hotel_[namahotel]&utm_medium=partner` |
| WA blast | `utm_source=whatsapp&utm_medium=direct` |

Ini memungkinkan Google Analytics GA4 menunjukkan dengan tepat dari channel mana booking/konversi terjadi.

### 15.3 Konsistensi Brand Antar Channel

**Yang harus konsisten:**
- Nama bisnis: "Lombok Transfer" (tidak disingkat, tidak diubah)
- Logo: selalu versi yang sama, tidak di-modifikasi
- Nomor WA: selalu nomor yang sama di semua channel
- URL website: selalu lomboktransfer.com (atau domain yang dipilih)
- Harga: konsisten antar channel (price parity)

**Tone of voice:**
- EN: warm, knowledgeable, professional. Seperti local guide berpengalaman yang ramah.
- ID: santai tapi profesional, tidak terlalu formal, tapi tidak slang berlebihan
- ZH: sopan, informatif, detail — tamu China menghargai informasi yang lengkap

---

## 16. Analytics & KPI

### 16.1 KPI Utama per Channel

**Website:**
| Metric | Target |
|---|---|
| Monthly unique visitors | 2.000+ (bulan 3), 5.000+ (bulan 6) |
| Bounce rate | < 60% |
| Booking conversion rate | > 3% dari visitors |
| Average session duration | > 2 menit |
| Top organic keywords | Rank 1–3 untuk "lombok airport transfer" |

**Google Business Profile:**
| Metric | Target |
|---|---|
| Jumlah review | 100+ (bulan 6) |
| Rating rata-rata | 4.7+ |
| Impression per bulan | 5.000+ |
| Click-to-call / Website | 200+ per bulan |

**OTA:**
| Metric | Target |
|---|---|
| Klook booking per bulan | 30+ (bulan 3) |
| Viator booking per bulan | 20+ (bulan 3) |
| Traveloka booking per bulan | 40+ (bulan 3) |
| Rating rata-rata di semua OTA | 4.8+ |

**WhatsApp:**
| Metric | Target |
|---|---|
| Inquiry per bulan | 200+ |
| Conversion inquiry → booking | > 40% |
| Response time (chatbot) | < 30 detik |
| Response time (manusia) | < 15 menit saat jam kerja |

**Social Media:**
| Platform | Follower Target (bulan 6) | Engagement Rate |
|---|---|---|
| Instagram | 2.000+ | > 3% |
| TikTok | 5.000+ | > 5% |
| Xiaohongshu | 500+ | > 5% |

### 16.2 Dashboard Analytics Eksternal

Di internal dashboard, ada tab "Marketing Analytics" yang menampilkan:
- Booking per sumber (pie chart, monthly)
- Revenue per channel (bar chart)
- Trend follower sosial media (connect via API)
- Review count dan rating trend per platform
- Website traffic dari GA4 (embed widget)
- Top performing content (views/engagement)

### 16.3 Review Analytics

- Total review terkumpul per platform per bulan
- Rating rata-rata trend (naik/turun)
- Kata yang paling sering muncul di review positif dan negatif (word cloud)
- Supir dengan review terbanyak dan rating tertinggi

---

## 17. Non-Functional Requirements

### 17.1 SEO Technical

- Website accessible oleh Googlebot (tidak ada JS-render barrier tanpa SSR)
- Robots.txt tidak memblokir halaman penting
- XML sitemap disubmit ke Google Search Console dan Bing Webmaster Tools
- Open Graph tags di semua halaman (untuk preview di WA, FB, WeChat)
- Twitter Card tags (untuk preview di Twitter/X)

### 17.2 Aksesibilitas

- Semua gambar punya alt text dalam bahasa yang sesuai
- Kontras warna WCAG AA minimum
- Form booking bisa diakses via keyboard
- Error messages deskriptif

### 17.3 GDPR & Privacy

- Cookie consent banner (sesuai GDPR untuk pengunjung dari EU)
- Halaman Privacy Policy dalam EN (wajib untuk Viator/GetYourGuide)
- Opsi unsubscribe di semua email
- Tidak menjual data tamu ke pihak ketiga
- Data tamu hanya digunakan untuk keperluan layanan dan follow-up

### 17.4 Uptime & Reliability

- Website: target uptime 99.9% (Vercel SLA)
- Booking form: jika sistem down, redirect ke WA dengan pesan "temporarily unavailable, book via WhatsApp"
- Monitoring: setup UptimeRobot (gratis) untuk alert jika website down > 5 menit

### 17.5 Mobile Performance

- Google PageSpeed Insights mobile: > 80
- Booking form harus mudah diisi di layar HP 375px
- Tidak ada pop-up yang menutupi konten di mobile (Google Core Web Vitals penalty)

---

## 18. Roadmap Implementasi

### Fase 1 — Fondasi Digital (Minggu 1–4)

**Wajib sebelum operasional:**

- [ ] Daftar dan verifikasi Google Business Profile
- [ ] Setup WhatsApp Business API via Fonnte
- [ ] Buat akun semua OTA: Klook, Traveloka Xperience
- [ ] Launch website (Next.js) — minimal versi EN + ID
- [ ] Booking form online live dan terkoneksi ke Supabase
- [ ] Setup GA4 + Google Search Console
- [ ] Buat akun Instagram dan TikTok (posting pertama: 3 konten)
- [ ] Setup WhatsApp chatbot sederhana (auto-reply FAQ dasar)

### Fase 2 — Distribusi & Konten (Minggu 5–8)

- [ ] Daftar Viator dan GetYourGuide
- [ ] Daftar Trip.com untuk pasar China
- [ ] Buat akun Xiaohongshu — posting 5 konten pertama
- [ ] Tambahkan bahasa ZH di website
- [ ] Publish 4 artikel blog SEO pertama (EN)
- [ ] Setup Claude AI chatbot (EN + ID) via n8n + Claude API
- [ ] Setup email sequence otomatis (booking confirmation, post-trip review request)
- [ ] Mulai aktif kumpulkan review Google (request via WA setelah setiap trip)

### Fase 3 — Optimasi & Skalasi (Bulan 3–4)

- [ ] Analisis performa: channel mana yang paling banyak menghasilkan booking
- [ ] Buat akun WeChat Official Account (untuk pasar China)
- [ ] Mulai outreach hotel partner (target 5 hotel pertama)
- [ ] Publish 4 artikel blog tambahan (EN + ZH)
- [ ] Setup Facebook Page + pixel retargeting
- [ ] Chatbot Claude dalam Mandarin (ZH) untuk WA dan WeChat
- [ ] Setup email newsletter bulanan

### Fase 4 — Dominasi Pasar (Bulan 5–6)

- [ ] Evaluasi ROI semua channel — pertahankan yang terbaik, stop yang tidak produktif
- [ ] Ekspansi konten: target 8 artikel blog per bulan
- [ ] KOL/KOC collaboration di Xiaohongshu (undang 2–3 travel content creator China)
- [ ] Setup Facebook dan Instagram Ads (retargeting + lookalike)
- [ ] Target: Top 3 Google untuk "lombok airport transfer"
- [ ] Onboard 10 hotel partner aktif
- [ ] Channel manager untuk sinkronisasi OTA otomatis (BookingKit/Rezdy)

---

## Appendix

### A. Daftar Tool & Platform

| Tool/Platform | Fungsi | Biaya/bulan |
|---|---|---|
| Vercel | Hosting website | Gratis (hobby) / $20 (pro) |
| Supabase | Database + Auth | Gratis hingga 500MB |
| n8n (self-hosted) | Otomasi workflow | VPS ~Rp 50–80rb |
| Fonnte | WhatsApp API | ~Rp 50rb |
| Claude API | AI chatbot | ~$5–10 |
| Mailchimp | Email marketing | Gratis hingga 500 kontak |
| UptimeRobot | Website monitoring | Gratis |
| Google Analytics 4 | Website analytics | Gratis |
| Canva Pro | Desain konten sosmed | ~$15/bulan |
| **Total estimasi** | | **~Rp 400–600rb/bulan** |

### B. Daftar Konten Instagram — 30 Hari Pertama

| Minggu | Post | Format |
|---|---|---|
| 1 | Perkenalan brand: "Siapa Lombok Transfer?" | Carousel |
| 1 | Destinasi: Gili Trawangan sunset | Reels |
| 1 | "Cara booking transfer dari BIL" | Carousel step-by-step |
| 2 | Behind the scenes: supir siap-siap pagi | Reels |
| 2 | Destinasi: Pantai Kuta Lombok drone shot | Single photo |
| 2 | Tips: "5 hal yang perlu tahu saat tiba di BIL" | Carousel |
| 3 | Testimoni tamu (screenshot review + foto) | Single photo |
| 3 | Destinasi: Rinjani dari kejauhan | Reels |
| 3 | FAQ: "Berapa biaya transfer ke Gili?" | Carousel |
| 4 | Spotlight supir: cerita lokal dari Pak [Nama] | Reels |
| 4 | Destinasi: Senggigi beach walk | Reels |
| 4 | Perbandingan: "Transfer privat vs shuttle — mana lebih baik?" | Carousel |

### C. Template Posting Xiaohongshu (Artikel Pertama)

```
标题: 龙目岛机场到吉利群岛，这篇攻略让你省去90%的麻烦！

正文:
来龙目岛必去吉利群岛！但很多朋友不知道从机场怎么去...

[在这里写攻略内容，用亲切自然的口吻，像朋友分享经验]

📍 出发地: 龙目岛国际机场 (BIL)
🏝️ 目的地: 吉利群岛
⏱️ 车程: 约1.5小时
💰 价格: 约465,000印尼盾/辆（可坐4人）

✨ 推荐：提前预订龙目岛出行的接机服务，24小时都有司机，中英文都可以沟通！

#龙目岛 #吉利群岛 #印尼旅行 #龙目岛旅游攻略 #巴厘岛周边 #东南亚旅行
```

### D. Checklist Sebelum Go-Live

**Website:**
- [ ] Semua halaman ter-load tanpa error di mobile dan desktop
- [ ] Form booking berfungsi dan data masuk ke Supabase
- [ ] WA button mengarah ke nomor yang benar
- [ ] SSL certificate aktif (HTTPS)
- [ ] Google Analytics terpasang dan tracking
- [ ] Meta tags (title, description, OG) di semua halaman
- [ ] Privacy Policy dan Terms ada dan accessible

**Google Business Profile:**
- [ ] Terverifikasi (proses verifikasi 3–7 hari kerja via kartu pos atau video)
- [ ] Foto minimal 10 foto diupload
- [ ] Jam buka benar (24 jam)
- [ ] Nomor WA terdaftar
- [ ] Deskripsi bisnis terisi lengkap

**WhatsApp:**
- [ ] Akun bisnis live dan bisa menerima pesan
- [ ] Auto-reply tersedia untuk jam di luar operasional
- [ ] Chatbot AI live dan merespons pertanyaan dasar

**OTA:**
- [ ] Listing Klook: published dan bisa di-booking
- [ ] Listing Traveloka: published
- [ ] Foto OTA berkualitas tinggi, minimal 8 foto
- [ ] Harga benar dan availability real-time

---

*Dokumen ini adalah living document. Diperbarui setiap kuartal berdasarkan data performa aktual channel dan perubahan algoritma platform.*
