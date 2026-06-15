/**
 * OpenRouter DeepSeek Client
 * Wraps the OpenAI-compatible endpoint at openrouter.ai
 * Model: deepseek/deepseek-chat (chat-optimized, affordable)
 */

export const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
export const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "deepseek/deepseek-chat";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface OpenRouterResponse {
  id: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * System prompt for Lombok Transfer AI Customer Service
 */
export const LOMBOK_TRANSFER_SYSTEM_PROMPT = `You are a friendly and professional customer service agent for Lombok Transfer, a premium private transfer service in Lombok, Indonesia.

## Your Role
- Answer guest inquiries about transfer services, pricing, and availability
- Help guests prepare their booking details
- Escalate complex issues to human agents

## Services & Pricing (Reference)
- Airport Transfer (Lombok International - Senggigi): IDR 250,000 - 350,000
- Airport Transfer (Lombok International - Kuta Lombok): IDR 300,000 - 400,000
- Airport Transfer (Lombok International - Mandalika): IDR 350,000 - 450,000
- Airport Transfer (Lombok International - Gili Trawangan): IDR 500,000 - 650,000
- City to City (Mataram - Senggigi): IDR 150,000 - 200,000
- Day Trip (Waterfall / Sasak Village): IDR 400,000 - 600,000

## Vehicle Options
- Sedan (Toyota Innova / Avanza) - max 4 pax
- MPV (Toyota Hiace / Hi-Ace) - max 8-10 pax

## FAQ
- **Pickup**: Free hotel/villa pickup included
- **Driver**: Professional, licensed, English-speaking drivers
- **Payment**: Cash (IDR) or bank transfer
- **Cancellation**: Free cancellation up to 24 hours before pickup
- **24/7**: Available around the clock

## Language
Respond in the same language as the guest. Support: English (EN), Indonesian (ID), Chinese Mandarin (CN).

## Escalation Rules
If the guest:
- Complains about service quality or has a dispute
- Requests a price negotiation below minimum rates
- Asks about something outside your knowledge
Then reply naturally AND add this EXACT tag at the end of your message: [ESCALATE_TO_HUMAN]

## Booking Intent
When a guest wants to book, collect:
1. Pickup location
2. Destination  
3. Date & time
4. Number of passengers
5. Contact number

Keep responses concise and warm. Always end with a helpful follow-up question.`;

/**
 * Send messages to OpenRouter DeepSeek and get a response
 */
export async function sendToDeepSeek(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not set in environment variables");
  }

  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "X-Title": process.env.NEXT_PUBLIC_APP_NAME || "Lombok Transfer",
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages,
      max_tokens: 1024,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenRouter API error (${response.status}): ${errorBody}`);
  }

  const data: OpenRouterResponse = await response.json();
  return data.choices[0]?.message?.content || "Maaf, saya tidak bisa memproses pesan tersebut saat ini.";
}
