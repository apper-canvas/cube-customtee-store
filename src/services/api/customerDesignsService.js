// Customer Designs Service - manages customer showcase and featured designs
import mockCustomerDesigns from '@/services/mockData/customerDesigns.js';

class CustomerDesignsService {
  async getFeaturedDesigns() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockCustomerDesigns.filter(design => design.featured);
  }

  async getAllCustomerDesigns() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockCustomerDesigns;
  }

  async getPopularDesigns(limit = 6) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockCustomerDesigns
      .filter(design => design.popularity > 4.2)
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, limit);
  }

  async getDesignById(id) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockCustomerDesigns.find(design => design.Id === id);
  }

  async getDesignsByTag(tag) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockCustomerDesigns.filter(design => 
      design.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
    );
  }

  async incrementShares(designId) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    const design = mockCustomerDesigns.find(d => d.Id === designId);
    if (design) {
      design.shares += 1;
      return design;
    }
    throw new Error('Design not found');
  }

  async incrementRecreations(designId) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    const design = mockCustomerDesigns.find(d => d.Id === designId);
    if (design) {
      design.recreations += 1;
      return design;
    }
    throw new Error('Design not found');
  }
}

export const customerDesignsService = new CustomerDesignsService();