"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import PageHeader from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bell, CheckCheck, AlertTriangle, Info, RefreshCw } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

const TYPE_META: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  alert: { label: "Peringatan", icon: AlertTriangle, color: "text-destructive" },
  system: { label: "Sistem", icon: Info, color: "text-blue-500" },
  booking_update: { label: "Booking", icon: Bell, color: "text-primary" },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const supabase = createClient();

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    setNotifications(data || []);
    setIsLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAllRead = async () => {
    await supabase.from("notifications").update({ is_read: true }).eq("is_read", false);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const markRead = async (id: string) => {
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const displayed = filter === "unread" ? notifications.filter(n => !n.is_read) : notifications;
  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        title="Notifikasi"
        subtitle="Semua pemberitahuan sistem dan aktivitas operasional."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={fetchNotifications}>
              <RefreshCw className="w-4 h-4" /> Refresh
            </Button>
            {unreadCount > 0 && (
              <Button size="sm" className="gap-2" onClick={markAllRead}>
                <CheckCheck className="w-4 h-4" /> Tandai Semua Dibaca
              </Button>
            )}
          </div>
        }
      />

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors",
            filter === "all" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          Semua
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2",
            filter === "unread" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          Belum Dibaca
          {unreadCount > 0 && (
            <span className="bg-destructive text-destructive-foreground text-xs rounded-full px-1.5 py-0.5 leading-none">{unreadCount}</span>
          )}
        </button>
      </div>

      {/* Notification List */}
      <div className="space-y-2">
        {isLoading ? (
          <div className="h-48 flex items-center justify-center text-muted-foreground">Memuat notifikasi...</div>
        ) : displayed.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center border border-dashed rounded-lg bg-muted/10">
            <Bell className="w-10 h-10 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground text-sm">
              {filter === "unread" ? "Semua notifikasi sudah dibaca." : "Belum ada notifikasi."}
            </p>
          </div>
        ) : (
          displayed.map(notif => {
            const meta = TYPE_META[notif.type] || TYPE_META.system;
            const Icon = meta.icon;

            return (
              <div
                key={notif.id}
                onClick={() => markRead(notif.id)}
                className={cn(
                  "flex items-start gap-4 p-4 rounded-lg border bg-card cursor-pointer transition-all hover:shadow-sm",
                  !notif.is_read && "border-primary/20 bg-primary/5"
                )}
              >
                <div className={cn("w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-muted", !notif.is_read && "bg-primary/10")}>
                  <Icon className={cn("w-4 h-4", meta.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-0.5">
                    <h4 className={cn("text-sm", !notif.is_read && "font-bold")}>{notif.title}</h4>
                    <Badge variant="outline" className="text-[10px] flex-shrink-0">{meta.label}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-snug">{notif.message}</p>
                  <p className="text-xs text-muted-foreground/60 mt-2">
                    {new Date(notif.created_at).toLocaleString("id-ID", { weekday: "short", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
                  </p>
                  {notif.link && (
                    <Link
                      href={notif.link}
                      className="text-xs text-primary hover:underline mt-1 inline-block"
                      onClick={e => e.stopPropagation()}
                    >
                      Lihat Detail →
                    </Link>
                  )}
                </div>
                {!notif.is_read && (
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
