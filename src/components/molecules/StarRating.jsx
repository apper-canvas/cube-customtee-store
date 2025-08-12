import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StarRating = ({ 
  rating = 0, 
  maxRating = 5, 
  size = "sm", 
  interactive = false,
  onChange = null,
  className = "",
  showRating = false
}) => {
  const sizeClasses = {
    xs: "w-3 h-3",
    sm: "w-4 h-4", 
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };

  const handleStarClick = (starRating) => {
    if (interactive && onChange) {
      onChange(starRating);
    }
  };

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      <div className="flex items-center">
        {[...Array(maxRating)].map((_, index) => {
          const starRating = index + 1;
          const isFilled = starRating <= rating;
          const isHalfFilled = rating > index && rating < starRating;
          
          return (
            <button
              key={index}
              type="button"
              disabled={!interactive}
              onClick={() => handleStarClick(starRating)}
              className={cn(
                "relative transition-all duration-200",
                interactive && "hover:scale-110 cursor-pointer",
                !interactive && "cursor-default"
              )}
            >
              <ApperIcon 
                name="Star" 
                className={cn(
                  sizeClasses[size],
                  isFilled 
                    ? "text-yellow-400 fill-current" 
                    : isHalfFilled
                    ? "text-yellow-400 fill-current opacity-50"
                    : "text-gray-300"
                )}
              />
            </button>
          );
        })}
      </div>
      {showRating && (
        <span className="text-sm font-medium text-gray-600 ml-2">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;