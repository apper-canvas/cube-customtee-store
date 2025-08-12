import reviewData from "@/services/mockData/reviews.js";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Store for user votes (in real app, this would be in backend)
let userVotes = JSON.parse(localStorage.getItem('userVotes') || '{}');

export const reviewService = {
  async getByProductId(productId) {
    await delay(300);
    return reviewData.filter(review => review.productId === productId)
                    .map(review => ({ ...review }));
  },

  async getById(id) {
    await delay(200);
    const review = reviewData.find(r => r.Id === id);
    if (!review) {
      throw new Error("Review not found");
    }
    return { ...review };
  },

  async create(review) {
    await delay(400);
    const maxId = Math.max(...reviewData.map(r => r.Id), 0);
    const newReview = {
      ...review,
      Id: maxId + 1,
      reviewDate: new Date().toISOString(),
      helpfulVotes: { yes: 0, no: 0 },
      verified: true
    };
    reviewData.push(newReview);
    return { ...newReview };
  },

  async update(id, updates) {
    await delay(350);
    const index = reviewData.findIndex(r => r.Id === id);
    if (index === -1) {
      throw new Error("Review not found");
    }
    reviewData[index] = { ...reviewData[index], ...updates };
    return { ...reviewData[index] };
  },

  async delete(id) {
    await delay(300);
    const index = reviewData.findIndex(r => r.Id === id);
    if (index === -1) {
      throw new Error("Review not found");
    }
    const deleted = reviewData.splice(index, 1)[0];
    return { ...deleted };
  },

  async voteHelpful(reviewId, isHelpful) {
    await delay(200);
    const review = reviewData.find(r => r.Id === reviewId);
    if (!review) {
      throw new Error("Review not found");
    }

    // Check if user has already voted on this review
    const voteKey = `review_${reviewId}`;
    const existingVote = userVotes[voteKey];

    if (existingVote) {
      // User has already voted, update the vote
      if (existingVote === 'yes') {
        review.helpfulVotes.yes--;
      } else {
        review.helpfulVotes.no--;
      }
    }

    // Add new vote
    if (isHelpful) {
      review.helpfulVotes.yes++;
      userVotes[voteKey] = 'yes';
    } else {
      review.helpfulVotes.no++;
      userVotes[voteKey] = 'no';
    }

    // Store votes in localStorage
    localStorage.setItem('userVotes', JSON.stringify(userVotes));

    return { 
      ...review,
      userVote: userVotes[voteKey]
    };
  },

  getUserVote(reviewId) {
    const voteKey = `review_${reviewId}`;
    return userVotes[voteKey] || null;
  },

  getReviewStats(productId) {
    const reviews = reviewData.filter(r => r.productId === productId);
    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        photosCount: 0
      };
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    
    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      ratingDistribution[review.rating]++;
    });

    const photosCount = reviews.reduce((count, review) => count + review.photos.length, 0);

    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: reviews.length,
      ratingDistribution,
      photosCount
    };
  }
};