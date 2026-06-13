import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Map, Clock, Star } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TOURS = [
  {
    title: "Waterfalls & Monkey Forest",
    duration: "Full Day (8-10h)",
    price: "from IDR 750k",
    description: "Explore the stunning Sendang Gile and Tiu Kelep waterfalls at the foot of Mount Rinjani.",
    image: "https://images.unsplash.com/photo-1604999333679-b86d54738315?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "Sasak Traditional Village",
    duration: "Half Day (4-6h)",
    price: "from IDR 500k",
    description: "Immerse yourself in the local Sasak culture, visit traditional weaving villages and pristine southern beaches.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "Gili Islands Snorkeling",
    duration: "Full Day (8-10h)",
    price: "from IDR 850k",
    description: "Private boat tour to snorkel with sea turtles around the famous three Gili islands.",
    image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=600&auto=format&fit=crop"
  }
];

export default function ToursPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">Discover Lombok</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the best of the island with our private, fully customizable day tours guided by passionate locals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TOURS.map((tour, i) => (
            <div key={i} className="group rounded-2xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
              <div className="aspect-[4/3] relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors z-10" />
                <Image
                  src={tour.image}
                  alt={tour.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 z-20 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-foreground">
                  {tour.price}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-foreground mb-2 flex items-start gap-2">
                  <Map className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  {tour.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" /> {tour.duration}
                </p>
                <p className="text-muted-foreground text-sm mb-6 flex-1">
                  {tour.description}
                </p>
                <Link href={`https://wa.me/62817777480?text=Hi! I'm interested in booking the ${encodeURIComponent(tour.title)} tour.`} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ size: "default" }), "w-full rounded-full group-hover:bg-primary transition-colors gap-2")}>
                  Book Tour <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-primary/5 rounded-3xl p-8 md:p-12 text-center border border-primary/10">
          <Star className="h-12 w-12 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Custom Tours Available</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Have a specific itinerary in mind? We can create a custom tour just for you. Contact us to plan your perfect day in Lombok.
          </p>
          <Link href="https://wa.me/62817777480" target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ size: "lg" }), "rounded-full")}>
            Plan Custom Tour
          </Link>
        </div>
      </div>
    </div>
  );
}
