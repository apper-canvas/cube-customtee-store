import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import SizeSelector from "@/components/molecules/SizeSelector";
import PriceDisplay from "@/components/molecules/PriceDisplay";
import ColorSwatch from "@/components/molecules/ColorSwatch";
import Button from "@/components/atoms/Button";
import ReviewSection from "@/components/organisms/ReviewSection";
import { cn } from "@/utils/cn";

const ProductModal = ({ product, isOpen, onClose, onAddToCart }) => {
const [selectedColor, setSelectedColor] = useState(product?.colors[0]);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Generate mockup URL based on selected color and product style
  const generateMockupUrl = (color, style, viewAngle = 'front') => {
    const colorHex = color?.value?.replace('#', '') || 'FFFFFF';
    const styleParam = style?.toLowerCase().replace(/\s+/g, '-') || 'crew-neck';
    return `https://api.placid.app/u/mockup-tshirt?style=${styleParam}&color=${colorHex}&view=${viewAngle}&width=800&height=800`;
  };

  // Generate mockup images for current selection
  const mockupImages = [
    generateMockupUrl(selectedColor, product?.style, 'front'),
    generateMockupUrl(selectedColor, product?.style, 'back'),
  ];

  if (!product) return null;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    const cartItem = {
      productId: product.Id,
      name: product.name,
      style: product.style,
      price: product.basePrice,
      color: selectedColor,
      size: selectedSize,
      quantity,
      image: product.images[currentImageIndex]
    };

    onAddToCart(cartItem);
    toast.success("Added to cart!");
    onClose();
  };

  const handleCustomize = () => {
    toast.info("Design Studio loading...");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>

            <div className="flex flex-col lg:flex-row">
              {/* Image Section */}
              <div className="lg:w-1/2">
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200">
<img
                    src={mockupImages[currentImageIndex] || product.images[currentImageIndex]}
                    alt={`${product.name} in ${selectedColor?.name}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Complexity Badge */}
                  {product.complexityLevel && (
                    <div className="absolute top-4 right-4 bg-white rounded-lg px-3 py-1 shadow-md">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          product.complexityLevel === 'Simple' && "bg-green-500",
                          product.complexityLevel === 'Moderate' && "bg-yellow-500",
                          product.complexityLevel === 'Complex' && "bg-orange-500",
                          product.complexityLevel === 'Very Complex' && "bg-red-500"
                        )} />
                        <span className="text-xs font-medium text-gray-700">
                          {product.complexityLevel}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
{mockupImages.length > 1 && (
                  <div className="flex space-x-2 p-4 overflow-x-auto">
                    {mockupImages.map((mockupUrl, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                          currentImageIndex === index ? "border-primary" : "border-gray-200"
                        }`}
                      >
                        <img 
                          src={mockupUrl} 
                          alt={index === 0 ? 'Front view' : 'Back view'} 
                          className="w-full h-full object-cover" 
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Details Section */}
<div className="flex flex-col overflow-y-auto">
              {/* Main Product Details */}
              <div className="lg:w-1/2 p-6 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                  <p className="text-secondary mt-1">{product.style}</p>
                  <PriceDisplay 
                    price={product.basePrice} 
                    complexity={product.complexityLevel ? {
                      level: product.complexityLevel,
                      multiplier: product.complexityLevel === 'Simple' ? 1.0 :
                                 product.complexityLevel === 'Moderate' ? 1.2 :
                                 product.complexityLevel === 'Complex' ? 1.5 : 2.0
                    } : null}
                    className="mt-3" 
                  />
                </div>

                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Color Selection */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      Color: <span className="font-normal text-secondary">{selectedColor?.name}</span>
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {product.colors.map((color, index) => (
                        <ColorSwatch
                          key={index}
                          color={color}
                          selected={selectedColor?.name === color.name}
                          onClick={setSelectedColor}
                          size="lg"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Size Selection */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Size</h4>
                    <SizeSelector
                      sizes={product.sizes}
                      selectedSize={selectedSize}
                      onSizeChange={setSelectedSize}
                    />
                  </div>

                  {/* Quantity */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Quantity</h4>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                      >
                        <ApperIcon name="Minus" className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 bg-gray-50 rounded-lg min-w-[3rem] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                      >
                        <ApperIcon name="Plus" className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button onClick={handleCustomize} variant="outline" className="flex-1">
                    <ApperIcon name="Palette" className="w-4 h-4 mr-2" />
                    Start Customizing
                  </Button>
                  <Button onClick={handleAddToCart} className="flex-1">
                    <ApperIcon name="ShoppingCart" className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>

                {/* Specifications */}
                <div className="pt-4 border-t border-gray-100">
                  <h4 className="font-medium text-gray-900 mb-3">Specifications</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-secondary">Material:</span>
                      <p className="font-medium">{product.specifications.material}</p>
                    </div>
                    <div>
                      <span className="text-secondary">Weight:</span>
                      <p className="font-medium">{product.specifications.weight}</p>
                    </div>
                    <div>
                      <span className="text-secondary">Care:</span>
                      <p className="font-medium">{product.specifications.care}</p>
                    </div>
                    <div>
                      <span className="text-secondary">Origin:</span>
                      <p className="font-medium">{product.specifications.origin}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="border-t border-gray-200 p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Customer Reviews</h3>
                  <p className="text-gray-600">See what other customers are saying about this product</p>
                </div>
                <ReviewSection product={product} />
              </div>
            </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;