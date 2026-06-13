import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowLeft, Calendar, User, Clock, Share2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Dummy content database
const BLOG_DB: Record<string, any> = {
  "10-best-beaches-in-south-lombok": {
    title: "10 Best Beaches in South Lombok",
    date: "June 10, 2026",
    author: "Lombok Transfer Editor",
    readTime: "8 min read",
    category: "Beaches",
    excerpt: "Discover the hidden gems of South Lombok, from the famous pink beach to the surfer's paradise of Selong Belanak.",
    image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1200&auto=format&fit=crop",
    content: `
      <p>South Lombok is renowned for having some of the most spectacular, pristine beaches in all of Southeast Asia. While many travelers flock to Bali, those seeking untouched white sands and crystal-clear turquoise waters find their paradise here. Let's dive into the top 10 beaches you absolutely cannot miss on your trip to South Lombok.</p>
      
      <h2>1. Selong Belanak Beach</h2>
      <p>Often hailed as one of the best beaches in Asia, Selong Belanak offers a massive crescent-shaped bay with powder-fine white sand. It's the ultimate spot for beginner surfers due to its gentle rolling waves. The surrounding green hills provide a picturesque backdrop that will leave you breathless.</p>
      
      <h2>2. Tanjung Aan</h2>
      <p>If you prefer calmer waters for swimming, Tanjung Aan is your go-to. Known for its unique pepper-like sand, this horseshoe-shaped bay is perfect for a relaxing day under the sun. Don't forget to hike up Merese Hill right next to it for a spectacular sunset view.</p>
      
      <h2>3. Mawun Beach</h2>
      <p>Tucked away in a secluded cove, Mawun Beach is incredibly photogenic. The steep hills on either side block the strong currents, making the middle section of the beach relatively calm for swimming. It's quieter than Selong Belanak, offering a peaceful retreat.</p>
      
      <h2>4. Pink Beach (Tangsi Beach)</h2>
      <p>Yes, the sand is actually pink! The unique color comes from crushed red coral mixing with the white sand. While it's a bit of a drive to reach the southeastern tip of Lombok, the otherworldly blush-colored shore and excellent snorkeling make the journey completely worthwhile.</p>
      
      <p><em>Renting a reliable car with a driver is highly recommended for exploring these hidden gems, as the roads can sometimes be challenging. Contact Lombok Transfer to arrange your beach-hopping itinerary today!</em></p>
    `
  },
  "ultimate-guide-to-mount-rinjani": {
    title: "Ultimate Guide to Mount Rinjani",
    date: "May 25, 2026",
    author: "Rinjani Expert",
    readTime: "12 min read",
    category: "Trekking",
    excerpt: "Everything you need to know before trekking Indonesia's second highest volcano. What to pack, when to go, and which route to choose.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop",
    content: `
      <p>Standing tall at 3,726 meters, Mount Rinjani is an active volcano that dominates the landscape of Lombok. Trekking to its summit or crater lake is a bucket-list experience for adventurers worldwide. However, it is a demanding trek that requires proper preparation. Here is your ultimate guide.</p>
      
      <h2>When to Go</h2>
      <p>The best time to climb Mount Rinjani is during the dry season, from April to November. The national park is usually closed from January to March due to heavy rainfall, which makes the trails slippery and dangerous.</p>
      
      <h2>Choosing Your Route</h2>
      <ul>
        <li><strong>Sembalun Route:</strong> The preferred route for summiting. It starts at a higher elevation in a savanna landscape. It's hot during the day but offers the most direct path to the crater rim and summit.</li>
        <li><strong>Senaru Route:</strong> Better for those who only want to trek to the crater rim. You'll hike through dense, shaded tropical forests, eventually arriving at a spectacular viewpoint of the crater lake.</li>
      </ul>
      
      <h2>What to Pack</h2>
      <p>Layers are crucial. While you'll sweat profusely during the daytime hike, temperatures at the summit can drop below freezing. Bring a good windbreaker, thermal base layers, a headlamp, and sturdy trekking shoes broken in beforehand.</p>
    `
  },
  "gili-islands-which-one-is-for-you": {
    title: "Gili Islands: Which One is For You?",
    date: "May 12, 2026",
    author: "Island Hopper",
    readTime: "6 min read",
    category: "Island Guide",
    excerpt: "Trawangan, Meno, or Air? We break down the vibe, activities, and best spots for each of the famous three Gilis.",
    image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?q=80&w=1200&auto=format&fit=crop",
    content: `
      <p>The Gili Islands—three tiny, picturesque specks of land floating just off the northwest coast of Lombok. With no cars or motorbikes allowed on any of them, they offer a true tropical escape. But which one should you choose?</p>
      
      <h2>Gili Trawangan (The Party Island)</h2>
      <p>Gili T is the largest, most developed, and most vibrant of the three. If you're looking for bustling nightlife, dive centers on every corner, night markets, and sunset beach clubs, this is your island. Despite its reputation, the northern part of the island remains surprisingly quiet and laid-back.</p>
      
      <h2>Gili Meno (The Honeymoon Island)</h2>
      <p>Nestled in the middle, Gili Meno is the smallest and quietest. It's the ultimate destination for couples and those seeking total tranquility. The beaches here are spectacular, and you have the best chance of swimming with sea turtles right off the shore. Don't miss the famous underwater statues!</p>
      
      <h2>Gili Air (The Chill Island)</h2>
      <p>Gili Air offers the perfect goldilocks balance. It has a great selection of restaurants and yoga studios, but maintains a more relaxed, bohemian vibe compared to Gili T. It's favored by backpackers, yogis, and families looking for a mix of relaxation and mild entertainment.</p>
    `
  }
};

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
              <button className="p-2 rounded-full bg-muted hover:bg-primary hover:text-white transition-colors">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Article Body */}
          <div 
            className="prose prose-lg prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary hover:prose-a:text-primary/80 max-w-none"
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
