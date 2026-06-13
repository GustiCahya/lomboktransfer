-- Migration: Create Notifications and WA Logs Tables

-- 1. Create Notifications Table (In-App Dashboard Notifications)
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID, -- Optional: link to a specific user/driver. If null, broadcasts to all admins
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- e.g., 'alert', 'system', 'booking_update'
    link TEXT, -- Optional URL to navigate when clicked
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for querying user notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- 2. Create WhatsApp Logs Table
CREATE TABLE IF NOT EXISTS public.wa_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    recipient_phone VARCHAR(20) NOT NULL,
    recipient_type VARCHAR(20) NOT NULL, -- 'guest', 'driver', 'admin'
    message_type VARCHAR(50) NOT NULL, -- 'booking_confirm', 'driver_assign', 'reminder', etc.
    message_content TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'sent', -- 'sent', 'delivered', 'read', 'failed'
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast lookup by booking or recipient
CREATE INDEX IF NOT EXISTS idx_wa_logs_booking_id ON public.wa_logs(booking_id);
CREATE INDEX IF NOT EXISTS idx_wa_logs_recipient_phone ON public.wa_logs(recipient_phone);

-- Realtime publication for notifications so dashboard can auto-update
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
