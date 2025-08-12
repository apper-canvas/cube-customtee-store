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
    },
    payment: {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      billingZip: ''
    },
    orderNotes: ''
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

  const handlePaymentChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      payment: {
        ...prev.payment,
        [field]: value
      }
    }));
  };

  const handleOrderNotesChange = (value) => {
    setFormData(prev => ({
      ...prev,
      orderNotes: value
    }));
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };
const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Validate payment fields
    if (!formData.payment.cardNumber || !formData.payment.expiryDate || !formData.payment.cvv || !formData.payment.billingZip) {
      toast.error('Please complete all payment fields');
      return;
    }

    setLoading(true);
    
    try {
      const orderData = {
        email: formData.email,
        items: cartItems,
        shippingAddress: formData.shippingAddress,
        billingAddress: sameAsBilling ? formData.shippingAddress : formData.billingAddress,
        payment: formData.payment,
        orderNotes: formData.orderNotes,
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
          
          {/* Progress Indicator */}
          <div className="mt-8 mb-8">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 bg-success text-white rounded-full text-sm font-medium">
                  ✓
                </div>
                <span className="ml-2 text-sm font-medium text-success">Cart</span>
              </div>
              <div className="w-12 h-0.5 bg-success"></div>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 bg-success text-white rounded-full text-sm font-medium">
                  ✓
                </div>
                <span className="ml-2 text-sm font-medium text-success">Shipping</span>
              </div>
              <div className="w-12 h-0.5 bg-primary"></div>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full text-sm font-medium">
                  3
                </div>
                <span className="ml-2 text-sm font-medium text-primary">Payment</span>
              </div>
              <div className="w-12 h-0.5 bg-gray-200"></div>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 bg-gray-200 text-gray-400 rounded-full text-sm font-medium">
                  4
                </div>
                <span className="ml-2 text-sm text-gray-400">Complete</span>
              </div>
            </div>
          </div>
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
                    <ApperIcon name="MapPin" className="w-5 h-5 mr-2 text-primary" />
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

              {/* Payment Information */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-6">
                  <ApperIcon name="CreditCard" className="w-5 h-5 mr-2 text-primary" />
                  Payment Information
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <Input
                      placeholder="1234 5678 9012 3456"
                      value={formData.payment.cardNumber}
                      onChange={(e) => handlePaymentChange('cardNumber', formatCardNumber(e.target.value))}
                      maxLength={19}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <Input
                      placeholder="MM/YY"
                      value={formData.payment.expiryDate}
                      onChange={(e) => handlePaymentChange('expiryDate', formatExpiry(e.target.value))}
                      maxLength={5}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <Input
                      placeholder="123"
                      value={formData.payment.cvv}
                      onChange={(e) => handlePaymentChange('cvv', e.target.value.replace(/\D/g, ''))}
                      maxLength={4}
                      required
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Billing ZIP Code
                    </label>
                    <Input
                      placeholder="12345"
                      value={formData.payment.billingZip}
                      onChange={(e) => handlePaymentChange('billingZip', e.target.value)}
                      maxLength={10}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Order Notes */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-6">
                  <ApperIcon name="MessageSquare" className="w-5 h-5 mr-2 text-primary" />
                  Special Instructions
                </h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    placeholder="Any special delivery instructions or notes about your order..."
                    value={formData.orderNotes}
                    onChange={(e) => handleOrderNotesChange(e.target.value)}
                    rows={4}
                    className="flex w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  />
                </div>
              </div>

              {/* Place Order Button */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Order Total:</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-blue-700 text-white py-4 text-lg font-semibold"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <ApperIcon name="Loader2" className="w-5 h-5 mr-2 animate-spin" />
                        Processing Order...
                      </>
                    ) : (
                      <>
                        <ApperIcon name="Lock" className="w-5 h-5 mr-2" />
                        Place Order - ${total.toFixed(2)}
                      </>
                    )}
                  </Button>
                  
                  <div className="flex items-center justify-center text-sm text-gray-500">
                    <ApperIcon name="Shield" className="w-4 h-4 mr-1" />
                    Your payment information is secure and encrypted
                  </div>
                </div>
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