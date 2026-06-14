"use client";

import React from "react";
import { Share2 } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonProps {
  title?: string;
  text?: string;
}

export default function ShareButton({ title, text }: ShareButtonProps) {
  const handleShare = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const shareTitle = title || "Lombok Transfer";
    const shareText = text || "Check out this article on Lombok Transfer!";

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        toast.success("Successfully shared!");
      } catch (error) {
        // Only show error if the user didn't abort/cancel the share action
        if (error instanceof Error && error.name !== "AbortError") {
          toast.error("Failed to share the page.");
        }
      }
    } else {
      // Fallback: Copy link to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard!");
      } catch {
        toast.error("Could not copy link to clipboard.");
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="p-2 rounded-full bg-muted hover:bg-primary hover:text-white transition-colors"
      title="Share this article"
    >
      <Share2 className="h-4 w-4" />
    </button>
  );
}
