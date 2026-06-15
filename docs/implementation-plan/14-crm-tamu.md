# Step 14 - Modul CRM & Tamu

**Fase:** 4 - CRM & Analytics  
**Target:** Minggu 8–9 (Hari 31–33)  
**Dependency:** Step 05 (Booking), Step 10 (Automation)  
**Referensi PRD:** §8 Modul 5 - CRM & Tamu

---

## Tujuan

Membangun database tamu terpusat, riwayat interaksi, segmentasi pelanggan, dan sistem manajemen review untuk mendorong repeat business.

---

## Todo List

### 14.1 Data Layer

- [ ] Buat `hooks/useCRM.ts`:
  - `useGuests(filters)` - list database tamu dengan filter segmentasi
  - `useGuest(id)` - detail profil tamu
  - `useGuestBookings(id)` - riwayat booking per tamu
  - `useUpdateGuestTag()` - assign VIP/Regular tag
- [ ] Buat `hooks/useReviews.ts`:
  - `useReviews(filters)` - list review dari semua platform
  - `useReviewStats()` - rata-rata rating, jumlah per platform
  - `useReplyReview()` - mutation balas review
- [ ] Buat `lib/validations/crm.ts` - Zod schemas

### 14.2 Database Tamu

- [ ] Buat `app/(dashboard)/crm/page.tsx`:
  - PageHeader: "Customer Relationship Management"
  - Sub-nav: Database Tamu | Review Tracker | Re-engagement
  - Tabel tamu:
    | Nama | HP/Email | Negara | Bahasa | Tag | Total Booking | Nilai Transaksi | Terakhir Booking |
  - Filter segmentasi:
    - Kebangsaan / bahasa
    - Sumber booking pertama
    - Tag (VIP / Regular / One-time / Repeat)
    - Frekuensi (1x, >1x)
    - Status (Aktif, Dormant > 3 bulan)
  - Export data (CSV) untuk email marketing external
- [ ] Buat `components/crm/GuestTable.tsx`
- [ ] Buat `components/crm/SegmentationFilters.tsx`

### 14.3 Profil Detail Tamu

- [ ] Buat `app/(dashboard)/crm/guests/[id]/page.tsx`:
  - **Info Kontak & Demografi:** nama, kontak, bahasa, kebangsaan
  - **Metrics Lifetime:** total booking, total spend, sumber pertama kali
  - **Tag Management:** dropdown set tag tamu
  - **Timeline Interaksi:**
    - Daftar semua booking (tanggal, rute, supir, status)
    - Daftar review yang diberikan
    - Log pesan WA yang dikirim/diterima (dari wa_logs)
    - Catatan manual admin tentang tamu (preferensi makanan, alergi, dll)
- [ ] Buat `components/crm/GuestProfile.tsx`
- [ ] Buat `components/crm/GuestTimeline.tsx`

### 14.4 Manajemen Review

- [ ] Buat `app/(dashboard)/crm/reviews/page.tsx`:
  - Dashboard ringkasan:
    - Rata-rata rating bulan ini vs bulan lalu
    - Breakdown jumlah review per platform (Google, Klook, Viator, Internal)
    - Top 3 supir dengan rating tertinggi
  - Daftar Review (Tabel/Cards):
    | Tanggal | Tamu | Supir | Platform | Rating | Isi Review | Status Reply |
  - Filter: platform, rating bintang, status reply, supir
  - Aksi: Tombol "Balas Review"
- [ ] Buat `components/crm/ReviewDashboard.tsx`
- [ ] Buat `components/crm/ReviewList.tsx`
- [ ] Buat `components/crm/ReplyReviewDialog.tsx`:
  - Menampilkan isi review
  - Textarea untuk balasan (internal notes atau copy-paste ke OTA)
  - Tandai sebagai "Sudah Dibalas"

### 14.5 Follow-up & Re-engagement

- [ ] Buat `app/(dashboard)/crm/re-engagement/page.tsx`:
  - Fokus pada tamu yang dormant (tidak booking > 6 bulan) namun pernah kasih rating bagus
  - List target tamu
  - Template pesan WA re-engagement (EN dan CN):
    - "Hi [Name], planning to visit Lombok again? Get 10% off for your next trip!"
  - Tombol "Kirim Pesan Promo" (trigger n8n WA blast individu)
  - Log follow-up per tamu
- [ ] Buat `components/crm/ReEngagementList.tsx`
- [ ] Buat `components/crm/PromoMessageDialog.tsx`

### 14.6 CRM Automation Tracker

- [ ] Terhubung dengan Workflow n8n Step 10:
  - Monitor status pengiriman review request H+2 jam (Sent / Clicked / Submitted)
  - Link Supabase review tracking table dengan webhook responses

### 14.7 CRM Sub-Navigation

- [ ] Buat `app/(dashboard)/crm/layout.tsx`:
  - Sub-nav tabs:
    - Database Tamu → `/crm`
    - Review Tracker → `/crm/reviews`
    - Re-engagement → `/crm/re-engagement`

---

## Deliverables

| Output | Kriteria Selesai |
|---|---|
| Database tamu | List + filter segmentasi lengkap |
| Profil detail tamu | Timeline interaksi + booking history |
| Manajemen review | Dashboard agregat + list + status reply |
| Re-engagement | List tamu dormant + template WA blast |

---

## Estimasi Waktu

| Task | Durasi |
|---|---|
| 14.1 Data layer | 1.5 jam |
| 14.2 Database list | 2.5 jam |
| 14.3 Profil detail | 3 jam |
| 14.4 Manajemen review | 3.5 jam |
| 14.5 Re-engagement | 2 jam |
| 14.6 Navigation | 30 menit |
| **Total** | **~13 jam** |
