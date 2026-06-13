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
    image: "https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_1200,h_630/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/p31do24ksdcrouegn6at/Lombok%20Waterfalls%20and%20Monkey%20Forest%20Private%20Day%20Tour.jpg"
  },
  {
    title: "Sasak Traditional Village",
    duration: "Half Day (4-6h)",
    price: "from IDR 500k",
    description: "Immerse yourself in the local Sasak culture, visit traditional weaving villages and pristine southern beaches.",
    image: "https://tse3.mm.bing.net/th/id/OIP.DOTssNxV_Wp3hTrVYnIZggHaE6?rs=1&pid=ImgDetMain&o=7&rm=3"
  },
  {
    title: "Gili Islands Snorkeling",
    duration: "Full Day (8-10h)",
    price: "from IDR 850k",
    description: "Private boat tour to snorkel with sea turtles around the famous three Gili islands.",
    image: "https://s-light.tiket.photos/t/01E25EBZS3W0FY9GTG6C42E1SE/rsfit19201280gsm/events/2020/10/09/8120d8e6-0629-4303-8301-dcb4c8dbbf71-1602223746140-38935a774877b5b56d0177e01576113b.jpg"
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
