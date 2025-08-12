import savedDesignsMockData from '@/services/mockData/savedDesigns';

class SavedDesignsService {
  constructor() {
    this.storageKey = 'savedDesigns';
    this.initializeData();
  }

  initializeData() {
    // Initialize with mock data if localStorage is empty
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify(savedDesignsMockData));
    }
  }

  getAll() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading saved designs:', error);
      return [];
    }
  }

  getById(id) {
    // Validate ID
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid design ID');
    }

    const designs = this.getAll();
    const design = designs.find(d => d.Id === id);
    
    if (!design) {
      throw new Error(`Design with ID ${id} not found`);
    }
    
    return { ...design }; // Return copy
  }

  create(designData) {
    const designs = this.getAll();
    
    // Generate new ID
    const newId = designs.length > 0 ? Math.max(...designs.map(d => d.Id)) + 1 : 1;
    
    const newDesign = {
      Id: newId,
      name: designData.name || 'Untitled Design',
      style: designData.style || 'Crew Neck',
      color: designData.color || { name: 'White', value: '#FFFFFF' },
      size: designData.size || 'M',
      designAreas: designData.designAreas || { Front: [], Back: [], Sleeve: [] },
      price: designData.price || 24.99,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    designs.push(newDesign);
    localStorage.setItem(this.storageKey, JSON.stringify(designs));
    
    return { ...newDesign }; // Return copy
  }

  update(id, updateData) {
    // Validate ID
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid design ID');
    }

    const designs = this.getAll();
    const index = designs.findIndex(d => d.Id === id);
    
    if (index === -1) {
      throw new Error(`Design with ID ${id} not found`);
    }

    // Update design
    const updatedDesign = {
      ...designs[index],
      ...updateData,
      Id: id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };

    designs[index] = updatedDesign;
    localStorage.setItem(this.storageKey, JSON.stringify(designs));
    
    return { ...updatedDesign }; // Return copy
  }

  delete(id) {
    // Validate ID
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid design ID');
    }

    const designs = this.getAll();
    const index = designs.findIndex(d => d.Id === id);
    
    if (index === -1) {
      throw new Error(`Design with ID ${id} not found`);
    }

    designs.splice(index, 1);
    localStorage.setItem(this.storageKey, JSON.stringify(designs));
    
    return true;
  }

  // Additional utility methods
  search(query) {
    if (!query || !query.trim()) {
      return this.getAll();
    }

    const designs = this.getAll();
    const searchTerm = query.toLowerCase();
    
    return designs.filter(design => 
      design.name.toLowerCase().includes(searchTerm) ||
      design.style.toLowerCase().includes(searchTerm) ||
      design.color.name.toLowerCase().includes(searchTerm)
    );
  }

  getByComplexity(complexity) {
    const designs = this.getAll();
    
    return designs.filter(design => {
      const totalElements = Object.values(design.designAreas).reduce(
        (total, elements) => total + (elements?.length || 0), 0
      );
      
      let designComplexity;
      if (totalElements <= 2) designComplexity = 'Simple';
      else if (totalElements <= 5) designComplexity = 'Moderate';
      else if (totalElements <= 8) designComplexity = 'Complex';
      else designComplexity = 'Very Complex';
      
      return designComplexity === complexity;
    });
  }

  getStatistics() {
    const designs = this.getAll();
    
    if (designs.length === 0) {
      return {
        total: 0,
        averagePrice: 0,
        totalValue: 0,
        complexityDistribution: {},
        styleDistribution: {},
        colorDistribution: {}
      };
    }

    // Calculate statistics
    const totalValue = designs.reduce((sum, d) => sum + d.price, 0);
    const averagePrice = totalValue / designs.length;

    // Complexity distribution
    const complexityDistribution = designs.reduce((acc, design) => {
      const totalElements = Object.values(design.designAreas).reduce(
        (total, elements) => total + (elements?.length || 0), 0
      );
      
      let complexity;
      if (totalElements <= 2) complexity = 'Simple';
      else if (totalElements <= 5) complexity = 'Moderate';
      else if (totalElements <= 8) complexity = 'Complex';
      else complexity = 'Very Complex';
      
      acc[complexity] = (acc[complexity] || 0) + 1;
      return acc;
    }, {});

    // Style distribution
    const styleDistribution = designs.reduce((acc, design) => {
      acc[design.style] = (acc[design.style] || 0) + 1;
      return acc;
    }, {});

    // Color distribution
    const colorDistribution = designs.reduce((acc, design) => {
      const colorName = design.color?.name || 'Unknown';
      acc[colorName] = (acc[colorName] || 0) + 1;
      return acc;
    }, {});

    return {
      total: designs.length,
      averagePrice,
      totalValue,
      complexityDistribution,
      styleDistribution,
      colorDistribution
    };
  }
}

// Export singleton instance
export const savedDesignsService = new SavedDesignsService();
export default savedDesignsService;