import React, { useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import StarRating from "@/components/molecules/StarRating";
import { reviewService } from "@/services/api/reviewService";
import { cn } from "@/utils/cn";

const ReviewCard = ({ review, onVoteUpdate }) => {
  const [isVoting, setIsVoting] = useState(false);
  const [userVote, setUserVote] = useState(reviewService.getUserVote(review.Id));
  const [votes, setVotes] = useState(review.helpfulVotes);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  const handleVote = async (isHelpful) => {
    if (isVoting) return;
    
    setIsVoting(true);
    
    try {
      const updatedReview = await reviewService.voteHelpful(review.Id, isHelpful);
      setVotes(updatedReview.helpfulVotes);
      setUserVote(updatedReview.userVote);
      
      toast.success(
        isHelpful 
          ? "Thanks for marking this review as helpful!" 
          : "Thanks for your feedback!"
      );
      
      onVoteUpdate && onVoteUpdate(updatedReview);
    } catch (error) {
      console.error("Error voting on review:", error);
      toast.error("Failed to submit vote. Please try again.");
    } finally {
      setIsVoting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const displayPhotos = showAllPhotos ? review.photos : review.photos.slice(0, 3);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {review.customerName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <p className="font-semibold text-gray-900">{review.customerName}</p>
              {review.verified && (
                <div className="flex items-center text-green-600">
                  <ApperIcon name="ShieldCheck" className="w-4 h-4" />
                  <span className="text-xs ml-1">Verified Purchase</span>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500">{formatDate(review.reviewDate)}</p>
          </div>
        </div>
        <StarRating rating={review.rating} size="sm" />
      </div>

      {/* Review Content */}
      <div className="space-y-2">
        <h4 className="font-semibold text-gray-900">{review.title}</h4>
        <p className="text-gray-700 leading-relaxed">{review.review}</p>
      </div>

      {/* Photos */}
      {review.photos.length > 0 && (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {displayPhotos.map((photo, index) => (
              <div key={index} className="relative group cursor-pointer">
                <img
                  src={photo}
                  alt={`Review photo ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg group-hover:opacity-90 transition-opacity"
                  onClick={() => {
                    // In a real app, this would open a lightbox
                    window.open(photo, '_blank');
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200 flex items-center justify-center">
                  <ApperIcon 
                    name="Expand" 
                    className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" 
                  />
                </div>
              </div>
            ))}
          </div>
          
          {review.photos.length > 3 && !showAllPhotos && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAllPhotos(true)}
              className="text-sm"
            >
              <ApperIcon name="Plus" className="w-4 h-4 mr-1" />
              Show {review.photos.length - 3} more photos
            </Button>
          )}
        </div>
      )}

      {/* Helpful Voting */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Was this helpful?</span>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleVote(true)}
              disabled={isVoting}
              className={cn(
                "flex items-center space-x-1 text-sm",
                userVote === 'yes' && "bg-green-50 border-green-300 text-green-700"
              )}
            >
              <ApperIcon name="ThumbsUp" className="w-4 h-4" />
              <span>Yes ({votes.yes})</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleVote(false)}
              disabled={isVoting}
              className={cn(
                "flex items-center space-x-1 text-sm",
                userVote === 'no' && "bg-red-50 border-red-300 text-red-700"
              )}
            >
              <ApperIcon name="ThumbsDown" className="w-4 h-4" />
              <span>No ({votes.no})</span>
            </Button>
          </div>
        </div>
        
        {isVoting && (
          <div className="flex items-center text-sm text-gray-500">
            <ApperIcon name="Loader2" className="w-4 h-4 animate-spin mr-1" />
            Submitting...
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;