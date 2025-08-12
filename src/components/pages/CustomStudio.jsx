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
// Design validation constants
const PRINT_AREA = {
  width: 220,
  height: 280,
  x: 40,
  y: 60
};

const MIN_TEXT_SIZE = 8; // Minimum readable text size in pixels
const MIN_IMAGE_RESOLUTION = 150; // Minimum DPI for good print quality
const RECOMMENDED_IMAGE_SIZE = 300; // Recommended minimum pixel dimension

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
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [designWarnings, setDesignWarnings] = useState([]);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [exportFormat, setExportFormat] = useState('png');
  const [exportResolution, setExportResolution] = useState('high');
  const [shareLink, setShareLink] = useState('');
  const [isGeneratingShare, setIsGeneratingShare] = useState(false);
  // Get current design elements
const designElements = designAreas[activeDesignArea];
  
  // Alignment and grid state
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [gridSize, setGridSize] = useState(10);
  const [showGrid, setShowGrid] = useState(false);
  const [selectedElements, setSelectedElements] = useState([]);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [minElementSize, setMinElementSize] = useState(20);
  const [maxElementSize, setMaxElementSize] = useState(200);

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
// Design validation helpers
  const isElementInPrintArea = (element) => {
    const elementRight = element.x + (element.width || 100);
    const elementBottom = element.y + (element.type === 'text' ? element.size || 16 : element.height || 100);
    
    return (
      element.x >= PRINT_AREA.x &&
      element.y >= PRINT_AREA.y &&
      elementRight <= PRINT_AREA.x + PRINT_AREA.width &&
      elementBottom <= PRINT_AREA.y + PRINT_AREA.height
    );
  };

  const validateDesign = () => {
    const warnings = [];
    const allElements = Object.values(designAreas).flat();
    
    allElements.forEach(element => {
      if (!isElementInPrintArea(element)) {
        warnings.push({
          id: element.id,
          type: 'print-area',
          message: `${element.type === 'text' ? 'Text' : 'Image'} extends outside printable area`
        });
      }
      
      if (element.type === 'text' && element.size < MIN_TEXT_SIZE) {
        warnings.push({
          id: element.id,
          type: 'text-size',
          message: `Text size ${element.size}px may be too small for printing (min: ${MIN_TEXT_SIZE}px)`
        });
      }
      
      if (element.type === 'image' && element.lowResolution) {
        warnings.push({
          id: element.id,
          type: 'image-resolution',
          message: 'Image resolution may be too low for good print quality'
        });
      }
    });
    
    setDesignWarnings(warnings);
    return warnings;
  };

// Enhanced pricing calculation with complexity
  const basePrice = 24.99;
  const totalElements = Object.values(designAreas).reduce((total, elements) => total + elements.length, 0);
  
  // Calculate design complexity
  const calculateComplexity = () => {
    const allElements = Object.values(designAreas).flat();
    let complexityScore = 0;
    
    allElements.forEach(element => {
      if (element.type === 'text') {
        // Base text complexity
        complexityScore += 1;
        // Additional complexity for effects
        if (element.stroke > 0) complexityScore += 0.5;
        if (element.shadow > 0) complexityScore += 0.5;
        if (element.rotation !== 0) complexityScore += 0.3;
      } else if (element.type === 'image') {
        // Base image complexity
        complexityScore += 2;
        // Additional complexity for effects
        if (element.filter !== 'none') complexityScore += 0.5;
        if (element.rotation !== 0) complexityScore += 0.3;
      }
    });
    
    return complexityScore;
  };
  
  const complexityScore = calculateComplexity();
  const getComplexityLevel = (score) => {
    if (score <= 2) return { level: 'Simple', multiplier: 1.0, color: 'green' };
    if (score <= 5) return { level: 'Moderate', multiplier: 1.2, color: 'yellow' };
    if (score <= 8) return { level: 'Complex', multiplier: 1.5, color: 'orange' };
    return { level: 'Very Complex', multiplier: 2.0, color: 'red' };
  };
  
  const complexity = getComplexityLevel(complexityScore);
  const baseCost = totalElements * 3.99;
  const customizationCost = baseCost * complexity.multiplier;
  const totalPrice = basePrice + customizationCost;
const addTextElement = () => {
    if (!textInput.trim()) {
      toast.error("Please enter some text");
      return;
    }

    // Validate text size
    if (fontSize < MIN_TEXT_SIZE) {
      toast.warning(`Text size ${fontSize}px may be too small for printing. Recommended minimum: ${MIN_TEXT_SIZE}px`);
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

    // Check if element is in print area
    if (!isElementInPrintArea(newElement)) {
      toast.warning("Text may be outside the printable area. Use Print Preview to check positioning.");
    }

    setDesignAreas(prev => ({
      ...prev,
      [activeDesignArea]: [...prev[activeDesignArea], newElement]
    }));
    setTextInput("");
    toast.success(`Text added to ${activeDesignArea} design`);
    
    // Update validation warnings
    setTimeout(() => validateDesign(), 100);
  };

const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Please select a valid image file");
      return;
    }

    // Check file size and estimate resolution
    const fileSizeKB = file.size / 1024;
    let isLowResolution = false;
    
    if (fileSizeKB < 50) {
      toast.warning("Image file size is very small and may result in poor print quality.");
      isLowResolution = true;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      // Create image element to check dimensions
      const img = new Image();
      img.onload = () => {
        let resolutionWarning = false;
        
        // Check image dimensions
        if (img.width < RECOMMENDED_IMAGE_SIZE || img.height < RECOMMENDED_IMAGE_SIZE) {
          toast.warning(`Image dimensions (${img.width}×${img.height}) may be too small for good print quality. Recommended: ${RECOMMENDED_IMAGE_SIZE}×${RECOMMENDED_IMAGE_SIZE} or larger.`);
          isLowResolution = true;
          resolutionWarning = true;
        }
        
        // Estimate DPI based on dimensions and file size
        const estimatedDPI = Math.sqrt((img.width * img.height) / (fileSizeKB / 100));
        if (estimatedDPI < MIN_IMAGE_RESOLUTION) {
          toast.warning("Image may have low resolution for printing. For best results, use high-resolution images.");
          isLowResolution = true;
          resolutionWarning = true;
        }
        
        const newElement = {
          id: Date.now() + Math.random(),
          type: "image",
          content: e.target.result,
          x: 100,
          y: 150,
          width: Math.min(100, img.width / 2),
          height: Math.min(100, img.height / 2),
          originalWidth: img.width,
          originalHeight: img.height,
          rotation: 0,
          opacity: 100,
          filter: "none",
          brightness: 100,
          isDragging: false,
          visible: true,
          zIndex: designElements.length,
          lowResolution: isLowResolution
        };

        // Check if element is in print area
        if (!isElementInPrintArea(newElement)) {
          toast.warning("Image may be outside the printable area. Use Print Preview to check positioning.");
        }

        setDesignAreas(prev => ({
          ...prev,
          [activeDesignArea]: [...prev[activeDesignArea], newElement]
        }));
        
        let successMessage = `Image added to ${activeDesignArea} design`;
        if (resolutionWarning) {
          successMessage += " (check resolution warnings)";
        }
        toast.success(successMessage);
        
        // Update validation warnings
        setTimeout(() => validateDesign(), 100);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };
// Template quick-add functions
  const addQuoteElement = () => {
    const quotes = [
      "Be Yourself",
      "Stay Strong",
      "Dream Big",
      "Never Give Up",
      "Make It Happen",
      "Believe & Achieve"
    ];
    
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    
    const newElement = {
      id: Date.now() + Math.random(),
      type: "text",
      content: randomQuote,
      font: "Impact",
      color: "#000000",
      size: 28,
      stroke: 1,
      strokeColor: "#FFFFFF",
      shadow: 2,
      shadowColor: "#666666",
      rotation: 0,
      opacity: 100,
      x: 80,
      y: 120,
      isDragging: false,
      visible: true,
      zIndex: designElements.length
    };

    // Check if element is in print area
    if (!isElementInPrintArea(newElement)) {
      toast.warning("Quote may be outside the printable area. Use Print Preview to check positioning.");
    }

    setDesignAreas(prev => ({
      ...prev,
      [activeDesignArea]: [...prev[activeDesignArea], newElement]
    }));
    
    toast.success(`Inspirational quote added to ${activeDesignArea} design`);
    setTimeout(() => validateDesign(), 100);
  };

  const addLogoPlaceholder = () => {
    // Create a simple placeholder "logo" using canvas
    const canvas = document.createElement('canvas');
    canvas.width = 120;
    canvas.height = 120;
    const ctx = canvas.getContext('2d');
    
    // Draw placeholder logo design
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, 120, 120);
    ctx.strokeStyle = '#cccccc';
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(10, 10, 100, 100);
    
    // Add "LOGO" text
    ctx.fillStyle = '#999999';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('LOGO', 60, 65);
    
    const placeholderDataUrl = canvas.toDataURL();
    
    const newElement = {
      id: Date.now() + Math.random(),
      type: "image",
      content: placeholderDataUrl,
      x: 90,
      y: 80,
      width: 80,
      height: 80,
      originalWidth: 120,
      originalHeight: 120,
      rotation: 0,
      opacity: 100,
      filter: "none",
      brightness: 100,
      isDragging: false,
      visible: true,
      zIndex: designElements.length,
      lowResolution: false
    };

    // Check if element is in print area
    if (!isElementInPrintArea(newElement)) {
      toast.warning("Logo placeholder may be outside the printable area. Use Print Preview to check positioning.");
    }

    setDesignAreas(prev => ({
      ...prev,
      [activeDesignArea]: [...prev[activeDesignArea], newElement]
    }));
    
    toast.success(`Logo placeholder added to ${activeDesignArea} design`);
    setTimeout(() => validateDesign(), 100);
  };

  const addBorderElement = () => {
    // Add four border elements (top, bottom, left, right)
    const borderElements = [
      // Top border
      {
        id: Date.now() + Math.random(),
        type: "text",
        content: "━━━━━━━━━━━━━━━━━━━━",
        font: "Arial",
        color: "#000000",
        size: 16,
        stroke: 0,
        strokeColor: "#000000",
        shadow: 0,
        shadowColor: "#000000",
        rotation: 0,
        opacity: 100,
        x: 50,
        y: 70,
        isDragging: false,
        visible: true,
        zIndex: designElements.length
      },
      // Bottom border
      {
        id: Date.now() + Math.random() + 0.1,
        type: "text", 
        content: "━━━━━━━━━━━━━━━━━━━━",
        font: "Arial",
        color: "#000000",
        size: 16,
        stroke: 0,
        strokeColor: "#000000",
        shadow: 0,
        shadowColor: "#000000",
        rotation: 0,
        opacity: 100,
        x: 50,
        y: 300,
        isDragging: false,
        visible: true,
        zIndex: designElements.length + 1
      }
    ];

    let elementsInPrintArea = 0;
    borderElements.forEach(element => {
      if (isElementInPrintArea(element)) {
        elementsInPrintArea++;
      }
    });

    if (elementsInPrintArea < borderElements.length) {
      toast.warning("Some border elements may be outside the printable area. Use Print Preview to check positioning.");
    }

    setDesignAreas(prev => ({
      ...prev,
      [activeDesignArea]: [...prev[activeDesignArea], ...borderElements]
    }));
    
    toast.success(`Decorative border added to ${activeDesignArea} design`);
    setTimeout(() => validateDesign(), 100);
  };
  const handleMouseDown = useCallback((e, element) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
setDraggedElement(element.id);
    
    setDesignAreas(prev => ({
      ...prev,
      [activeDesignArea]: prev[activeDesignArea].map(el => 
        el.id === element.id 
          ? { ...el, isDragging: true }
          : el
      )
    }));
  }, [activeDesignArea]);

const handleMouseMove = useCallback((e) => {
    if (!draggedElement) return;

const mockupRect = document.querySelector('.t-shirt-mockup').getBoundingClientRect();
    let x = e.clientX - mockupRect.left - dragOffset.x;
    let y = e.clientY - mockupRect.top - dragOffset.y;

    // Apply snap-to-grid
    if (snapToGrid) {
      x = Math.round(x / gridSize) * gridSize;
      y = Math.round(y / gridSize) * gridSize;
    }

    setDesignAreas(prev => ({
      ...prev,
      [activeDesignArea]: prev[activeDesignArea].map(el => {
        if (el.id === draggedElement) {
          const updatedElement = { ...el, x: Math.max(0, Math.min(x, 250)), y: Math.max(0, Math.min(y, 300)) };
          
          // Show warning if dragging outside print area
          if (showPrintPreview && !isElementInPrintArea(updatedElement)) {
            // Debounced warning to avoid spam
            clearTimeout(window.printAreaWarning);
            window.printAreaWarning = setTimeout(() => {
              toast.warning("Element is outside the printable area", { toastId: 'print-area-warning' });
            }, 500);
          }
          
          return updatedElement;
        }
        return el;
      })
    }));
    
    // Update validation warnings after drag
    setTimeout(() => validateDesign(), 100);
  }, [draggedElement, dragOffset, activeDesignArea, showPrintPreview]);

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
      [activeDesignArea]: prev[activeDesignArea].map(el => {
        if (el.id === id) {
let updatedElement = { ...el, [property]: value };
          
          // Apply size constraints
          if ((property === 'width' || property === 'height') && updatedElement.type === 'image') {
            let newValue = Math.max(minElementSize, Math.min(value, maxElementSize));
            
            if (maintainAspectRatio && updatedElement.originalWidth && updatedElement.originalHeight) {
              const aspectRatio = updatedElement.originalWidth / updatedElement.originalHeight;
              if (property === 'width') {
                updatedElement = { ...updatedElement, width: newValue, height: newValue / aspectRatio };
              } else if (property === 'height') {
                updatedElement = { ...updatedElement, height: newValue, width: newValue * aspectRatio };
              }
            } else {
              updatedElement = { ...updatedElement, [property]: newValue };
            }
          }
          
          // Validate text size changes
          if (property === 'size' && updatedElement.type === 'text' && value < MIN_TEXT_SIZE) {
            toast.warning(`Text size ${value}px may be too small for printing. Recommended minimum: ${MIN_TEXT_SIZE}px`);
          }
          
          return updatedElement;
        }
        return el;
      })
    }));
    
    // Update validation warnings after property change
    setTimeout(() => validateDesign(), 100);
  };

  // Alignment helper functions
  const centerElementsHorizontally = () => {
    if (selectedElements.length === 0) {
      toast.warning("Please select elements to align");
      return;
    }
    
    const centerX = 150; // Center of mockup
    setDesignAreas(prev => ({
      ...prev,
      [activeDesignArea]: prev[activeDesignArea].map(el => 
        selectedElements.includes(el.id) ? { ...el, x: centerX } : el
      )
    }));
    toast.success(`${selectedElements.length} element(s) centered horizontally`);
  };

  const centerElementsVertically = () => {
    if (selectedElements.length === 0) {
      toast.warning("Please select elements to align");
      return;
    }
    
    const centerY = 150; // Center of mockup
    setDesignAreas(prev => ({
      ...prev,
      [activeDesignArea]: prev[activeDesignArea].map(el => 
        selectedElements.includes(el.id) ? { ...el, y: centerY } : el
      )
    }));
    toast.success(`${selectedElements.length} element(s) centered vertically`);
  };

  const alignElementsToFirst = (direction) => {
    if (selectedElements.length < 2) {
      toast.warning("Please select at least 2 elements to align");
      return;
    }
    
    const firstElement = designElements.find(el => el.id === selectedElements[0]);
    if (!firstElement) return;
    
    const alignValue = direction === 'horizontal' ? firstElement.x : firstElement.y;
    const property = direction === 'horizontal' ? 'x' : 'y';
    
    setDesignAreas(prev => ({
      ...prev,
      [activeDesignArea]: prev[activeDesignArea].map(el => 
        selectedElements.includes(el.id) && el.id !== firstElement.id 
          ? { ...el, [property]: alignValue } 
          : el
      )
    }));
    toast.success(`Elements aligned ${direction}ly to first selected element`);
  };

  const distributeElementsEvenly = (direction) => {
    if (selectedElements.length < 3) {
      toast.warning("Please select at least 3 elements to distribute");
      return;
    }
    
    const elements = designElements.filter(el => selectedElements.includes(el.id));
    const property = direction === 'horizontal' ? 'x' : 'y';
    const sortedElements = [...elements].sort((a, b) => a[property] - b[property]);
    
    const first = sortedElements[0][property];
    const last = sortedElements[sortedElements.length - 1][property];
    const spacing = (last - first) / (sortedElements.length - 1);
    
    setDesignAreas(prev => ({
      ...prev,
      [activeDesignArea]: prev[activeDesignArea].map(el => {
        const index = sortedElements.findIndex(sorted => sorted.id === el.id);
        return index !== -1 
          ? { ...el, [property]: first + (index * spacing) }
          : el;
      })
    }));
    toast.success(`Elements distributed evenly ${direction === 'horizontal' ? 'horizontally' : 'vertically'}`);
  };

  const adjustMarginFromEdges = (side, margin) => {
    if (selectedElements.length === 0) {
      toast.warning("Please select elements to adjust margins");
      return;
    }
    
    const mockupWidth = 300;
    const mockupHeight = 400;
    
    setDesignAreas(prev => ({
      ...prev,
      [activeDesignArea]: prev[activeDesignArea].map(el => {
        if (!selectedElements.includes(el.id)) return el;
        
        let updates = {};
        switch (side) {
          case 'left':
            updates.x = margin;
            break;
          case 'right':
            updates.x = mockupWidth - margin - (el.width || 100);
            break;
          case 'top':
            updates.y = margin;
            break;
          case 'bottom':
            updates.y = mockupHeight - margin - (el.type === 'text' ? el.size || 20 : el.height || 100);
            break;
        }
        return { ...el, ...updates };
      })
    }));
    toast.success(`Adjusted margin from ${side} edge`);
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

  const toggleElementSelection = (elementId) => {
    setSelectedElements(prev => {
      if (prev.includes(elementId)) {
        return prev.filter(id => id !== elementId);
      } else {
        return [...prev, elementId];
      }
    });
  };

  const clearSelection = () => {
    setSelectedElements([]);
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
  const exportDesign = async () => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set resolution based on selection
      const resolutions = {
        'standard': { width: 800, height: 1000 },
        'high': { width: 1600, height: 2000 },
        'print': { width: 3200, height: 4000 }
      };
      
      const resolution = resolutions[exportResolution];
      canvas.width = resolution.width;
      canvas.height = resolution.height;
      
      // Fill background with shirt color
      ctx.fillStyle = selectedColor.value;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Scale design elements to canvas resolution
      const scale = canvas.width / 300; // 300 is mockup width
      
      for (const element of designElements) {
        ctx.save();
        ctx.translate(element.x * scale, element.y * scale);
        ctx.rotate((element.rotation || 0) * Math.PI / 180);
        
        if (element.type === 'text') {
          ctx.font = `${(element.fontSize || 20) * scale}px Arial`;
          ctx.fillStyle = element.color || '#000000';
          ctx.textAlign = 'center';
          ctx.fillText(element.text, 0, 0);
        } else if (element.type === 'image' && element.src) {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          await new Promise((resolve) => {
            img.onload = () => {
              ctx.drawImage(img, -element.width * scale / 2, -element.height * scale / 2, element.width * scale, element.height * scale);
              resolve();
            };
            img.src = element.src;
          });
        }
        ctx.restore();
      }
      
      // Download the image
      const link = document.createElement('a');
      link.download = `custom-design-${Date.now()}.${exportFormat}`;
      link.href = canvas.toDataURL(`image/${exportFormat}`);
      link.click();
      
      toast.success(`Design exported as ${exportFormat.toUpperCase()} successfully!`);
      setShowExportDialog(false);
    } catch (error) {
      toast.error('Failed to export design. Please try again.');
    }
  };

  const generateShareLink = async () => {
    setIsGeneratingShare(true);
    try {
      const designData = {
        selectedStyle,
        selectedColor,
        selectedSize,
        designElements,
        designAreas,
        totalPrice,
        createdAt: new Date().toISOString()
      };
      
      // Generate unique ID for the share
      const shareId = `design_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Store design temporarily (in real app, this would be sent to backend)
      localStorage.setItem(`shared_design_${shareId}`, JSON.stringify(designData));
      
      // Create shareable URL
      const baseUrl = window.location.origin;
      const shareUrl = `${baseUrl}/design-preview/${shareId}`;
      setShareLink(shareUrl);
      
      // Copy to clipboard
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Share link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to generate share link. Please try again.');
    } finally {
      setIsGeneratingShare(false);
    }
  };
return (
    <>
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
                  {/* Color Preview Selector */}
                  <div className="absolute top-4 left-4 bg-white rounded-lg p-3 shadow-md">
                    <div className="text-xs font-medium text-gray-600 mb-2">Color Preview</div>
                    <div className="flex gap-1">
                      {availableColors.slice(0, 5).map((color) => (
                        <button
                          key={color.name}
                          onClick={() => setSelectedColor(color)}
                          className={cn(
                            "w-6 h-6 rounded border-2 transition-all",
                            selectedColor.name === color.name 
                              ? "border-blue-500 ring-2 ring-blue-200" 
                              : "border-gray-200 hover:border-gray-300"
                          )}
                          style={{ backgroundColor: color.value }}
                          title={`Preview on ${color.name}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Design Complexity Indicator */}
                  <div className="absolute top-4 right-4 bg-white rounded-lg p-3 shadow-md">
                    <div className="text-xs font-medium text-gray-600 mb-1">Design Complexity</div>
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-3 h-3 rounded-full",
                        complexity.color === 'green' && "bg-green-500",
                        complexity.color === 'yellow' && "bg-yellow-500",
                        complexity.color === 'orange' && "bg-orange-500",
                        complexity.color === 'red' && "bg-red-500"
                      )} />
                      <span className="text-sm font-medium">{complexity.level}</span>
                      <span className="text-xs text-gray-500">
                        (+{((complexity.multiplier - 1) * 100).toFixed(0)}%)
                      </span>
                    </div>
                  </div>

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
                    {/* Print Area Boundaries */}
                    {showPrintPreview && (
                      <div
                        className="absolute border-2 border-dashed border-blue-500 bg-blue-50 bg-opacity-20 pointer-events-none"
                        style={{
                          left: PRINT_AREA.x,
                          top: PRINT_AREA.y,
                          width: PRINT_AREA.width,
                          height: PRINT_AREA.height
                        }}
                      >
                        <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                          Print Area
                        </div>
                      </div>
                    )}

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
                    {designElements.map((element) => {
                      const hasWarning = designWarnings.some(w => w.id === element.id);
                      const isOutsidePrintArea = showPrintPreview && !isElementInPrintArea(element);
                      
                      // Color contrast warning for text elements
                      const hasColorContrast = element.type === 'text' && 
                        element.color === selectedColor.value && 
                        element.stroke === 0 && 
                        element.shadow === 0;
                      
                      return (
                        <div
                          key={element.id}
                          className={cn(
                            "absolute cursor-move select-none group",
                            element.isDragging && "z-50",
                            !element.visible && "opacity-30",
                            hasWarning && "ring-2 ring-yellow-400 ring-opacity-50",
                            isOutsidePrintArea && "ring-2 ring-red-400 ring-opacity-50",
                            hasColorContrast && "ring-2 ring-purple-400 ring-opacity-50"
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
                                  : hasColorContrast 
                                  ? "1px 1px 3px rgba(0,0,0,0.8), -1px -1px 3px rgba(255,255,255,0.8)"
                                  : element.color === "#FFFFFF" ? "1px 1px 2px rgba(0,0,0,0.3)" : "none",
                                WebkitTextStroke: element.stroke > 0 
                                  ? `${element.stroke}px ${element.strokeColor || "#000000"}`
                                  : "none"
                              }}
                            >
                              {element.content}
                            </div>
                          ) : (
                            <div className="relative">
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
                              {/* Low resolution warning indicator */}
                              {element.lowResolution && (
                                <div className="absolute -top-1 -left-1 bg-yellow-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold">
                                  !
                                </div>
                              )}
                            </div>
                          )}
                          
                          {/* Color contrast warning */}
                          {hasColorContrast && (
                            <div className="absolute -top-2 -left-2 bg-purple-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                              👁
                            </div>
                          )}
                          
                          {/* Warning indicators */}
                          {hasWarning && (
                            <div className="absolute -top-2 -left-2 bg-yellow-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                              ⚠
                            </div>
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
                      );
                    })}
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
{/* Design Validation Controls */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800">Design Validation</h3>
                  <Button
                    variant={showPrintPreview ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowPrintPreview(!showPrintPreview)}
                  >
                    <ApperIcon name={showPrintPreview ? "EyeOff" : "Eye"} className="w-4 h-4 mr-1" />
                    Print Preview
                  </Button>
                </div>
                
                {designWarnings.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 space-y-2">
                    <div className="flex items-center text-yellow-800 text-sm font-medium">
                      <ApperIcon name="AlertTriangle" className="w-4 h-4 mr-2" />
                      Design Warnings ({designWarnings.length})
                    </div>
                    <div className="space-y-1 text-sm text-yellow-700">
                      {designWarnings.slice(0, 3).map((warning, index) => (
                        <div key={index} className="flex items-start">
                          <span className="w-1 h-1 bg-yellow-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                          {warning.message}
                        </div>
                      ))}
                      {designWarnings.length > 3 && (
                        <div className="text-yellow-600 font-medium">
                          +{designWarnings.length - 3} more warnings
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {showPrintPreview && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                    <div className="flex items-center text-blue-800 text-sm">
                      <ApperIcon name="Info" className="w-4 h-4 mr-2" />
                      Print area is highlighted in blue. Elements outside this area may not print properly.
                    </div>
                  </div>
                )}
              </div>

              {/* Style Selector */}
{/* Snap to Grid & Alignment Tools */}
              <div className="border-t pt-6">
                <h3 className="font-medium mb-4 flex items-center">
                  <ApperIcon name="Grid3x3" className="w-4 h-4 mr-2" />
                  Precision Tools
                </h3>
                
                <div className="space-y-4">
                  {/* Grid Controls */}
                  <div className="bg-gray-50 p-3 rounded-lg space-y-3">
                    <h4 className="text-xs font-semibold text-gray-700">Snap to Grid</h4>
                    <div className="flex items-center justify-between">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={snapToGrid}
                          onChange={(e) => setSnapToGrid(e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm">Enable Snap</span>
                      </label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowGrid(!showGrid)}
                        className="text-xs px-2 py-1"
                      >
                        {showGrid ? 'Hide' : 'Show'} Grid
                      </Button>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Grid Size: {gridSize}px</label>
                      <input
                        type="range"
                        min="5"
                        max="20"
                        value={gridSize}
                        onChange={(e) => setGridSize(parseInt(e.target.value))}
                        className="w-full"
                        disabled={!snapToGrid}
                      />
                    </div>
                  </div>

                  {/* Element Selection */}
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-semibold text-blue-800">
                        Selected: {selectedElements.length} element(s)
                      </h4>
                      {selectedElements.length > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearSelection}
                          className="text-xs px-2 py-1"
                        >
                          Clear
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-blue-600">
                      Shift+click elements in the workspace to select multiple for alignment
                    </p>
                  </div>

                  {/* Alignment Controls */}
                  <div className="bg-gray-50 p-3 rounded-lg space-y-3">
                    <h4 className="text-xs font-semibold text-gray-700">Alignment Tools</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={centerElementsHorizontally}
                        className="text-xs"
                        disabled={selectedElements.length === 0}
                      >
                        <ApperIcon name="AlignCenter" className="w-3 h-3 mr-1" />
                        H-Center
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={centerElementsVertically}
                        className="text-xs"
                        disabled={selectedElements.length === 0}
                      >
                        <ApperIcon name="AlignCenter" className="w-3 h-3 mr-1" />
                        V-Center
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => alignElementsToFirst('horizontal')}
                        className="text-xs"
                        disabled={selectedElements.length < 2}
                      >
                        <ApperIcon name="AlignLeft" className="w-3 h-3 mr-1" />
                        H-Align
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => alignElementsToFirst('vertical')}
                        className="text-xs"
                        disabled={selectedElements.length < 2}
                      >
                        <ApperIcon name="AlignTop" className="w-3 h-3 mr-1" />
                        V-Align
                      </Button>
                    </div>
                  </div>

                  {/* Spacing Controls */}
                  <div className="bg-gray-50 p-3 rounded-lg space-y-3">
                    <h4 className="text-xs font-semibold text-gray-700">Spacing Controls</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => distributeElementsEvenly('horizontal')}
                        className="text-xs"
                        disabled={selectedElements.length < 3}
                      >
                        <ApperIcon name="DistributeHorizontal" className="w-3 h-3 mr-1" />
                        H-Distribute
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => distributeElementsEvenly('vertical')}
                        className="text-xs"
                        disabled={selectedElements.length < 3}
                      >
                        <ApperIcon name="DistributeVertical" className="w-3 h-3 mr-1" />
                        V-Distribute
                      </Button>
                    </div>
                    <div className="grid grid-cols-4 gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => adjustMarginFromEdges('left', 20)}
                        className="text-xs p-1"
                        disabled={selectedElements.length === 0}
                        title="Align to left edge"
                      >
                        ←
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => adjustMarginFromEdges('top', 20)}
                        className="text-xs p-1"
                        disabled={selectedElements.length === 0}
                        title="Align to top edge"
                      >
                        ↑
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => adjustMarginFromEdges('bottom', 20)}
                        className="text-xs p-1"
                        disabled={selectedElements.length === 0}
                        title="Align to bottom edge"
                      >
                        ↓
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => adjustMarginFromEdges('right', 20)}
                        className="text-xs p-1"
                        disabled={selectedElements.length === 0}
                        title="Align to right edge"
                      >
                        →
                      </Button>
                    </div>
                  </div>

                  {/* Size Constraints */}
                  <div className="bg-gray-50 p-3 rounded-lg space-y-3">
                    <h4 className="text-xs font-semibold text-gray-700">Size Constraints</h4>
                    <label className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={maintainAspectRatio}
                        onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                        className="mr-2"
                      />
                      Maintain Aspect Ratio
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Min Size: {minElementSize}px</label>
                        <input
                          type="range"
                          min="10"
                          max="50"
                          value={minElementSize}
                          onChange={(e) => setMinElementSize(parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Max Size: {maxElementSize}px</label>
                        <input
                          type="range"
                          min="100"
                          max="300"
                          value={maxElementSize}
                          onChange={(e) => setMaxElementSize(parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

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

              {/* Template Quick-Add Buttons */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <ApperIcon name="Zap" className="w-4 h-4 mr-2" />
                  Design Templates
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    variant="outline"
                    onClick={addQuoteElement}
                    className="w-full justify-start text-sm h-9"
                  >
                    <ApperIcon name="Quote" className="w-4 h-4 mr-2" />
                    Add Quote
                  </Button>
                  <Button
                    variant="outline"
                    onClick={addLogoPlaceholder}
                    className="w-full justify-start text-sm h-9"
                  >
                    <ApperIcon name="Image" className="w-4 h-4 mr-2" />
                    Add Logo Placeholder
                  </Button>
                  <Button
                    variant="outline"
                    onClick={addBorderElement}
                    className="w-full justify-start text-sm h-9"
                  >
                    <ApperIcon name="Square" className="w-4 h-4 mr-2" />
                    Add Border
                  </Button>
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
                    <span>Elements ({totalElements}):</span>
                    <span>${baseCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Complexity ({complexity.level}):</span>
                    <span className={cn(
                      "font-medium",
                      complexity.color === 'green' && "text-green-600",
                      complexity.color === 'yellow' && "text-yellow-600",
                      complexity.color === 'orange' && "text-orange-600",
                      complexity.color === 'red' && "text-red-600"
                    )}>
                      +{((complexity.multiplier - 1) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Total Customizations:</span>
                    <span>${customizationCost.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <PriceDisplay 
                      price={totalPrice} 
                      complexity={complexity}
                      className="text-lg font-semibold" 
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
<div className="space-y-3">
                {/* Design validation button */}
                <Button 
                  onClick={() => {
                    const warnings = validateDesign();
                    if (warnings.length === 0) {
                      toast.success("Design validated successfully! No issues found.");
                    } else {
                      toast.warning(`Design has ${warnings.length} warning${warnings.length > 1 ? 's' : ''}. Check the validation panel.`);
                    }
                  }}
                  variant="outline"
                  className="w-full mb-2"
                >
                  <ApperIcon name="CheckCircle2" className="w-4 h-4 mr-2" />
                  Validate Design
                </Button>
                
                <Button 
                  onClick={() => {
                    const warnings = validateDesign();
                    if (warnings.length > 0) {
                      toast.error(`Please fix ${warnings.length} design warning${warnings.length > 1 ? 's' : ''} before adding to cart.`);
                      return;
                    }
                    addToCart();
                  }} 
                  className="w-full"
                >
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
                
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowExportDialog(true)}
                    className="text-sm"
                  >
                    <ApperIcon name="Download" className="w-4 h-4 mr-1" />
                    Export
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowShareDialog(true)}
                    className="text-sm"
                  >
                    <ApperIcon name="Share2" className="w-4 h-4 mr-1" />
                    Share
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

        {/* Export Dialog */}
        {showExportDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-[400px] max-w-90vw">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Export Design</h3>
                <Button
                  variant="outline"
                  onClick={() => setShowExportDialog(false)}
                  className="p-2"
                >
                  <ApperIcon name="X" size={16} />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Export Format
                  </label>
                  <select
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="png">PNG (Best Quality)</option>
                    <option value="jpeg">JPEG (Smaller Size)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resolution
                  </label>
                  <select
                    value={exportResolution}
                    onChange={(e) => setExportResolution(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="standard">Standard (800x1000px)</option>
                    <option value="high">High (1600x2000px)</option>
                    <option value="print">Print Ready (3200x4000px)</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-3 mt-6">
                  <Button
                    onClick={exportDesign}
                    className="flex-1"
                  >
                    <ApperIcon name="Download" className="w-4 h-4 mr-2" />
                    Export Design
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowExportDialog(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Share Dialog */}
        {showShareDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-[500px] max-w-90vw">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Share Design</h3>
                <Button
                  variant="outline"
                  onClick={() => setShowShareDialog(false)}
                  className="p-2"
                >
                  <ApperIcon name="X" size={16} />
                </Button>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-600 text-sm">
                  Generate a shareable link to get feedback and approval before ordering.
                </p>
                
                {shareLink ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Shareable Link
                      </label>
                      <div className="flex items-center gap-2">
                        <Input
                          value={shareLink}
                          readOnly
                          className="flex-1 text-sm"
                        />
                        <Button
                          variant="outline"
                          onClick={() => navigator.clipboard.writeText(shareLink)}
                          className="px-3"
                        >
                          <ApperIcon name="Copy" size={16} />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-start gap-2">
                        <ApperIcon name="Info" className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div className="text-sm text-blue-800">
                          <p className="font-medium">Link features:</p>
                          <ul className="mt-1 space-y-1 list-disc list-inside">
                            <li>Preview design without editing capabilities</li>
                            <li>Comments and feedback section</li>
                            <li>Approval/rejection options</li>
                            <li>Link expires in 30 days</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => {
                        setShowShareDialog(false);
                        setShareLink('');
                      }}
                      className="w-full"
                    >
                      Done
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Button
                      onClick={generateShareLink}
                      disabled={isGeneratingShare}
                      className="w-full"
                    >
                      {isGeneratingShare ? (
                        <>
                          <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                          Generating Link...
                        </>
                      ) : (
                        <>
                          <ApperIcon name="Share2" className="w-4 h-4 mr-2" />
                          Generate Share Link
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
)}
      </div>
    </div>
    </>
  );
};

export default CustomStudio;