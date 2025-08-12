import React, { useState, useEffect } from "react";
import ProductGrid from "@/components/organisms/ProductGrid";
import FilterSidebar from "@/components/organisms/FilterSidebar";
import ProductModal from "@/components/organisms/ProductModal";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { productService } from "@/services/api/productService";
import { filterService } from "@/services/api/filterService";

const Products = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    styles: [],
    colors: [],
    sizes: [],
    priceRange: { min: 15, max: 35 }
  });
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
  }, [selectedFilters]);

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
    // Filter logic would be implemented here
    // For now, showing all products
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleAddToCart = (cartItem) => {
    onAddToCart(cartItem);
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Custom T-Shirts</h1>
          <p className="text-secondary mt-2">
            Choose your style and create something amazing
          </p>
        </div>
        
        <Button
          onClick={() => setIsSidebarOpen(true)}
          variant="outline"
          className="lg:hidden flex items-center space-x-2"
        >
          <ApperIcon name="Filter" className="w-4 h-4" />
          <span>Filters</span>
        </Button>
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
            products={products}
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
    </div>
  );
};

export default Products;