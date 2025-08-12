import React from "react";

const PriceDisplay = ({ price, originalPrice, className = "" }) => {
  return (
    <div className={`flex items-baseline space-x-2 ${className}`}>
      <span className="text-2xl font-bold text-gray-900">
        ${price.toFixed(2)}
      </span>
      {originalPrice && originalPrice !== price && (
        <span className="text-sm text-secondary line-through">
          ${originalPrice.toFixed(2)}
        </span>
      )}
    </div>
  );
};

export default PriceDisplay;