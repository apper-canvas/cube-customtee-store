import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import StarRating from '@/components/molecules/StarRating';
import { toast } from 'react-toastify';

function ReviewIncentiveModal({ isOpen, onClose, orderNumber, onSubmitReview }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [photos, setPhotos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + photos.length > 5) {
      toast.error('Maximum 5 photos allowed');
      return;
    }

    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPhotos(prev => [...prev, e.target.result]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Please write a review comment');
      return;
    }

    setIsSubmitting(true);
    try {
      const reviewData = {
        rating,
        comment: comment.trim(),
        photos,
        orderNumber
      };

      await onSubmitReview(reviewData);
      
      // Show discount code if photos were included
      if (photos.length > 0) {
        toast.success('🎉 Review submitted! Your 10% discount code: PHOTOREVIEW10', {
          autoClose: 8000
        });
      } else {
        toast.success('Review submitted successfully!');
      }
      
      onClose();
    } catch (error) {
      toast.error('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const discountEligible = photos.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Share Your Experience</h3>
                    <p className="text-sm text-gray-500">Order #{orderNumber}</p>
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
              </div>

              {/* Incentive Banner */}
              <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                    <ApperIcon name="Camera" className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-green-900">📸 Photo Bonus!</h4>
                    <p className="text-sm text-green-700">
                      Add photos to your review and get <strong>10% off</strong> your next order!
                    </p>
                  </div>
                  {discountEligible && (
                    <div className="px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                      ✓ Discount Earned!
                    </div>
                  )}
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmitReview} className="p-6 space-y-6">
                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Overall Rating
                  </label>
                  <StarRating
                    rating={rating}
                    onRatingChange={setRating}
                    size="lg"
                    interactive={true}
                  />
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell others about your experience with this product..."
                    className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add Photos (Optional)
                    <span className="text-green-600 font-medium ml-2">+10% Discount!</span>
                  </label>
                  
                  {photos.length === 0 ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label htmlFor="photo-upload" className="cursor-pointer">
                        <ApperIcon name="Camera" className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Click to add photos</p>
                        <p className="text-xs text-green-600 mt-1">Earn 10% discount with photos!</p>
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-3">
                        {photos.map((photo, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={photo}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-20 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removePhoto(index)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <ApperIcon name="X" className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        {photos.length < 5 && (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg h-20 flex items-center justify-center hover:border-green-400 transition-colors">
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handlePhotoUpload}
                              className="hidden"
                              id={`photo-upload-${photos.length}`}
                            />
                            <label htmlFor={`photo-upload-${photos.length}`} className="cursor-pointer">
                              <ApperIcon name="Plus" className="w-6 h-6 text-gray-400" />
                            </label>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {photos.length}/5 photos • {discountEligible ? '✓ Discount eligible!' : 'Add more for discount'}
                      </p>
                    </div>
                  )}
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
                    disabled={isSubmitting || !comment.trim()}
                    className={`flex-1 ${discountEligible 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700' 
                      : 'bg-primary hover:bg-blue-700'
                    } text-white`}
                  >
                    {isSubmitting ? (
                      <>
                        <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <ApperIcon name="Send" className="w-4 h-4 mr-2" />
                        {discountEligible ? 'Submit & Get Discount!' : 'Submit Review'}
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

export default ReviewIncentiveModal;