const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock storage for orders (in a real app this would be a database)
// Mock orders data with realistic progression
const mockOrders = [
  {
    Id: 1,
    orderNumber: 'ORD-1001',
    status: 'Delivered',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedDelivery: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    subtotal: 45.98,
    tax: 4.60,
    total: 50.58,
    items: [
      { name: 'Custom Logo T-Shirt', quantity: 2, price: 22.99 },
    ],
    shipping: {
      address: '123 Main St, City, State 12345',
      method: 'Standard Shipping'
    },
    payment: {
      cardLast4: '4242',
      paymentMethod: 'Credit Card'
    }
  },
  {
    Id: 2,
    orderNumber: 'ORD-1002',
    status: 'Shipped',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    subtotal: 67.97,
    tax: 6.80,
    total: 74.77,
    items: [
      { name: 'Design Studio Creation', quantity: 1, price: 29.99 },
      { name: 'Custom Text T-Shirt', quantity: 2, price: 18.99 },
    ],
    shipping: {
      address: '456 Oak Ave, City, State 12345',
      method: 'Express Shipping'
    },
    payment: {
      cardLast4: '8888',
      paymentMethod: 'Credit Card'
    }
  },
  {
    Id: 3,
    orderNumber: 'ORD-1003',
    status: 'In Production',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    subtotal: 34.99,
    tax: 3.50,
    total: 38.49,
    items: [
      { name: 'Gallery Design T-Shirt', quantity: 1, price: 24.99 },
      { name: 'Basic Tee', quantity: 1, price: 9.99 },
    ],
    shipping: {
      address: '789 Pine Rd, City, State 12345',
      method: 'Standard Shipping'
    },
    payment: {
      cardLast4: '1234',
      paymentMethod: 'Credit Card'
    }
  },
  {
    Id: 4,
    orderNumber: 'ORD-1004',
    status: 'Processing',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    subtotal: 91.96,
    tax: 9.20,
    total: 101.16,
    items: [
      { name: 'Premium Custom Design', quantity: 2, price: 34.99 },
      { name: 'Studio Creation', quantity: 1, price: 21.98 },
    ],
    shipping: {
      address: '321 Elm St, City, State 12345',
      method: 'Express Shipping'
    },
    payment: {
      cardLast4: '5555',
      paymentMethod: 'Credit Card'
    }
  }
];

let orders = [...mockOrders];
let orderId = 5;
export const checkoutService = {
async createOrder(orderData) {
    await delay(800);
    
    // Simulate payment processing
    if (orderData.payment && orderData.payment.cardNumber) {
      // Basic validation simulation
      const cardNumber = orderData.payment.cardNumber.replace(/\s/g, '');
      if (cardNumber.length < 15) {
        throw new Error('Invalid card number');
      }
      if (!orderData.payment.expiryDate || !orderData.payment.cvv) {
        throw new Error('Missing payment information');
      }
    }
    
    const newOrder = {
      Id: orderId++,
      ...orderData,
      // Don't store sensitive payment data
      payment: {
        cardLast4: orderData.payment.cardNumber.slice(-4),
        paymentMethod: 'Credit Card'
      },
      orderNumber: `ORD-${String(orderId + 1000).padStart(4, '0')}`,
      status: 'Processing',
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      // Include calculated totals for confirmation display
      subtotal: orderData.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0,
      tax: orderData.tax || 0,
      total: orderData.total || 0
    };
    
    orders.push(newOrder);
    return { ...newOrder };
  },
  
async getOrders() {
    await delay(300);
    // Return orders sorted by creation date (most recent first)
    return [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getOrderById(id) {
    await delay(200);
    const order = orders.find(order => order.Id === parseInt(id));
    if (!order) {
      throw new Error('Order not found');
    }
    return { ...order };
  },

  async updateOrderStatus(id, status) {
    await delay(400);
    const orderIndex = orders.findIndex(order => order.Id === parseInt(id));
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }
    
    orders[orderIndex] = {
      ...orders[orderIndex],
      status,
      updatedAt: new Date().toISOString()
    };
    
    return { ...orders[orderIndex] };
  },

  async reorderItems(orderId) {
    await delay(500);
    const order = orders.find(order => order.Id === parseInt(orderId));
    if (!order) {
      throw new Error('Order not found');
    }
    
    // Simulate adding items to cart
    // In a real app, this would integrate with cart state management
    return {
      success: true,
      message: `${order.items?.length || 0} items added to cart`,
      items: order.items || []
    };
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