// Mock customer names for social proof notifications
const mockCustomers = [
  "Sarah M.", "Mike K.", "Jessica R.", "David L.", "Emily C.", "Ryan P.", "Amanda S.", 
  "Chris B.", "Nicole T.", "Alex W.", "Samantha H.", "Kevin J.", "Rachel D.", "Tyler M.",
  "Ashley G.", "Brandon F.", "Megan L.", "Justin N.", "Lauren P.", "Zachary R.",
  "Kayla V.", "Trevor S.", "Brittany A.", "Jordan E.", "Madison C.", "Austin H.",
  "Taylor W.", "Cameron D.", "Morgan B.", "Hunter L.", "Alexis P.", "Cody R."
];

// Mock recent purchase data
const mockRecentPurchases = [
  { customerId: "Sarah M.", location: "New York", product: "Premium Cotton Crew", design: "Coffee First", timeAgo: 3 },
  { customerId: "Mike K.", location: "California", product: "Classic V-Neck", design: "Just Do It Today", timeAgo: 8 },
  { customerId: "Jessica R.", location: "Texas", product: "Vintage Crew Neck", design: "Pizza is Life", timeAgo: 12 },
  { customerId: "David L.", location: "Florida", product: "Athletic Tank Top", design: "Never Give Up", timeAgo: 18 },
  { customerId: "Emily C.", location: "Illinois", product: "Fitted V-Neck", design: "Work Hard Play Hard", timeAgo: 25 },
  { customerId: "Ryan P.", location: "Colorado", product: "Performance Tank", design: "I'm Not Arguing", timeAgo: 31 },
  { customerId: "Amanda S.", location: "Oregon", product: "Long Sleeve Essential", design: "Dream Big", timeAgo: 47 },
  { customerId: "Chris B.", location: "Washington", product: "Organic Cotton Crew", design: "Gaming Legend", timeAgo: 52 }
];

// Mock customer photos for gallery
const mockCustomerPhotos = [
  {
    id: 1,
    customerName: "Sarah M.",
    location: "Los Angeles, CA",
    image: "https://images.unsplash.com/photo-1494790108755-2616c63c8a9a?w=300&h=300&fit=crop&crop=face",
    productImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
    design: "Coffee First",
    testimonial: "Love the quality and the design turned out perfect! Will definitely order again.",
    rating: 5,
    orderDate: "2024-01-10"
  },
  {
    id: 2,
    customerName: "Mike K.",
    location: "Austin, TX",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    productImage: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=300&h=300&fit=crop",
    design: "Just Do It Today",
    testimonial: "Exactly what I was looking for. Great fit and the printing quality is amazing.",
    rating: 5,
    orderDate: "2024-01-08"
  },
  {
    id: 3,
    customerName: "Jessica R.",
    location: "Miami, FL",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
    productImage: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&h=300&fit=crop",
    design: "Pizza is Life",
    testimonial: "So comfortable and the design is hilarious! Got tons of compliments.",
    rating: 5,
    orderDate: "2024-01-06"
  },
  {
    id: 4,
    customerName: "David L.",
    location: "Seattle, WA",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
    productImage: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop",
    design: "Never Give Up",
    testimonial: "Perfect for my workouts. The material is breathable and the message is motivating.",
    rating: 4,
    orderDate: "2024-01-04"
  },
  {
    id: 5,
    customerName: "Emily C.",
    location: "Denver, CO",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face",
    productImage: "https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?w=300&h=300&fit=crop",
    design: "Dream Big",
    testimonial: "Beautiful colors and the fit is flattering. The design really pops!",
    rating: 5,
    orderDate: "2024-01-02"
  },
  {
    id: 6,
    customerName: "Ryan P.",
    location: "Portland, OR",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
    productImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop",
    design: "Gaming Legend",
    testimonial: "As a gamer, this shirt is perfect! Quality is top-notch and the design is awesome.",
    rating: 5,
    orderDate: "2023-12-28"
  }
];

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Generate realistic daily design counts based on product popularity
function generateDailyDesigns(productId) {
  const baseCount = Math.floor(Math.random() * 20) + 10; // 10-30 base
  const popularProducts = [1, 5, 10]; // Premium Cotton Crew, Vintage Crew Neck, Fitted V-Neck
  
  if (popularProducts.includes(productId)) {
    return baseCount + Math.floor(Math.random() * 30) + 20; // 30-80 for popular
  }
  
  return baseCount + Math.floor(Math.random() * 10); // 10-40 for regular
}

export const socialProofService = {
  // Get social proof data for a product
  getProductSocialProof(productId) {
    const dailyDesigns = generateDailyDesigns(productId);
    
    return {
      dailyDesigns,
      weeklyDesigns: dailyDesigns * 7 + Math.floor(Math.random() * 50),
      monthlyDesigns: dailyDesigns * 30 + Math.floor(Math.random() * 200),
      isTrending: dailyDesigns > 35,
      recentActivity: Math.floor(Math.random() * 60) + 5 // minutes ago
    };
  },

  // Get recent purchase notifications
  async getRecentPurchases() {
    await delay(100);
    
    // Simulate real-time by updating timestamps
    return mockRecentPurchases.map(purchase => ({
      ...purchase,
      timeAgo: purchase.timeAgo + Math.floor(Math.random() * 5) // Add some variance
    }));
  },

  // Get a random recent purchase for notification
  getRandomRecentPurchase() {
    const purchase = mockRecentPurchases[Math.floor(Math.random() * mockRecentPurchases.length)];
    return {
      ...purchase,
      timeAgo: Math.floor(Math.random() * 45) + 2 // 2-47 minutes ago
    };
  },

  // Get customer photo gallery
  async getCustomerPhotos() {
    await delay(150);
    return mockCustomerPhotos;
  },

  // Get trending designs
  getTrendingDesigns() {
    return [1, 4, 10, 13, 16]; // Template IDs that are trending
  },

  // Generate live activity data
  generateLiveActivity() {
    const activities = [
      "designing a custom shirt",
      "browsing templates",
      "adding items to cart",
      "completing an order",
      "sharing a design"
    ];
    
    return {
      action: activities[Math.floor(Math.random() * activities.length)],
      count: Math.floor(Math.random() * 15) + 5, // 5-20 people
      location: ["United States", "Canada", "United Kingdom", "Australia"][Math.floor(Math.random() * 4)]
    };
  }
};