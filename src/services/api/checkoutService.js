const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock storage for orders (in a real app this would be a database)
let orders = [];
let orderId = 1;

export const checkoutService = {
  async createOrder(orderData) {
    await delay(800);
    
    const newOrder = {
      Id: orderId++,
      ...orderData,
      orderNumber: `ORD-${String(orderId + 1000).padStart(4, '0')}`,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };
    
    orders.push(newOrder);
    return { ...newOrder };
  },
  
  async getOrders() {
    await delay(300);
    return [...orders];
  },
  
  async getOrderById(id) {
    await delay(200);
    const order = orders.find(o => o.Id === id);
    if (!order) {
      throw new Error("Order not found");
    }
    return { ...order };
  }
};