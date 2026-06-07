/**
 * Format angka ke format Rupiah Indonesia
 * Contoh: 150000 → "Rp 150.000"
 */
export function formatRupiah(amount: number, compact = false): string {
  if (compact && amount >= 1_000_000) {
    return `Rp ${(amount / 1_000_000).toFixed(1)}jt`;
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format tanggal ke format Indonesia panjang
 * Contoh: "07 Juni 2025"
 */
export function formatTanggal(date: string | Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

/**
 * Format tanggal ke format singkat Indonesia
 * Contoh: "07/06/2025"
 */
export function formatTanggalPendek(date: string | Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

/**
 * Format tanggal + waktu
 * Contoh: "07 Jun 2025, 14:30"
 */
export function formatTanggalWaktu(date: string | Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

/**
 * Hitung sisa hari hingga tanggal tertentu
 * Negatif = sudah lewat
 */
export function sisaHari(date: string | Date): number {
  const now = new Date();
  const target = new Date(date);
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Format sisa hari ke label yang informatif
 */
export function formatSisaHari(date: string | Date): string {
  const days = sisaHari(date);
  if (days < 0) return `Kadaluarsa ${Math.abs(days)} hari lalu`;
  if (days === 0) return "Kadaluarsa hari ini";
  if (days <= 30) return `${days} hari lagi`;
  return `${Math.floor(days / 30)} bulan lagi`;
}

/**
 * Format nomor telepon ke format display
 * Contoh: "081234567890" → "+62 812-3456-7890"
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  const normalized = cleaned.startsWith("0") ? "62" + cleaned.slice(1) : cleaned;
  return `+${normalized}`;
}
