"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface StatusUpdateButtonProps {
  label: string;
  icon: React.ElementType;
  onClick: () => Promise<void>;
  isLoading?: boolean;
  colorClass?: string;
}

export default function StatusUpdateButton({ 
  label, 
  icon: Icon, 
  onClick, 
  isLoading = false,
  colorClass = "bg-primary"
}: StatusUpdateButtonProps) {
  
  const handleClick = async () => {
    // Provide haptic feedback if browser supports it (mostly Android/iOS webviews)
    if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
    
    // In real app, we might want a confirm dialog here for certain critical status changes
    // using window.confirm or a Radix dialog
    await onClick();
  };

  return (
    <Button 
      onClick={handleClick} 
      disabled={isLoading}
      className={`w-full h-14 text-base font-bold shadow-lg flex items-center justify-center gap-3 transition-transform active:scale-95 ${colorClass}`}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <Icon className="w-5 h-5" />
      )}
      {isLoading ? "Menyimpan..." : label}
    </Button>
  );
}
