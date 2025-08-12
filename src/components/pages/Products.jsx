import React, { useState, useEffect, useMemo } from "react";
import ProductGrid from "@/components/organisms/ProductGrid";
import FilterSidebar from "@/components/organisms/FilterSidebar";
import ProductModal from "@/components/organisms/ProductModal";
import SizeGuideModal from "@/components/organisms/SizeGuideModal";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { productService } from "@/services/api/productService";
import { filterService } from "@/services/api/filterService";
import { customerDesignsService } from "@/services/api/customerDesignsService";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
const Products = ({ onAddToCart }) => {
const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [popularDesigns, setPopularDesigns] = useState([]);
  const [filters, setFilters] = useState(null);
const [selectedFilters, setSelectedFilters] = useState({
    styles: [],
    colors: [],
    sizes: [],
    designTypes: [],
    colorSchemes: [],
    complexityLevels: [],
    priceRange: { min: 15, max: 35 }
  });
const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [designsLoading, setDesignsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  // Load recently viewed products from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recentlyViewed');
    if (stored) {
      try {
        setRecentlyViewed(JSON.parse(stored));
      } catch (error) {
        console.error('Error parsing recently viewed products:', error);
      }
    }
  }, []);

  // Save recently viewed products to localStorage
  const saveRecentlyViewed = (products) => {
    try {
      localStorage.setItem('recentlyViewed', JSON.stringify(products));
    } catch (error) {
      console.error('Error saving recently viewed products:', error);
    }
  };

  // Add product to recently viewed
  const addToRecentlyViewed = (product) => {
    setRecentlyViewed(prev => {
      // Remove if already exists to avoid duplicates
      const filtered = prev.filter(item => item.id !== product.id);
      // Add to beginning and limit to 10 items
      const updated = [product, ...filtered].slice(0, 10);
      saveRecentlyViewed(updated);
      return updated;
    });
  };
  useEffect(() => {
loadData();
    loadPopularDesigns();
  }, []);

useEffect(() => {
    if (products.length > 0 && filters) {
      applyFilters();
    }
  }, [selectedFilters, searchQuery]);

const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [productsData, filtersData] = await Promise.all([
        productService.getAll(),
        filterService.getFilters()
      ]);
      setProducts(productsData);
      setFilters(filtersData);
    } catch (err) {
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadPopularDesigns = async () => {
    setDesignsLoading(true);
    try {
      const designs = await customerDesignsService.getPopularDesigns(6);
      setPopularDesigns(designs);
    } catch (err) {
      console.error("Failed to load popular designs:", err);
    } finally {
      setDesignsLoading(false);
    }
  };

const applyFilters = () => {
    let filtered = [...products];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.style.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply style filters
    if (selectedFilters.styles.length > 0) {
      filtered = filtered.filter(product =>
        selectedFilters.styles.includes(product.style)
      );
    }

    // Apply design type filters
    if (selectedFilters.designTypes.length > 0) {
      filtered = filtered.filter(product =>
        selectedFilters.designTypes.includes(product.designType || 'Text-Only')
      );
    }

    // Apply color scheme filters
    if (selectedFilters.colorSchemes.length > 0) {
      filtered = filtered.filter(product =>
        selectedFilters.colorSchemes.includes(product.colorScheme || 'Monochrome')
      );
    }

    // Apply complexity level filters
// Apply complexity level filters
    if (selectedFilters.complexityLevels.length > 0) {
      filtered = filtered.filter(product =>
        selectedFilters.complexityLevels.includes(product.complexityLevel || 'Simple')
      );
    }

    // Apply price range filter
    filtered = filtered.filter(product =>
      product.basePrice >= selectedFilters.priceRange.min &&
      product.basePrice <= selectedFilters.priceRange.max
    );

    setFilteredProducts(filtered);
  };

const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    // Add to recently viewed when product is clicked
    addToRecentlyViewed(product);
  };

  const handleAddToCart = (cartItem) => {
    onAddToCart(cartItem);
    setIsModalOpen(false);
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

// Generate search suggestions from products
  const searchSuggestions = useMemo(() => {
    const suggestions = new Set();
    products.forEach(product => {
      suggestions.add(product.name);
      suggestions.add(product.style);
    });
    return Array.from(suggestions);
  }, [products]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gradient">Custom T-Shirts</h1>
          <p className="text-secondary mt-2">
            Choose your style and create something amazing
          </p>
        </div>
        
        <div className="flex items-center space-x-4 w-full lg:w-auto">
          <SearchBar
            placeholder="Search by name or style..."
            onSearch={handleSearch}
            suggestions={searchSuggestions}
            className="flex-1 lg:flex-none lg:w-80"
          />
          
          <Button
            onClick={() => setIsSidebarOpen(true)}
            variant="outline"
            className="lg:hidden flex items-center space-x-2 flex-shrink-0"
          >
            <ApperIcon name="Filter" className="w-4 h-4" />
            <span>Filters</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:w-64 flex-shrink-0">
          {filters && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
              <FilterSidebar
                filters={filters}
                selectedFilters={selectedFilters}
                onFilterChange={setSelectedFilters}
                isOpen={true}
                onClose={() => {}}
              />
            </div>
          )}
        </div>

        {/* Mobile Sidebar */}
        {filters && (
          <FilterSidebar
            filters={filters}
            selectedFilters={selectedFilters}
            onFilterChange={setSelectedFilters}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0">
<ProductGrid
            products={filteredProducts}
            loading={loading}
            error={error}
            onProductClick={handleProductClick}
            onRetry={loadData}
          />
        </div>
      </div>

      {/* Design Inspiration Feed */}
      {popularDesigns.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">
                Design Inspiration
              </h2>
              <p className="text-gray-600">
                Get inspired by popular customer creations
              </p>
            </div>
            <Button
              onClick={() => navigate('/gallery')}
              variant="outline"
              className="flex items-center"
            >
              View All
              <ApperIcon name="ArrowRight" size={16} className="ml-2" />
            </Button>
          </div>
          
          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularDesigns.map((design) => (
                <div
                  key={`design-${design.Id}`}
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
                      {design.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <Button
                      onClick={() => handleRecreateDesign(design)}
                      className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                    >
                      <ApperIcon name="Copy" size={16} className="mr-2" />
                      Recreate This Design
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

{/* Recently Viewed Section */}
      {recentlyViewed.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold text-gray-900">
              Recently Viewed
            </h2>
          </div>
          
          <div className="relative">
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {recentlyViewed.map((product) => (
                <div
                  key={`recent-${product.id}`}
                  className="flex-none w-64 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="aspect-square bg-gray-100 rounded-t-2xl overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">
                        ${product.price}
                      </span>
                      <div className="flex gap-1">
                        {product.colors?.slice(0, 3).map((color, index) => (
                          <div
                            key={index}
                            className="w-4 h-4 rounded-full border border-gray-200"
                            style={{ backgroundColor: color.value }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleAddToCart}
      />

      {/* Size Guide Modal */}
      <SizeGuideModal 
        isOpen={false}
        onClose={() => {}}
      />
    </div>
  );
};

export default Products;