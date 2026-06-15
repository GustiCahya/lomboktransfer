# PRD - Internal Dashboard Lombok Transfer

**Versi:** 1.0  
**Tanggal:** Juni 2026  
**Status:** Draft  
**Penulis:** Internal - Lombok Transfer  

---

## Daftar Isi

1. [Overview & Tujuan](#1-overview--tujuan)
2. [Pengguna & Peran](#2-pengguna--peran)
3. [Arsitektur & Tech Stack](#3-arsitektur--tech-stack)
4. [Modul 1 - Booking & Dispatch](#4-modul-1--booking--dispatch)
5. [Modul 2 - Human Resource](#5-modul-2--human-resource)
6. [Modul 3 - Fleet Management](#6-modul-3--fleet-management)
7. [Modul 4 - Accounting & Keuangan](#7-modul-4--accounting--keuangan)
8. [Modul 5 - CRM & Tamu](#8-modul-5--crm--tamu)
9. [Modul 6 - Legal & Compliance](#9-modul-6--legal--compliance)
10. [Modul 7 - Vendor & Procurement](#10-modul-7--vendor--procurement)
11. [Modul 8 - Laporan & Analitik](#11-modul-8--laporan--analitik)
12. [Schema Database (Supabase)](#12-schema-database-supabase)
13. [Integrasi Eksternal](#13-integrasi-eksternal)
14. [Keamanan & Akses](#14-keamanan--akses)
15. [Non-Functional Requirements](#15-non-functional-requirements)
16. [Roadmap Implementasi](#16-roadmap-implementasi)

---

## 1. Overview & Tujuan

### 1.1 Konteks Bisnis

Lombok Transfer adalah layanan transportasi wisata premium berbasis di Lombok yang menghubungkan wisatawan internasional dari Bandara Internasional Lombok (BIL) ke seluruh destinasi wisata utama - Gili Trawangan, Kuta Lombok, Senggigi, dan kawasan Mandalika - dengan armada supir profesional lokal.

Target market utama: wisatawan mancanegara berbahasa Inggris dan Mandarin, serta wisatawan domestik Indonesia.

### 1.2 Tujuan Internal Dashboard

Dashboard ini adalah **sistem operasional terpusat** (back-office) yang mengelola seluruh aspek internal bisnis:

- Memantau dan mengelola booking secara real-time
- Mengkoordinasikan penugasan supir secara efisien
- Memastikan kepatuhan legal dan dokumen selalu up-to-date
- Mengelola keuangan, komisi, dan laporan P&L
- Menyimpan dan menganalisis data tamu untuk repeat business
- Melacak kondisi dan jadwal perawatan armada kendaraan

### 1.3 Prinsip Desain

- **Mobile-first untuk supir:** Supir mengakses dashboard via HP - antarmuka mereka harus ringan dan jelas
- **Desktop untuk admin:** Admin dan owner menggunakan tampilan penuh dengan data padat
- **Otomasi over manual:** Sebisa mungkin trigger otomatis, bukan input manual berulang
- **Alert proaktif:** Sistem memperingatkan sebelum masalah terjadi (dokumen mau expire, armada mau servis)
- **Multibahasa minimal:** Indonesia untuk tim internal, Inggris untuk data tamu internasional

---

## 2. Pengguna & Peran

### 2.1 Matriks Peran

| Peran | Akses | Deskripsi |
|---|---|---|
| `owner` | Full access | Pemilik bisnis, akses semua modul termasuk keuangan |
| `admin` | Semua kecuali keuangan sensitif | Staf kantor yang mengelola operasional harian |
| `dispatcher` | Booking + Supir + Fleet | Koordinator yang menugaskan dan memantau trip |
| `driver` | Trip aktif milik sendiri + profil diri | Supir, akses terbatas via mobile view |
| `accountant` | Accounting + Laporan | Akses modul keuangan saja |
| `viewer` | Baca saja | Untuk investor atau mitra yang perlu pantau performa |

### 2.2 Akses per Modul

| Modul | owner | admin | dispatcher | driver | accountant | viewer |
|---|---|---|---|---|---|---|
| Booking & Dispatch | ✅ | ✅ | ✅ | Milik sendiri | ❌ | 👁 |
| Human Resource | ✅ | ✅ | 👁 | Profil sendiri | ❌ | ❌ |
| Fleet Management | ✅ | ✅ | ✅ | 👁 | ❌ | ❌ |
| Accounting | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| CRM | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Legal & Compliance | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Vendor | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Laporan & Analitik | ✅ | ✅ | 👁 | ❌ | ✅ | 👁 |

---

## 3. Arsitektur & Tech Stack

### 3.1 Stack

```
Frontend (Dashboard Admin)
  └── Next.js 14 (App Router)
  └── Tailwind CSS
  └── shadcn/ui komponen
  └── React Query untuk data fetching

Backend / Database
  └── Supabase (PostgreSQL)
  └── Supabase Auth (login & role management)
  └── Supabase Storage (dokumen, foto)
  └── Supabase Realtime (notifikasi live)

Otomasi & Workflow
  └── n8n (self-hosted di VPS)
  └── Fonnte (WhatsApp API gateway)
  └── Claude API (AI chatbot tamu)

Deployment
  └── Vercel (frontend)
  └── Railway.app atau DigitalOcean (n8n)
  └── Supabase Cloud (database)

Biaya estimasi infrastruktur: < Rp 300.000/bulan
```

### 3.2 Alur Data Utama

```
Booking masuk (website / OTA / WA)
       │
       ▼
  Supabase DB
       │
       ├──► n8n trigger → assign supir → WA notif supir
       │
       ├──► n8n trigger → WA konfirmasi ke tamu
       │
       └──► Dashboard admin (realtime update)
                │
                └──► Driver view (mobile) → update status trip
```

---

## 4. Modul 1 - Booking & Dispatch

### 4.1 Deskripsi

Pusat kontrol semua pemesanan masuk dan penugasan supir. Ini adalah modul paling aktif digunakan setiap hari.

### 4.2 Fitur

#### 4.2.1 Daftar Booking (Booking List)

- Tabel booking dengan kolom: ID booking, nama tamu, rute, tanggal/jam, status, supir ditugaskan, sumber booking (website/Klook/Viator/WA/manual)
- Filter: tanggal, status, supir, rute, sumber
- Search: nama tamu atau ID booking
- Warna status: Menunggu (kuning) / Terkonfirmasi (biru) / Berlangsung (hijau) / Selesai (abu) / Dibatalkan (merah)
- Export CSV untuk laporan bulanan

#### 4.2.2 Form Booking Manual

Untuk booking via telepon atau walk-in yang tidak melalui sistem online.

Form fields:

- Nama tamu (required)
- Nomor HP / WhatsApp
- Email (opsional)
- Kebangsaan / bahasa
- Rute: titik jemput → titik antar (dropdown dari master rute)
- Tanggal & jam penjemputan
- Jumlah penumpang
- Jumlah bagasi
- Catatan khusus (flight number, kebutuhan bayi seat, dll)
- Harga (auto-fill dari master tarif, bisa override)
- Metode pembayaran: Cash / Transfer / OTA

#### 4.2.3 Detail Booking

Halaman detail satu booking mencakup:

- Info tamu lengkap
- Timeline status (booking → konfirmasi → supir berangkat → tamu dijemput → selesai)
- Supir yang ditugaskan (dengan tombol ganti)
- Kendaraan yang digunakan
- Riwayat komunikasi WA (log)
- Invoice & status pembayaran
- Tombol aksi: Konfirmasi / Tugaskan Supir / Kirim WA Konfirmasi / Selesaikan / Batalkan

#### 4.2.4 Kalender Dispatch

Tampilan kalender (hari / minggu / bulan) yang menampilkan:

- Semua trip terjadwal dalam timeline
- Warna berbeda per supir
- Slot kosong yang bisa diisi
- Konflik jadwal ditandai merah
- Drag-and-drop untuk memindahkan atau re-assign booking

#### 4.2.5 Auto-Dispatch Logic

Trigger otomatis via n8n ketika booking baru masuk:

1. Cek supir yang available di jam tersebut (tidak ada booking konflik)
2. Prioritas assign berdasarkan: supir terdekat lokasi → supir dengan load paling ringan hari itu → supir dengan rating tertinggi
3. Jika supir ditemukan: kirim WA ke supir (detail tamu, rute, jam), kirim WA konfirmasi ke tamu
4. Jika tidak ada supir available: alert ke admin via WA/dashboard, booking masuk status "Perlu Assign Manual"

#### 4.2.6 Status Trip (Supir Mobile View)

Tampilan sederhana untuk supir di HP:

- Daftar trip hari ini
- Per trip: nama tamu, rute, jam, nomor HP tamu (tombol langsung telpon/WA)
- Tombol update status: "Sedang Menuju Tamu" / "Tamu Sudah Dijemput" / "Selesai"
- Rute Google Maps (deep link)

### 4.3 Notifikasi Otomatis (via n8n + Fonnte)

| Trigger | Penerima | Pesan |
|---|---|---|
| Booking baru masuk | Admin | "Booking baru: [Nama], [Rute], [Tanggal]" |
| Booking di-assign ke supir | Supir | "Trip baru untuk Anda: [detail lengkap tamu + rute]" |
| Booking dikonfirmasi | Tamu | "Booking Anda dikonfirmasi. Supir: [Nama]. WA: [nomor]" |
| H-1 trip | Tamu | Reminder jadwal penjemputan besok |
| 3 jam sebelum trip | Supir | Reminder trip mendatang |
| Trip selesai | Tamu | "Terima kasih! Berikan review di: [link]" |
| Booking dibatalkan | Tamu + Admin | Konfirmasi pembatalan + refund info |

---

## 5. Modul 2 - Human Resource

### 5.1 Deskripsi

Manajemen data supir dan staf, jadwal kerja, performa, dan penggajian.

### 5.2 Fitur

#### 5.2.1 Profil Supir

Data master per supir:

**Informasi Pribadi:**

- Nama lengkap, foto profil
- NIK (Nomor Induk Kependudukan)
- Tanggal lahir
- Alamat lengkap
- Nomor HP (WhatsApp aktif)
- Nomor rekening bank + nama bank
- Kontak darurat (nama + nomor)

**Dokumen (upload + tracking expiry):**

- KTP (scan) - tidak expire
- SIM A (scan) - expire date, alert H-60 dan H-30
- SIM B1 (jika berlaku)
- SKCK - expire date, alert H-30
- Surat sehat dokter - expire date, alert H-30

**Status Kerja:**

- Status aktif / non-aktif / cuti
- Tanggal bergabung
- Tipe mitra: karyawan tetap / mitra lepas
- Kendaraan yang biasa dikendarai (linked ke Fleet)

#### 5.2.2 Jadwal & Shift

- Kalender ketersediaan per supir (available / cuti / tidak tersedia)
- Admin bisa set hari cuti / tidak tersedia untuk supir tertentu
- Supir bisa request cuti via mobile view (perlu approval admin)
- Tampilan mingguan: semua supir dalam satu kalender (siapa available kapan)

#### 5.2.3 Riwayat Trip

Per supir, tampilkan:

- Total trip bulan ini / bulan lalu / all time
- Breakdown per rute
- Rating rata-rata dari tamu (jika ada review)
- Total pendapatan yang dihasilkan
- Total komisi yang diterima

#### 5.2.4 Penilaian Performa

Metrik performa per supir:

- Rating rata-rata tamu (1–5 bintang)
- On-time rate (% trip tidak terlambat)
- Completion rate (% trip selesai tanpa insiden)
- Komplain yang diterima (linked ke CRM)
- Jumlah pembatalan yang disebabkan supir

Tampilan: scorecard individual + ranking seluruh supir

#### 5.2.5 Payroll & Komisi

**Skema komisi:**

- Persentase komisi per trip (configurable per supir, default misal 60% dari tarif)
- Bonus high season (configurable)
- Potongan jika ada insiden / komplain

**Proses payroll bulanan:**

1. Auto-kalkulasi komisi berdasarkan trip yang selesai di bulan berjalan
2. Admin review dan approve
3. Generate slip gaji PDF per supir
4. Tandai sebagai "Sudah Dibayar" setelah transfer

**Fields per record payroll:**

- Periode (bulan/tahun)
- Total trip
- Total pendapatan kotor
- Persentase komisi
- Total komisi
- Bonus (jika ada)
- Potongan (jika ada)
- Total dibayarkan
- Status: Draft / Approved / Dibayar
- Tanggal pembayaran
- Bukti transfer (upload)

#### 5.2.6 SOP & Training

- Repositori dokumen SOP (upload PDF)
- Daftar SOP yang wajib dibaca supir baru
- Checklist onboarding supir baru
- Log training yang pernah diikuti per supir

---

## 6. Modul 3 - Fleet Management

### 6.1 Deskripsi

Manajemen armada kendaraan - dokumen, jadwal perawatan, kondisi, dan biaya operasional per unit.

### 6.2 Fitur

#### 6.2.1 Inventaris Armada

Data master per kendaraan:

**Identitas Kendaraan:**

- Nama/kode unit (misal: LT-01, LT-02)
- Merek & model (misal: Toyota Innova Reborn)
- Tahun pembuatan
- Warna
- Nomor plat (TNKB)
- Nomor rangka (VIN)
- Nomor mesin
- Kapasitas penumpang
- Foto kendaraan (eksterior + interior)

**Dokumen Kendaraan (upload + tracking expiry):**

- STNK - expire date, alert H-60 dan H-30
- KIR (Uji Kelayakan) - expire date, alert H-30
- Asuransi kendaraan - expire date, tipe (TLO/All Risk), nama asuransi, nomor polis
- Asuransi penumpang - expire date

**Status:**

- Aktif / Perawatan / Tidak Aktif / Dijual

#### 6.2.2 Jadwal Servis & Perawatan

Per kendaraan, tracking:

| Jenis Servis | Interval | Alert |
|---|---|---|
| Ganti oli | Setiap 5.000 km | H-500 km sebelum batas |
| Servis rutin | Setiap 10.000 km | H-1.000 km sebelum batas |
| Ganti ban | Per kondisi / 40.000 km | Sesuai input mekanik |
| Aki | Per kondisi | Input manual |
| Rem | Per kondisi | Input manual |
| KIR | 6 bulan sekali | H-30 hari |

**Per record servis:**

- Tanggal servis
- Kendaraan
- Jenis servis
- Kilometer saat servis
- Bengkel (linked ke Vendor)
- Biaya
- Catatan mekanik
- Next service (km atau tanggal)
- Bukti servis (upload foto / invoice)

#### 6.2.3 Log Penggunaan

- Odometer input harian (supir input via mobile)
- Total km per bulan per unit
- Rata-rata km per trip

#### 6.2.4 Insiden & Kerusakan

Per insiden:

- Tanggal
- Kendaraan & supir
- Deskripsi kejadian
- Foto kerusakan
- Status klaim asuransi (jika ada)
- Biaya perbaikan
- Status: Dalam Perbaikan / Selesai

#### 6.2.5 Biaya Operasional per Unit

Dashboard per kendaraan menampilkan:

- Total biaya servis YTD (year-to-date)
- Biaya BBM estimasi (berdasarkan km × konsumsi BBM rata-rata)
- Total pendapatan yang dihasilkan unit tersebut
- Profit kontribusi per unit
- Grafik biaya vs pendapatan per bulan

---

## 7. Modul 4 - Accounting & Keuangan

### 7.1 Deskripsi

Sistem keuangan internal: pendapatan, pengeluaran, invoice, komisi, rekonsiliasi OTA, dan laporan P&L.

### 7.2 Fitur

#### 7.2.1 Pendapatan

**Per transaksi:**

- Tanggal
- ID booking (linked)
- Nama tamu
- Rute
- Tarif gross
- Sumber booking: Langsung / Klook / Viator / Traveloka / GetYourGuide / Trip.com / Manual
- Komisi platform OTA (% dan nominal)
- Pendapatan nett
- Metode pembayaran: Cash / Transfer Bank / OTA Settlement
- Status: Menunggu / Lunas / Refunded

**Rekonsiliasi OTA:**

- Upload settlement report dari Klook/Viator/Traveloka (CSV/Excel)
- Auto-matching dengan booking di sistem
- Flag transaksi yang tidak cocok (perlu review manual)
- Summary: total booking via OTA, total komisi dipotong, nett diterima

#### 7.2.2 Pengeluaran

Kategori pengeluaran:

- BBM
- Servis & perawatan kendaraan (linked ke Fleet)
- Asuransi
- Pembayaran supir/komisi (linked ke HR Payroll)
- Platform fee (n8n, Fonnte, Vercel, Supabase, Fonnte)
- Marketing (iklan, konten)
- Operasional kantor
- Legal & perizinan
- Lain-lain

Per record pengeluaran:

- Tanggal
- Kategori
- Deskripsi
- Jumlah
- Metode pembayaran
- Bukti (upload struk/invoice)
- PIC yang mengeluarkan

#### 7.2.3 Invoice Tamu

**Generate invoice otomatis** setelah trip selesai:

- Nomor invoice (auto-increment)
- Tanggal
- Data tamu (nama, email)
- Detail layanan (rute, tanggal, jumlah penumpang)
- Breakdown harga
- Total
- Metode pembayaran
- Status: Belum Lunas / Lunas

**Format:** PDF yang bisa di-download dan dikirim via email/WA.

#### 7.2.4 Laporan P&L

Dashboard keuangan ringkas:

| Metric | Periode |
|---|---|
| Total pendapatan gross | Bulan ini / bulan lalu / YTD |
| Total komisi OTA dipotong | - |
| Total pendapatan nett | - |
| Total pengeluaran operasional | - |
| Total komisi supir dibayarkan | - |
| EBITDA sederhana | - |
| Margin keuntungan (%) | - |

Grafik:

- Pendapatan vs pengeluaran per bulan (bar chart, 12 bulan)
- Breakdown pendapatan per sumber (pie chart)
- Breakdown pengeluaran per kategori

#### 7.2.5 Arus Kas (Cash Flow)

- Ringkasan kas masuk dan kas keluar per minggu/bulan
- Saldo estimasi akhir bulan
- Alert jika proyeksi kas masuk tidak cukup untuk komisi supir bulan depan

---

## 8. Modul 5 - CRM & Tamu

### 8.1 Deskripsi

Database tamu, riwayat interaksi, manajemen review, dan strategi repeat business.

### 8.2 Fitur

#### 8.2.1 Database Tamu

Per tamu:

- Nama lengkap
- Email
- Nomor HP / WhatsApp
- Kebangsaan
- Bahasa (EN / CN / ID / lainnya)
- Sumber pertama kali booking (website / Klook / Viator / dll)
- Tanggal pertama booking
- Total booking lifetime
- Total nilai transaksi lifetime
- Tag: VIP / Regular / One-time / Repeat

#### 8.2.2 Riwayat Booking per Tamu

Timeline semua booking tamu tersebut:

- Tanggal, rute, supir, nilai transaksi
- Review yang diberikan (jika ada)
- Catatan khusus dari supir atau admin

#### 8.2.3 Manajemen Review

**Review request workflow:**

1. Trip selesai → n8n trigger → WA ke tamu berisi link review (Google / Klook / Viator)
2. Admin monitor status: Sent / Clicked / Submitted
3. Dashboard: total review terkumpul per platform, rata-rata rating

**Review tracker:**

- Sumber review (Google / Klook / Viator / TripAdvisor)
- Nama reviewer
- Rating (1–5)
- Isi review (ringkasan)
- Tanggal
- Supir yang bersangkutan
- Status respons admin: Belum Dibalas / Sudah Dibalas

#### 8.2.4 Segmentasi & Tag

Filter tamu berdasarkan:

- Kebangsaan / bahasa
- Sumber booking
- Nilai transaksi (High Value / Medium / Low)
- Frekuensi (One-time / Repeat)
- Periode terakhir booking (aktif / dormant 3+ bulan)

#### 8.2.5 Follow-up & Re-engagement

- Daftar tamu yang belum pernah booking ulang dalam 6 bulan
- Template WA re-engagement (dalam EN dan CN)
- Log follow-up: tanggal, isi pesan, respons

---

## 9. Modul 6 - Legal & Compliance

### 9.1 Deskripsi

Tracker dokumen legal perusahaan dan kepatuhan operasional yang memastikan bisnis beroperasi tanpa risiko perizinan.

### 9.2 Fitur

#### 9.2.1 Dokumen Perusahaan

Per dokumen:

- Nama dokumen
- Nomor dokumen
- Instansi penerbit
- Tanggal terbit
- Tanggal berlaku
- Status: Aktif / Kadaluarsa / Proses Perpanjangan
- File scan (upload)
- PIC yang bertanggung jawab perpanjangan

**Daftar dokumen wajib:**

- SIUP (Surat Izin Usaha Perdagangan)
- NPWP perusahaan
- Akta pendirian perusahaan
- SK Kemenkumham
- NIB (Nomor Induk Berusaha) via OSS
- Izin usaha pariwisata (Dinas Pariwisata)
- TDUP (Tanda Daftar Usaha Pariwisata)
- Izin operasional angkutan (Dishub)
- Domisili usaha

#### 9.2.2 Dokumen Supir (Linked ke HR)

Tabel konsolidasi semua dokumen supir yang akan expire:

- Nama supir, jenis dokumen, tanggal expire, sisa hari
- Filter: "Expire dalam 30 hari" / "Sudah expire"
- Satu klik ke profil supir untuk update

#### 9.2.3 Dokumen Kendaraan (Linked ke Fleet)

Tabel konsolidasi semua dokumen kendaraan yang akan expire:

- Unit kendaraan, jenis dokumen (STNK/KIR/asuransi), tanggal expire, sisa hari
- Filter sama seperti dokumen supir

#### 9.2.4 Alert & Reminder Otomatis

| Dokumen | Alert H- |
|---|---|
| STNK kendaraan | H-60, H-30, H-7 |
| KIR kendaraan | H-30, H-7 |
| Asuransi kendaraan | H-60, H-30 |
| SIM supir | H-60, H-30, H-7 |
| SKCK supir | H-30 |
| Surat sehat supir | H-30 |
| SIUP / izin perusahaan | H-90, H-30 |

Alert dikirim via:

- Notifikasi di dashboard
- WA ke admin/owner

#### 9.2.5 Kontrak Mitra

Per kontrak:

- Pihak (supir mitra / hotel partner / travel agent)
- Jenis kontrak
- Tanggal mulai dan berakhir
- Poin penting (ringkasan)
- File kontrak (upload PDF)
- Status: Aktif / Expired / Dalam Negosiasi
- Alert perpanjangan H-60

#### 9.2.6 Kepatuhan Data (GDPR/Privacy)

- Log data tamu yang meminta penghapusan data (right to be forgotten)
- Prosedur penghapusan data tamu dari sistem
- Kebijakan retensi data: data tamu aktif disimpan selamanya, data tamu non-aktif 3 tahun
- Log akses data sensitif (siapa mengakses data apa, kapan)

---

## 10. Modul 7 - Vendor & Procurement

### 10.1 Deskripsi

Direktori vendor, manajemen hubungan supplier, dan kontrol pengeluaran pengadaan.

### 10.2 Fitur

#### 10.2.1 Direktori Vendor

Per vendor:

- Nama
- Kategori: Bengkel / BBM / Asuransi / WA Gateway / Hotel Partner / Travel Agent / Lainnya
- Nama PIC
- Nomor HP / WhatsApp
- Alamat
- Email
- Website (jika ada)
- Nomor rekening (untuk pembayaran)
- Rating internal (1–5, dari pengalaman menggunakan)
- Catatan

**Kategori Vendor:**

| Kategori | Contoh |
|---|---|
| Bengkel rekanan | Bengkel resmi Toyota Lombok, bengkel kepercayaan |
| Supplier BBM | SPBU rekanan, vendor BBM partai |
| Asuransi | Perusahaan asuransi kendaraan, asuransi penumpang |
| Teknologi | Fonnte (WA Gateway), hosting, domain |
| Hotel & Akomodasi | Hotel bintang 4-5 Senggigi, resort Mandalika (partner referral) |
| Travel Agent | Agen perjalanan lokal Lombok, DMC |
| Cleaning & Laundry | Layanan cuci kendaraan |
| Percetakan | Kartu nama, brosur |

#### 10.2.2 Riwayat Transaksi per Vendor

- Daftar semua pembayaran ke vendor tersebut
- Total spend per vendor per bulan/tahun
- Perbandingan budget vs aktual

#### 10.2.3 Hotel & Travel Partner

Sub-modul khusus untuk partnership bisnis:

Per partner:

- Nama hotel/agen
- PIC reservasi (nama + kontak)
- Skema komisi / referral fee yang disepakati
- Jumlah booking yang masuk dari partner ini (bulan ini / total)
- Nilai bisnis yang dihasilkan
- Status partnership: Aktif / Non-aktif / Dalam Negosiasi

#### 10.2.4 Purchase Order Sederhana

Untuk pengeluaran di atas threshold tertentu (misal Rp 500.000):

- Buat PO dengan detail barang/jasa, jumlah, vendor, harga
- Approval dari owner sebelum pembayaran
- Link ke bukti transaksi setelah selesai

---

## 11. Modul 8 - Laporan & Analitik

### 11.1 Deskripsi

Satu halaman overview metrics bisnis dan laporan yang bisa di-export.

### 11.2 Dashboard Overview (Home)

Widget yang tampil di halaman utama:

**Operasional Hari Ini:**

- Total booking hari ini
- Trip berlangsung sekarang (live)
- Supir aktif / total supir
- Armada tersedia / total armada
- Booking menunggu assign

**Keuangan Bulan Ini:**

- Pendapatan gross (progress vs bulan lalu)
- Pendapatan nett (setelah komisi OTA)
- Pengeluaran bulan ini
- Estimasi profit bulan ini

**Alert Prioritas:**

- Dokumen akan expire dalam 14 hari
- Kendaraan melebihi km servis
- Booking konflik jadwal (jika ada)
- Tamu komplain yang belum direspons

### 11.3 Laporan yang Tersedia

| Laporan | Frekuensi | Format |
|---|---|---|
| Ringkasan operasional harian | Harian (otomatis) | WA ke owner |
| Rekap booking mingguan | Mingguan | PDF / CSV |
| Laporan pendapatan bulanan | Bulanan | PDF |
| Rekap komisi supir bulanan | Bulanan | PDF per supir |
| Laporan P&L bulanan | Bulanan | PDF |
| Rekonsiliasi OTA | Bulanan | Excel |
| Laporan performa supir | Bulanan | PDF |
| Laporan biaya armada | Bulanan | PDF |
| Dokumen akan expire | Real-time | Dashboard alert + WA |

### 11.4 Grafik & Visualisasi

- Trend pendapatan 12 bulan terakhir
- Booking per sumber (Klook vs Viator vs Langsung vs dll)
- Rute paling populer
- Peak hours / peak days
- Performa per supir (radar chart)
- Utilisasi armada (% waktu terpakai vs idle)
- Distribusi kebangsaan tamu (world map / bar chart)
- Review rating trend

---

## 12. Schema Database (Supabase)

### 12.1 Tabel Utama

```sql
-- USERS (Auth Supabase)
users
  id          uuid PRIMARY KEY
  email       text UNIQUE
  full_name   text
  role        text  -- owner | admin | dispatcher | driver | accountant | viewer
  created_at  timestamptz DEFAULT now()

-- DRIVERS (Supir)
drivers
  id              uuid PRIMARY KEY
  user_id         uuid REFERENCES users(id)
  full_name       text NOT NULL
  nik             text UNIQUE
  phone_wa        text NOT NULL
  date_of_birth   date
  address         text
  bank_account    text
  bank_name       text
  emergency_contact_name  text
  emergency_contact_phone text
  status          text  -- active | inactive | leave
  join_date       date
  driver_type     text  -- employee | freelance
  commission_pct  numeric(5,2) DEFAULT 60.00
  created_at      timestamptz DEFAULT now()

-- DRIVER_DOCUMENTS (Dokumen supir)
driver_documents
  id            uuid PRIMARY KEY
  driver_id     uuid REFERENCES drivers(id)
  doc_type      text  -- ktp | sim_a | sim_b1 | skck | health_cert
  file_url      text
  issue_date    date
  expiry_date   date
  status        text  -- active | expired | renewal_process
  created_at    timestamptz DEFAULT now()

-- VEHICLES (Armada)
vehicles
  id              uuid PRIMARY KEY
  unit_code       text UNIQUE  -- LT-01, LT-02
  brand           text
  model           text
  year            int
  color           text
  plate_number    text UNIQUE
  vin             text
  engine_number   text
  passenger_cap   int
  status          text  -- active | maintenance | inactive | sold
  current_km      int
  last_service_km int
  photo_urls      text[]
  created_at      timestamptz DEFAULT now()

-- VEHICLE_DOCUMENTS (Dokumen kendaraan)
vehicle_documents
  id            uuid PRIMARY KEY
  vehicle_id    uuid REFERENCES vehicles(id)
  doc_type      text  -- stnk | kir | insurance_vehicle | insurance_passenger
  file_url      text
  issue_date    date
  expiry_date   date
  insurer_name  text    -- untuk dokumen asuransi
  policy_number text
  status        text  -- active | expired | renewal_process
  created_at    timestamptz DEFAULT now()

-- SERVICE_RECORDS (Riwayat servis kendaraan)
service_records
  id            uuid PRIMARY KEY
  vehicle_id    uuid REFERENCES vehicles(id)
  service_date  date NOT NULL
  service_type  text  -- oil_change | routine | tire | battery | brake | other
  km_at_service int
  next_service_km int
  workshop_id   uuid REFERENCES vendors(id)
  cost          numeric(12,2)
  notes         text
  receipt_url   text
  created_at    timestamptz DEFAULT now()

-- ROUTES (Master rute)
routes
  id              uuid PRIMARY KEY
  name            text NOT NULL  -- "BIL → Gili Trawangan"
  origin          text NOT NULL
  destination     text NOT NULL
  base_price      numeric(12,2) NOT NULL
  is_active       boolean DEFAULT true
  estimated_duration_min int
  notes           text

-- BOOKINGS (Pemesanan)
bookings
  id              uuid PRIMARY KEY
  booking_code    text UNIQUE  -- LT-2026-0001
  guest_id        uuid REFERENCES guests(id)
  route_id        uuid REFERENCES routes(id)
  driver_id       uuid REFERENCES drivers(id)
  vehicle_id      uuid REFERENCES vehicles(id)
  pickup_datetime timestamptz NOT NULL
  pickup_address  text
  dropoff_address text
  pax_count       int DEFAULT 1
  luggage_count   int DEFAULT 0
  gross_price     numeric(12,2) NOT NULL
  ota_commission  numeric(12,2) DEFAULT 0
  net_price       numeric(12,2) NOT NULL
  source          text  -- direct | klook | viator | traveloka | getyourguide | trip_com | whatsapp | manual
  status          text  -- pending | confirmed | driver_assigned | in_progress | completed | cancelled
  payment_method  text  -- cash | transfer | ota_settlement
  payment_status  text  -- unpaid | paid | refunded
  notes           text
  flight_number   text
  language_pref   text  -- en | id | zh
  created_at      timestamptz DEFAULT now()
  updated_at      timestamptz DEFAULT now()

-- GUESTS (Data tamu)
guests
  id              uuid PRIMARY KEY
  full_name       text NOT NULL
  email           text
  phone_wa        text
  nationality     text
  language        text  -- en | id | zh | other
  source_first    text  -- channel pertama kali booking
  total_bookings  int DEFAULT 0
  total_spend     numeric(12,2) DEFAULT 0
  tag             text  -- vip | regular | one_time | repeat
  notes           text
  created_at      timestamptz DEFAULT now()

-- REVIEWS (Ulasan tamu)
reviews
  id              uuid PRIMARY KEY
  booking_id      uuid REFERENCES bookings(id)
  guest_id        uuid REFERENCES guests(id)
  driver_id       uuid REFERENCES drivers(id)
  platform        text  -- google | klook | viator | tripadvisor | internal
  rating          int   -- 1-5
  review_text     text
  review_date     date
  admin_reply     text
  replied_at      timestamptz
  created_at      timestamptz DEFAULT now()

-- PAYROLL (Penggajian supir)
payroll
  id              uuid PRIMARY KEY
  driver_id       uuid REFERENCES drivers(id)
  period_month    int
  period_year     int
  total_trips     int
  gross_revenue   numeric(12,2)
  commission_pct  numeric(5,2)
  commission_amt  numeric(12,2)
  bonus           numeric(12,2) DEFAULT 0
  deduction       numeric(12,2) DEFAULT 0
  net_payable     numeric(12,2)
  status          text  -- draft | approved | paid
  payment_date    date
  transfer_proof  text
  created_at      timestamptz DEFAULT now()

-- EXPENSES (Pengeluaran)
expenses
  id              uuid PRIMARY KEY
  expense_date    date NOT NULL
  category        text  -- fuel | maintenance | insurance | commission | platform_fee | marketing | office | legal | other
  description     text NOT NULL
  amount          numeric(12,2) NOT NULL
  payment_method  text
  vendor_id       uuid REFERENCES vendors(id)
  receipt_url     text
  created_by      uuid REFERENCES users(id)
  notes           text
  created_at      timestamptz DEFAULT now()

-- VENDORS (Direktori vendor)
vendors
  id              uuid PRIMARY KEY
  name            text NOT NULL
  category        text  -- workshop | fuel | insurance | technology | hotel | travel_agent | other
  pic_name        text
  phone_wa        text
  email           text
  address         text
  website         text
  bank_account    text
  bank_name       text
  rating          int  -- 1-5
  notes           text
  is_active       boolean DEFAULT true
  created_at      timestamptz DEFAULT now()

-- COMPANY_DOCUMENTS (Dokumen perusahaan)
company_documents
  id              uuid PRIMARY KEY
  doc_name        text NOT NULL
  doc_number      text
  issuer          text
  issue_date      date
  expiry_date     date
  status          text  -- active | expired | renewal_process
  file_url        text
  pic_user_id     uuid REFERENCES users(id)
  notes           text
  created_at      timestamptz DEFAULT now()

-- PARTNER_CONTRACTS (Kontrak mitra)
partner_contracts
  id              uuid PRIMARY KEY
  party_name      text NOT NULL
  party_type      text  -- driver | hotel | travel_agent | other
  contract_type   text
  start_date      date
  end_date        date
  key_terms       text
  file_url        text
  status          text  -- active | expired | negotiating
  created_at      timestamptz DEFAULT now()

-- HOTEL_PARTNERS (Hotel & travel agent partner)
hotel_partners
  id              uuid PRIMARY KEY
  vendor_id       uuid REFERENCES vendors(id)
  commission_pct  numeric(5,2)
  referral_fee    numeric(12,2)
  total_bookings  int DEFAULT 0
  total_value     numeric(12,2) DEFAULT 0
  status          text  -- active | inactive | negotiating
  notes           text
  created_at      timestamptz DEFAULT now()
```

### 12.2 Indexes Penting

```sql
-- Booking queries yang sering
CREATE INDEX idx_bookings_pickup_datetime ON bookings(pickup_datetime);
CREATE INDEX idx_bookings_driver_id ON bookings(driver_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_source ON bookings(source);

-- Document expiry monitoring
CREATE INDEX idx_driver_docs_expiry ON driver_documents(expiry_date);
CREATE INDEX idx_vehicle_docs_expiry ON vehicle_documents(expiry_date);
CREATE INDEX idx_company_docs_expiry ON company_documents(expiry_date);

-- CRM queries
CREATE INDEX idx_guests_nationality ON guests(nationality);
CREATE INDEX idx_bookings_guest_id ON bookings(guest_id);
```

---

## 13. Integrasi Eksternal

### 13.1 WhatsApp (via Fonnte)

**Endpoints yang digunakan:**

- Send message: `POST https://api.fonnte.com/send`
- Webhook incoming message (untuk chatbot)

**n8n workflow terhubung:**

- Konfirmasi booking ke tamu
- Notif trip ke supir
- Alert dokumen akan expire ke admin
- Review request post-trip
- Laporan harian ke owner
- Chatbot Claude untuk inquiry tamu

### 13.2 Booking Platform OTA

| Platform | Integrasi |
|---|---|
| Klook | API atau upload CSV settlement manual |
| Viator | API atau CSV |
| Traveloka Xperience | CSV settlement |
| GetYourGuide | API |
| Trip.com | CSV settlement |

Mode awal: upload CSV manual bulanan untuk rekonsiliasi. API integrasi sebagai fase lanjutan.

### 13.3 Google

- **Google Calendar:** Sinkronisasi jadwal trip (opsional, untuk supir yang prefer Google Calendar)
- **Google Maps:** Deep link di mobile view supir untuk navigasi
- **Google Business:** Webhook review baru (via Zapier/Make sebagai alternatif)

### 13.4 Claude API

Chatbot AI untuk tamu via WhatsApp:

- Model: `claude-sonnet-4-20250514`
- Sistem prompt dalam EN dan CN
- Kemampuan: jawab pertanyaan harga, ketersediaan, rute; collect data booking; eskalasi ke admin untuk kasus kompleks
- Riwayat percakapan disimpan di Supabase per session

### 13.5 Supabase Realtime

Fitur yang menggunakan realtime subscription:

- Status trip live di dashboard dispatcher
- Alert baru masuk
- Update status supir (available/on-trip)
- Booking baru masuk (notif di dashboard)

---

## 14. Keamanan & Akses

### 14.1 Autentikasi

- Supabase Auth dengan email + password
- Opsi: tambahkan OTP via WhatsApp untuk supir (lebih mudah dari email)
- Session timeout: 8 jam untuk admin, 24 jam untuk driver mobile

### 14.2 Row Level Security (RLS)

Implementasi RLS di Supabase untuk setiap tabel:

```sql
-- Contoh: Supir hanya bisa lihat booking milik sendiri
CREATE POLICY "drivers_own_bookings" ON bookings
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM drivers WHERE id = bookings.driver_id
    )
    OR
    (SELECT role FROM users WHERE id = auth.uid()) IN ('owner', 'admin', 'dispatcher')
  );

-- Accounting: hanya owner dan accountant
CREATE POLICY "accounting_access" ON expenses
  FOR ALL USING (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('owner', 'accountant')
  );
```

### 14.3 Audit Log

Setiap perubahan data penting dicatat:

- Siapa yang mengubah
- Kapan
- Data sebelum vs sesudah
- IP address

Tabel yang di-audit: bookings (status change), payroll, expenses di atas threshold, contract.

### 14.4 Data Sensitif

- Nomor rekening supir: enkripsi di database
- Data tamu (NIK, passport): enkripsi
- API keys (Fonnte, Claude, dll): disimpan di environment variable, tidak pernah di database
- Backup otomatis Supabase: daily, retensi 30 hari

---

## 15. Non-Functional Requirements

### 15.1 Performa

- Halaman dashboard utama: load < 2 detik
- Daftar booking (100+ record): load < 1 detik dengan pagination
- Export PDF laporan: selesai < 5 detik
- Mobile view supir: optimasi untuk koneksi 3G Lombok

### 15.2 Ketersediaan

- Target uptime: 99% (down < 7 jam/bulan)
- Supabase SLA: 99.9%
- Vercel SLA: 99.99%

### 15.3 Skalabilitas

- Database Supabase free tier: cukup untuk 1.000 booking/bulan
- Upgrade ke Pro ($25/bulan) saat mencapai 10 armada aktif
- Arsitektur mendukung hingga 50 supir dan 20 kendaraan tanpa perubahan struktur

### 15.4 Browser & Device Support

- Desktop: Chrome, Firefox, Safari, Edge (2 versi terakhir)
- Mobile (driver view): Chrome Android, Safari iOS
- Resolusi minimum mobile: 375px (iPhone SE)
- Resolusi desktop: optimasi untuk 1440px

### 15.5 Aksesibilitas

- Kontras warna minimal WCAG AA
- Semua form punya label yang jelas
- Error state yang deskriptif (bukan hanya warna merah)

---

## 16. Roadmap Implementasi

### Fase 1 - Fondasi (Minggu 1–3)

**Prioritas absolut sebelum operasional berjalan.**

- [ ] Setup Supabase project + schema database lengkap
- [ ] Setup Supabase Auth + role system
- [ ] Modul Booking: form manual + daftar booking + detail booking
- [ ] Modul HR: input profil supir + dokumen dasar
- [ ] Modul Fleet: input inventaris kendaraan + dokumen
- [ ] Dashboard overview sederhana (booking hari ini, supir aktif)
- [ ] Mobile view supir: daftar trip hari ini + update status

### Fase 2 - Otomasi (Minggu 4–5)

- [ ] Setup n8n + Fonnte WA Gateway
- [ ] Workflow auto-assign supir
- [ ] Notifikasi WA: konfirmasi tamu + notif supir
- [ ] Workflow reminder pre-trip (H-1)
- [ ] Workflow review request post-trip
- [ ] Alert dokumen akan expire (ke admin via WA)
- [ ] Laporan harian otomatis ke owner via WA

### Fase 3 - Keuangan & Compliance (Minggu 6–7)

- [ ] Modul Accounting: input pendapatan + pengeluaran + laporan P&L
- [ ] Generate invoice PDF otomatis
- [ ] Modul Payroll: kalkulasi komisi + slip gaji PDF
- [ ] Modul Legal: tracker dokumen perusahaan + alert expiry
- [ ] Rekonsiliasi OTA: upload CSV + matching
- [ ] Modul Vendor: direktori vendor

### Fase 4 - CRM & Analytics (Minggu 8–9)

- [ ] Modul CRM: database tamu + segmentasi
- [ ] Review tracker + management respons
- [ ] Modul Analitik: grafik trend + laporan export
- [ ] Kalender dispatch dengan drag-and-drop
- [ ] Hotel partner sub-modul

### Fase 5 - AI & Peningkatan (Minggu 10–12)

- [ ] Claude API chatbot untuk tamu via WA
- [ ] Auto-dispatch berbasis lokasi supir (jika GPS tracking diimplementasikan)
- [ ] Integrasi API Klook/Viator (menggantikan upload CSV manual)
- [ ] Dashboard analytics lanjutan
- [ ] Audit log lengkap

---

## Appendix

### A. Master Rute Default

| Rute | Harga Dasar |
|---|---|
| BIL → Mataram | Rp 315.000 |
| BIL → Senggigi | Rp 375.000 |
| BIL → Kuta Lombok | Rp 315.000 |
| BIL → Bangsal (Gili area) | Rp 465.000 |
| BIL → Mandalika | Rp 315.000 |
| BIL → Tetebatu | Rp 450.000 |
| Senggigi → Gili (via Bangsal) | Rp 200.000 |
| Day Tour Paket (Full Day) | Rp 800.000–1.200.000 |

*Surcharge dini hari/malam (00:00–06:00): +20%*
*Surcharge high season: +20–30%*

### B. Kode Status Booking

| Kode | Label | Deskripsi |
|---|---|---|
| `pending` | Menunggu | Booking masuk, belum dikonfirmasi |
| `confirmed` | Dikonfirmasi | Admin konfirmasi, belum ada supir |
| `driver_assigned` | Supir Ditugaskan | Supir sudah dapat notif |
| `in_progress` | Berlangsung | Supir dalam perjalanan / tamu sudah dijemput |
| `completed` | Selesai | Trip selesai, tamu sampai tujuan |
| `cancelled` | Dibatalkan | Dibatalkan oleh tamu atau operator |

### C. Struktur Folder Project (Next.js)

```
lombok-transfer/
├── app/
│   ├── (auth)/
│   │   └── login/
│   ├── (dashboard)/
│   │   ├── layout.tsx          # Sidebar + header
│   │   ├── page.tsx            # Dashboard overview
│   │   ├── bookings/
│   │   ├── dispatch/
│   │   ├── drivers/
│   │   ├── fleet/
│   │   ├── accounting/
│   │   ├── crm/
│   │   ├── legal/
│   │   ├── vendors/
│   │   └── reports/
│   └── (driver)/
│       └── trips/              # Mobile view supir
├── components/
│   ├── ui/                     # shadcn/ui
│   ├── bookings/
│   ├── drivers/
│   └── shared/
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── types.ts            # Generated types
│   └── utils/
└── hooks/
    ├── useBookings.ts
    ├── useDrivers.ts
    └── useRealtime.ts
```

---

*Dokumen ini adalah living document - diperbarui seiring perkembangan produk dan operasional Lombok Transfer.*
