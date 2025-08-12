import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Badge from '@/components/atoms/Badge';
import PriceDisplay from '@/components/molecules/PriceDisplay';
import SearchBar from '@/components/molecules/SearchBar';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import { savedDesignsService } from '@/services/api/savedDesignsService';
import { cn } from '@/utils/cn';

const SavedDesigns = () => {
  const navigate = useNavigate();
  const [designs, setDesigns] = useState([]);
  const [filteredDesigns, setFilteredDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedDesigns, setSelectedDesigns] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [designToDelete, setDesignToDelete] = useState(null);
  const [showBatchDeleteDialog, setShowBatchDeleteDialog] = useState(false);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [designToDuplicate, setDesignToDuplicate] = useState(null);
  const [duplicateName, setDuplicateName] = useState('');

  // Load designs on component mount
  useEffect(() => {
    loadDesigns();
  }, []);

  // Filter and sort designs when data changes
  useEffect(() => {
    let filtered = designs;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(design => 
        design.name.toLowerCase().includes(query) ||
        design.style.toLowerCase().includes(query) ||
        design.color.name.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      default:
        break;
    }

    setFilteredDesigns(filtered);
  }, [designs, searchQuery, sortBy]);

  const loadDesigns = async () => {
    try {
      setLoading(true);
      const data = await savedDesignsService.getAll();
      setDesigns(data);
    } catch (error) {
      toast.error('Failed to load saved designs');
      console.error('Error loading designs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (design) => {
    // Navigate to Custom Studio with design data
    const templateData = encodeURIComponent(JSON.stringify({
      name: design.name,
      style: design.style,
      color: design.color,
      size: design.size,
      designAreas: design.designAreas,
      designElements: design.designAreas?.Front || []
    }));
    navigate(`/studio?template=${templateData}&editMode=true&designId=${design.Id}`);
    toast.info(`Editing "${design.name}"`);
  };

  const handleDelete = async (design) => {
    try {
      await savedDesignsService.delete(design.Id);
      await loadDesigns();
      toast.success(`Design "${design.name}" deleted successfully`);
      setShowDeleteDialog(false);
      setDesignToDelete(null);
    } catch (error) {
      toast.error('Failed to delete design');
      console.error('Error deleting design:', error);
    }
  };

  const handleBatchDelete = async () => {
    try {
      for (const designId of selectedDesigns) {
        await savedDesignsService.delete(designId);
      }
      await loadDesigns();
      toast.success(`${selectedDesigns.length} design${selectedDesigns.length > 1 ? 's' : ''} deleted successfully`);
      setSelectedDesigns([]);
      setShowBatchDeleteDialog(false);
    } catch (error) {
      toast.error('Failed to delete designs');
      console.error('Error deleting designs:', error);
    }
  };

  const handleDuplicate = async (design, customName = null) => {
    try {
      const duplicateData = {
        name: customName || `${design.name} (Copy)`,
        style: design.style,
        color: design.color,
        size: design.size,
        designAreas: design.designAreas,
        price: design.price
      };
      
      const newDesign = await savedDesignsService.create(duplicateData);
      await loadDesigns();
      toast.success(`Design duplicated as "${newDesign.name}"`);
      setShowDuplicateDialog(false);
      setDesignToDuplicate(null);
      setDuplicateName('');
    } catch (error) {
      toast.error('Failed to duplicate design');
      console.error('Error duplicating design:', error);
    }
  };

  const handleSelectDesign = (designId) => {
    setSelectedDesigns(prev => {
      if (prev.includes(designId)) {
        return prev.filter(id => id !== designId);
      } else {
        return [...prev, designId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedDesigns.length === filteredDesigns.length) {
      setSelectedDesigns([]);
    } else {
      setSelectedDesigns(filteredDesigns.map(d => d.Id));
    }
  };

  const getTotalElementsCount = (designAreas) => {
    if (!designAreas) return 0;
    return Object.values(designAreas).reduce((total, elements) => total + (elements?.length || 0), 0);
  };

  const getDesignComplexity = (designAreas) => {
    const totalElements = getTotalElementsCount(designAreas);
    if (totalElements <= 2) return { level: 'Simple', color: 'green' };
    if (totalElements <= 5) return { level: 'Moderate', color: 'yellow' };
    if (totalElements <= 8) return { level: 'Complex', color: 'orange' };
    return { level: 'Very Complex', color: 'red' };
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gradient">Saved Designs</h1>
              <p className="text-xl text-secondary mt-2">
                Manage your custom t-shirt designs
              </p>
            </div>
            <Link to="/studio">
              <Button>
                <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                Create New Design
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Designs</p>
                  <p className="text-2xl font-bold text-primary">{designs.length}</p>
                </div>
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Palette" className="w-4 h-4 text-primary" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Selected</p>
                  <p className="text-2xl font-bold text-accent">{selectedDesigns.length}</p>
                </div>
                <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                  <ApperIcon name="CheckSquare" className="w-4 h-4 text-accent" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-success">
                    ${designs.reduce((sum, d) => sum + d.price, 0).toFixed(2)}
                  </p>
                </div>
                <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                  <ApperIcon name="DollarSign" className="w-4 h-4 text-success" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg. Price</p>
                  <p className="text-2xl font-bold text-info">
                    ${designs.length ? (designs.reduce((sum, d) => sum + d.price, 0) / designs.length).toFixed(2) : '0.00'}
                  </p>
                </div>
                <div className="w-8 h-8 bg-info/10 rounded-lg flex items-center justify-center">
                  <ApperIcon name="TrendingUp" className="w-4 h-4 text-info" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="flex-1 max-w-md">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search designs by name, style, or color..."
                />
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="newest">Sort by Newest</option>
                <option value="oldest">Sort by Oldest</option>
                <option value="name">Sort by Name</option>
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
              </select>
            </div>

            {/* View Mode and Actions */}
            <div className="flex items-center gap-3">
              {/* Select All */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="text-sm"
              >
                <ApperIcon name="CheckSquare" className="w-4 h-4 mr-1" />
                {selectedDesigns.length === filteredDesigns.length ? 'Deselect All' : 'Select All'}
              </Button>

              {/* Batch Actions */}
              {selectedDesigns.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBatchDeleteDialog(true)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  <ApperIcon name="Trash2" className="w-4 h-4 mr-1" />
                  Delete ({selectedDesigns.length})
                </Button>
              )}

              {/* View Mode Toggle */}
              <div className="flex border border-gray-200 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "p-2 rounded-l-lg transition-colors",
                    viewMode === 'grid'
                      ? "bg-primary text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <ApperIcon name="Grid3x3" size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "p-2 rounded-r-lg transition-colors",
                    viewMode === 'list'
                      ? "bg-primary text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <ApperIcon name="List" size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Design Grid/List */}
        {filteredDesigns.length === 0 ? (
          <Empty 
            icon="Palette"
            title={searchQuery ? "No designs found" : "No saved designs yet"}
            description={searchQuery 
              ? "Try adjusting your search terms or filters"
              : "Create your first custom t-shirt design to get started"
            }
            action={
              <Link to="/studio">
                <Button>
                  <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                  Create Design
                </Button>
              </Link>
            }
          />
        ) : (
          <div className={cn(
            viewMode === 'grid'
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          )}>
            {filteredDesigns.map((design) => {
              const complexity = getDesignComplexity(design.designAreas);
              const totalElements = getTotalElementsCount(design.designAreas);
              const isSelected = selectedDesigns.includes(design.Id);

              return viewMode === 'grid' ? (
                // Grid View
                <div
                  key={design.Id}
                  className={cn(
                    "bg-white rounded-2xl shadow-lg overflow-hidden card-hover transition-all duration-200",
                    isSelected && "ring-2 ring-primary ring-opacity-50"
                  )}
                >
                  {/* Design Preview */}
                  <div className="relative bg-gray-100 h-48 flex items-center justify-center">
                    {/* T-shirt mockup */}
                    <div 
                      className="relative w-32 h-40 rounded-lg shadow-sm"
                      style={{ 
                        backgroundColor: design.color?.value || '#FFFFFF',
                        border: design.color?.value === '#FFFFFF' ? '1px solid #e5e7eb' : 'none'
                      }}
                    >
                      {/* Front design elements preview */}
                      {design.designAreas?.Front?.slice(0, 3).map((element, index) => (
                        <div
                          key={index}
                          className="absolute"
                          style={{
                            left: `${(element.x / 300) * 100}%`,
                            top: `${(element.y / 400) * 100}%`,
                            fontSize: element.type === 'text' ? `${Math.max(element.size / 4, 6)}px` : 'inherit',
                            transform: `scale(${Math.max(0.3, 1 - index * 0.1)})`
                          }}
                        >
                          {element.type === 'text' ? (
                            <span style={{ color: element.color || '#000000' }}>
                              {element.content?.substring(0, 10)}
                            </span>
                          ) : (
                            <div 
                              className="w-4 h-4 bg-gray-400 rounded"
                              style={{ opacity: 0.7 }}
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Selection checkbox */}
                    <button
                      onClick={() => handleSelectDesign(design.Id)}
                      className={cn(
                        "absolute top-3 left-3 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                        isSelected
                          ? "bg-primary border-primary text-white"
                          : "bg-white border-gray-300 hover:border-primary"
                      )}
                    >
                      {isSelected && <ApperIcon name="Check" size={12} />}
                    </button>

                    {/* Complexity badge */}
                    <div className="absolute top-3 right-3">
                      <Badge 
                        variant={complexity.color === 'green' ? 'success' : 
                                complexity.color === 'yellow' ? 'warning' : 
                                complexity.color === 'orange' ? 'warning' : 'error'}
                        className="text-xs"
                      >
                        {complexity.level}
                      </Badge>
                    </div>
                  </div>

                  {/* Design Info */}
                  <div className="p-4">
                    <div className="mb-3">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                        {design.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {design.style} • {design.color?.name} • {design.size}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {totalElements} element{totalElements !== 1 ? 's' : ''} • {new Date(design.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <PriceDisplay price={design.price} className="text-lg font-semibold" />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(design)}
                        className="flex-1 text-sm"
                      >
                        <ApperIcon name="Edit" className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setDesignToDuplicate(design);
                          setDuplicateName(`${design.name} (Copy)`);
                          setShowDuplicateDialog(true);
                        }}
                        className="flex-1 text-sm"
                      >
                        <ApperIcon name="Copy" className="w-3 h-3 mr-1" />
                        Duplicate
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setDesignToDelete(design);
                          setShowDeleteDialog(true);
                        }}
                        className="text-red-600 hover:text-red-700 px-2"
                      >
                        <ApperIcon name="Trash2" className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                // List View
                <div
                  key={design.Id}
                  className={cn(
                    "bg-white rounded-lg shadow-sm border transition-all duration-200",
                    isSelected && "ring-2 ring-primary ring-opacity-50"
                  )}
                >
                  <div className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Selection checkbox */}
                      <button
                        onClick={() => handleSelectDesign(design.Id)}
                        className={cn(
                          "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0",
                          isSelected
                            ? "bg-primary border-primary text-white"
                            : "bg-white border-gray-300 hover:border-primary"
                        )}
                      >
                        {isSelected && <ApperIcon name="Check" size={12} />}
                      </button>

                      {/* Design thumbnail */}
                      <div 
                        className="w-16 h-20 rounded-lg shadow-sm flex-shrink-0"
                        style={{ 
                          backgroundColor: design.color?.value || '#FFFFFF',
                          border: design.color?.value === '#FFFFFF' ? '1px solid #e5e7eb' : 'none'
                        }}
                      />

                      {/* Design info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {design.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-1">
                              {design.style} • {design.color?.name} • {design.size}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span>{totalElements} element{totalElements !== 1 ? 's' : ''}</span>
                              <span>•</span>
                              <span>{new Date(design.createdAt).toLocaleDateString()}</span>
                              <span>•</span>
                              <Badge 
                                variant={complexity.color === 'green' ? 'success' : 
                                        complexity.color === 'yellow' ? 'warning' : 
                                        complexity.color === 'orange' ? 'warning' : 'error'}
                                className="text-xs"
                              >
                                {complexity.level}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <PriceDisplay price={design.price} className="text-lg font-semibold" />
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(design)}
                                className="text-sm"
                              >
                                <ApperIcon name="Edit" className="w-3 h-3 mr-1" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setDesignToDuplicate(design);
                                  setDuplicateName(`${design.name} (Copy)`);
                                  setShowDuplicateDialog(true);
                                }}
                                className="text-sm"
                              >
                                <ApperIcon name="Copy" className="w-3 h-3 mr-1" />
                                Duplicate
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setDesignToDelete(design);
                                  setShowDeleteDialog(true);
                                }}
                                className="text-red-600 hover:text-red-700 px-2"
                              >
                                <ApperIcon name="Trash2" className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {showDeleteDialog && designToDelete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-96 max-w-90vw">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                  <ApperIcon name="AlertTriangle" className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold">Delete Design</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete "{designToDelete.name}"? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteDialog(false);
                    setDesignToDelete(null);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleDelete(designToDelete)}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Delete Design
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Batch Delete Confirmation Dialog */}
        {showBatchDeleteDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-96 max-w-90vw">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                  <ApperIcon name="AlertTriangle" className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold">Delete Multiple Designs</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete {selectedDesigns.length} design{selectedDesigns.length > 1 ? 's' : ''}? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowBatchDeleteDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleBatchDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Delete All
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Duplicate Dialog */}
        {showDuplicateDialog && designToDuplicate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-96 max-w-90vw">
              <h3 className="text-xl font-semibold mb-4">Duplicate Design</h3>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Original: {designToDuplicate.name}</p>
                <Input
                  placeholder="Enter new design name..."
                  value={duplicateName}
                  onChange={(e) => setDuplicateName(e.target.value)}
                  className="mb-2"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDuplicateDialog(false);
                    setDesignToDuplicate(null);
                    setDuplicateName('');
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleDuplicate(designToDuplicate, duplicateName)}
                  className="flex-1"
                  disabled={!duplicateName.trim()}
                >
                  Duplicate
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedDesigns;