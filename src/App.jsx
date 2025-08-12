import React, { useState } from 'react'
import SocialProofNotifications from '@/components/molecules/SocialProofNotifications'
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "@/components/organisms/Header";
import CartDrawer from "@/components/organisms/CartDrawer";
import PromotionalBanner from "@/components/molecules/PromotionalBanner";
import Orders from "@/components/pages/Orders";
import OrderConfirmation from "@/components/pages/OrderConfirmation";
import Checkout from "@/components/pages/Checkout";
import Products from "@/components/pages/Products";
import CustomStudio from "@/components/pages/CustomStudio";
import DesignGallery from "@/components/pages/DesignGallery";
import SavedDesigns from "@/components/pages/SavedDesigns";
import productsData from "@/services/mockData/products.json";
import filtersData from "@/services/mockData/filters.json";
import { customerDesignsService } from "@/services/api/customerDesignsService";
const App = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

const addToCart = async (item, sourceOrderNumber = null) => {
    const existingItem = cartItems.find(
      cartItem => 
        cartItem.productId === item.productId &&
        cartItem.color.name === item.color.name &&
        cartItem.size === item.size
    );

    if (existingItem) {
      setCartItems(cartItems.map(cartItem =>
        cartItem.id === existingItem.id
          ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
          : cartItem
      ));
    } else {
      const newItem = {
        ...item,
        id: Date.now() + Math.random()
      };
      setCartItems([...cartItems, newItem]);
    }

    // Show reorder confirmation if source order provided
    if (sourceOrderNumber) {
      try {
        const { toast } = await import('react-toastify');
        toast.success(`Reordered from Order #${sourceOrderNumber}`);
      } catch (err) {
        console.error('Failed to load toast notification:', err);
      }
    }
  };

  const handleReorder = async (orderId) => {
    try {
      const { checkoutService } = await import('@/services/api/checkoutService');
      const result = await checkoutService.reorderItems(orderId);
      const order = await checkoutService.getOrderById(orderId);
      
      // Add each item to cart with preserved customizations
      result.items.forEach(item => {
        const cartItem = {
          productId: item.productId || Date.now() + Math.random(),
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          color: item.color || { name: 'Default', hex: '#000000' },
          size: item.size || 'M',
          image: item.image || '/placeholder-tshirt.jpg'
        };
        addToCart(cartItem, order.orderNumber);
      });
    } catch (err) {
      const { toast } = await import('react-toastify');
      toast.error('Failed to reorder items');
    }
  };

  const updateCartQuantity = (itemId, newQuantity) => {
    setCartItems(cartItems.map(item =>
      item.id === itemId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
<div className="min-h-screen bg-background">
      <Header 
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
      />
      
      <PromotionalBanner />
<main className="flex-1 pt-16">
<Routes>
          <Route path="/" element={<Products onAddToCart={addToCart} />} />
          <Route path="/gallery" element={<DesignGallery />} />
          <Route path="/studio" element={<CustomStudio />} />
          <Route path="/saved-designs" element={<SavedDesigns />} />
          <Route path="/orders" element={<Orders onReorder={handleReorder} />} />
          <Route path="/checkout" element={<Checkout cartItems={cartItems} onClearCart={() => setCartItems([])} />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
        </Routes>
      </main>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
      />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </div>
  );
};

export default App;