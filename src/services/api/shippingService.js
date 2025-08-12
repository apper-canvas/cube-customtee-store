const shippingOptions = [
  {
    id: 'standard',
    name: 'Standard Shipping',
    description: '5-7 business days',
    price: 5.99,
    estimatedDays: 7,
    icon: 'Truck'
  },
  {
    id: 'express',
    name: 'Express Shipping',
    description: '2-3 business days',
    price: 12.99,
    estimatedDays: 3,
    icon: 'Zap'
  },
  {
    id: 'overnight',
    name: 'Overnight Shipping',
    description: 'Next business day',
    price: 24.99,
    estimatedDays: 1,
    icon: 'Clock'
  }
];

export const shippingService = {
  getShippingOptions() {
    return [...shippingOptions];
  },

  getShippingOptionById(id) {
    return shippingOptions.find(option => option.id === id);
  },

  calculateShipping(subtotal, shippingOptionId = 'standard') {
    const option = this.getShippingOptionById(shippingOptionId);
    if (!option) return 0;
    
    // Free standard shipping for orders over $50
    if (shippingOptionId === 'standard' && subtotal >= 50) {
      return 0;
    }
    
    return option.price;
  },

  getEstimatedDelivery(shippingOptionId = 'standard') {
    const option = this.getShippingOptionById(shippingOptionId);
    if (!option) return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    return new Date(Date.now() + option.estimatedDays * 24 * 60 * 60 * 1000);
  }
};