import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "@/components/organisms/Header";
import PromotionalBanner from "@/components/molecules/PromotionalBanner";
import CartDrawer from "@/components/organisms/CartDrawer";
import Products from "@/components/pages/Products";
import DesignGallery from "@/components/pages/DesignGallery";
import CustomStudio from "@/components/pages/CustomStudio";
import Orders from "@/components/pages/Orders";
import Checkout from "@/components/pages/Checkout";
import OrderConfirmation from "@/components/pages/OrderConfirmation";

const App = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (item) => {
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
      <main className="flex-1">
<Routes>
          <Route path="/" element={<Products onAddToCart={addToCart} />} />
          <Route path="/gallery" element={<DesignGallery />} />
          <Route path="/studio" element={<CustomStudio />} />
          <Route path="/orders" element={<Orders />} />
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