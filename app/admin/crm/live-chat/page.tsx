/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, AlertTriangle, Phone, RefreshCw, Inbox } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: string;
}

interface Session {
  id: string;
  guest_phone: string;
  status: string;
  messages_json: Message[];
  last_message_at: string;
}

function MessageBubble({ msg, isUser }: { msg: Message; isUser: boolean }) {
  return (
    <div className={`flex gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${isUser ? "bg-primary/20" : "bg-muted"}`}>
        {isUser ? <User className="h-4 w-4 text-primary" /> : <Bot className="h-4 w-4 text-muted-foreground" />}
      </div>
      <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${isUser
        ? "bg-primary text-primary-foreground rounded-tr-sm"
        : "bg-muted text-foreground rounded-tl-sm"
      }`}>
        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
        {msg.timestamp && (
          <p className={`text-xs mt-1 ${isUser ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
            {format(new Date(msg.timestamp), "HH:mm", { locale: id })}
          </p>
        )}
      </div>
    </div>
  );
}

function ChatSidebar({ sessions, activeId, onSelect }: { sessions: Session[]; activeId: string | null; onSelect: (s: Session) => void }) {
  return (
    <div className="flex flex-col h-full border-r border-border w-72 shrink-0">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold flex items-center gap-2 text-sm">
          <Inbox className="h-4 w-4" />
          Live Chat Sessions
        </h3>
      </div>
      <div className="overflow-y-auto flex-1">
        {sessions.length === 0 && (
          <div className="p-4 text-center text-xs text-muted-foreground">
            Belum ada sesi chat aktif
          </div>
        )}
        {sessions.map((s) => {
          const lastMsg = s.messages_json?.[s.messages_json.length - 1];
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s)}
              className={`w-full flex flex-col items-start gap-1 p-4 border-b border-border text-left transition-colors hover:bg-muted/60 ${activeId === s.id ? "bg-primary/5 border-l-2 border-l-primary" : ""}`}
            >
              <div className="flex items-center justify-between w-full gap-2">
                <span className="font-medium text-sm flex items-center gap-1.5">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  {s.guest_phone}
                </span>
                <StatusBadge status={s.status} />
              </div>
              {lastMsg && (
                <p className="text-xs text-muted-foreground truncate w-full">
                  {lastMsg.role === "assistant" ? "🤖 " : "👤 "}{lastMsg.content}
                </p>
              )}
              <p className="text-xs text-muted-foreground/60">
                {format(new Date(s.last_message_at), "dd MMM HH:mm", { locale: id })}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "bot":
      return <Badge variant="outline" className="text-xs text-indigo-500 border-indigo-500/30 bg-indigo-500/10">AI Bot</Badge>;
    case "human_required":
      return <Badge variant="outline" className="text-xs text-warning border-warning/30 bg-warning/10">Perlu Bantuan</Badge>;
    case "human_active":
      return <Badge variant="outline" className="text-xs text-success border-success/30 bg-success/10">Human Active</Badge>;
    case "closed":
      return <Badge variant="outline" className="text-xs text-muted-foreground">Selesai</Badge>;
    default:
      return null;
  }
}

export default function LiveChatPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [internalMessages, setInternalMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [internalMessages]);

  const loadSessions = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("chat_sessions")
      .select("*")
      .neq("status", "closed")
      .order("last_message_at", { ascending: false });
    setSessions(data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleSelectSession = (session: Session) => {
    setActiveSession(session);
    const msgs = session.messages_json || [];
    setInternalMessages(msgs.map((m: any) => ({ ...m, timestamp: session.last_message_at })));
  };

  const handleTakeover = async () => {
    if (!activeSession) return;
    const supabase = createClient();
    await supabase.from("chat_sessions").update({ status: "human_active" }).eq("id", activeSession.id);
    setActiveSession({ ...activeSession, status: "human_active" });
    loadSessions();
  };

  const handleSendAsAdmin = async () => {
    if (!inputValue.trim() || !activeSession) return;
    setIsSending(true);

    const adminMsg: Message = {
      role: "user",
      content: `[Admin] ${inputValue}`,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...internalMessages, adminMsg];
    setInternalMessages(updatedMessages);
    setInputValue("");

    const supabase = createClient();
    await supabase.from("chat_sessions").update({
      messages_json: updatedMessages,
      last_message_at: new Date().toISOString(),
    }).eq("id", activeSession.id);

    setIsSending(false);
  };

  // Demo Chat: send a test message as guest (internal demo only)
  const handleDemoChat = async () => {
    if (!inputValue.trim()) return;
    setIsSending(true);

    const userMsg: Message = {
      role: "user",
      content: inputValue,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...internalMessages, userMsg];
    setInternalMessages(updatedMessages);
    setInputValue("");

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.filter(m => !m.content.startsWith("[Admin]")),
          sessionId: activeSession?.id,
          guestPhone: activeSession?.guest_phone,
        }),
      });
      const data = await res.json();

      const aiMsg: Message = {
        role: "assistant",
        content: data.response || "Terjadi kesalahan pada AI.",
        timestamp: new Date().toISOString(),
      };

      setInternalMessages([...updatedMessages, aiMsg]);

      if (data.needsHuman && activeSession) {
        setActiveSession({ ...activeSession, status: "human_required" });
        loadSessions();
      }
    } catch {
      setInternalMessages([...updatedMessages, {
        role: "assistant",
        content: "Maaf, gagal terhubung ke AI. Pastikan OPENROUTER_API_KEY sudah diisi.",
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (activeSession?.status === "human_active") {
        void handleSendAsAdmin();
      } else {
        void handleDemoChat();
      }
    }
  };

  return (
    <div className="flex h-[calc(100vh-220px)] overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      {/* Sidebar */}
      <ChatSidebar
        sessions={sessions}
        activeId={activeSession?.id || null}
        onSelect={handleSelectSession}
      />

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-card shrink-0">
          {activeSession ? (
            <>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{activeSession.guest_phone}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <StatusBadge status={activeSession.status} />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {activeSession.status !== "human_active" && (
                  <Button size="sm" variant="outline" onClick={handleTakeover} className="gap-1.5 text-xs border-warning text-warning hover:bg-warning/10">
                    <AlertTriangle className="h-3 w-3" />
                    Ambil Alih (Takeover)
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={loadSessions} className="h-8 w-8 p-0">
                  <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Bot className="h-5 w-5" />
              <span className="text-sm">Pilih sesi chat dari panel kiri</span>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {!activeSession ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 text-muted-foreground">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">AI Chat Center</p>
                <p className="text-sm mt-1">
                  Powered by <span className="text-indigo-400 font-medium">DeepSeek</span> via OpenRouter
                </p>
                <p className="text-xs mt-2 max-w-xs">
                  Pilih sesi chat dari daftar kiri, atau gunakan panel di bawah untuk menguji AI secara langsung.
                </p>
              </div>
            </div>
          ) : internalMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              Belum ada pesan dalam sesi ini.
            </div>
          ) : (
            internalMessages
              .filter(m => m.role !== "system")
              .map((msg, i) => (
                <MessageBubble
                  key={i}
                  msg={msg}
                  isUser={msg.role === "user"}
                />
              ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-border p-4 shrink-0 bg-card">
          {!activeSession && (
            <div className="text-xs text-center text-muted-foreground mb-3">
              💡 Mode Demo - Test AI langsung tanpa sesi tamu aktif
            </div>
          )}
          {activeSession?.status === "human_active" && (
            <div className="text-xs text-center text-success bg-success/10 rounded-md py-1.5 mb-3">
              ✅ Mode Human - Pesan Anda akan masuk sebagai pesan Admin
            </div>
          )}
          <div className="flex gap-3">
            <Input
              placeholder={
                activeSession?.status === "human_active"
                  ? "Ketik balasan sebagai Admin..."
                  : "Ketik pesan untuk test AI..."
              }
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSending}
              className="flex-1"
            />
            <Button
              onClick={activeSession?.status === "human_active" ? handleSendAsAdmin : handleDemoChat}
              disabled={isSending || !inputValue.trim()}
              className="gap-2 shrink-0"
            >
              {isSending ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Kirim
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
