import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100 pb-4 mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-2 text-left hover:text-primary transition-colors"
      >
        <h4 className="font-medium text-gray-900">{title}</h4>
        <ApperIcon 
          name={isOpen ? "ChevronUp" : "ChevronDown"} 
          className={cn("w-4 h-4 transition-transform duration-200", isOpen && "rotate-180")}
        />
      </button>
      <div className={cn(
        "mt-3 transition-all duration-300 overflow-hidden",
        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      )}>
        {children}
      </div>
    </div>
  );
};

export default FilterSection;