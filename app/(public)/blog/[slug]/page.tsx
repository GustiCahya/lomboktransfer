import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import ShareButton from "@/components/public/ShareButton";

import { BLOG_DB } from "@/lib/constants/blog";
// Generate SEO Metadata
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = BLOG_DB[params.slug];
  
  if (!post) {
    return {
      title: "Blog Post Not Found | Lombok Transfer",
      description: "The requested blog post could not be found."
    };
  }

  return {
    title: `${post.title} | Lombok Transfer Travel Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
      type: "article",
      authors: [post.author],
      publishedTime: new Date(post.date).toISOString()
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    }
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = BLOG_DB[params.slug];

  if (!post) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
        <p className="text-muted-foreground mb-8">The blog post you're looking for doesn't exist or has been removed.</p>
        <Link href="/blog" className={buttonVariants({ variant: "default" })}>
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src={post.image} 
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <Link 
              href="/blog" 
              className="inline-flex items-center text-white/80 hover:text-white mb-6 text-sm font-medium transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to all articles
            </Link>
            
            <div className="mb-4">
              <span className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">
                {post.category}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/80">
              <div className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
              <span>&bull;</span>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{post.date}</span>
              </div>
              <span>&bull;</span>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="max-w-3xl mx-auto">
          {/* Social Share (Top) */}
          <div className="flex items-center justify-between border-b pb-6 mb-8">
            <p className="text-muted-foreground font-medium">Share this article</p>
            <div className="flex gap-2">
              <ShareButton title={post.title} text={post.excerpt} />
            </div>
          </div>

          {/* Article Body */}
          <div 
            className="prose max-w-[680px] mx-auto mt-10 mb-20 prose-headings:font-sans prose-headings:font-extrabold prose-headings:tracking-tight prose-headings:text-foreground prose-a:text-primary hover:prose-a:text-primary/80 [&_p]:font-serif [&_p]:text-[#242424] dark:[&_p]:text-foreground/90 [&_p]:text-[20px] md:[&_p]:text-[21px] [&_p]:leading-[32px] [&_p]:mb-8 [&_p]:mt-0 [&_li]:font-serif [&_li]:text-[#242424] dark:[&_li]:text-foreground/90 [&_li]:text-[20px] md:[&_li]:text-[21px] [&_li]:leading-[32px] [&_li]:mb-4 [&_ul]:mb-8 [&_h2]:text-[28px] md:[&_h2]:text-[32px] [&_h2]:leading-[1.3] [&_h2]:mt-12 [&_h2]:mb-4 [&_h3]:text-[24px] md:[&_h3]:text-[26px] [&_h3]:leading-[1.3] [&_h3]:mt-10 [&_h3]:mb-4"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Footer CTA */}
          <div className="mt-16 p-8 bg-muted/50 rounded-2xl border text-center">
            <h3 className="text-2xl font-bold mb-3">Ready to explore Lombok?</h3>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Book your private transport with Lombok Transfer for a comfortable, safe, and unforgettable journey around the island.
            </p>
            <Link href="/" className={cn(buttonVariants({ size: "lg" }), "px-8")}>
              Book Transport Now
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
