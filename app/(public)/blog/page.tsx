import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { BLOGS_LIST } from "@/lib/constants/blog";
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
          {BLOGS_LIST.map((blog) => (
            <div key={blog.slug} className="group flex flex-col bg-card rounded-2xl overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300">
              <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col flex-1 p-6 md:p-8">
                <div className="text-sm text-muted-foreground mb-3">{blog.date}</div>
                <h2 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors line-clamp-2">
                  {blog.title}
                </h2>
                <p className="text-muted-foreground mb-6 line-clamp-3 flex-1">
                  {blog.excerpt}
                </p>
                <Link 
                  href={`/blog/${blog.slug}`} 
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mt-auto gap-2 p-0 hover:bg-transparent hover:text-primary")}
                >
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
