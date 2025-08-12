import React, { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const PromotionalBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative bg-gradient-to-r from-primary to-accent text-white overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-2 left-8 animate-pulse">
          <ApperIcon name="Sparkles" size={24} />
        </div>
        <div className="absolute top-6 right-16 animate-pulse delay-300">
          <ApperIcon name="Sparkles" size={16} />
        </div>
        <div className="absolute bottom-3 left-32 animate-pulse delay-700">
          <ApperIcon name="Sparkles" size={20} />
        </div>
        <div className="absolute bottom-2 right-8 animate-pulse delay-500">
          <ApperIcon name="Sparkles" size={18} />
        </div>
      </div>
      
      <div className="relative container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            {/* Gift icon */}
            <div className="hidden sm:flex items-center justify-center w-12 h-12 bg-white/20 rounded-full backdrop-blur-sm">
              <ApperIcon name="Gift" size={24} />
            </div>
            
            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-display font-bold text-lg md:text-xl">
                  🎉 Special Offer Alert!
                </h2>
                <span className="text-sm md:text-base font-medium">
                  Get 25% OFF your first custom design
                </span>
              </div>
              <p className="text-sm opacity-90 mt-1">
                Limited time: Use code <span className="font-bold bg-white/20 px-2 py-1 rounded text-xs">FIRST25</span> - Ends Dec 31st
              </p>
            </div>
          </div>
          
          {/* Action button - hidden on mobile to save space */}
          <div className="hidden lg:block ml-4">
            <Button 
              variant="secondary" 
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 font-semibold"
            >
              Shop Now
            </Button>
          </div>
          
          {/* Close button */}
          <button
            onClick={() => setIsVisible(false)}
            className="ml-2 p-1 hover:bg-white/20 rounded-full transition-colors duration-200 flex-shrink-0"
            aria-label="Close banner"
          >
            <ApperIcon name="X" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromotionalBanner;