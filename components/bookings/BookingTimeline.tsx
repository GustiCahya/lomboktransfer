import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, Car, MapPin, Flag } from "lucide-react";

interface BookingTimelineProps {
  status: string;
}

const steps = [
  { id: "pending", label: "Menunggu", icon: Clock },
  { id: "confirmed", label: "Dikonfirmasi", icon: CheckCircle2 },
  { id: "driver_assigned", label: "Supir Ditugaskan", icon: Car },
  { id: "in_progress", label: "Sedang Berlangsung", icon: MapPin },
  { id: "completed", label: "Selesai", icon: Flag },
];

export default function BookingTimeline({ status }: BookingTimelineProps) {
  // If cancelled, show a specific error timeline or just abort
  if (status === "cancelled") {
    return (
      <div className="p-4 bg-destructive/10 text-destructive rounded-md border border-destructive/20 text-center font-medium">
        Booking ini telah dibatalkan
      </div>
    );
  }

  const currentStepIndex = steps.findIndex(s => s.id === status) !== -1 
    ? steps.findIndex(s => s.id === status) 
    : (status === "active" ? 3 : 0);

  return (
    <div className="relative flex justify-between w-full mt-4 mb-8 before:absolute before:inset-0 before:top-1/2 before:-translate-y-1/2 before:h-1 before:bg-muted before:z-0">
      <div 
        className="absolute top-1/2 -translate-y-1/2 h-1 bg-primary z-0 transition-all duration-500" 
        style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
      />
      
      {steps.map((step, index) => {
        const isCompleted = index < currentStepIndex;
        const isCurrent = index === currentStepIndex;

        return (
          <div key={step.id} className="relative z-10 flex flex-col items-center">
            <div 
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border-4 transition-colors",
                isCompleted ? "bg-primary border-primary text-primary-foreground" : 
                isCurrent ? "bg-background border-primary text-primary" : 
                "bg-background border-muted text-muted-foreground"
              )}
            >
              <step.icon className="w-4 h-4" />
            </div>
            <span 
              className={cn(
                "absolute top-12 text-xs font-medium w-24 text-center",
                isCurrent ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
