import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';

function EmailPromptModal({ isOpen, onClose, orderNumber, customerEmail }) {
  const [email, setEmail] = useState(customerEmail || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendReviewRequest = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const { emailService } = await import('@/services/api/emailService');
      await emailService.sendReviewRequest(orderNumber, email);
      toast.success('Review request sent! Customer will receive a special photo discount offer.');
      onClose();
    } catch (error) {
      toast.error('Failed to send review request');
    } finally {
      setIsLoading(false);
    }
  };

// Lock body scroll when modal opens
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <ApperIcon name="Mail" className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Request Customer Review</h3>
                    <p className="text-sm text-gray-500">Order #{orderNumber}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                  className="rounded-full w-8 h-8 p-0"
                >
                  <ApperIcon name="X" className="w-4 h-4" />
                </Button>
              </div>

              {/* Special Offer Alert */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <ApperIcon name="Gift" className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-green-900 mb-1">Photo Review Incentive</h4>
                    <p className="text-sm text-green-700">
                      Customer will receive a <strong>10% discount</strong> code for their next purchase when they submit a review with photos!
                    </p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSendReviewRequest} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Email Address
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="customer@example.com"
                    required
                    className="w-full"
                  />
                </div>

                {/* Preview */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-2">Email Preview:</h5>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Subject:</strong> How was your CustomTee experience? Get 10% off your next order!</p>
                    <p><strong>Content:</strong> Share your photos and get rewarded...</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
                  >
                    {isLoading ? (
                      <>
                        <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <ApperIcon name="Send" className="w-4 h-4 mr-2" />
                        Send Review Request
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default EmailPromptModal;