import React, { useState } from "react";
import FilterSection from "@/components/molecules/FilterSection";
import ColorSwatch from "@/components/molecules/ColorSwatch";
import SizeGuideModal from "@/components/organisms/SizeGuideModal";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";
import { toast } from "react-toastify";
const FilterSidebar = ({ 
  filters, 
  selectedFilters, 
  onFilterChange, 
  isOpen, 
  onClose 
}) => {
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const handleSizeGuideOpen = () => {
    setIsSizeGuideOpen(true);
    toast.info("📏 Size guide opened - find your perfect fit!");
  };
const handleStyleFilter = (style) => {
    const newStyles = selectedFilters.styles.includes(style)
      ? selectedFilters.styles.filter(s => s !== style)
      : [...selectedFilters.styles, style];
    onFilterChange({ ...selectedFilters, styles: newStyles });
  };

  const handleColorFilter = (color) => {
    const newColors = selectedFilters.colors.includes(color.name)
      ? selectedFilters.colors.filter(c => c !== color.name)
      : [...selectedFilters.colors, color.name];
    onFilterChange({ ...selectedFilters, colors: newColors });
  };

  const handleSizeFilter = (size) => {
    const newSizes = selectedFilters.sizes.includes(size)
      ? selectedFilters.sizes.filter(s => s !== size)
      : [...selectedFilters.sizes, size];
    onFilterChange({ ...selectedFilters, sizes: newSizes });
  };

  const handleDesignTypeFilter = (designType) => {
    const newDesignTypes = selectedFilters.designTypes.includes(designType)
      ? selectedFilters.designTypes.filter(d => d !== designType)
      : [...selectedFilters.designTypes, designType];
    onFilterChange({ ...selectedFilters, designTypes: newDesignTypes });
  };

  const handleColorSchemeFilter = (colorScheme) => {
    const newColorSchemes = selectedFilters.colorSchemes.includes(colorScheme)
      ? selectedFilters.colorSchemes.filter(c => c !== colorScheme)
      : [...selectedFilters.colorSchemes, colorScheme];
    onFilterChange({ ...selectedFilters, colorSchemes: newColorSchemes });
  };

  const handleComplexityLevelFilter = (complexityLevel) => {
    const newComplexityLevels = selectedFilters.complexityLevels.includes(complexityLevel)
      ? selectedFilters.complexityLevels.filter(c => c !== complexityLevel)
      : [...selectedFilters.complexityLevels, complexityLevel];
    onFilterChange({ ...selectedFilters, complexityLevels: newComplexityLevels });
  };

  return (
<>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[90]"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed lg:static inset-y-0 left-0 z-[95] w-80 lg:w-auto",
        "bg-white lg:bg-transparent lg:backdrop-filter-none shadow-2xl lg:shadow-none",
        "transform lg:transform-none transition-transform duration-300",
        "overflow-y-auto",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-6 lg:p-0">
          <div className="flex items-center justify-between lg:hidden mb-6">
            <h2 className="text-xl font-bold text-gray-900">Filters</h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {/* Style Categories */}
            <FilterSection title="T-Shirt Style">
              <div className="space-y-2">
                {filters.styles.map((style) => (
                  <label key={style} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedFilters.styles.includes(style)}
                      onChange={() => handleStyleFilter(style)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">{style}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            {/* Colors */}
            <FilterSection title="Colors">
              <div className="grid grid-cols-4 gap-3">
                {filters.colors.map((color, index) => (
                  <div key={index} className="text-center">
                    <ColorSwatch
                      color={color}
                      selected={selectedFilters.colors.includes(color.name)}
                      onClick={handleColorFilter}
                      size="lg"
                    />
                    <p className="text-xs text-gray-600 mt-1">{color.name}</p>
                  </div>
                ))}
              </div>
            </FilterSection>

{/* Sizes */}
            <FilterSection title="Sizes">
              <div className="space-y-3">
                {/* Size Guide Button */}
                <button
                  onClick={handleSizeGuideOpen}
                  className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-200"
                >
                  <ApperIcon name="Ruler" size={16} />
                  <span>Size Guide</span>
                </button>
                
                {/* Size Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  {filters.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSizeFilter(size)}
                      className={cn(
                        "px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200",
                        selectedFilters.sizes.includes(size)
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-gray-700 border-gray-200 hover:border-primary"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </FilterSection>
{/* Price Range */}
            <FilterSection title="Price Range">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">$15 - $35</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="35"
                  className="w-full accent-primary"
                />
              </div>
            </FilterSection>

            {/* Design Type */}
            <FilterSection title="Design Type">
              <div className="space-y-2">
                {filters.designTypes?.map((designType) => (
                  <label key={designType} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFilters.designTypes.includes(designType)}
                      onChange={() => handleDesignTypeFilter(designType)}
                      className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                    />
                    <span className="text-sm text-gray-700">{designType}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            {/* Color Scheme */}
            <FilterSection title="Color Scheme">
              <div className="space-y-2">
                {filters.colorSchemes?.map((colorScheme) => (
                  <label key={colorScheme} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFilters.colorSchemes.includes(colorScheme)}
                      onChange={() => handleColorSchemeFilter(colorScheme)}
                      className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                    />
                    <span className="text-sm text-gray-700">{colorScheme}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            {/* Complexity Level */}
            <FilterSection title="Complexity Level">
              <div className="space-y-2">
                {filters.complexityLevels?.map((complexityLevel) => (
                  <label key={complexityLevel} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFilters.complexityLevels.includes(complexityLevel)}
                      onChange={() => handleComplexityLevelFilter(complexityLevel)}
                      className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                    />
                    <span className="text-sm text-gray-700">{complexityLevel}</span>
                  </label>
                ))}
              </div>
            </FilterSection>
          </div>
        </div>
      </div>
{/* Size Guide Modal */}
      <SizeGuideModal 
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />
    </>
  );
};

export default FilterSidebar;