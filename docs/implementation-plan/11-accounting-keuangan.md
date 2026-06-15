# Step 11 - Modul Accounting & Keuangan

**Fase:** 3 - Keuangan & Compliance  
**Target:** Minggu 6–7 (Hari 21–27)  
**Dependency:** Step 05 (Booking), Step 06 (HR), Step 10 (Automation)  
**Referensi PRD:** §7 Modul 4 - Accounting & Keuangan

---

## Tujuan

Membangun sistem keuangan internal: pendapatan, pengeluaran, invoice tamu, payroll & komisi supir, rekonsiliasi OTA, laporan P&L, dan arus kas.

---

## Todo List

### 11.1 Data Layer - Hooks & Services

- [ ] Buat `hooks/useRevenue.ts`:
  - `useRevenue(filters)` - list pendapatan dari booking
  - `useRevenueBySource()` - breakdown per sumber
  - `useRevenueSummary(period)` - ringkasan per periode
- [ ] Buat `hooks/useExpenses.ts`:
  - `useExpenses(filters)` - list pengeluaran
  - `useCreateExpense()` - mutation create
  - `useExpensesByCategory()` - breakdown per kategori
- [ ] Buat `hooks/usePayroll.ts`:
  - `usePayrollList(period)` - list payroll per bulan
  - `usePayrollDetail(id)` - detail per supir
  - `useGeneratePayroll()` - mutation auto-calculate
  - `useApprovePayroll()` - mutation approve
- [ ] Buat `hooks/useInvoice.ts`:
  - `useGenerateInvoice(bookingId)` - generate invoice PDF
- [ ] Buat `lib/validations/expense.ts` - Zod schema

### 11.2 Halaman Pendapatan

- [ ] Buat `app/(dashboard)/accounting/revenue/page.tsx`:
  - PageHeader: "Pendapatan"
  - Filter: periode (bulan/tahun), sumber booking, status pembayaran
  - Tabel pendapatan:
    | Tanggal | Booking | Tamu | Rute | Tarif Gross | Komisi OTA | Nett | Sumber | Metode | Status |
  - Summary cards atas:
    - Total gross bulan ini
    - Total komisi OTA dipotong
    - Total nett bulan ini
    - vs bulan lalu (% growth)
  - Export CSV
- [ ] Buat `components/accounting/RevenueTable.tsx`
- [ ] Buat `components/accounting/RevenueSummary.tsx`

### 11.3 Halaman Pengeluaran

- [ ] Buat `app/(dashboard)/accounting/expenses/page.tsx`:
  - PageHeader: "Pengeluaran" + tombol "Tambah Pengeluaran"
  - Filter: periode, kategori, vendor
  - Tabel pengeluaran:
    | Tanggal | Kategori | Deskripsi | Jumlah | Metode | Vendor | PIC | Bukti |
  - Kategori: BBM, Servis, Asuransi, Komisi Supir, Platform Fee, Marketing, Kantor, Legal, Lainnya
  - Summary cards:
    - Total pengeluaran bulan ini
    - Breakdown top 3 kategori
  - Export CSV
- [ ] Buat `components/accounting/ExpenseTable.tsx`

### 11.4 Form Tambah Pengeluaran

- [ ] Buat `components/accounting/ExpenseForm.tsx` (dialog):
  - Tanggal
  - Kategori (dropdown)
  - Deskripsi
  - Jumlah (Rupiah, format input)
  - Metode pembayaran
  - Vendor (dropdown dari tabel vendors, opsional)
  - Upload bukti (struk/invoice foto)
  - Catatan
  - PIC: auto-fill user yang login
- [ ] Validasi: jumlah > 0, deskripsi required

### 11.5 Invoice Tamu

- [ ] Buat `app/(dashboard)/accounting/invoices/page.tsx`:
  - Daftar semua invoice
  - Filter: periode, status (Belum Lunas / Lunas)
  - Tabel:
    | No. Invoice | Tanggal | Tamu | Rute | Total | Status | Aksi |
  - Auto-generate nomor invoice: `INV-LT-{YYYY}-{0001}`
- [ ] Buat `components/accounting/InvoiceGenerator.tsx`:
  - Generate invoice PDF otomatis dari data booking:
    - Header: Logo Lombok Transfer, alamat, kontak
    - Nomor invoice + tanggal
    - Data tamu (nama, email)
    - Detail layanan (rute, tanggal, jumlah penumpang)
    - Breakdown harga
    - Total
    - Metode pembayaran
    - Footer: terms & conditions
  - Library: `@react-pdf/renderer` atau `jspdf`
  - Download PDF
  - Kirim via email/WA (trigger n8n)
- [ ] Buat `components/accounting/InvoicePreview.tsx` - preview sebelum generate

### 11.6 Payroll & Komisi Supir (Lengkap)

- [ ] Buat `app/(dashboard)/accounting/payroll/page.tsx`:
  - Pilih periode: bulan + tahun
  - Tombol "Generate Payroll Bulan Ini"
  - Tabel per supir:
    | Supir | Total Trip | Pendapatan Kotor | Komisi (%) | Total Komisi | Bonus | Potongan | Nett | Status |
  - Status per supir: Draft / Approved / Dibayar
  - Aksi per supir:
    - Edit bonus/potongan
    - Approve (individual)
    - Download slip gaji PDF
    - Mark as "Dibayar" + upload bukti transfer
  - Aksi bulk:
    - Approve all
    - Export semua slip gaji (ZIP)
  - Total summary bawah: total seluruh supir
- [ ] Buat `components/accounting/PayrollTable.tsx`
- [ ] Buat `components/accounting/PayrollDetailDialog.tsx`:
  - Breakdown per trip supir bulan itu
  - List semua trip: tanggal, rute, tarif, komisi
  - Subtotal + bonus - potongan = nett
- [ ] Buat `components/accounting/PayslipPDF.tsx`:
  - Generate slip gaji PDF per supir:
    - Periode
    - Nama supir + rekening
    - Breakdown trip
    - Total komisi + bonus - potongan = dibayarkan
    - Tanda tangan digital (opsional)
- [ ] Implementasi auto-calculate:

  ```sql
  -- Query: Hitung payroll untuk supir X, bulan Y
  SELECT
    count(*) as total_trips,
    sum(gross_price) as gross_revenue,
    d.commission_pct,
    sum(gross_price * d.commission_pct / 100) as commission_amt
  FROM bookings b
  JOIN drivers d ON b.driver_id = d.id
  WHERE b.driver_id = $1
    AND b.status = 'completed'
    AND date_trunc('month', b.pickup_datetime) = $2
  GROUP BY d.commission_pct;
  ```

### 11.7 Rekonsiliasi OTA

- [ ] Buat `app/(dashboard)/accounting/ota-reconciliation/page.tsx`:
  - Upload settlement report (CSV/Excel) dari Klook/Viator/Traveloka
  - Parser per platform (format CSV berbeda):
    - Klook: kolom [Booking ID, Product, Date, Pax, Revenue, Commission, Net]
    - Viator: format serupa
  - Auto-matching logic:
    1. Parse CSV → extract booking reference
    2. Match dengan booking di database (by date + guest name + route)
    3. Categorize: Matched ✅ / Not Found ⚠️ / Mismatch ❌
  - Dashboard rekonsiliasi:
    - Total booking via OTA (per platform)
    - Total komisi dipotong per platform
    - Nett diterima per platform
    - Transaksi tidak cocok (perlu review manual)
  - Resolve manual: admin bisa link transaksi yang tidak cocok ke booking
- [ ] Buat `components/accounting/OTAUploader.tsx`
- [ ] Buat `components/accounting/ReconciliationTable.tsx`
- [ ] Buat `lib/parsers/klook-csv.ts` - parser Klook CSV
- [ ] Buat `lib/parsers/viator-csv.ts` - parser Viator CSV

### 11.8 Laporan P&L

- [ ] Buat `app/(dashboard)/accounting/pnl/page.tsx`:
  - Dashboard keuangan ringkas:

    | Metric | Bulan Ini | Bulan Lalu | YTD |
    |---|---|---|---|
    | Pendapatan gross | X | X | X |
    | Komisi OTA | (X) | (X) | (X) |
    | Pendapatan nett | X | X | X |
    | Pengeluaran operasional | (X) | (X) | (X) |
    | Komisi supir | (X) | (X) | (X) |
    | EBITDA | X | X | X |
    | Margin (%) | X% | X% | X% |

  - Grafik (recharts):
    - Bar chart: Pendapatan vs Pengeluaran per bulan (12 bulan)
    - Pie chart: Breakdown pendapatan per sumber
    - Pie chart: Breakdown pengeluaran per kategori
  - Export laporan P&L sebagai PDF
- [ ] Buat `components/accounting/PnLDashboard.tsx`
- [ ] Buat `components/accounting/RevenueChart.tsx`
- [ ] Buat `components/accounting/ExpenseChart.tsx`

### 11.9 Arus Kas (Cash Flow)

- [ ] Buat `app/(dashboard)/accounting/cashflow/page.tsx`:
  - Ringkasan kas masuk vs kas keluar per minggu/bulan
  - Saldo estimasi akhir bulan
  - Timeline: grafik area kas masuk (hijau) vs kas keluar (merah)
  - Alert: jika proyeksi kas tidak cukup untuk komisi supir bulan depan
- [ ] Buat `components/accounting/CashFlowChart.tsx`

### 11.10 Accounting Navigation

- [ ] Buat sub-navigation di modul Accounting:
  - Pendapatan → `/accounting/revenue`
  - Pengeluaran → `/accounting/expenses`
  - Invoice → `/accounting/invoices`
  - Payroll → `/accounting/payroll`
  - Rekonsiliasi OTA → `/accounting/ota-reconciliation`
  - Laporan P&L → `/accounting/pnl`
  - Arus Kas → `/accounting/cashflow`
- [ ] Buat `app/(dashboard)/accounting/layout.tsx` - sub-nav layout

---

## Deliverables

| Output | Kriteria Selesai |
|---|---|
| Pendapatan | Tabel + summary + filter |
| Pengeluaran | CRUD + kategorisasi + bukti upload |
| Invoice | Auto-generate PDF + kirim |
| Payroll | Auto-calculate + approve flow + slip PDF |
| Rekonsiliasi OTA | Upload CSV + matching + review |
| Laporan P&L | Dashboard + chart + export PDF |
| Cash flow | Timeline + proyeksi + alert |

---

## Estimasi Waktu

| Task | Durasi |
|---|---|
| 11.1 Data layer | 2 jam |
| 11.2 Pendapatan | 3 jam |
| 11.3 Pengeluaran | 2 jam |
| 11.4 Form expense | 1 jam |
| 11.5 Invoice | 4 jam |
| 11.6 Payroll | 6 jam |
| 11.7 Rekonsiliasi OTA | 5 jam |
| 11.8 Laporan P&L | 3 jam |
| 11.9 Arus kas | 2 jam |
| 11.10 Navigation | 30 menit |
| **Total** | **~28.5 jam** |
