import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import { checkoutService } from '@/services/api/checkoutService';

const Checkout = ({ cartItems = [], onClearCart }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    shippingAddress: {
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States'
    },
    billingAddress: {
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States'
    }
  });

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleEmailChange = (value) => {
    setFormData(prev => ({
      ...prev,
      email: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);
    
    try {
      const orderData = {
        email: formData.email,
        items: cartItems,
        shippingAddress: formData.shippingAddress,
        billingAddress: sameAsBilling ? formData.shippingAddress : formData.billingAddress,
        subtotal,
        shipping,
        tax,
        total
      };

      const order = await checkoutService.createOrder(orderData);
      
      toast.success(`Order ${order.orderNumber} placed successfully!`);
      onClearCart();
      navigate('/orders');
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ApperIcon name="ShoppingCart" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
            <p className="text-secondary mb-6">Add some items to your cart to proceed with checkout</p>
            <Button onClick={() => navigate('/')}>
              <ApperIcon name="ArrowLeft" className="w-5 h-5 mr-2" />
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center text-secondary hover:text-primary transition-colors"
          >
            <ApperIcon name="ArrowLeft" className="w-5 h-5 mr-2" />
            Continue Shopping
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Customer Information Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Information */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <ApperIcon name="Mail" className="w-5 h-5 mr-2 text-primary" />
                  Contact Information
                </h2>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <ApperIcon name="Truck" className="w-5 h-5 mr-2 text-primary" />
                  Shipping Address
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    placeholder="First name"
                    value={formData.shippingAddress.firstName}
                    onChange={(e) => handleInputChange('shippingAddress', 'firstName', e.target.value)}
                    required
                  />
                  <Input
                    placeholder="Last name"
                    value={formData.shippingAddress.lastName}
                    onChange={(e) => handleInputChange('shippingAddress', 'lastName', e.target.value)}
                    required
                  />
                  <div className="sm:col-span-2">
                    <Input
                      placeholder="Address"
                      value={formData.shippingAddress.address}
                      onChange={(e) => handleInputChange('shippingAddress', 'address', e.target.value)}
                      required
                    />
                  </div>
                  <Input
                    placeholder="City"
                    value={formData.shippingAddress.city}
                    onChange={(e) => handleInputChange('shippingAddress', 'city', e.target.value)}
                    required
                  />
                  <Input
                    placeholder="State"
                    value={formData.shippingAddress.state}
                    onChange={(e) => handleInputChange('shippingAddress', 'state', e.target.value)}
                    required
                  />
                  <Input
                    placeholder="ZIP code"
                    value={formData.shippingAddress.zipCode}
                    onChange={(e) => handleInputChange('shippingAddress', 'zipCode', e.target.value)}
                    required
                  />
                  <Input
                    placeholder="Country"
                    value={formData.shippingAddress.country}
                    onChange={(e) => handleInputChange('shippingAddress', 'country', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Billing Address */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <ApperIcon name="CreditCard" className="w-5 h-5 mr-2 text-primary" />
                    Billing Address
                  </h2>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sameAsBilling}
                      onChange={(e) => setSameAsBilling(e.target.checked)}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
                    />
                    <span className="text-sm text-secondary">Same as shipping</span>
                  </label>
                </div>
                
                {!sameAsBilling && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      placeholder="First name"
                      value={formData.billingAddress.firstName}
                      onChange={(e) => handleInputChange('billingAddress', 'firstName', e.target.value)}
                      required={!sameAsBilling}
                    />
                    <Input
                      placeholder="Last name"
                      value={formData.billingAddress.lastName}
                      onChange={(e) => handleInputChange('billingAddress', 'lastName', e.target.value)}
                      required={!sameAsBilling}
                    />
                    <div className="sm:col-span-2">
                      <Input
                        placeholder="Address"
                        value={formData.billingAddress.address}
                        onChange={(e) => handleInputChange('billingAddress', 'address', e.target.value)}
                        required={!sameAsBilling}
                      />
                    </div>
                    <Input
                      placeholder="City"
                      value={formData.billingAddress.city}
                      onChange={(e) => handleInputChange('billingAddress', 'city', e.target.value)}
                      required={!sameAsBilling}
                    />
                    <Input
                      placeholder="State"
                      value={formData.billingAddress.state}
                      onChange={(e) => handleInputChange('billingAddress', 'state', e.target.value)}
                      required={!sameAsBilling}
                    />
                    <Input
                      placeholder="ZIP code"
                      value={formData.billingAddress.zipCode}
                      onChange={(e) => handleInputChange('billingAddress', 'zipCode', e.target.value)}
                      required={!sameAsBilling}
                    />
                    <Input
                      placeholder="Country"
                      value={formData.billingAddress.country}
                      onChange={(e) => handleInputChange('billingAddress', 'country', e.target.value)}
                      required={!sameAsBilling}
                    />
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <ApperIcon name="Package" className="w-5 h-5 mr-2 text-primary" />
                Order Summary
              </h2>

              {/* Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex space-x-4">
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      {item.customDesign && (
                        <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg flex items-center justify-center">
                          <ApperIcon name="Palette" className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                      <p className="text-xs text-secondary">{item.style}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <div
                          className="w-3 h-3 rounded-full border border-gray-200"
                          style={{ backgroundColor: item.color.value }}
                        />
                        <span className="text-xs text-secondary">{item.color.name}</span>
                        <span className="text-xs text-secondary">•</span>
                        <span className="text-xs text-secondary">{item.size}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900 text-sm">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      <div className="text-xs text-secondary">
                        ${item.price.toFixed(2)} each
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-100 pt-4 space-y-2">
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

              {/* Place Order Button */}
              <Button 
                onClick={handleSubmit}
                disabled={loading}
                className="w-full mt-6" 
                size="lg"
              >
                {loading ? (
                  <>
                    <Loading className="w-5 h-5 mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ApperIcon name="CreditCard" className="w-5 h-5 mr-2" />
                    Place Order • ${total.toFixed(2)}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;