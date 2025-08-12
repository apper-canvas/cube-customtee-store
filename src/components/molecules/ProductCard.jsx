import React, { useState } from "react";
import Button from "@/components/atoms/Button";
import ColorSwatch from "@/components/molecules/ColorSwatch";
import PriceDisplay from "@/components/molecules/PriceDisplay";

const ProductCard = ({ product, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleCustomizeClick = (e) => {
    e.stopPropagation();
    // Placeholder for customize functionality
    alert("Design Studio loading...");
  };

  return (
<div 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white rounded-xl shadow-sm card-hover cursor-pointer overflow-hidden group relative"
    >
<div className="aspect-square overflow-hidden rounded-t-xl bg-gradient-to-br from-gray-100 to-gray-200 relative">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Quick View Modal Overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center p-4 transition-all duration-200">
            {/* Color Options */}
            <div className="mb-4">
              <p className="text-white text-sm font-medium mb-2 text-center">Available Colors</p>
              <div className="flex space-x-2 justify-center">
                {product.colors.slice(0, 5).map((color, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
                {product.colors.length > 5 && (
                  <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-300 flex items-center justify-center">
                    <span className="text-xs text-gray-600">+{product.colors.length - 5}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Quick View Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors duration-200 shadow-lg"
            >
              Quick View
            </button>
          </div>
        )}
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">{product.name}</h3>
          <p className="text-sm text-secondary">{product.style}</p>
        </div>
        
        <PriceDisplay price={product.basePrice} className="text-sm" />
        
        <div className="flex space-x-2">
          {product.colors.slice(0, 4).map((color, index) => (
            <ColorSwatch
              key={index}
              color={color}
              selected={false}
              onClick={() => {}}
              size="sm"
            />
          ))}
          {product.colors.length > 4 && (
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600">
              +{product.colors.length - 4}
            </div>
          )}
        </div>
        
        <Button
          onClick={handleCustomizeClick}
          className="w-full"
          size="sm"
        >
          Customize
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;