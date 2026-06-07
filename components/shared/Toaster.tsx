"use client";

import { Toaster } from "sonner";

export default function SonnerToaster() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast: "bg-card text-foreground border border-border shadow-lg",
          success: "border-green-500/30",
          error: "border-destructive/30",
        },
      }}
    />
  );
}
