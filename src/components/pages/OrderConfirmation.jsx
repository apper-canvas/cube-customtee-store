import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state?.order;

  // Redirect if no order data
  if (!orderData) {
    navigate('/');
    return null;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-success rounded-full mb-4">
            <ApperIcon name="Check" size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-600">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="border-b border-gray-200 pb-4 mb-4">
            <h2 className="text-xl font-display font-semibold text-gray-900 mb-2">
              Order Details
            </h2>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-primary">
                {orderData.orderNumber}
              </span>
              <span className="text-sm text-gray-500">
                {formatDate(orderData.createdAt)}
              </span>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Estimated Delivery</h3>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <ApperIcon name="Truck" size={20} className="text-primary" />
              <div>
                <p className="font-medium text-gray-900">
                  {formatDate(orderData.estimatedDelivery)}
                </p>
                <p className="text-sm text-gray-600">
                  Standard shipping to {orderData.shipping?.address}
                </p>
              </div>
            </div>
          </div>

          {/* Email Confirmation Notice */}
          <div className="mb-6">
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <ApperIcon name="Mail" size={20} className="text-success mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Email Confirmation Sent</p>
                <p className="text-sm text-gray-600">
                  A confirmation email has been sent to{' '}
                  <span className="font-medium">{orderData.email}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Items ({orderData.items?.length || 0})</span>
                <span className="font-medium">{formatCurrency(orderData.subtotal || 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">{formatCurrency(orderData.shipping?.cost || 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">{formatCurrency(orderData.tax || 0)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatCurrency(orderData.total || 0)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => navigate('/orders')}
            className="flex-1 bg-primary text-white hover:bg-blue-700"
          >
            <ApperIcon name="Package" size={16} className="mr-2" />
            View Order Status
          </Button>
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="flex-1"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;