# Step 13 - Modul Vendor & Procurement

**Fase:** 3 - Keuangan & Compliance  
**Target:** Minggu 7 (Hari 28–30)  
**Dependency:** Step 11 (Accounting), Step 07 (Fleet)  
**Referensi PRD:** §10 Modul 7 - Vendor & Procurement

---

## Tujuan

Membangun direktori vendor, riwayat transaksi, sub-modul hotel & travel partner, dan purchase order sederhana.

---

## Todo List

### 13.1 Data Layer

- [ ] Buat `hooks/useVendors.ts`:
  - `useVendors(filters)` - list semua vendor
  - `useVendor(id)` - detail vendor
  - `useCreateVendor()` - mutation create
  - `useUpdateVendor()` - mutation update
  - `useVendorTransactions(vendorId)` - riwayat transaksi
- [ ] Buat `hooks/useHotelPartners.ts`:
  - `useHotelPartners()` - list hotel & travel partners
  - `useCreateHotelPartner()` - mutation create
- [ ] Buat `lib/validations/vendor.ts` - Zod schema

### 13.2 Direktori Vendor

- [ ] Buat `app/(dashboard)/vendors/page.tsx`:
  - PageHeader: "Vendor & Procurement"
  - Sub-nav: Direktori | Hotel Partner | Purchase Order
  - Tombol "Tambah Vendor"
  - Filter: kategori, status (aktif/non-aktif), rating
  - Search: nama vendor
  - Tabel/Card vendor:
    | Nama | Kategori | PIC | HP/WA | Rating | Total Transaksi | Status |
  - Kategori (PRD §10.2.1):
    - Bengkel Rekanan
    - Supplier BBM
    - Asuransi
    - Teknologi
    - Hotel & Akomodasi
    - Travel Agent
    - Cleaning & Laundry
    - Percetakan
- [ ] Buat `components/vendors/VendorTable.tsx`
- [ ] Buat `components/vendors/VendorCard.tsx`

### 13.3 Detail Vendor

- [ ] Buat `app/(dashboard)/vendors/[id]/page.tsx`:
  - **Info Vendor:**
    - Nama, kategori, PIC, HP/WA, email, alamat, website
    - Nomor rekening + bank
    - Rating internal (1–5 stars, editable)
    - Catatan
    - Status: Aktif / Non-aktif
  - **Riwayat Transaksi:**
    - Tabel: semua pembayaran ke vendor ini (from expenses table)
      | Tanggal | Deskripsi | Jumlah | Bukti |
    - Total spend per vendor:
      - Bulan ini
      - Tahun ini
      - All time
    - Grafik: spend per bulan (12 bulan, bar chart)
  - **Budget vs Aktual** (opsional):
    - Set budget per vendor per bulan
    - Perbandingan: budget vs actual spend
    - Alert jika melebihi budget

### 13.4 Form Tambah/Edit Vendor

- [ ] Buat `components/vendors/VendorForm.tsx` (dialog/page):
  - Nama (required)
  - Kategori (dropdown)
  - PIC name
  - HP/WA
  - Email
  - Alamat
  - Website
  - Nomor rekening + nama bank
  - Rating internal (1–5 stars)
  - Catatan
  - Status: Aktif / Non-aktif

### 13.5 Hotel & Travel Partner

- [ ] Buat `app/(dashboard)/vendors/partners/page.tsx`:
  - Daftar hotel & travel agent partners:
    | Nama | PIC Reservasi | Kontak | Komisi/Referral | Booking Bulan Ini | Total Booking | Nilai Bisnis | Status |
  - Status: Aktif / Non-aktif / Dalam Negosiasi
  - Tombol "Tambah Partner"
- [ ] Buat `components/vendors/PartnerTable.tsx`
- [ ] Buat `components/vendors/PartnerForm.tsx` (dialog):
  - Link ke vendor existing (atau buat baru)
  - PIC reservasi (nama + kontak)
  - Skema komisi / referral fee (% atau nominal)
  - Status partnership
  - Catatan
- [ ] Tracking per partner:
  - Jumlah booking yang masuk dari partner (linked ke booking.source)
  - Total nilai transaksi dari partner
  - ROI partnership

### 13.6 Purchase Order Sederhana

- [ ] Buat `app/(dashboard)/vendors/purchase-orders/page.tsx`:
  - Untuk pengeluaran di atas threshold (misal Rp 500.000)
  - Daftar PO:
    | No. PO | Tanggal | Vendor | Deskripsi | Jumlah | Status | Approver |
  - Status: Draft / Menunggu Approval / Approved / Rejected / Selesai
  - Tombol "Buat PO"
- [ ] Buat `components/vendors/PurchaseOrderForm.tsx` (dialog):
  - Vendor (dropdown)
  - Detail barang/jasa (line items):
    - Item, quantity, unit price, total
    - Bisa multiple items
  - Total PO
  - Catatan
- [ ] Approval flow:
  - PO dibuat oleh admin → notif ke owner
  - Owner approve/reject di dashboard
  - Setelah approved → link ke bukti transaksi (expense)
- [ ] Buat tabel `purchase_orders`:

  ```sql
  purchase_orders (id, po_number, vendor_id, description, items_json,
                   total_amount, status, created_by, approved_by, 
                   approved_at, notes, created_at)
  ```

### 13.7 Vendor Sub-Navigation

- [ ] Buat `app/(dashboard)/vendors/layout.tsx`:
  - Sub-nav:
    - Direktori → `/vendors`
    - Hotel & Travel Partner → `/vendors/partners`
    - Purchase Order → `/vendors/purchase-orders`

---

## Deliverables

| Output | Kriteria Selesai |
|---|---|
| Direktori vendor | CRUD + 8 kategori + rating |
| Detail vendor | Info + riwayat transaksi + spend analysis |
| Hotel partner | CRUD + booking tracking + ROI |
| Purchase order | Create + approval flow + link ke expense |

---

## Estimasi Waktu

| Task | Durasi |
|---|---|
| 13.1 Data layer | 1.5 jam |
| 13.2 Direktori list | 2.5 jam |
| 13.3 Detail vendor | 3 jam |
| 13.4 Form CRUD | 1.5 jam |
| 13.5 Hotel partner | 3 jam |
| 13.6 Purchase order | 3 jam |
| 13.7 Navigation | 30 menit |
| **Total** | **~15 jam** |
