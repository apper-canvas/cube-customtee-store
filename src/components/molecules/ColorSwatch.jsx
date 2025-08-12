import React from "react";
import { cn } from "@/utils/cn";

const ColorSwatch = ({ color, selected, onClick, size = "md" }) => {
  const sizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10"
  };

  return (
    <button
      onClick={() => onClick(color)}
      className={cn(
        "rounded-full border-2 transition-all duration-200 hover:scale-110",
        sizes[size],
        selected ? "border-primary shadow-lg ring-2 ring-primary ring-opacity-30" : "border-gray-200 hover:border-gray-300"
      )}
      style={{ backgroundColor: color.value }}
      title={color.name}
    />
  );
};

export default ColorSwatch;