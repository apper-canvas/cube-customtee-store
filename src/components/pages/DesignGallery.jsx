import React, { useCallback, useState } from "react";
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
    tags: ["motivation", "sports", "nike"]
  },
  {
    Id: 2,
    name: "Coffee First",
    category: "Popular",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop",
    likes: 892,
    tags: ["coffee", "morning", "funny"]
  },
  {
    Id: 3,
    name: "World Cup Winner",
    category: "Sports",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    likes: 634,
    tags: ["soccer", "football", "championship"]
  },
  {
    Id: 4,
    name: "I'm Not Arguing",
    category: "Funny",
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop",
    likes: 1156,
    tags: ["humor", "sarcasm", "funny"]
  },
  {
    Id: 5,
    name: "CEO of My Life",
    category: "Business",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    likes: 543,
    tags: ["business", "entrepreneur", "success"]
  },
  {
    Id: 6,
    name: "Dream Big",
    category: "Quotes",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
    likes: 778,
    tags: ["inspiration", "dreams", "motivation"]
  },
  {
    Id: 7,
    name: "Geometric Abstract",
    category: "Graphics",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    likes: 445,
    tags: ["abstract", "geometric", "modern"]
  },
  {
    Id: 8,
    name: "Halloween Vibes",
    category: "Seasonal",
    image: "https://images.unsplash.com/photo-1509557965043-6e4b7e6b6b7b?w=400&h=400&fit=crop",
    likes: 321,
    tags: ["halloween", "spooky", "october"]
  },
  {
    Id: 9,
    name: "Basketball Legend",
    category: "Sports",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=400&fit=crop",
    likes: 567,
    tags: ["basketball", "sports", "legend"]
  },
  {
    Id: 10,
    name: "Pizza is Life",
    category: "Funny",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop",
    likes: 923,
    tags: ["pizza", "food", "funny"]
  },
  {
    Id: 11,
    name: "Success Mindset",
    category: "Business",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=400&fit=crop",
    likes: 412,
    tags: ["success", "mindset", "business"]
  },
  {
    Id: 12,
    name: "Be Kind Always",
    category: "Quotes",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop",
    likes: 689,
    tags: ["kindness", "positive", "quotes"]
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

  const handleCustomize = useCallback((template) => {
    alert(`Customizing "${template.name}" - Design Studio loading...`);
  }, []);

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