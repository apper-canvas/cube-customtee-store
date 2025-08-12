import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';

function OrderDetailModal({ order, isOpen, onClose, onReorder }) {
  const [isReordering, setIsReordering] = useState(false);

  if (!order) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Pending';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimelineSteps = () => {
    const baseSteps = [
      { key: 'placed', label: 'Order Placed', icon: 'ShoppingCart' },
      { key: 'confirmed', label: 'Payment Confirmed', icon: 'CreditCard' },
      { key: 'production', label: 'In Production', icon: 'Settings' },
      { key: 'quality', label: 'Quality Check', icon: 'CheckCircle' },
      { key: 'shipped', label: 'Shipped', icon: 'Truck' },
      { key: 'delivered', label: 'Delivered', icon: 'Package' }
    ];

    return baseSteps.map((step, index) => {
      const isCompleted = getStepStatus(step.key);
      const timestamp = getStepTimestamp(step.key);
      return {
        ...step,
        isCompleted,
        timestamp,
        isActive: index === getCurrentStepIndex()
      };
    });
  };

  const getStepStatus = (stepKey) => {
    const statusMap = {
      'placed': ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'],
      'confirmed': ['Confirmed', 'Processing', 'Shipped', 'Delivered'],
      'production': ['Processing', 'Shipped', 'Delivered'],
      'quality': ['Processing', 'Shipped', 'Delivered'],
      'shipped': ['Shipped', 'Delivered'],
      'delivered': ['Delivered']
    };
    return statusMap[stepKey]?.includes(order.status);
  };

  const getCurrentStepIndex = () => {
    const statusStepMap = {
      'Pending': 0,
      'Confirmed': 1,
      'Processing': 2,
      'Shipped': 4,
      'Delivered': 5
    };
    return statusStepMap[order.status] || 0;
  };

  const getStepTimestamp = (stepKey) => {
    const timestampMap = {
      'placed': order.createdAt,
      'confirmed': order.status === 'Pending' ? null : order.createdAt,
      'production': order.status === 'Processing' || order.status === 'Shipped' || order.status === 'Delivered' ? order.updatedAt : null,
      'quality': order.status === 'Processing' || order.status === 'Shipped' || order.status === 'Delivered' ? order.updatedAt : null,
      'shipped': order.status === 'Shipped' || order.status === 'Delivered' ? order.shippedAt || order.updatedAt : null,
      'delivered': order.status === 'Delivered' ? order.deliveredAt || order.updatedAt : null
    };
    return timestampMap[stepKey];
  };

const handleReorder = async () => {
    if (!onReorder) return;
    
    setIsReordering(true);
    try {
      await onReorder(order.Id);
      onClose();
    } catch (error) {
      toast.error('Failed to reorder items. Please try again.');
    } finally {
      setIsReordering(false);
    }
  };

const handleTrackPackage = () => {
    if (order.tracking?.url) {
      window.open(order.tracking.url, '_blank');
    } else {
      toast.info('Tracking information will be available once your order ships.');
    }
  };

  const handleRequestReview = async () => {
    try {
      const { emailService } = await import('@/services/api/emailService');
      await emailService.sendReviewRequest(order.orderNumber);
      toast.success('Review request sent! Check your email for a special photo discount offer.');
    } catch (error) {
      toast.error('Failed to send review request');
    }
  };

  const handleContactSupport = () => {
    window.open('mailto:support@customtee.com?subject=Order Support - ' + order.orderNumber, '_blank');
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
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-white rounded-2xl shadow-2xl z-50 flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-display font-bold text-gray-900">
                  Order Details
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {order.orderNumber} • {formatDate(order.createdAt)}
                </p>
              </div>
              <Button
                onClick={onClose}
                variant="outline"
                size="sm"
                className="p-2"
              >
                <ApperIcon name="X" size={20} />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Order Summary */}
                  <div>
                    <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
                      Order Summary
                    </h3>
                    <div className="space-y-4">
                      {order.items?.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                            <ApperIcon name="Shirt" size={24} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.name || 'Custom T-Shirt'}</h4>
                            <p className="text-sm text-gray-600">
                              {item.color || 'Navy Blue'} • {item.size || 'L'}
                            </p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity || 1}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">
                              {formatCurrency((item.price || 29.99) * (item.quantity || 1))}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatCurrency(item.price || 29.99)} each
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Totals */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-xl space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">{formatCurrency(order.subtotal || 89.97)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-medium">{formatCurrency(order.shippingCost || 9.99)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax</span>
                        <span className="font-medium">{formatCurrency(order.tax || 7.50)}</span>
                      </div>
                      <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
                        <span>Total</span>
                        <span className="text-lg">{formatCurrency(order.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div>
                    <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
                      Customer Information
                    </h3>
                    <div className="space-y-4">
                      {/* Shipping Address */}
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center space-x-2 mb-3">
                          <ApperIcon name="MapPin" size={16} className="text-gray-600" />
                          <h4 className="font-medium text-gray-900">Shipping Address</h4>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>{order.shipping?.name || 'John Smith'}</p>
                          <p>{order.shipping?.address || '123 Main Street'}</p>
                          <p>{order.shipping?.city || 'San Francisco'}, {order.shipping?.state || 'CA'} {order.shipping?.zip || '94102'}</p>
                          <p>{order.shipping?.country || 'United States'}</p>
                        </div>
                      </div>

                      {/* Billing Information */}
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center space-x-2 mb-3">
                          <ApperIcon name="CreditCard" size={16} className="text-gray-600" />
                          <h4 className="font-medium text-gray-900">Billing Information</h4>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>{order.billing?.name || 'John Smith'}</p>
                          <p>{order.billing?.address || 'Same as shipping address'}</p>
                          <p className="flex items-center space-x-2">
                            <span>•••• •••• •••• {order.billing?.lastFour || '4242'}</span>
                            <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                              {order.billing?.cardType || 'Visa'}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center space-x-2 mb-3">
                          <ApperIcon name="Mail" size={16} className="text-gray-600" />
                          <h4 className="font-medium text-gray-900">Contact Information</h4>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>{order.email || 'john.smith@email.com'}</p>
                          <p>{order.phone || '+1 (555) 123-4567'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Order Timeline */}
                  <div>
                    <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
                      Order Timeline
                    </h3>
                    <div className="relative">
                      {getTimelineSteps().map((step, index) => (
                        <div key={step.key} className="relative flex items-center mb-6 last:mb-0">
                          {/* Timeline line */}
                          {index < getTimelineSteps().length - 1 && (
                            <div className={`absolute left-6 top-12 w-0.5 h-6 ${
                              step.isCompleted ? 'bg-success' : 'bg-gray-200'
                            }`} />
                          )}
                          
                          {/* Timeline dot */}
                          <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
                            step.isCompleted 
                              ? 'bg-success text-white' 
                              : step.isActive 
                                ? 'bg-primary text-white' 
                                : 'bg-gray-200 text-gray-400'
                          }`}>
                            <ApperIcon name={step.icon} size={20} />
                          </div>
                          
                          {/* Timeline content */}
                          <div className="ml-4 flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className={`font-medium ${
                                step.isCompleted || step.isActive ? 'text-gray-900' : 'text-gray-500'
                              }`}>
                                {step.label}
                              </h4>
                              {step.timestamp && (
                                <span className="text-sm text-gray-500">
                                  {formatDate(step.timestamp)}
                                </span>
                              )}
                            </div>
                            {step.isActive && !step.isCompleted && (
                              <p className="text-sm text-primary mt-1">In progress...</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tracking Information */}
                  {order.status === 'Shipped' || order.status === 'Delivered' ? (
                    <div>
                      <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
                        Tracking Information
                      </h3>
                      <div className="p-4 bg-blue-50 rounded-xl">
                        <div className="flex items-center space-x-3 mb-3">
                          <ApperIcon name="Truck" size={20} className="text-primary" />
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {order.tracking?.carrier || 'UPS Ground'}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Tracking #{order.tracking?.number || '1Z999AA1234567890'}
                            </p>
                          </div>
                        </div>
                        {order.tracking?.url && (
                          <Button
                            onClick={handleTrackPackage}
                            variant="outline"
                            size="sm"
                            className="w-full mt-3"
                          >
                            <ApperIcon name="ExternalLink" size={16} className="mr-2" />
                            Track Package
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : null}

                  {/* Estimated Delivery */}
                  <div>
                    <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
                      Delivery Information
                    </h3>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-3 mb-3">
                        <ApperIcon name="Calendar" size={20} className="text-gray-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">
                            Estimated Delivery
                          </h4>
                          <p className="text-sm text-gray-600">
                            {formatDate(order.estimatedDelivery || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString())}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <ApperIcon name="Package" size={16} />
                        <span>{order.shippingMethod || 'Standard Shipping (5-7 business days)'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

{/* Footer Actions */}
            <div className="p-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-3 justify-between">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleReorder}
                    disabled={isReordering}
                    className="bg-primary text-white hover:bg-blue-700"
                  >
                    <ApperIcon name="RotateCcw" size={16} className="mr-2" />
                    {isReordering ? 'Adding...' : 'Reorder Items'}
                  </Button>
                  {order.status === 'Delivered' ? (
                    <Button
                      onClick={handleRequestReview}
                      variant="outline"
                      className="flex-1 sm:flex-initial bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                    >
                      <ApperIcon name="Star" size={16} className="mr-2" />
                      Request Review
                    </Button>
                  ) : (
                    <Button
                      onClick={handleTrackPackage}
                      variant="outline"
                      className="flex-1 sm:flex-initial"
                    >
                      <ApperIcon name="Package" size={16} className="mr-2" />
                      Track Package
                    </Button>
                  )}
                </div>
                <Button
                  onClick={handleContactSupport}
                  variant="outline"
                  className="text-sm"
                >
                  <ApperIcon name="MessageCircle" size={16} className="mr-2" />
                  Contact Support
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default OrderDetailModal;