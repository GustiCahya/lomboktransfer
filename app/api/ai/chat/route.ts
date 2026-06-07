import { NextRequest, NextResponse } from "next/server";
import { sendToDeepSeek, LOMBOK_TRANSFER_SYSTEM_PROMPT, ChatMessage } from "@/lib/ai/openrouter";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, sessionId, guestPhone } = body as {
      messages: ChatMessage[];
      sessionId?: string;
      guestPhone?: string;
    };

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "messages array is required" }, { status: 400 });
    }

    // Prepend system prompt
    const fullMessages: ChatMessage[] = [
      { role: "system", content: LOMBOK_TRANSFER_SYSTEM_PROMPT },
      ...messages,
    ];

    // Send to DeepSeek via OpenRouter
    const aiResponse = await sendToDeepSeek(fullMessages);

    // Check for escalation signal
    const needsHuman = aiResponse.includes("[ESCALATE_TO_HUMAN]");
    const cleanResponse = aiResponse.replace("[ESCALATE_TO_HUMAN]", "").trim();

    // Persist session if sessionId provided (server-side update)
    if (sessionId && guestPhone) {
      const supabase = createClient();
      const updatedMessages = [
        ...messages,
        { role: "assistant", content: cleanResponse },
      ];

      await supabase
        .from("chat_sessions")
        .update({
          messages_json: updatedMessages,
          status: needsHuman ? "human_required" : "bot",
          last_message_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", sessionId);
    }

    return NextResponse.json({
      response: cleanResponse,
      needsHuman,
    });
  } catch (error) {
    console.error("AI Chat API error:", error);
    return NextResponse.json(
      { error: "Gagal menghubungi AI. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
