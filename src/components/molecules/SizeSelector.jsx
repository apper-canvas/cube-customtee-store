import React from "react";
import { cn } from "@/utils/cn";

const SizeSelector = ({ sizes, selectedSize, onSizeChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map((size) => (
        <button
          key={size}
          onClick={() => onSizeChange(size)}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 hover:scale-105",
            selectedSize === size
              ? "bg-primary text-white border-primary shadow-lg"
              : "bg-white text-secondary border-gray-200 hover:border-primary hover:text-primary"
          )}
        >
          {size}
        </button>
      ))}
    </div>
  );
};

export default SizeSelector;