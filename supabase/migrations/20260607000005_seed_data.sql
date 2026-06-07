-- Migration: Seed Data (Default Routes and basic setup)

INSERT INTO public.routes (name, origin, destination, base_price, is_active) VALUES
  ('BIL → Mataram', 'Bandara Internasional Lombok (BIL)', 'Mataram', 315000, true),
  ('BIL → Senggigi', 'Bandara Internasional Lombok (BIL)', 'Senggigi', 375000, true),
  ('BIL → Kuta Lombok', 'Bandara Internasional Lombok (BIL)', 'Kuta Lombok', 315000, true),
  ('BIL → Bangsal (Gili area)', 'Bandara Internasional Lombok (BIL)', 'Bangsal (Gili area)', 465000, true),
  ('BIL → Mandalika', 'Bandara Internasional Lombok (BIL)', 'Mandalika', 315000, true),
  ('BIL → Tetebatu', 'Bandara Internasional Lombok (BIL)', 'Tetebatu', 450000, true),
  ('Senggigi → Gili (via Bangsal)', 'Senggigi', 'Bangsal', 200000, true),
  ('Day Tour Paket (Full Day)', 'Custom', 'Custom', 1000000, true)
ON CONFLICT DO NOTHING;
