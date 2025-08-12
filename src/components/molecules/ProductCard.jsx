import React from "react";
import Button from "@/components/atoms/Button";
import ColorSwatch from "@/components/molecules/ColorSwatch";
import PriceDisplay from "@/components/molecules/PriceDisplay";

const ProductCard = ({ product, onClick }) => {
  const handleCustomizeClick = (e) => {
    e.stopPropagation();
    // Placeholder for customize functionality
    alert("Design Studio loading...");
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm card-hover cursor-pointer overflow-hidden group"
    >
      <div className="aspect-square overflow-hidden rounded-t-xl bg-gradient-to-br from-gray-100 to-gray-200">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
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