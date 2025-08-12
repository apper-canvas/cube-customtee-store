import React from "react";
import { cn } from "@/utils/cn";

const PriceDisplay = ({ price, originalPrice, complexity, className = "" }) => {
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
      {complexity && complexity.multiplier > 1 && (
        <span className={cn(
          "text-xs px-2 py-1 rounded-full font-medium",
          complexity.level === 'Moderate' && "bg-yellow-100 text-yellow-700",
          complexity.level === 'Complex' && "bg-orange-100 text-orange-700",
          complexity.level === 'Very Complex' && "bg-red-100 text-red-700"
        )}>
          +{((complexity.multiplier - 1) * 100).toFixed(0)}%
        </span>
      )}
    </div>
  );
};

export default PriceDisplay;