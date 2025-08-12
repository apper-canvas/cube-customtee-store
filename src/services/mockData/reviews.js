const mockReviews = [
  {
    Id: 1,
    productId: 1,
    customerName: "Sarah Johnson",
    rating: 5,
    title: "Perfect quality and fit!",
    review: "I absolutely love this t-shirt! The fabric is so soft and comfortable, and the fit is exactly what I was looking for. The color stayed vibrant even after multiple washes. Highly recommend!",
    reviewDate: "2024-01-15T10:30:00Z",
    photos: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    ],
    helpfulVotes: { yes: 12, no: 1 },
    verified: true
  },
  {
    Id: 2,
    productId: 1,
    customerName: "Mike Chen",
    rating: 4,
    title: "Great shirt, runs a bit large",
    review: "The quality is excellent and the design possibilities are endless. Only reason for 4 stars is that it runs slightly larger than expected. I'd recommend sizing down if you want a fitted look.",
    reviewDate: "2024-01-12T14:20:00Z",
    photos: [],
    helpfulVotes: { yes: 8, no: 2 },
    verified: true
  },
  {
    Id: 3,
    productId: 1,
    customerName: "Emily Rodriguez",
    rating: 5,
    title: "Amazing for custom designs!",
    review: "Used this for my business custom prints and the results are phenomenal. The fabric holds the design beautifully and customers love the feel. Will definitely be ordering more!",
    reviewDate: "2024-01-10T09:45:00Z",
    photos: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    ],
    helpfulVotes: { yes: 15, no: 0 },
    verified: true
  },
  {
    Id: 4,
    productId: 2,
    customerName: "Alex Thompson",
    rating: 4,
    title: "Nice v-neck style",
    review: "Good quality v-neck tee. The neckline is flattering and the material is comfortable. Only wish there were more color options available.",
    reviewDate: "2024-01-08T16:15:00Z",
    photos: [],
    helpfulVotes: { yes: 6, no: 1 },
    verified: true
  },
  {
    Id: 5,
    productId: 2,
    customerName: "Jessica Park",
    rating: 5,
    title: "Perfect for layering",
    review: "This v-neck is perfect for layering or wearing alone. The cut is very flattering and the fabric quality exceeded my expectations. Love it!",
    reviewDate: "2024-01-05T11:30:00Z",
    photos: [
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    ],
    helpfulVotes: { yes: 9, no: 0 },
    verified: true
  },
  {
    Id: 6,
    productId: 3,
    customerName: "David Wilson",
    rating: 5,
    title: "Great for workouts",
    review: "Lightweight and breathable, exactly what I needed for my gym sessions. The fit is perfect and it doesn't restrict movement at all.",
    reviewDate: "2024-01-03T08:20:00Z",
    photos: [],
    helpfulVotes: { yes: 7, no: 0 },
    verified: true
  },
  {
    Id: 7,
    productId: 3,
    customerName: "Lisa Martinez",
    rating: 4,
    title: "Good tank, wish it was longer",
    review: "Nice quality tank top with good breathability. My only complaint is that I wish it was a bit longer for better coverage. Overall happy with the purchase.",
    reviewDate: "2024-01-01T13:45:00Z",
    photos: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    ],
    helpfulVotes: { yes: 5, no: 2 },
    verified: true
  },
  {
    Id: 8,
    productId: 4,
    customerName: "Robert Kim",
    rating: 5,
    title: "Perfect for cooler weather",
    review: "Excellent long sleeve tee for fall and winter. The material is warm but not too heavy, and the fit is comfortable. Great for custom printing too.",
    reviewDate: "2023-12-28T10:15:00Z",
    photos: [],
    helpfulVotes: { yes: 10, no: 1 },
    verified: true
  },
  {
    Id: 9,
    productId: 5,
    customerName: "Amanda Foster",
    rating: 5,
    title: "Love the vintage feel!",
    review: "This shirt has such a great vintage vibe! Super soft and comfortable, and the pre-washed feel is amazing. Perfect for that lived-in look I was going for.",
    reviewDate: "2023-12-25T15:30:00Z",
    photos: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    ],
    helpfulVotes: { yes: 11, no: 0 },
    verified: true
  },
  {
    Id: 10,
    productId: 6,
    customerName: "Taylor Brooks",
    rating: 4,
    title: "Soft and comfortable",
    review: "Really soft material and the pastel colors are beautiful. The v-neck cut is flattering. Only minor issue is that it's a bit delicate, so be careful with washing.",
    reviewDate: "2023-12-20T12:00:00Z",
    photos: [],
    helpfulVotes: { yes: 6, no: 3 },
    verified: true
  }
];

export default mockReviews;