import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import SizeSelector from "@/components/molecules/SizeSelector";
import PriceDisplay from "@/components/molecules/PriceDisplay";
import ColorSwatch from "@/components/molecules/ColorSwatch";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
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
  const [searchParams] = useSearchParams();
  const [selectedStyle, setSelectedStyle] = useState("Crew Neck");
  const [selectedColor, setSelectedColor] = useState(availableColors[0]);
  const [selectedSize, setSelectedSize] = useState("M");
  
  // Multi-area design state
  const [activeDesignArea, setActiveDesignArea] = useState("Front");
  const [designAreas, setDesignAreas] = useState({
    Front: [],
    Back: [],
    Sleeve: []
  });
  
  // Text controls
  const [textInput, setTextInput] = useState("");
  const [selectedFont, setSelectedFont] = useState("Arial");
  const [selectedTextColor, setSelectedTextColor] = useState(textColors[0]);
  const [fontSize, setFontSize] = useState(24);
  const [textStroke, setTextStroke] = useState(0);
  const [textStrokeColor, setTextStrokeColor] = useState("#000000");
  const [textShadow, setTextShadow] = useState(0);
  const [textShadowColor, setTextShadowColor] = useState("#000000");
  const [textRotation, setTextRotation] = useState(0);
  const [textOpacity, setTextOpacity] = useState(100);
  
  // Image editing controls
  const [selectedElement, setSelectedElement] = useState(null);
  const [imageRotation, setImageRotation] = useState(0);
  const [imageOpacity, setImageOpacity] = useState(100);
  const [imageFilter, setImageFilter] = useState("none");
  const [imageBrightness, setImageBrightness] = useState(100);
  
  // Layers panel
  const [showLayersPanel, setShowLayersPanel] = useState(true);
  
  // Save system
  const [savedDesigns, setSavedDesigns] = useState([]);
  const [designName, setDesignName] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showSavedDesigns, setShowSavedDesigns] = useState(false);
  
  const [draggedElement, setDraggedElement] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [templateName, setTemplateName] = useState(null);
  const fileInputRef = useRef(null);
  
  // Get current design elements
  const designElements = designAreas[activeDesignArea];

  // Load template data from URL params
// Load saved designs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedDesigns');
    if (saved) {
      setSavedDesigns(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const templateData = searchParams.get('template');
    if (templateData) {
      try {
        const template = JSON.parse(decodeURIComponent(templateData));
        setTemplateName(template.name);
        if (template.designElements && template.designElements.length > 0) {
          setDesignAreas(prev => ({
            ...prev,
            [activeDesignArea]: template.designElements.map(element => ({
              ...element,
              id: Date.now() + Math.random() + element.id
            }))
          }));
        }
      } catch (error) {
        console.error('Failed to load template:', error);
      }
    }
  }, [searchParams, activeDesignArea]);
const basePrice = 24.99;
  const totalElements = Object.values(designAreas).reduce((total, elements) => total + elements.length, 0);
  const customizationCost = totalElements * 3.99;
  const totalPrice = basePrice + customizationCost;

const addTextElement = () => {
    if (!textInput.trim()) {
      toast.error("Please enter some text");
      return;
    }

    const newElement = {
      id: Date.now() + Math.random(),
      type: "text",
      content: textInput,
      font: selectedFont,
      color: selectedTextColor.value,
      size: fontSize,
      stroke: textStroke,
      strokeColor: textStrokeColor,
      shadow: textShadow,
      shadowColor: textShadowColor,
      rotation: textRotation,
      opacity: textOpacity,
      x: 150,
      y: 100,
      isDragging: false,
      visible: true,
      zIndex: designElements.length
    };

    setDesignAreas(prev => ({
      ...prev,
      [activeDesignArea]: [...prev[activeDesignArea], newElement]
    }));
    setTextInput("");
    toast.success(`Text added to ${activeDesignArea} design`);
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
        id: Date.now() + Math.random(),
        type: "image",
        content: e.target.result,
        x: 100,
        y: 150,
        width: 100,
        height: 100,
        rotation: 0,
        opacity: 100,
        filter: "none",
        brightness: 100,
        isDragging: false,
        visible: true,
        zIndex: designElements.length
      };

      setDesignAreas(prev => ({
        ...prev,
        [activeDesignArea]: [...prev[activeDesignArea], newElement]
      }));
      toast.success(`Image added to ${activeDesignArea} design`);
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

    setDesignAreas(prev => ({
      ...prev,
      [activeDesignArea]: prev[activeDesignArea].map(el =>
        el.id === draggedElement
          ? { ...el, x: Math.max(0, Math.min(x, 250)), y: Math.max(0, Math.min(y, 300)) }
          : el
      )
    }));
  }, [draggedElement, dragOffset, activeDesignArea]);

const handleMouseUp = useCallback(() => {
    if (draggedElement) {
      setDesignAreas(prev => ({
        ...prev,
        [activeDesignArea]: prev[activeDesignArea].map(el =>
          el.id === draggedElement
            ? { ...el, isDragging: false }
            : el
        )
      }));
      setDraggedElement(null);
    }
  }, [draggedElement, activeDesignArea]);

const removeElement = (id) => {
    setDesignAreas(prev => ({
      ...prev,
      [activeDesignArea]: prev[activeDesignArea].filter(el => el.id !== id)
    }));
    toast.info("Design element removed");
  };

  const toggleElementVisibility = (id) => {
    setDesignAreas(prev => ({
      ...prev,
      [activeDesignArea]: prev[activeDesignArea].map(el =>
        el.id === id ? { ...el, visible: !el.visible } : el
      )
    }));
  };

  const reorderElement = (dragIndex, hoverIndex) => {
    setDesignAreas(prev => {
      const elements = [...prev[activeDesignArea]];
      const draggedElement = elements[dragIndex];
      elements.splice(dragIndex, 1);
      elements.splice(hoverIndex, 0, draggedElement);
      return {
        ...prev,
        [activeDesignArea]: elements.map((el, index) => ({ ...el, zIndex: index }))
      };
    });
  };

  const updateElementProperty = (id, property, value) => {
    setDesignAreas(prev => ({
      ...prev,
      [activeDesignArea]: prev[activeDesignArea].map(el =>
        el.id === id ? { ...el, [property]: value } : el
      )
    }));
  };



const clearAllElements = () => {
    setDesignAreas(prev => ({
      ...prev,
      [activeDesignArea]: []
    }));
    toast.info(`All ${activeDesignArea} design elements cleared`);
  };

  const clearAllAreas = () => {
    setDesignAreas({
      Front: [],
      Back: [],
      Sleeve: []
    });
    toast.info("All design areas cleared");
  };

const saveDesign = () => {
    if (!designName.trim()) {
      toast.error("Please enter a design name");
      return;
    }

    const design = {
      id: Date.now(),
      name: designName,
      style: selectedStyle,
      color: selectedColor,
      size: selectedSize,
      designAreas: designAreas,
      price: totalPrice,
      createdAt: new Date().toISOString()
    };

    const updatedDesigns = [...savedDesigns, design];
    setSavedDesigns(updatedDesigns);
    localStorage.setItem('savedDesigns', JSON.stringify(updatedDesigns));
    
    setDesignName("");
    setShowSaveDialog(false);
    toast.success(`Design "${design.name}" saved successfully!`);
  };

  const loadDesign = (design) => {
    setSelectedStyle(design.style);
    setSelectedColor(design.color);
    setSelectedSize(design.size);
    setDesignAreas(design.designAreas);
    setShowSavedDesigns(false);
    toast.success(`Design "${design.name}" loaded successfully!`);
  };

  const deleteDesign = (designId) => {
    const updatedDesigns = savedDesigns.filter(d => d.id !== designId);
    setSavedDesigns(updatedDesigns);
    localStorage.setItem('savedDesigns', JSON.stringify(updatedDesigns));
    toast.info("Design deleted");
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
      designAreas: designAreas
    };

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
          {templateName && (
            <div className="mb-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                <ApperIcon name="Template" size={16} className="mr-1" />
                Based on Template: {templateName}
              </span>
            </div>
          )}
          <p className="text-xl text-secondary max-w-2xl mx-auto">
            {templateName 
              ? "Customize this template or create your own unique design with our powerful tools"
              : "Create your own unique designs with our powerful customization tools"
            }
          </p>
        </div>

        {/* Main Studio Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Layers Panel - Collapsible */}
          {showLayersPanel && (
            <div className="xl:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-sm">Layers</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowLayersPanel(false)}
                    className="p-1 h-6 w-6"
                  >
                    <ApperIcon name="X" size={12} />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {designElements.length === 0 ? (
                    <div className="text-xs text-gray-500 text-center py-4">
                      No layers yet
                    </div>
                  ) : (
                    designElements
                      .sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0))
                      .map((element, index) => (
                        <div
                          key={element.id}
                          className={cn(
                            "flex items-center gap-2 p-2 rounded border text-xs cursor-pointer hover:bg-gray-50",
                            selectedElement?.id === element.id && "bg-blue-50 border-blue-200"
                          )}
                          onClick={() => setSelectedElement(element)}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleElementVisibility(element.id);
                            }}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <ApperIcon 
                              name={element.visible ? "Eye" : "EyeOff"} 
                              size={12} 
                            />
                          </button>
                          
                          <ApperIcon 
                            name={element.type === "text" ? "Type" : "Image"} 
                            size={12} 
                            className="text-gray-400"
                          />
                          
                          <span className="flex-1 truncate">
                            {element.type === "text" 
                              ? element.content.substring(0, 10) + (element.content.length > 10 ? "..." : "")
                              : `Image ${index + 1}`
                            }
                          </span>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeElement(element.id);
                            }}
                            className="text-red-400 hover:text-red-600"
                          >
                            <ApperIcon name="Trash2" size={10} />
                          </button>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Design Workspace */}
          <div className={cn("xl:col-span-7", !showLayersPanel && "xl:col-span-9")}>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Design Workspace</h2>
                {!showLayersPanel && (
                  <Button
                    variant="outline"
                    onClick={() => setShowLayersPanel(true)}
                    className="text-sm"
                  >
                    <ApperIcon name="Layers" className="w-4 h-4 mr-2" />
                    Show Layers
                  </Button>
                )}
              </div>
              
              {/* Design Area Tabs */}
              <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
                {["Front", "Back", "Sleeve"].map((area) => (
                  <button
                    key={area}
                    onClick={() => setActiveDesignArea(area)}
                    className={cn(
                      "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all",
                      activeDesignArea === area
                        ? "bg-white text-primary shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    )}
                  >
                    {area}
                    {designAreas[area].length > 0 && (
                      <span className="ml-2 bg-primary text-white text-xs rounded-full px-2 py-0.5">
                        {designAreas[area].length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              
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
                        element.isDragging && "z-50",
                        !element.visible && "opacity-30"
                      )}
                      style={{
                        left: element.x,
                        top: element.y,
                        transform: `scale(${element.isDragging ? 1.05 : 1}) rotate(${element.rotation || 0}deg)`,
                        opacity: element.visible ? (element.opacity || 100) / 100 : 0.3,
                        zIndex: element.zIndex || 0
                      }}
                      onMouseDown={(e) => handleMouseDown(e, element)}
                      onClick={() => setSelectedElement(element)}
                    >
                      {element.type === "text" ? (
                        <div
                          style={{
                            fontFamily: element.font,
                            fontSize: `${element.size}px`,
                            color: element.color,
                            fontWeight: "bold",
                            textShadow: element.shadow > 0 
                              ? `${element.shadow}px ${element.shadow}px ${element.shadow * 2}px ${element.shadowColor || "#000000"}`
                              : element.color === "#FFFFFF" ? "1px 1px 2px rgba(0,0,0,0.3)" : "none",
                            WebkitTextStroke: element.stroke > 0 
                              ? `${element.stroke}px ${element.strokeColor || "#000000"}`
                              : "none"
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
                            objectFit: "contain",
                            filter: element.filter !== "none" 
                              ? `${element.filter} brightness(${element.brightness || 100}%)`
                              : `brightness(${element.brightness || 100}%)`
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
                  {selectedStyle} - {selectedColor.name} - {selectedSize} - {activeDesignArea}
                </div>
              </div>
            </div>
          </div>

          {/* Controls Panel - 30% */}
{/* Tools Panel */}
          <div className="xl:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6 max-h-screen overflow-y-auto">
              <h2 className="text-xl font-semibold">Design Tools</h2>

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

              {/* Text Tool with Effects */}
              <div className="border-t pt-6">
                <h3 className="font-medium mb-4 flex items-center">
                  <ApperIcon name="Type" className="w-4 h-4 mr-2" />
                  Text Tools
                </h3>
                
                <div className="space-y-4">
                  <Input
                    placeholder="Enter your text..."
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                  />
                  
                  {/* Basic Text Properties */}
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
                      <label className="block text-xs font-medium text-gray-600 mb-1">Size: {fontSize}px</label>
                      <input
                        type="range"
                        min="12"
                        max="48"
                        value={fontSize}
                        onChange={(e) => setFontSize(parseInt(e.target.value))}
                        className="w-full"
                      />
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

                  {/* Text Effects */}
                  <div className="bg-gray-50 p-3 rounded-lg space-y-3">
                    <h4 className="text-xs font-semibold text-gray-700">Text Effects</h4>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Stroke: {textStroke}px</label>
                        <input
                          type="range"
                          min="0"
                          max="5"
                          value={textStroke}
                          onChange={(e) => setTextStroke(parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Shadow: {textShadow}px</label>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          value={textShadow}
                          onChange={(e) => setTextShadow(parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Rotation: {textRotation}°</label>
                        <input
                          type="range"
                          min="-180"
                          max="180"
                          value={textRotation}
                          onChange={(e) => setTextRotation(parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Opacity: {textOpacity}%</label>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={textOpacity}
                          onChange={(e) => setTextOpacity(parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="block text-gray-600 mb-1">Stroke Color</label>
                        <input
                          type="color"
                          value={textStrokeColor}
                          onChange={(e) => setTextStrokeColor(e.target.value)}
                          className="w-full h-6 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-600 mb-1">Shadow Color</label>
                        <input
                          type="color"
                          value={textShadowColor}
                          onChange={(e) => setTextShadowColor(e.target.value)}
                          className="w-full h-6 rounded"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button onClick={addTextElement} className="w-full text-sm">
                    <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                    Add Text
                  </Button>
                </div>
              </div>

              {/* Image Tools with Effects */}
              <div className="border-t pt-6">
                <h3 className="font-medium mb-4 flex items-center">
                  <ApperIcon name="Image" className="w-4 h-4 mr-2" />
                  Image Tools
                </h3>
                
                <div className="space-y-4">
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

                  {/* Image Effects */}
                  {selectedElement && selectedElement.type === "image" && (
                    <div className="bg-gray-50 p-3 rounded-lg space-y-3">
                      <h4 className="text-xs font-semibold text-gray-700">Image Effects</h4>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Width: {selectedElement.width}px
                          </label>
                          <input
                            type="range"
                            min="50"
                            max="200"
                            value={selectedElement.width}
                            onChange={(e) => updateElementProperty(selectedElement.id, 'width', parseInt(e.target.value))}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Height: {selectedElement.height}px
                          </label>
                          <input
                            type="range"
                            min="50"
                            max="200"
                            value={selectedElement.height}
                            onChange={(e) => updateElementProperty(selectedElement.id, 'height', parseInt(e.target.value))}
                            className="w-full"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Rotation: {selectedElement.rotation || 0}°
                          </label>
                          <input
                            type="range"
                            min="-180"
                            max="180"
                            value={selectedElement.rotation || 0}
                            onChange={(e) => updateElementProperty(selectedElement.id, 'rotation', parseInt(e.target.value))}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Opacity: {selectedElement.opacity || 100}%
                          </label>
                          <input
                            type="range"
                            min="10"
                            max="100"
                            value={selectedElement.opacity || 100}
                            onChange={(e) => updateElementProperty(selectedElement.id, 'opacity', parseInt(e.target.value))}
                            className="w-full"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Filter</label>
                        <select
                          value={selectedElement.filter || "none"}
                          onChange={(e) => updateElementProperty(selectedElement.id, 'filter', e.target.value)}
                          className="w-full p-2 text-sm border border-gray-300 rounded"
                        >
                          <option value="none">None</option>
                          <option value="grayscale(100%)">Grayscale</option>
                          <option value="sepia(100%)">Sepia</option>
                          <option value="blur(2px)">Blur</option>
                          <option value="contrast(150%)">High Contrast</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          Brightness: {selectedElement.brightness || 100}%
                        </label>
                        <input
                          type="range"
                          min="50"
                          max="150"
                          value={selectedElement.brightness || 100}
                          onChange={(e) => updateElementProperty(selectedElement.id, 'brightness', parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Price Display */}
              <div className="border-t pt-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Base Price:</span>
                    <span>${basePrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Customizations ({totalElements}):</span>
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
                  <Button 
                    variant="outline" 
                    onClick={() => setShowSaveDialog(true)}
                    className="text-sm"
                  >
                    <ApperIcon name="Save" className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowSavedDesigns(true)}
                    className="text-sm"
                  >
                    <ApperIcon name="FolderOpen" className="w-4 h-4 mr-1" />
                    Designs
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={clearAllElements} className="text-sm">
                    <ApperIcon name="Trash2" className="w-4 h-4 mr-1" />
                    Clear Area
                  </Button>
                  <Button variant="outline" onClick={clearAllAreas} className="text-sm">
                    <ApperIcon name="RotateCcw" className="w-4 h-4 mr-1" />
                    Reset All
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Design Dialog */}
        {showSaveDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-96 max-w-90vw">
              <h3 className="text-xl font-semibold mb-4">Save Design</h3>
              <Input
                placeholder="Enter design name..."
                value={designName}
                onChange={(e) => setDesignName(e.target.value)}
                className="mb-4"
              />
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowSaveDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={saveDesign}
                  className="flex-1"
                >
                  Save Design
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Saved Designs Dialog */}
        {showSavedDesigns && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-[600px] max-w-90vw max-h-[80vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Saved Designs</h3>
                <Button
                  variant="outline"
                  onClick={() => setShowSavedDesigns(false)}
                  className="p-2"
                >
                  <ApperIcon name="X" size={16} />
                </Button>
              </div>
              
              <div className="overflow-y-auto flex-1">
                {savedDesigns.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No saved designs yet
                  </div>
                ) : (
                  <div className="space-y-3">
                    {savedDesigns.map((design) => (
                      <div key={design.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{design.name}</h4>
                            <p className="text-sm text-gray-500">
                              {design.style} - {design.color.name} - {design.size}
                            </p>
                            <p className="text-xs text-gray-400">
                              {new Date(design.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <PriceDisplay price={design.price} className="text-sm" />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => loadDesign(design)}
                            >
                              Load
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteDesign(design.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <ApperIcon name="Trash2" size={14} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default CustomStudio;