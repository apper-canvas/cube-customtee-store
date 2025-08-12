import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
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

  // Social sharing functions
  const shareOnFacebook = () => {
    const url = encodeURIComponent(window.location.origin + '/design/' + orderData.designId);
    const text = encodeURIComponent('Check out my amazing custom design from Custom Product Store!');
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank', 'width=600,height=400');
  };

  const shareOnTwitter = () => {
    const url = encodeURIComponent(window.location.origin + '/design/' + orderData.designId);
    const text = encodeURIComponent('Just ordered my custom design! 🎨 Check it out:');
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'width=600,height=400');
  };

  const shareOnInstagram = () => {
    toast.info('Instagram sharing: Save your design image and post it manually to Instagram!');
  };

  const copyShareLink = () => {
    const shareUrl = window.location.origin + '/design/' + (orderData.designId || 'shared');
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success('Link copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy link');
    });
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

{/* Social Sharing Section */}
        <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
          <h3 className="text-lg font-display font-bold text-gray-900 mb-3 flex items-center">
            <ApperIcon name="Share2" size={20} className="mr-2 text-blue-600" />
            Share Your Design
          </h3>
          <p className="text-gray-600 mb-4">
            Show off your amazing custom design! Share on social media and inspire others.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => shareOnFacebook()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <ApperIcon name="Facebook" size={16} className="mr-2" />
              Facebook
            </Button>
            <Button
              onClick={() => shareOnTwitter()}
              className="bg-sky-500 hover:bg-sky-600 text-white"
            >
              <ApperIcon name="Twitter" size={16} className="mr-2" />
              Twitter
            </Button>
            <Button
              onClick={() => shareOnInstagram()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <ApperIcon name="Instagram" size={16} className="mr-2" />
              Instagram
            </Button>
            <Button
              onClick={() => copyShareLink()}
              variant="outline"
              className="border-gray-300"
            >
              <ApperIcon name="Link" size={16} className="mr-2" />
              Copy Link
            </Button>
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