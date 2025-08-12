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

const Products = ({ onAddToCart }) => {
const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    styles: [],
    colors: [],
    sizes: [],
    priceRange: { min: 15, max: 35 }
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  useEffect(() => {
    loadData();
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
  };

  const handleAddToCart = (cartItem) => {
    onAddToCart(cartItem);
    setIsModalOpen(false);
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