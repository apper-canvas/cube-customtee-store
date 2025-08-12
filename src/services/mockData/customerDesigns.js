const mockCustomerDesigns = [
  {
    Id: 1,
    customerName: "Sarah M.",
    customerLocation: "Portland, OR",
    designTitle: "Sunset Vibes Collection",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    description: "Created this dreamy sunset design for my summer vacation tees. The gradient effect turned out amazing!",
    tags: ["Sunset", "Gradient", "Summer", "Vacation"],
    featured: true,
    popularity: 4.8,
    likes: 156,
    shares: 24,
    recreations: 18,
    createdAt: "2024-01-15",
    productUsed: "Premium Cotton T-Shirt",
    designComplexity: "Intermediate",
    colorScheme: "Warm Sunset",
    permissionGranted: true,
    socialMedia: {
      instagram: "@sarahdesigns",
      allowTag: true
    }
  },
  {
    Id: 2,
    customerName: "Mike T.",
    customerLocation: "Austin, TX",
    designTitle: "Retro Gaming Squad",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop",
    description: "Designed matching gaming tees for my crew. The pixel art style came out perfect!",
    tags: ["Gaming", "Retro", "Pixel Art", "Squad"],
    featured: true,
    popularity: 4.6,
    likes: 203,
    shares: 31,
    recreations: 45,
    createdAt: "2024-01-12",
    productUsed: "Unisex Hoodies",
    designComplexity: "Advanced",
    colorScheme: "Neon Bright",
    permissionGranted: true,
    socialMedia: {
      twitter: "@miketgamer",
      allowTag: true
    }
  },
  {
    Id: 3,
    customerName: "Emma L.",
    customerLocation: "Nashville, TN",
    designTitle: "Botanical Bliss",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop",
    description: "Nature-inspired design perfect for my yoga studio's merchandise. Clean and calming vibes.",
    tags: ["Nature", "Botanical", "Yoga", "Minimalist"],
    featured: false,
    popularity: 4.7,
    likes: 89,
    shares: 15,
    recreations: 12,
    createdAt: "2024-01-10",
    productUsed: "Organic Cotton Tank",
    designComplexity: "Beginner",
    colorScheme: "Earth Tones",
    permissionGranted: true,
    socialMedia: {
      instagram: "@emmalyoga",
      allowTag: true
    }
  },
  {
    Id: 4,
    customerName: "Alex R.",
    customerLocation: "Seattle, WA",
    designTitle: "Coffee Culture Co.",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop",
    description: "Created this for my local coffee shop. The hand-lettered style really captures our vibe!",
    tags: ["Coffee", "Typography", "Local Business", "Hand Lettered"],
    featured: true,
    popularity: 4.5,
    likes: 134,
    shares: 28,
    recreations: 22,
    createdAt: "2024-01-08",
    productUsed: "Premium T-Shirt",
    designComplexity: "Intermediate",
    colorScheme: "Coffee Browns",
    permissionGranted: true,
    socialMedia: {
      instagram: "@seattlecoffeeco",
      allowTag: true
    }
  },
  {
    Id: 5,
    customerName: "Jordan K.",
    customerLocation: "Denver, CO",
    designTitle: "Mountain Adventure",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
    description: "Designed this for our hiking group's annual trip to Colorado. The mountain silhouette is iconic!",
    tags: ["Mountains", "Adventure", "Hiking", "Colorado"],
    featured: false,
    popularity: 4.4,
    likes: 112,
    shares: 19,
    recreations: 16,
    createdAt: "2024-01-05",
    productUsed: "Performance Long Sleeve",
    designComplexity: "Intermediate",
    colorScheme: "Mountain Blues",
    permissionGranted: true,
    socialMedia: {
      instagram: "@jordanadventures",
      allowTag: true
    }
  },
  {
    Id: 6,
    customerName: "Taylor W.",
    customerLocation: "Miami, FL",
    designTitle: "Ocean Waves",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    description: "Tropical vibes for our beach volleyball team. The wave pattern flows beautifully on the fabric!",
    tags: ["Ocean", "Waves", "Beach", "Tropical"],
    featured: false,
    popularity: 4.3,
    likes: 78,
    shares: 12,
    recreations: 9,
    createdAt: "2024-01-03",
    productUsed: "Beach Tank Top",
    designComplexity: "Beginner",
    colorScheme: "Ocean Blues",
    permissionGranted: true,
    socialMedia: {
      instagram: "@taylorwaves",
      allowTag: true
    }
  }
];

export default mockCustomerDesigns;