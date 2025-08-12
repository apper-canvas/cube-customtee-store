import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import productsData from "@/services/mockData/products.json";
import filtersData from "@/services/mockData/filters.json";

// Mock template data
const mockTemplates = [
  {
    Id: 1,
    name: "Just Do It Today",
    category: "Popular",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    likes: 1247,
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
      <div>
        <h3 className="font-semibold text-gray-900 text-lg line-clamp-1">{template.name}</h3>
        <div className="flex items-center space-x-2 text-sm text-secondary">
          <ApperIcon name="Heart" size={14} />
          <span>{template.likes.toLocaleString()}</span>
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

const DesignGallery = () => {
  const [activeCategory, setActiveCategory] = useState("Popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [likedTemplates, setLikedTemplates] = useState(new Set());

  const handleLike = useCallback((templateId) => {
    setLikedTemplates(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(templateId)) {
        newLiked.delete(templateId);
      } else {
        newLiked.add(templateId);
      }
      return newLiked;
    });
  }, []);

const navigate = useNavigate();

  const handleCustomize = useCallback((template) => {
    const templateData = encodeURIComponent(JSON.stringify(template));
    navigate(`/studio?template=${templateData}`);
  }, [navigate]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  // Filter templates based on category and search
  const filteredTemplates = mockTemplates.filter(template => {
    const matchesCategory = activeCategory === "Popular" || template.category === activeCategory;
    const matchesSearch = !searchQuery || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gradient mb-4">Design Gallery</h1>
        <p className="text-xl text-secondary max-w-2xl mx-auto">
          Browse thousands of pre-made templates ready to customize for your perfect design.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <SearchBar
          placeholder="Search templates by name or keyword..."
          onSearch={handleSearch}
          suggestions={[]}
        />
      </div>

      {/* Category Tabs */}
      <div className="mb-8">
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                activeCategory === category
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-secondary">
          {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
          {searchQuery && ` for "${searchQuery}"`}
          {activeCategory !== "Popular" && ` in ${activeCategory}`}
        </p>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.Id}
            template={template}
            onCustomize={handleCustomize}
            onLike={handleLike}
            isLiked={likedTemplates.has(template.Id)}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <ApperIcon name="Search" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
          <p className="text-secondary mb-6">
            Try adjusting your search or browse a different category.
          </p>
          <Button
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("Popular");
            }}
            variant="outline"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default DesignGallery;