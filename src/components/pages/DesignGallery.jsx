import React, { useCallback, useEffect, useState } from "react";
import { customerDesignsService } from "@/services/api/customerDesignsService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import productsData from "@/services/mockData/products.json";
import filtersData from "@/services/mockData/filters.json";

function DesignGallery() {
  const [featuredDesigns, setFeaturedDesigns] = useState([]);
  const [allDesigns, setAllDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('featured');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadDesigns();
  }, []);

  const loadDesigns = async () => {
    setLoading(true);
    setError('');
    try {
      const [featured, all] = await Promise.all([
        customerDesignsService.getFeaturedDesigns(),
        customerDesignsService.getAllCustomerDesigns()
      ]);
      setFeaturedDesigns(featured);
      setAllDesigns(all);
    } catch (err) {
      setError('Failed to load customer designs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecreateDesign = async (design) => {
    try {
      await customerDesignsService.incrementRecreations(design.Id);
      toast.success(`Recreating "${design.designTitle}" design!`);
      navigate('/studio', { 
        state: { 
          inspiration: design,
          recreateMode: true 
        }
      });
    } catch (err) {
      toast.error("Failed to load design inspiration");
    }
  };

  const handleShareDesign = async (design) => {
    try {
      await customerDesignsService.incrementShares(design.Id);
      if (navigator.share) {
        await navigator.share({
          title: `Check out "${design.designTitle}" by ${design.customerName}`,
          text: design.description,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Design link copied to clipboard!');
      }
    } catch (err) {
      toast.error("Failed to share design");
    }
  };

  const filteredDesigns = activeTab === 'featured' ? featuredDesigns : allDesigns;
  const categories = ['all', 'gaming', 'nature', 'coffee', 'adventure', 'ocean'];

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDesigns} />;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
            Customer Design Showcase
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get inspired by amazing designs created by our community. Every design tells a story.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl p-1 shadow-sm border border-gray-200">
            <Button
              onClick={() => setActiveTab('featured')}
              variant={activeTab === 'featured' ? 'default' : 'outline'}
              className={`px-6 py-2 ${activeTab === 'featured' 
                ? 'bg-primary text-white shadow-sm' 
                : 'bg-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <ApperIcon name="Star" size={16} className="mr-2" />
              Featured Designs
            </Button>
            <Button
              onClick={() => setActiveTab('gallery')}
              variant={activeTab === 'gallery' ? 'default' : 'outline'}
              className={`px-6 py-2 ml-2 ${activeTab === 'gallery' 
                ? 'bg-primary text-white shadow-sm' 
                : 'bg-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <ApperIcon name="Grid3X3" size={16} className="mr-2" />
              All Designs
            </Button>
          </div>
        </div>

        {/* Featured Spotlight */}
        {activeTab === 'featured' && featuredDesigns.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">Design Spotlight</h2>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 border border-blue-100">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src={featuredDesigns[0].image}
                    alt={featuredDesigns[0].designTitle}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center mb-4">
                    <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium mr-3">
                      ⭐ Featured Design
                    </div>
                    <div className="flex items-center text-gray-600">
                      <ApperIcon name="Heart" size={16} className="mr-1 text-red-500" />
                      {featuredDesigns[0].likes} likes
                    </div>
                  </div>
                  <h3 className="text-3xl font-display font-bold text-gray-900 mb-3">
                    {featuredDesigns[0].designTitle}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Created by <span className="font-semibold">{featuredDesigns[0].customerName}</span> from {featuredDesigns[0].customerLocation}
                  </p>
                  <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                    {featuredDesigns[0].description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {featuredDesigns[0].tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white text-gray-700 rounded-full text-sm border border-gray-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleRecreateDesign(featuredDesigns[0])}
                      className="bg-primary hover:bg-blue-700 text-white px-6 py-3"
                    >
                      <ApperIcon name="Copy" size={16} className="mr-2" />
                      Recreate This Design
                    </Button>
                    <Button
                      onClick={() => handleShareDesign(featuredDesigns[0])}
                      variant="outline"
                      className="px-6 py-3"
                    >
                      <ApperIcon name="Share2" size={16} className="mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Design Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">
            {activeTab === 'featured' ? 'More Featured Designs' : 'Customer Gallery'}
          </h2>
          
          {filteredDesigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {(activeTab === 'featured' ? featuredDesigns.slice(1) : filteredDesigns).map((design) => (
                <div
                  key={design.Id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
                >
                  <div className="aspect-square bg-gray-100 overflow-hidden relative">
                    <img
                      src={design.image}
                      alt={design.designTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute top-3 right-3">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center text-sm font-medium text-gray-700">
                        <ApperIcon name="Heart" size={14} className="mr-1 text-red-500" />
                        {design.likes}
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                          {design.designTitle}
                        </h3>
                        <p className="text-sm text-gray-500">
                          by {design.customerName}
                        </p>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <ApperIcon name="Star" size={14} className="mr-1 text-yellow-400" />
                        {design.popularity}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {design.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {design.tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleRecreateDesign(design)}
                        className="flex-1 bg-primary hover:bg-blue-700 text-white text-sm"
                      >
                        <ApperIcon name="Copy" size={14} className="mr-1" />
                        Recreate
                      </Button>
                      <Button
                        onClick={() => handleShareDesign(design)}
                        variant="outline"
                        className="px-3 py-2"
                      >
                        <ApperIcon name="Share2" size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Empty 
              message="No designs found" 
              description="Check back later for more customer creations!"
            />
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 p-8 bg-gradient-to-br from-primary/5 to-purple-50 rounded-3xl border border-blue-100">
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
            Create Your Own Design
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Ready to join our community of creators? Start designing your custom apparel today and share your creativity with others.
          </p>
          <Button
            onClick={() => navigate('/studio')}
            className="bg-primary hover:bg-blue-700 text-white px-8 py-3"
          >
            <ApperIcon name="Palette" size={16} className="mr-2" />
            Start Creating
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DesignGallery;

// Helper functions for social sharing (used by OrderConfirmation)
function shareOnFacebook() {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent("Check out my custom design from CustomTee Store!");
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank', 'width=600,height=400');
}

function shareOnTwitter() {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent("Just created an amazing custom design! 🎨 #CustomTee #Design");
  window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'width=600,height=400');
}

function shareOnInstagram() {
  toast.info("Share your design photo on Instagram and tag us @customtee!");
}

async function copyShareLink() {
  try {
    await navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  } catch (err) {
    toast.error('Failed to copy link');
  }
}

// Mock template data
const mockTemplates = [
  {
    Id: 1,
    name: "Just Do It Today",
    category: "Popular",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    likes: 1247,
    isTrending: true,
    weeklyGrowth: 23,
    tags: ["motivation", "sports", "nike"],
    designElements: [
      {
        id: 1,
        type: "text",
        content: "JUST DO IT",
        x: 150,
        y: 120,
        fontSize: 32,
        fontFamily: "Arial Black",
        color: "#FFFFFF",
        fontWeight: "bold"
      },
      {
        id: 2,
        type: "text",
        content: "TODAY",
        x: 190,
        y: 180,
        fontSize: 24,
        fontFamily: "Arial",
        color: "#F59E0B",
        fontWeight: "normal"
      }
    ]
  },
  {
    Id: 2,
    name: "Coffee First",
    category: "Popular",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop",
    likes: 892,
    isTrending: false,
    weeklyGrowth: 8,
    tags: ["coffee", "morning", "funny"],
    designElements: [
      {
        id: 1,
        type: "text",
        content: "But First,",
        x: 140,
        y: 100,
        fontSize: 20,
        fontFamily: "Georgia",
        color: "#8B4513",
        fontWeight: "normal"
      },
      {
        id: 2,
        type: "text",
        content: "COFFEE",
        x: 120,
        y: 140,
        fontSize: 36,
        fontFamily: "Impact",
        color: "#2D1B16",
        fontWeight: "bold"
      }
    ]
  },
  {
    Id: 3,
    name: "World Cup Winner",
    category: "Sports",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    likes: 634,
    isTrending: false,
    weeklyGrowth: 12,
    tags: ["soccer", "football", "championship"],
    designElements: [
      {
        id: 1,
        type: "text",
        content: "WORLD CUP",
        x: 110,
        y: 100,
        fontSize: 28,
        fontFamily: "Arial Black",
        color: "#FFD700",
        fontWeight: "bold"
      },
      {
        id: 2,
        type: "text",
        content: "CHAMPION",
        x: 120,
        y: 140,
        fontSize: 24,
        fontFamily: "Arial",
        color: "#FFFFFF",
        fontWeight: "bold"
      },
      {
        id: 3,
        type: "text",
        content: "⚽",
        x: 200,
        y: 180,
        fontSize: 40,
        fontFamily: "Arial",
        color: "#000000",
        fontWeight: "normal"
      }
    ]
  },
  {
    Id: 4,
    name: "I'm Not Arguing",
    category: "Funny",
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop",
    likes: 1156,
    isTrending: true,
    weeklyGrowth: 31,
    tags: ["humor", "sarcasm", "funny"],
    designElements: [
      {
        id: 1,
        type: "text",
        content: "I'm Not Arguing",
        x: 100,
        y: 110,
        fontSize: 22,
        fontFamily: "Arial",
        color: "#333333",
        fontWeight: "normal"
      },
      {
        id: 2,
        type: "text",
        content: "I'm Just Explaining",
        x: 80,
        y: 140,
        fontSize: 20,
        fontFamily: "Arial",
        color: "#666666",
        fontWeight: "normal"
      },
      {
        id: 3,
        type: "text",
        content: "Why I'm Right",
        x: 120,
        y: 170,
        fontSize: 24,
        fontFamily: "Arial Black",
        color: "#2563EB",
        fontWeight: "bold"
      }
    ]
  },
  {
    Id: 5,
    name: "CEO of My Life",
    category: "Business",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    likes: 543,
    isTrending: false,
    weeklyGrowth: 5,
    tags: ["business", "entrepreneur", "success"],
    designElements: [
      {
        id: 1,
        type: "text",
        content: "CEO",
        x: 180,
        y: 110,
        fontSize: 40,
        fontFamily: "Times New Roman",
        color: "#1F2937",
        fontWeight: "bold"
      },
      {
        id: 2,
        type: "text",
        content: "of My Life",
        x: 140,
        y: 160,
        fontSize: 18,
        fontFamily: "Arial",
        color: "#6B7280",
        fontWeight: "normal"
      }
    ]
  },
  {
    Id: 6,
    name: "Dream Big",
    category: "Quotes",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
    likes: 778,
    isTrending: false,
    weeklyGrowth: 15,
    tags: ["inspiration", "dreams", "motivation"],
    designElements: [
      {
        id: 1,
        type: "text",
        content: "DREAM",
        x: 160,
        y: 120,
        fontSize: 36,
        fontFamily: "Impact",
        color: "#8B5CF6",
        fontWeight: "bold"
      },
      {
        id: 2,
        type: "text",
        content: "BIG",
        x: 190,
        y: 160,
        fontSize: 32,
        fontFamily: "Impact",
        color: "#F59E0B",
        fontWeight: "bold"
      }
    ]
  },
  {
    Id: 7,
    name: "Geometric Abstract",
    category: "Graphics",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    likes: 445,
    isTrending: false,
    weeklyGrowth: 7,
    tags: ["abstract", "geometric", "modern"],
    designElements: [
      {
        id: 1,
        type: "text",
        content: "▲",
        x: 150,
        y: 100,
        fontSize: 48,
        fontFamily: "Arial",
        color: "#2563EB",
        fontWeight: "normal"
      },
      {
        id: 2,
        type: "text",
        content: "●",
        x: 180,
        y: 140,
        fontSize: 32,
        fontFamily: "Arial",
        color: "#F59E0B",
        fontWeight: "normal"
      },
      {
        id: 3,
        type: "text",
        content: "■",
        x: 210,
        y: 180,
        fontSize: 24,
        fontFamily: "Arial",
        color: "#10B981",
        fontWeight: "normal"
      }
    ]
  },
  {
    Id: 8,
    name: "Halloween Vibes",
    category: "Seasonal",
    image: "https://images.unsplash.com/photo-1509557965043-6e4b7e6b6b7b?w=400&h=400&fit=crop",
    likes: 321,
    isTrending: false,
    weeklyGrowth: 3,
    tags: ["halloween", "spooky", "october"],
    designElements: [
      {
        id: 1,
        type: "text",
        content: "SPOOKY",
        x: 140,
        y: 110,
        fontSize: 28,
        fontFamily: "Creepster",
        color: "#FF4500",
        fontWeight: "bold"
      },
      {
        id: 2,
        type: "text",
        content: "VIBES",
        x: 160,
        y: 150,
        fontSize: 24,
        fontFamily: "Creepster",
        color: "#800080",
        fontWeight: "bold"
      },
      {
        id: 3,
        type: "text",
        content: "🎃",
        x: 200,
        y: 190,
        fontSize: 32,
        fontFamily: "Arial",
        color: "#000000",
        fontWeight: "normal"
      }
    ]
  },
  {
    Id: 9,
    name: "Basketball Legend",
    category: "Sports",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=400&fit=crop",
    likes: 567,
    isTrending: false,
    weeklyGrowth: 9,
    tags: ["basketball", "sports", "legend"],
    designElements: [
      {
        id: 1,
        type: "text",
        content: "LEGEND",
        x: 130,
        y: 120,
        fontSize: 32,
        fontFamily: "Arial Black",
        color: "#FF6B35",
        fontWeight: "bold"
      },
      {
        id: 2,
        type: "text",
        content: "🏀",
        x: 200,
        y: 160,
        fontSize: 36,
        fontFamily: "Arial",
        color: "#000000",
        fontWeight: "normal"
      }
    ]
  },
  {
    Id: 10,
    name: "Pizza is Life",
    category: "Funny",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop",
    likes: 923,
    isTrending: true,
    weeklyGrowth: 27,
    tags: ["pizza", "food", "funny"],
    designElements: [
      {
        id: 1,
        type: "text",
        content: "PIZZA",
        x: 160,
        y: 110,
        fontSize: 28,
        fontFamily: "Comic Sans MS",
        color: "#DC2626",
        fontWeight: "bold"
      },
      {
        id: 2,
        type: "text",
        content: "IS LIFE",
        x: 140,
        y: 150,
        fontSize: 22,
        fontFamily: "Comic Sans MS",
        color: "#059669",
        fontWeight: "bold"
      },
      {
        id: 3,
        type: "text",
        content: "🍕",
        x: 200,
        y: 190,
        fontSize: 32,
        fontFamily: "Arial",
        color: "#000000",
        fontWeight: "normal"
      }
    ]
  },
  {
    Id: 11,
    name: "Success Mindset",
    category: "Business",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=400&fit=crop",
    likes: 412,
    isTrending: false,
    weeklyGrowth: 4,
    tags: ["success", "mindset", "business"],
    designElements: [
      {
        id: 1,
        type: "text",
        content: "SUCCESS",
        x: 130,
        y: 110,
        fontSize: 26,
        fontFamily: "Times New Roman",
        color: "#1F2937",
        fontWeight: "bold"
      },
      {
        id: 2,
        type: "text",
        content: "MINDSET",
        x: 120,
        y: 150,
        fontSize: 24,
        fontFamily: "Times New Roman",
        color: "#374151",
        fontWeight: "bold"
      }
    ]
  },
  {
    Id: 12,
    name: "Be Kind Always",
    category: "Quotes",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop",
    likes: 689,
    isTrending: false,
    weeklyGrowth: 11,
    tags: ["kindness", "positive", "quotes"],
    designElements: [
      {
        id: 1,
        type: "text",
        content: "Be Kind",
        x: 150,
        y: 120,
        fontSize: 28,
        fontFamily: "Georgia",
        color: "#059669",
        fontWeight: "normal"
      },
      {
        id: 2,
        type: "text",
        content: "Always",
        x: 160,
        y: 160,
        fontSize: 24,
        fontFamily: "Georgia",
        color: "#10B981",
        fontWeight: "italic"
      },
      {
        id: 3,
        type: "text",
        content: "💚",
        x: 200,
        y: 190,
        fontSize: 24,
        fontFamily: "Arial",
        color: "#000000",
        fontWeight: "normal"
      }
    ]
  },
  {
    Id: 13,
    name: "Work Hard Play Hard",
    category: "Popular",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=400&fit=crop",
    likes: 1089,
    isTrending: true,
    weeklyGrowth: 19,
    tags: ["motivation", "work", "balance"],
    designElements: [
      {
        id: 1,
        type: "text",
        content: "WORK HARD",
        x: 110,
        y: 110,
        fontSize: 24,
        fontFamily: "Arial Black",
        color: "#1F2937",
        fontWeight: "bold"
      },
      {
        id: 2,
        type: "text",
        content: "PLAY HARD",
        x: 110,
        y: 150,
        fontSize: 24,
        fontFamily: "Arial Black",
        color: "#2563EB",
        fontWeight: "bold"
      }
    ]
  },
  {
    Id: 14,
    name: "Corporate Excellence",
    category: "Business",
    image: "https://images.unsplash.com/photo-1486312338219-ce68e2c6b013?w=400&h=400&fit=crop",
    likes: 234,
    isTrending: false,
    weeklyGrowth: 2,
    tags: ["corporate", "professional", "excellence"],
    designElements: [
      {
        id: 1,
        type: "text",
        content: "EXCELLENCE",
        x: 100,
        y: 130,
        fontSize: 22,
        fontFamily: "Times New Roman",
        color: "#1F2937",
        fontWeight: "bold"
      },
      {
        id: 2,
        type: "text",
        content: "IS NOT A SKILL",
        x: 80,
        y: 160,
        fontSize: 14,
        fontFamily: "Arial",
        color: "#6B7280",
        fontWeight: "normal"
      },
      {
        id: 3,
        type: "text",
        content: "IT'S AN ATTITUDE",
        x: 70,
        y: 180,
        fontSize: 16,
        fontFamily: "Arial",
        color: "#374151",
        fontWeight: "bold"
      }
    ]
  },
  {
    Id: 15,
    name: "Weekend Warrior",
    category: "Funny",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
    likes: 756,
    isTrending: false,
    weeklyGrowth: 14,
    tags: ["weekend", "warrior", "funny"],
    designElements: [
      {
        id: 1,
        type: "text",
        content: "WEEKEND",
        x: 120,
        y: 110,
        fontSize: 26,
        fontFamily: "Arial Black",
        color: "#7C3AED",
        fontWeight: "bold"
      },
      {
        id: 2,
        type: "text",
        content: "WARRIOR",
        x: 130,
        y: 150,
        fontSize: 24,
        fontFamily: "Arial Black",
        color: "#F59E0B",
        fontWeight: "bold"
      },
      {
        id: 3,
        type: "text",
        content: "⚔️",
        x: 200,
        y: 190,
        fontSize: 28,
        fontFamily: "Arial",
        color: "#000000",
        fontWeight: "normal"
      }
    ]
  },
  {
    Id: 16,
    name: "Never Give Up",
    category: "Quotes",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=400&fit=crop",
    likes: 1234,
    isTrending: true,
    weeklyGrowth: 25,
    tags: ["motivation", "perseverance", "never give up"],
    designElements: [
      {
        id: 1,
        type: "text",
        content: "NEVER",
        x: 160,
        y: 110,
        fontSize: 28,
        fontFamily: "Impact",
        color: "#DC2626",
        fontWeight: "bold"
      },
      {
        id: 2,
        type: "text",
        content: "GIVE UP",
        x: 130,
        y: 150,
        fontSize: 26,
        fontFamily: "Impact",
        color: "#1F2937",
        fontWeight: "bold"
      }
    ]
  },
  {
    Id: 17,
    name: "Tech Startup Vibes",
    category: "Business",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=400&fit=crop",
    likes: 445,
    isTrending: false,
    weeklyGrowth: 6,
    tags: ["tech", "startup", "innovation"],
    designElements: [
      {
        id: 1,
        type: "text",
        content: "INNOVATE",
        x: 130,
        y: 110,
        fontSize: 24,
        fontFamily: "Arial",
        color: "#2563EB",
        fontWeight: "bold"
      },
      {
        id: 2,
        type: "text",
        content: "DISRUPT",
        x: 140,
        y: 140,
        fontSize: 22,
        fontFamily: "Arial",
        color: "#7C3AED",
        fontWeight: "bold"
      },
      {
        id: 3,
        type: "text",
        content: "SCALE",
        x: 170,
        y: 170,
        fontSize: 20,
        fontFamily: "Arial",
        color: "#059669",
        fontWeight: "bold"
      }
    ]
  },
  {
    Id: 18,
    name: "Christmas Joy",
    category: "Seasonal",
    image: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400&h=400&fit=crop",
    likes: 567,
    isTrending: false,
    weeklyGrowth: 10,
    tags: ["christmas", "holiday", "joy"],
    designElements: [
      {
        id: 1,
        type: "text",
        content: "JOY TO THE",
        x: 120,
        y: 110,
        fontSize: 20,
        fontFamily: "Georgia",
        color: "#DC2626",
        fontWeight: "bold"
      },
      {
        id: 2,
        type: "text",
        content: "WORLD",
        x: 160,
        y: 140,
        fontSize: 28,
        fontFamily: "Georgia",
        color: "#059669",
        fontWeight: "bold"
      },
      {
        id: 3,
        type: "text",
        content: "🎄",
        x: 200,
        y: 170,
        fontSize: 32,
        fontFamily: "Arial",
        color: "#000000",
        fontWeight: "normal"
      }
    ]
  },
  {
    Id: 19,
    name: "Gaming Legend",
    category: "Graphics",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=400&fit=crop",
    likes: 823,
    isTrending: false,
    weeklyGrowth: 16,
    tags: ["gaming", "legend", "esports"],
    designElements: [
      {
        id: 1,
        type: "text",
        content: "GAMING",
        x: 140,
        y: 110,
        fontSize: 28,
        fontFamily: "Arial Black",
        color: "#8B5CF6",
        fontWeight: "bold"
      },
      {
        id: 2,
        type: "text",
        content: "LEGEND",
        x: 130,
        y: 150,
        fontSize: 26,
        fontFamily: "Arial Black",
        color: "#F59E0B",
        fontWeight: "bold"
      },
      {
        id: 3,
        type: "text",
        content: "🎮",
        x: 200,
        y: 190,
        fontSize: 32,
        fontFamily: "Arial",
        color: "#000000",
        fontWeight: "normal"
      }
    ]
  },
  {
    Id: 20,
    name: "Dog Mom Life",
    category: "Funny",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=400&fit=crop",
    likes: 945,
    isTrending: false,
    weeklyGrowth: 18,
    tags: ["dog", "mom", "pet"],
    designElements: [
      {
        id: 1,
        type: "text",
        content: "DOG MOM",
        x: 130,
        y: 110,
        fontSize: 26,
        fontFamily: "Comic Sans MS",
        color: "#8B5CF6",
        fontWeight: "bold"
      },
      {
        id: 2,
        type: "text",
        content: "LIFE",
        x: 170,
        y: 150,
        fontSize: 24,
        fontFamily: "Comic Sans MS",
        color: "#F59E0B",
        fontWeight: "bold"
      },
      {
        id: 3,
        type: "text",
        content: "🐕",
        x: 200,
        y: 190,
        fontSize: 32,
        fontFamily: "Arial",
        color: "#000000",
        fontWeight: "normal"
      }
    ]
  }
];

const categories = ["Popular", "Funny", "Sports", "Business", "Quotes", "Graphics", "Seasonal"];

const TemplateCard = ({ template, onCustomize, onLike, isLiked }) => (
  <div className="bg-white rounded-xl shadow-sm card-hover overflow-hidden group">
    <div className="aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 relative">
      <img
        src={template.image}
        alt={template.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute top-3 right-3">
        <button
          onClick={() => onLike(template.Id)}
          className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
            isLiked ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-600 hover:text-red-500'
          }`}
        >
          <ApperIcon name="Heart" size={16} className={isLiked ? 'fill-current' : ''} />
        </button>
      </div>
    </div>
<div className="p-4 space-y-3">
      <div className="relative">
        {template.isTrending && (
          <div className="absolute -top-2 -right-2 z-10">
            <div className="flex items-center space-x-1 bg-gradient-to-r from-orange-400 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
              <ApperIcon name="TrendingUp" size={12} />
              <span>TRENDING</span>
            </div>
          </div>
        )}
        <h3 className="font-semibold text-gray-900 text-lg line-clamp-1">{template.name}</h3>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-secondary">
            <ApperIcon name="Heart" size={14} />
            <span className="font-medium">{template.likes.toLocaleString()}</span>
          </div>
          {template.weeklyGrowth > 15 && (
            <div className="flex items-center space-x-1 text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <ApperIcon name="ArrowUp" size={10} />
              <span className="text-xs font-medium">+{template.weeklyGrowth}% this week</span>
            </div>
          )}
        </div>
      </div>
      
      <Button
        onClick={() => onCustomize(template)}
        className="w-full"
        size="sm"
      >
        Customize This
      </Button>
    </div>
  </div>
);

// Export helper functions for use in other components
export { shareOnFacebook, shareOnTwitter, shareOnInstagram, copyShareLink, mockTemplates };