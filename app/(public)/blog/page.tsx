import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const BLOGS = [
  {
    title: "10 Best Beaches in South Lombok",
    date: "June 10, 2026",
    excerpt: "Discover the hidden gems of South Lombok, from the famous pink beach to the surfer's paradise of Selong Belanak.",
    image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "Ultimate Guide to Mount Rinjani",
    date: "May 25, 2026",
    excerpt: "Everything you need to know before trekking Indonesia's second highest volcano. What to pack, when to go, and which route to choose.",
    image: "https://images.unsplash.com/photo-1570788647019-3dbba6f19cd6?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "Gili Islands: Which One is For You?",
    date: "May 12, 2026",
    excerpt: "Trawangan, Meno, or Air? We break down the vibe, activities, and best spots for each of the famous three Gilis.",
    image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?q=80&w=600&auto=format&fit=crop"
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">Travel Blog</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tips, guides, and stories to help you plan your perfect Lombok adventure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOGS.map((post, i) => (
            <div key={i} className="group bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all">
              <div className="aspect-[16/9] relative overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col items-start">
                <p className="text-sm text-muted-foreground mb-3">{post.date}</p>
                <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-muted-foreground mb-6 line-clamp-3">
                  {post.excerpt}
                </p>
                <Link href="#" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mt-auto gap-2 p-0 hover:bg-transparent hover:text-primary")}>
                  Read Article <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
