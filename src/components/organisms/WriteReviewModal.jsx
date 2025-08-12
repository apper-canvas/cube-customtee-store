import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import StarRating from "@/components/molecules/StarRating";
import { reviewService } from "@/services/api/reviewService";

const WriteReviewModal = ({ product, isOpen, onClose, onReviewAdded }) => {
  const [formData, setFormData] = useState({
    rating: 0,
    title: "",
    review: "",
    customerName: "",
    photos: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoFiles, setPhotoFiles] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // In a real app, you'd upload to a service like AWS S3
      // For demo, we'll create object URLs
      const photoUrls = files.map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...photoUrls].slice(0, 5) // Max 5 photos
      }));
      setPhotoFiles(prev => [...prev, ...files].slice(0, 5));
    }
  };

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
    setPhotoFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.rating || !formData.title || !formData.review || !formData.customerName) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewData = {
        productId: product.Id,
        ...formData
      };

      const newReview = await reviewService.create(reviewData);
      
      toast.success("Review submitted successfully!");
      onReviewAdded && onReviewAdded(newReview);
      
      // Reset form
      setFormData({
        rating: 0,
        title: "",
        review: "",
        customerName: "",
        photos: []
      });
      setPhotoFiles([]);
      
      onClose();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      rating: 0,
      title: "",
      review: "",
      customerName: "",
      photos: []
    });
    setPhotoFiles([]);
  };

  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Write a Review</h2>
                <p className="text-sm text-gray-600">{product.name}</p>
              </div>
              <button
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Rating <span className="text-red-500">*</span>
                </label>
                <StarRating
                  rating={formData.rating}
                  size="lg"
                  interactive={true}
                  onChange={(rating) => setFormData(prev => ({ ...prev, rating }))}
                />
              </div>

              {/* Customer Name */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <Input
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  required
                />
              </div>

              {/* Review Title */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Review Title <span className="text-red-500">*</span>
                </label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Summarize your review in one line"
                  required
                />
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Your Review <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="review"
                  value={formData.review}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                  placeholder="Tell us about your experience with this product..."
                  required
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Add Photos (Optional)
                </label>
                <div className="space-y-3">
                  {formData.photos.length < 5 && (
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center">
                        <ApperIcon name="Upload" className="w-6 h-6 text-gray-400 mb-1" />
                        <p className="text-sm text-gray-500">Click to upload photos</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                  
                  {formData.photos.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                      {formData.photos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={photo}
                            alt={`Review photo ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ApperIcon name="X" className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    onClose();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.rating || !formData.title || !formData.review || !formData.customerName}
                >
                  {isSubmitting ? (
                    <>
                      <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WriteReviewModal;