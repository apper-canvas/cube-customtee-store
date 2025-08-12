import React, { useState, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ColorSwatch from "@/components/molecules/ColorSwatch";
import SizeSelector from "@/components/molecules/SizeSelector";
import PriceDisplay from "@/components/molecules/PriceDisplay";
import { cn } from "@/utils/cn";

const availableStyles = [
  { value: "Crew Neck", label: "Crew Neck" },
  { value: "V-Neck", label: "V-Neck" },
  { value: "Tank Top", label: "Tank Top" },
  { value: "Long Sleeve", label: "Long Sleeve" }
];

const availableColors = [
  { name: "White", value: "#FFFFFF" },
  { name: "Black", value: "#000000" },
  { name: "Navy", value: "#1F2937" },
  { name: "Gray", value: "#6B7280" },
  { name: "Red", value: "#EF4444" },
  { name: "Royal Blue", value: "#2563EB" },
  { name: "Forest Green", value: "#065F46" },
  { name: "Burgundy", value: "#991B1B" }
];

const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];

const fontOptions = [
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Georgia",
  "Verdana",
  "Impact"
];

const textColors = [
  { name: "Black", value: "#000000" },
  { name: "White", value: "#FFFFFF" },
  { name: "Red", value: "#EF4444" },
  { name: "Blue", value: "#2563EB" },
  { name: "Green", value: "#10B981" },
  { name: "Yellow", value: "#F59E0B" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Pink", value: "#EC4899" }
];

const CustomStudio = () => {
  const [selectedStyle, setSelectedStyle] = useState("Crew Neck");
  const [selectedColor, setSelectedColor] = useState(availableColors[0]);
  const [selectedSize, setSelectedSize] = useState("M");
  const [designElements, setDesignElements] = useState([]);
  const [textInput, setTextInput] = useState("");
  const [selectedFont, setSelectedFont] = useState("Arial");
  const [selectedTextColor, setSelectedTextColor] = useState(textColors[0]);
  const [fontSize, setFontSize] = useState(24);
  const [draggedElement, setDraggedElement] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const fileInputRef = useRef(null);

  const basePrice = 24.99;
  const customizationCost = designElements.length * 3.99;
  const totalPrice = basePrice + customizationCost;

  const addTextElement = () => {
    if (!textInput.trim()) {
      toast.error("Please enter some text");
      return;
    }

    const newElement = {
      id: Date.now(),
      type: "text",
      content: textInput,
      font: selectedFont,
      color: selectedTextColor.value,
      size: fontSize,
      x: 150,
      y: 100,
      isDragging: false
    };

    setDesignElements([...designElements, newElement]);
    setTextInput("");
    toast.success("Text added to design");
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Please select a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const newElement = {
        id: Date.now(),
        type: "image",
        content: e.target.result,
        x: 100,
        y: 150,
        width: 100,
        height: 100,
        isDragging: false
      };

      setDesignElements([...designElements, newElement]);
      toast.success("Image added to design");
    };
    reader.readAsDataURL(file);
  };

  const handleMouseDown = useCallback((e, element) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setDraggedElement(element.id);
    
    setDesignElements(prev => 
      prev.map(el => 
        el.id === element.id 
          ? { ...el, isDragging: true }
          : el
      )
    );
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!draggedElement) return;

    const mockupRect = document.querySelector('.t-shirt-mockup').getBoundingClientRect();
    const x = e.clientX - mockupRect.left - dragOffset.x;
    const y = e.clientY - mockupRect.top - dragOffset.y;

    setDesignElements(prev =>
      prev.map(el =>
        el.id === draggedElement
          ? { ...el, x: Math.max(0, Math.min(x, 250)), y: Math.max(0, Math.min(y, 300)) }
          : el
      )
    );
  }, [draggedElement, dragOffset]);

  const handleMouseUp = useCallback(() => {
    if (draggedElement) {
      setDesignElements(prev =>
        prev.map(el =>
          el.id === draggedElement
            ? { ...el, isDragging: false }
            : el
        )
      );
      setDraggedElement(null);
    }
  }, [draggedElement]);

  const removeElement = (id) => {
    setDesignElements(prev => prev.filter(el => el.id !== id));
    toast.info("Design element removed");
  };

  const clearAllElements = () => {
    setDesignElements([]);
    toast.info("All design elements cleared");
  };

  const saveDesign = () => {
    const design = {
      style: selectedStyle,
      color: selectedColor,
      size: selectedSize,
      elements: designElements,
      price: totalPrice
    };
    
    // In a real app, this would save to a backend
    localStorage.setItem('savedDesign', JSON.stringify(design));
    toast.success("Design saved successfully!");
  };

  const addToCart = () => {
    const cartItem = {
      id: Date.now(),
      name: `Custom ${selectedStyle}`,
      style: selectedStyle,
      color: selectedColor.name,
      size: selectedSize,
      price: totalPrice,
      quantity: 1,
      isCustom: true,
      elements: designElements
    };

    // In a real app, this would integrate with the cart system
    const existingCart = JSON.parse(localStorage.getItem('customCart') || '[]');
    existingCart.push(cartItem);
    localStorage.setItem('customCart', JSON.stringify(existingCart));
    
    toast.success("Custom design added to cart!");
  };

  return (
    <div 
      className="min-h-screen bg-background py-8"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-4">Custom Design Studio</h1>
          <p className="text-xl text-secondary max-w-2xl mx-auto">
            Create your own unique designs with our powerful customization tools
          </p>
        </div>

        {/* Main Studio Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
          {/* Design Workspace - 70% */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-6">Design Workspace</h2>
              
              {/* T-Shirt Mockup */}
              <div className="relative bg-gray-50 rounded-xl p-8 flex justify-center items-center min-h-[500px]">
                <div 
                  className="t-shirt-mockup relative"
                  style={{ 
                    width: 300, 
                    height: 400,
                    backgroundColor: selectedColor.value,
                    borderRadius: selectedStyle === "V-Neck" ? "20px 20px 0 0" : "8px",
                    border: selectedColor.value === "#FFFFFF" ? "2px solid #e5e7eb" : "none",
                    clipPath: selectedStyle === "Tank Top" 
                      ? "polygon(20% 0%, 80% 0%, 100% 30%, 100% 100%, 0% 100%, 0% 30%)"
                      : selectedStyle === "V-Neck"
                      ? "polygon(0% 0%, 40% 0%, 50% 15%, 60% 0%, 100% 0%, 100% 100%, 0% 100%)"
                      : "none"
                  }}
                >
                  {/* Sleeves for Long Sleeve */}
                  {selectedStyle === "Long Sleeve" && (
                    <>
                      <div 
                        className="absolute -left-8 top-4 w-16 h-32 rounded-full"
                        style={{ backgroundColor: selectedColor.value }}
                      />
                      <div 
                        className="absolute -right-8 top-4 w-16 h-32 rounded-full"
                        style={{ backgroundColor: selectedColor.value }}
                      />
                    </>
                  )}

                  {/* Design Elements */}
                  {designElements.map((element) => (
                    <div
                      key={element.id}
                      className={cn(
                        "absolute cursor-move select-none group",
                        element.isDragging && "z-50"
                      )}
                      style={{
                        left: element.x,
                        top: element.y,
                        transform: element.isDragging ? "scale(1.05)" : "scale(1)"
                      }}
                      onMouseDown={(e) => handleMouseDown(e, element)}
                    >
                      {element.type === "text" ? (
                        <div
                          style={{
                            fontFamily: element.font,
                            fontSize: `${element.size}px`,
                            color: element.color,
                            fontWeight: "bold",
                            textShadow: element.color === "#FFFFFF" ? "1px 1px 2px rgba(0,0,0,0.3)" : "none"
                          }}
                        >
                          {element.content}
                        </div>
                      ) : (
                        <img
                          src={element.content}
                          alt="Custom design"
                          style={{
                            width: element.width,
                            height: element.height,
                            objectFit: "contain"
                          }}
                          draggable={false}
                        />
                      )}
                      
                      {/* Remove button */}
                      <button
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                        onClick={() => removeElement(element.id)}
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                {/* Style Label */}
                <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  {selectedStyle} - {selectedColor.name} - {selectedSize}
                </div>
              </div>
            </div>
          </div>

          {/* Controls Panel - 30% */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
              <h2 className="text-xl font-semibold">Customization</h2>

              {/* Style Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  T-Shirt Style
                </label>
                <select
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {availableStyles.map(style => (
                    <option key={style.value} value={style.value}>
                      {style.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Color Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  T-Shirt Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((color) => (
                    <ColorSwatch
                      key={color.name}
                      color={color}
                      selected={selectedColor.name === color.name}
                      onClick={() => setSelectedColor(color)}
                      className="w-8 h-8"
                    />
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size
                </label>
                <SizeSelector
                  sizes={availableSizes}
                  selectedSize={selectedSize}
                  onSizeChange={setSelectedSize}
                />
              </div>

              {/* Text Tool */}
              <div className="border-t pt-6">
                <h3 className="font-medium mb-4 flex items-center">
                  <ApperIcon name="Type" className="w-4 h-4 mr-2" />
                  Add Text
                </h3>
                
                <div className="space-y-3">
                  <Input
                    placeholder="Enter your text..."
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                  />
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Font</label>
                      <select
                        value={selectedFont}
                        onChange={(e) => setSelectedFont(e.target.value)}
                        className="w-full p-2 text-sm border border-gray-300 rounded"
                      >
                        {fontOptions.map(font => (
                          <option key={font} value={font} style={{ fontFamily: font }}>
                            {font}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Size</label>
                      <input
                        type="range"
                        min="12"
                        max="48"
                        value={fontSize}
                        onChange={(e) => setFontSize(parseInt(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-xs text-gray-500">{fontSize}px</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Text Color</label>
                    <div className="flex gap-1">
                      {textColors.map((color) => (
                        <ColorSwatch
                          key={color.name}
                          color={color}
                          selected={selectedTextColor.name === color.name}
                          onClick={() => setSelectedTextColor(color)}
                          className="w-6 h-6"
                        />
                      ))}
                    </div>
                  </div>
                  
                  <Button onClick={addTextElement} className="w-full text-sm">
                    <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                    Add Text
                  </Button>
                </div>
              </div>

              {/* Image Upload */}
              <div className="border-t pt-6">
                <h3 className="font-medium mb-4 flex items-center">
                  <ApperIcon name="Image" className="w-4 h-4 mr-2" />
                  Add Image
                </h3>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <ApperIcon name="Upload" className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>
              </div>

              {/* Price Display */}
              <div className="border-t pt-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Base Price:</span>
                    <span>${basePrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Customizations ({designElements.length}):</span>
                    <span>${customizationCost.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <PriceDisplay price={totalPrice} className="text-lg font-semibold" />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button onClick={addToCart} className="w-full">
                  <ApperIcon name="ShoppingCart" className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={saveDesign}>
                    <ApperIcon name="Save" className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                  <Button variant="outline" onClick={clearAllElements}>
                    <ApperIcon name="Trash2" className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomStudio;