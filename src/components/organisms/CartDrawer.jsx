import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";
import { toast } from "react-toastify";

const CartDrawer = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem }) => {
  const navigate = useNavigate();
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  
  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      onRemoveItem(itemId);
      toast.success("Item removed from cart");
    } else {
      onUpdateQuantity(itemId, newQuantity);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {cartItems.length === 0 ? (
<div className="flex-1 flex items-center justify-center">
                  <Empty
                    title="Your cart is empty"
                    description="Your cart is empty - start designing!"
                    actionLabel="Continue Shopping"
                    onAction={onClose}
                  />
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  {cartItems.map((item) => (
<div key={item.id} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex space-x-4">
                        <div className="relative">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          {item.customDesign && (
                            <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg flex items-center justify-center">
                              <ApperIcon name="Palette" className="w-6 h-6 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                          <p className="text-sm text-secondary">{item.style}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <div
                              className="w-4 h-4 rounded-full border border-gray-200"
                              style={{ backgroundColor: item.color.value }}
                            />
                            <span className="text-sm text-secondary">{item.color.name}</span>
                            <span className="text-sm text-secondary">•</span>
                            <span className="text-sm text-secondary">{item.size}</span>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                              >
                                <ApperIcon name="Minus" className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <button
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                              >
                                <ApperIcon name="Plus" className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</div>
                              <div className="text-sm text-secondary">${item.price.toFixed(2)} each</div>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="self-start p-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <ApperIcon name="Trash2" className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="p-1 rounded hover:bg-gray-200"
                          >
                            <ApperIcon name="Minus" className="w-4 h-4" />
                          </button>
                          <span className="px-3 py-1 bg-white rounded text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="p-1 rounded hover:bg-gray-200"
                          >
                            <ApperIcon name="Plus" className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => {
                              onRemoveItem(item.id);
                              toast.success("Item removed from cart");
                            }}
                            className="p-1 text-error hover:bg-red-50 rounded"
                          >
                            <ApperIcon name="Trash2" className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
<div className="border-t border-gray-100 p-6 bg-white">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary">Subtotal</span>
                    <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary">Shipping</span>
                    <span className="text-gray-900">
                      {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary">Tax (8%)</span>
                    <span className="text-gray-900">${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-100 pt-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                  {subtotal > 0 && subtotal < 50 && (
                    <div className="text-xs text-secondary mt-2">
                      Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    onClick={onClose} 
                    className="w-full"
                    size="lg"
                  >
                    <ApperIcon name="ArrowLeft" className="w-5 h-5 mr-2" />
                    Continue Shopping
                  </Button>
                  <Button onClick={handleCheckout} className="w-full" size="lg">
                    <ApperIcon name="CreditCard" className="w-5 h-5 mr-2" />
                    Checkout • ${total.toFixed(2)}
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;