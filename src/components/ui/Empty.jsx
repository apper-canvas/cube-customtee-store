import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No items found", 
  description = "There are no items to display at the moment.",
  actionLabel = "Browse Products",
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-gradient-to-br from-blue-50 to-amber-50 p-8 rounded-full mb-6">
        <ApperIcon name="Package" className="w-16 h-16 text-secondary" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3 text-gradient">{title}</h3>
      <p className="text-secondary text-center mb-8 max-w-md">
        {description}
      </p>
      {onAction && (
        <Button onClick={onAction} size="lg" className="flex items-center space-x-2">
          <ApperIcon name="ShoppingBag" className="w-5 h-5" />
          <span>{actionLabel}</span>
        </Button>
      )}
    </div>
  );
};

export default Empty;