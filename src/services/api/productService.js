import productData from "@/services/mockData/products.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const productService = {
  async getAll() {
    await delay(300);
    return [...productData];
  },

  async getById(id) {
    await delay(200);
    const product = productData.find(p => p.Id === id);
    if (!product) {
      throw new Error("Product not found");
    }
    return { ...product };
  },

  async create(product) {
    await delay(400);
    const maxId = Math.max(...productData.map(p => p.Id));
    const newProduct = {
      ...product,
      Id: maxId + 1
    };
    productData.push(newProduct);
    return { ...newProduct };
  },

  async update(id, updates) {
    await delay(350);
    const index = productData.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error("Product not found");
    }
    productData[index] = { ...productData[index], ...updates };
    return { ...productData[index] };
  },

  async delete(id) {
    await delay(300);
    const index = productData.findIndex(p => p.Id === id);
    if (index === -1) {
throw new Error("Product not found");
}
    const deleted = productData.splice(index, 1)[0];
    return { ...deleted };
  },

  async exportDesign(designData, format = 'png', resolution = 'high') {
    await delay(500);
    
    // Simulate design export processing
    const exportId = `export_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const exportRecord = {
      Id: exportId,
      designData,
      format,
      resolution,
      status: 'completed',
      downloadUrl: `${window.location.origin}/downloads/${exportId}.${format}`,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    };
    
    return exportRecord;
  },

  async createShareLink(designData, options = {}) {
    await delay(300);
    
    const shareId = `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + (options.expiryDays || 30));
    
    const shareRecord = {
      Id: shareId,
      designData,
      shareUrl: `${window.location.origin}/design-preview/${shareId}`,
      createdAt: new Date().toISOString(),
      expiresAt: expiryDate.toISOString(),
      viewCount: 0,
      isActive: true,
      approvalStatus: 'pending', // pending, approved, rejected
      comments: [],
      metadata: {
        allowComments: options.allowComments !== false,
        requireApproval: options.requireApproval !== false,
        notifyOnView: options.notifyOnView || false
      }
    };
    
    // Store in localStorage for demo (in production, this would be saved to backend)
    const existingShares = JSON.parse(localStorage.getItem('designShares') || '[]');
    existingShares.push(shareRecord);
    localStorage.setItem('designShares', JSON.stringify(existingShares));
    
    return shareRecord;
  },

  async getSharedDesign(shareId) {
    await delay(200);
    
    const shares = JSON.parse(localStorage.getItem('designShares') || '[]');
    const share = shares.find(s => s.Id === shareId);
    
    if (!share) {
      throw new Error('Shared design not found');
    }
    
    if (new Date() > new Date(share.expiresAt)) {
      throw new Error('Share link has expired');
    }
    
    if (!share.isActive) {
      throw new Error('Share link has been deactivated');
    }
    
    // Increment view count
    share.viewCount += 1;
    const updatedShares = shares.map(s => s.Id === shareId ? share : s);
    localStorage.setItem('designShares', JSON.stringify(updatedShares));
    
    return { ...share };
  },

  async updateShareApproval(shareId, approvalStatus, comment = '') {
    await delay(300);
    
    const shares = JSON.parse(localStorage.getItem('designShares') || '[]');
    const shareIndex = shares.findIndex(s => s.Id === shareId);
    
    if (shareIndex === -1) {
      throw new Error('Shared design not found');
    }
    
    shares[shareIndex].approvalStatus = approvalStatus;
    if (comment) {
      shares[shareIndex].comments.push({
        Id: Date.now(),
        text: comment,
        type: 'approval',
        createdAt: new Date().toISOString()
      });
    }
    
    localStorage.setItem('designShares', JSON.stringify(shares));
localStorage.setItem('designShares', JSON.stringify(shares));
    
    return { ...shares[shareIndex] };
  },

// Get product with review stats
  async getByIdWithReviews(id) {
    await delay(200);
    const product = productData.find(p => p.Id === id);
    if (!product) {
      throw new Error("Product not found");
    }

    // Import services dynamically to avoid circular dependency
    const { reviewService } = await import("@/services/api/reviewService");
    const { socialProofService } = await import("@/services/api/socialProofService");
    const reviewStats = reviewService.getReviewStats(id);
    const socialProofData = socialProofService.getProductSocialProof(id);

    return { 
      ...product,
      reviewStats,
      socialProofData
    };
  }
};