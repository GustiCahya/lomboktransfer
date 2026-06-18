"use client";

import React, { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Calendar, Clock, Users, ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

function BookingForm() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    date: "",
    time: "",
    pax: "2",
  });

  React.useEffect(() => {
    const originParam = searchParams.get("origin");
    const destParam = searchParams.get("destination");
    if (originParam || destParam) {
      setFormData(prev => ({
        ...prev,
        origin: originParam || prev.origin,
        destination: destParam || prev.destination,
      }));
    }
  }, [searchParams]);

  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);

  return (
    <div className="min-h-screen pt-32 pb-24 bg-muted/20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-foreground mb-4">Book Your Transfer</h1>
          <p className="text-lg text-muted-foreground">Fast, secure, and instantly confirmed.</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-12 relative">
          <div className="absolute left-0 top-1/2 w-full h-1 bg-border -z-10 -translate-y-1/2" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors",
                step >= i ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border border-border"
              )}>
                {step > i ? <CheckCircle2 className="w-5 h-5" /> : i}
              </div>
              <span className={cn("text-xs font-medium hidden sm:block", step >= i ? "text-primary" : "text-muted-foreground")}>
                {i === 1 ? "Route" : i === 2 ? "Details" : i === 3 ? "Passenger" : "Confirm"}
              </span>
            </div>
          ))}
        </div>

        {/* Form Container */}
        <div className="bg-card rounded-3xl p-6 md:p-10 shadow-sm border border-border">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-2xl font-bold mb-6">Where are you going?</h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Pickup Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="e.g. Lombok Airport (BIL)"
                      className="pl-10 h-12"
                      value={formData.origin}
                      onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Drop-off Destination</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="e.g. Kuta Lombok, Senggigi"
                      className="pl-10 h-12"
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <Button onClick={handleNext} disabled={!formData.origin || !formData.destination} className="h-12 px-8 rounded-full">
                  Next Step <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-2xl font-bold mb-6">When do you need us?</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="date"
                      className="pl-10 h-12"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Pickup Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="time"
                      className="pl-10 h-12"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Number of Passengers</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <select
                      className="flex h-12 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={formData.pax}
                      onChange={(e) => setFormData({ ...formData, pax: e.target.value })}
                    >
                      {[1, 2, 3, 4, 5, 6, 7].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-6">
                <Button variant="ghost" onClick={handlePrev} className="h-12 px-6">Back</Button>
                <Button onClick={handleNext} disabled={!formData.date || !formData.time} className="h-12 px-8 rounded-full">
                  Next Step <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step >= 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 text-center py-10">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Complete Booking via WhatsApp</h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                To ensure immediate confirmation and perfect coordination, we complete all bookings securely via WhatsApp.
              </p>

              <div className="bg-muted/50 rounded-xl p-6 mb-8 text-left max-w-sm mx-auto">
                <p className="text-sm font-medium mb-2 text-muted-foreground">Your Trip Summary:</p>
                <p className="font-semibold">{formData.origin} &rarr; {formData.destination}</p>
                <p className="text-sm mt-1">{formData.date} at {formData.time} • {formData.pax} Pax</p>
              </div>

              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={handlePrev} className="h-12 px-6">Edit Details</Button>
                <Link
                  href={`https://wa.me/6285102633994?text=Hi! I'd like to book a transfer from ${formData.origin} to ${formData.destination} on ${formData.date} at ${formData.time} for ${formData.pax} people.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ size: "default" }), "h-12 px-8 rounded-full bg-green-600 hover:bg-green-700 text-white gap-2")}
                >
                  Send to WhatsApp
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BookingPageClient() {
  return <BookingForm />;
}
