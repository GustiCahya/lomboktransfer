-- Migration: Add image_url to routes table
-- Menambahkan kolom image_url untuk menyimpan link gambar pada rute

ALTER TABLE public.routes
ADD COLUMN IF NOT EXISTS image_url TEXT;
