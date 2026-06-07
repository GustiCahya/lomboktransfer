import { z } from "zod";

export const guestNoteSchema = z.object({
  note: z.string().min(1, "Catatan tidak boleh kosong"),
});

export type GuestNoteFormValues = z.infer<typeof guestNoteSchema>;

export const replyReviewSchema = z.object({
  reply_content: z.string().min(1, "Balasan tidak boleh kosong"),
});

export type ReplyReviewFormValues = z.infer<typeof replyReviewSchema>;

export const reEngagementMessageSchema = z.object({
  message: z.string().min(1, "Pesan tidak boleh kosong"),
});

export type ReEngagementMessageFormValues = z.infer<typeof reEngagementMessageSchema>;
