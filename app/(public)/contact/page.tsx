import React from "react";
import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Lombok Transfer for bookings, custom itineraries, or any enquiries. Available 24/7 on WhatsApp. Based in Mataram, Lombok, Indonesia.",
  openGraph: {
    title: "Contact Us | Lombok Transfer",
    description:
      "Reach out to Lombok Transfer for bookings or custom itineraries. 24/7 WhatsApp support.",
    url: "https://lomboktransfer.com/contact",
  },
  alternates: { canonical: "https://lomboktransfer.com/contact" },
};


export default async function ContactPage() {
  const supabase = createAdminClient();
  const { data: settings } = await supabase
    .from('company_settings')
    .select('*')
    .eq('id', 1)
    .single();

  const email = settings?.email || "hello@lomboktransfer.com";
  const phoneWa = settings?.phone_wa || "+62 851-0263-3994";
  const address = settings?.address || "Jl. Langko 70, Mataram, Lombok, NTB, Indonesia";
  
  return (
    <div className="min-h-screen pt-32 pb-24 bg-muted/20">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-foreground mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions or need a custom itinerary? Get in touch with our team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6 md:col-span-1">
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">WhatsApp (24/7)</h3>
                  <a href={`https://wa.me/${phoneWa.replace(/[^0-9]/g, '')}`} className="text-muted-foreground hover:text-primary transition-colors">
                    {phoneWa}
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <a href={`mailto:${email}`} className="text-muted-foreground hover:text-primary transition-colors">
                    {email}
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Office Address</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{address}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <Card className="h-full">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6">Send us a message</h3>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name</Label>
                      <Input id="name" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="john@example.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="How can we help?" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" rows={6} placeholder="Type your message here..." />
                  </div>
                  <Button type="button" className="w-full gap-2">
                    Send Message <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
