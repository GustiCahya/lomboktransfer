export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  readTime: string;
  category: string;
  excerpt: string;
  image: string;
  content: string;
}

export const BLOG_DB: Record<string, BlogPost> = {
  "10-best-beaches-in-south-lombok": {
    slug: "10-best-beaches-in-south-lombok",
    title: "10 Best Beaches in South Lombok",
    date: "June 10, 2026",
    author: "Lombok Transfer Editor",
    readTime: "8 min read",
    category: "Beaches",
    excerpt: "Discover the hidden gems of South Lombok, from the famous pink beach to the surfer's paradise of Selong Belanak.",
    image: "https://images.unsplash.com/photo-1658642017201-45bb87756f1b?q=80&w=1281&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
    slug: "ultimate-guide-to-mount-rinjani",
    title: "Ultimate Guide to Mount Rinjani",
    date: "May 25, 2026",
    author: "Rinjani Expert",
    readTime: "12 min read",
    category: "Trekking",
    excerpt: "Everything you need to know before trekking Indonesia's second highest volcano. What to pack, when to go, and which route to choose.",
    image: "https://4.bp.blogspot.com/-soPBQYZTG6Q/Tb5rSE5TdVI/AAAAAAAABdI/ZpffadQRr0g/s1600/gunung-rinjani.jpg",
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
    slug: "gili-islands-which-one-is-for-you",
    title: "Gili Islands: Which One is For You?",
    date: "May 12, 2026",
    author: "Island Hopper",
    readTime: "6 min read",
    category: "Island Guide",
    excerpt: "Trawangan, Meno, or Air? We break down the vibe, activities, and best spots for each of the famous three Gilis.",
    image: "https://images.unsplash.com/photo-1619681216575-d6b3964fc278?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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

export const BLOGS_LIST = Object.values(BLOG_DB);
