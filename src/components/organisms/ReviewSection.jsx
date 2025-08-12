import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import StarRating from "@/components/molecules/StarRating";
import ReviewCard from "@/components/molecules/ReviewCard";
import WriteReviewModal from "@/components/organisms/WriteReviewModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { reviewService } from "@/services/api/reviewService";
import { cn } from "@/utils/cn";

const ReviewSection = ({ product }) => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [showWriteReview, setShowWriteReview] = useState(false);

  const filters = [
    { key: "all", label: "All Reviews", count: 0 },
    { key: "photos", label: "With Photos", count: 0 },
    { key: "5star", label: "5 Stars", count: 0 },
    { key: "4plus", label: "4+ Stars", count: 0 },
    { key: "recent", label: "Recent", count: 0 }
  ];

  const sortOptions = [
    { key: "recent", label: "Most Recent" },
    { key: "helpful", label: "Most Helpful" },
    { key: "highest", label: "Highest Rating" },
    { key: "lowest", label: "Lowest Rating" }
  ];

  useEffect(() => {
    loadReviews();
  }, [product.Id]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [reviews, activeFilter, sortBy]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const [reviewsData, stats] = await Promise.all([
        reviewService.getByProductId(product.Id),
        Promise.resolve(reviewService.getReviewStats(product.Id))
      ]);
      
      setReviews(reviewsData);
      setReviewStats(stats);
      setError(null);
    } catch (err) {
      console.error("Error loading reviews:", err);
      setError("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...reviews];

    // Apply filters
    switch (activeFilter) {
      case "photos":
        filtered = filtered.filter(review => review.photos.length > 0);
        break;
      case "5star":
        filtered = filtered.filter(review => review.rating === 5);
        break;
      case "4plus":
        filtered = filtered.filter(review => review.rating >= 4);
        break;
      case "recent":
        const recentDate = new Date();
        recentDate.setMonth(recentDate.getMonth() - 3); // Last 3 months
        filtered = filtered.filter(review => new Date(review.reviewDate) >= recentDate);
        break;
      default:
        // "all" - no filtering needed
        break;
    }

    // Apply sorting
    switch (sortBy) {
      case "helpful":
        filtered.sort((a, b) => {
          const aTotal = a.helpfulVotes.yes + a.helpfulVotes.no;
          const bTotal = b.helpfulVotes.yes + b.helpfulVotes.no;
          if (aTotal === 0 && bTotal === 0) return 0;
          if (aTotal === 0) return 1;
          if (bTotal === 0) return -1;
          const aRatio = a.helpfulVotes.yes / aTotal;
          const bRatio = b.helpfulVotes.yes / bTotal;
          return bRatio - aRatio;
        });
        break;
      case "highest":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "lowest":
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      case "recent":
      default:
        filtered.sort((a, b) => new Date(b.reviewDate) - new Date(a.reviewDate));
        break;
    }

    setFilteredReviews(filtered);
  };

  const handleReviewAdded = (newReview) => {
    setReviews(prev => [newReview, ...prev]);
    setReviewStats(reviewService.getReviewStats(product.Id));
    toast.success("Thank you for your review!");
  };

  const handleVoteUpdate = (updatedReview) => {
    setReviews(prev => prev.map(review => 
      review.Id === updatedReview.Id ? updatedReview : review
    ));
  };

  const getFilterCounts = () => {
    return {
      all: reviews.length,
      photos: reviews.filter(r => r.photos.length > 0).length,
      "5star": reviews.filter(r => r.rating === 5).length,
      "4plus": reviews.filter(r => r.rating >= 4).length,
      recent: reviews.filter(r => {
        const recentDate = new Date();
        recentDate.setMonth(recentDate.getMonth() - 3);
        return new Date(r.reviewDate) >= recentDate;
      }).length
    };
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadReviews} />;
  if (!reviewStats) return null;

  const filterCounts = getFilterCounts();

  return (
    <div className="space-y-6">
      {/* Review Stats Header */}
      <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-xl border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900">
                {reviewStats.averageRating.toFixed(1)}
              </div>
              <StarRating rating={reviewStats.averageRating} size="md" />
              <p className="text-sm text-gray-600 mt-1">
                {reviewStats.totalReviews} reviews
              </p>
            </div>
            
            {/* Rating Distribution */}
            <div className="space-y-2 flex-1 max-w-md">
              {[5, 4, 3, 2, 1].map(rating => {
                const count = reviewStats.ratingDistribution[rating];
                const percentage = reviewStats.totalReviews > 0 
                  ? (count / reviewStats.totalReviews) * 100 
                  : 0;
                
                return (
                  <div key={rating} className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1 w-12">
                      <span className="text-sm text-gray-600">{rating}</span>
                      <ApperIcon name="Star" className="w-3 h-3 text-yellow-400 fill-current" />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            {reviewStats.photosCount > 0 && (
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {reviewStats.photosCount}
                </div>
                <p className="text-xs text-gray-600">Photos</p>
              </div>
            )}
            
            <Button 
              onClick={() => setShowWriteReview(true)}
              className="whitespace-nowrap"
            >
              <ApperIcon name="Edit3" className="w-4 h-4 mr-2" />
              Write Review
            </Button>
          </div>
        </div>
      </div>

      {/* Filters and Sorting */}
      {reviews.length > 0 && (
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {filters.map(filter => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap",
                  activeFilter === filter.key
                    ? "bg-primary text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                {filter.label}
                <span className="ml-2 text-xs opacity-75">
                  ({filterCounts[filter.key]})
                </span>
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary bg-white"
            >
              {sortOptions.map(option => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.length > 0 ? (
          filteredReviews.map(review => (
            <ReviewCard
              key={review.Id}
              review={review}
              onVoteUpdate={handleVoteUpdate}
            />
          ))
        ) : reviews.length > 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <ApperIcon name="Filter" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews match your filters</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filter criteria</p>
            <Button
              variant="outline"
              onClick={() => setActiveFilter("all")}
            >
              Show All Reviews
            </Button>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <ApperIcon name="MessageSquare" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
            <p className="text-gray-600 mb-4">Be the first to share your experience with this product!</p>
            <Button onClick={() => setShowWriteReview(true)}>
              <ApperIcon name="Edit3" className="w-4 h-4 mr-2" />
              Write First Review
            </Button>
          </div>
        )}
      </div>

      {/* Write Review Modal */}
      <WriteReviewModal
        product={product}
        isOpen={showWriteReview}
        onClose={() => setShowWriteReview(false)}
        onReviewAdded={handleReviewAdded}
      />
    </div>
  );
};

export default ReviewSection;