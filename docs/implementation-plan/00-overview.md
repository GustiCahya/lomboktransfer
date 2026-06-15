# 📋 Implementation Plan - Lombok Transfer Internal Dashboard

**Versi:** 1.0  
**Dibuat:** 7 Juni 2026  
**Referensi:** [PRD - Internal Dashboard Lombok Transfer](../lombok-transfer-internal-dashboard-prd.md)

---

## Ringkasan Proyek

Internal Dashboard Lombok Transfer adalah sistem operasional terpusat (back-office) untuk mengelola booking, supir, armada, keuangan, CRM, legal, vendor, dan analitik bisnis transportasi wisata premium di Lombok.

## Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | Next.js 14 (App Router) + Tailwind CSS + shadcn/ui |
| Backend/Database | Supabase (PostgreSQL + Auth + Storage + Realtime) |
| Data Fetching | React Query (TanStack Query) |
| Otomasi | n8n (self-hosted) + Fonnte (WhatsApp API) |
| AI Chatbot | Claude API (`claude-sonnet-4-20250514`) |
| Deployment | Vercel (frontend) + Railway/DigitalOcean (n8n) + Supabase Cloud |

## Navigasi Dokumen Implementasi

| Step | Dokumen | Fase | Target |
|---|---|---|---|
| 01 | [Project Setup & Foundation](./01-project-setup.md) | Fase 1 | Minggu 1 |
| 02 | [Database Schema & Supabase](./02-database-schema.md) | Fase 1 | Minggu 1 |
| 03 | [Authentication & Authorization](./03-auth-system.md) | Fase 1 | Minggu 1 |
| 04 | [Layout & Navigation Shell](./04-layout-navigation.md) | Fase 1 | Minggu 1–2 |
| 05 | [Modul Booking & Dispatch](./05-booking-dispatch.md) | Fase 1 | Minggu 2–3 |
| 06 | [Modul Human Resource](./06-human-resource.md) | Fase 1 | Minggu 2–3 |
| 07 | [Modul Fleet Management](./07-fleet-management.md) | Fase 1 | Minggu 2–3 |
| 08 | [Dashboard Overview (Home)](./08-dashboard-overview.md) | Fase 1 | Minggu 3 |
| 09 | [Mobile Driver View](./09-mobile-driver-view.md) | Fase 1 | Minggu 3 |
| 10 | [n8n & WhatsApp Automation](./10-n8n-whatsapp-automation.md) | Fase 2 | Minggu 4–5 |
| 11 | [Modul Accounting & Keuangan](./11-accounting-keuangan.md) | Fase 3 | Minggu 6–7 |
| 12 | [Modul Legal & Compliance](./12-legal-compliance.md) | Fase 3 | Minggu 6–7 |
| 13 | [Modul Vendor & Procurement](./13-vendor-procurement.md) | Fase 3 | Minggu 7 |
| 14 | [Modul CRM & Tamu](./14-crm-tamu.md) | Fase 4 | Minggu 8–9 |
| 15 | [Modul Laporan & Analitik](./15-laporan-analitik.md) | Fase 4 | Minggu 8–9 |
| 16 | [AI Chatbot & Integrasi Lanjutan](./16-ai-chatbot-integrasi.md) | Fase 5 | Minggu 10–12 |
| 17 | [Testing & QA](./17-testing-qa.md) | Cross-cutting | Ongoing |
| 18 | [Deployment & Go-Live](./18-deployment-golive.md) | Cross-cutting | Minggu 12 |

---

## Timeline Visual

```
Minggu 1     ████████ Step 01–03: Setup, DB, Auth
Minggu 1–2   ████████ Step 04: Layout & Navigation
Minggu 2–3   ████████████████████████ Step 05–09: Core Modules + Dashboard + Mobile
Minggu 4–5   ████████████████ Step 10: n8n & WA Automation
Minggu 6–7   ████████████████████████ Step 11–13: Accounting, Legal, Vendor
Minggu 8–9   ████████████████ Step 14–15: CRM & Analitik
Minggu 10–12 ████████████████████████ Step 16: AI & Integrasi Lanjutan
Ongoing      ░░░░░░░░░░░░░░░░ Step 17: Testing & QA
Minggu 12    ████████ Step 18: Deployment & Go-Live
```

## Fase Summary

### Fase 1 - Fondasi (Minggu 1–3)
>
> Step 01–09 | Prioritas absolut sebelum operasional

Setup project, database, auth, layout, dan 3 modul inti (Booking, HR, Fleet) + dashboard overview + mobile driver view.

### Fase 2 - Otomasi (Minggu 4–5)
>
> Step 10 | Otomasi workflow operasional

Setup n8n + Fonnte, auto-assign supir, notifikasi WA, reminder, alert dokumen.

### Fase 3 - Keuangan & Compliance (Minggu 6–7)
>
> Step 11–13 | Sistem keuangan dan kepatuhan

Accounting, payroll, invoice, legal compliance, vendor management.

### Fase 4 - CRM & Analytics (Minggu 8–9)
>
> Step 14–15 | Customer relationship & business intelligence

Database tamu, segmentasi, review management, grafik trend, laporan export.

### Fase 5 - AI & Peningkatan (Minggu 10–12)
>
> Step 16 | Fitur lanjutan

Claude AI chatbot, integrasi API OTA, GPS tracking, audit log lengkap.

---

## Catatan Penting

> ⚠️ Setiap step memiliki **checklist todo** yang harus diselesaikan sebelum melanjutkan ke step berikutnya dalam fase yang sama. Step dalam fase yang sama bisa dikerjakan paralel jika tidak ada dependency.

> 📌 Dokumen ini adalah living document - diperbarui seiring perkembangan implementasi.
