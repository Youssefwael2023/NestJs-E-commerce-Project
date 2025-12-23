import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Review, ReviewDocument } from "../schemas/review.schema";

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>
  ) {}

  // Create a new review
  async createReview(data: {
    product: string;
    user: string;
    rating: number;
    title: string;
    comment: string;
  }) {
    // Check if user already reviewed this product
    const existingReview = await this.reviewModel.findOne({
      product: data.product,
      user: data.user,
    });

    if (existingReview) {
      throw new Error("You have already reviewed this product");
    }

    // Validate rating
    if (data.rating < 1 || data.rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    // Validate content length
    if (data.title.length < 10 || data.title.length > 1000) {
      throw new Error("Title must be between 10 and 1000 characters");
    }

    if (data.comment.length < 20 || data.comment.length > 2000) {
      throw new Error("Comment must be between 20 and 2000 characters");
    }

    const review = new this.reviewModel({
      ...data,
      isApproved: true, // Auto-approve for now, can be moderated later
      approvedAt: new Date(),
    });

    return await review.save();
  }

  // Get all approved reviews for a product
  async getProductReviews(productId: string) {
    const reviews = await this.reviewModel
      .find({
        product: productId,
        isApproved: true,
      })
      .sort({ createdAt: -1 });

    // Calculate rating statistics
    const allReviews = await this.reviewModel.find({
      product: productId,
      isApproved: true,
    });

    const ratings = allReviews.map((r) => r.rating);
    const averageRating =
      ratings.length > 0
        ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
        : 0;

    const ratingDistribution = {
      5: allReviews.filter((r) => r.rating === 5).length,
      4: allReviews.filter((r) => r.rating === 4).length,
      3: allReviews.filter((r) => r.rating === 3).length,
      2: allReviews.filter((r) => r.rating === 2).length,
      1: allReviews.filter((r) => r.rating === 1).length,
    };

    return {
      reviews,
      stats: {
        averageRating: parseFloat(averageRating.toString()),
        totalReviews: reviews.length,
        ratingDistribution,
      },
    };
  }

  // Get single review
  async getReviewById(id: string) {
    const review = await this.reviewModel
      .findById(id)
      .populate("user", "name email")
      .populate("product", "name");

    if (!review) {
      throw new Error("Review not found");
    }

    return review;
  }

  // Get user reviews
  async getUserReviews(userId: string) {
    return await this.reviewModel
      .find({ user: userId, isApproved: true })
      .populate("product", "name image")
      .sort({ createdAt: -1 });
  }

  // Update review
  async updateReview(
    id: string,
    userId: string,
    data: {
      rating?: number;
      title?: string;
      comment?: string;
    }
  ) {
    const review = await this.reviewModel.findById(id);

    if (!review) {
      throw new Error("Review not found");
    }

    // Check if user owns this review
    if (review.user.toString() !== userId) {
      throw new Error("You can only edit your own reviews");
    }

    if (data.rating && (data.rating < 1 || data.rating > 5)) {
      throw new Error("Rating must be between 1 and 5");
    }

    if (data.title && (data.title.length < 10 || data.title.length > 1000)) {
      throw new Error("Title must be between 10 and 1000 characters");
    }

    if (
      data.comment &&
      (data.comment.length < 20 || data.comment.length > 2000)
    ) {
      throw new Error("Comment must be between 20 and 2000 characters");
    }

    Object.assign(review, data);
    return await review.save();
  }

  // Delete review
  async deleteReview(id: string, userId: string) {
    const review = await this.reviewModel.findById(id);

    if (!review) {
      throw new Error("Review not found");
    }

    // Check if user owns this review
    if (review.user.toString() !== userId) {
      throw new Error("You can only delete your own reviews");
    }

    await this.reviewModel.findByIdAndDelete(id);
    return { message: "Review deleted successfully" };
  }

  // Mark review as helpful
  async markHelpful(reviewId: string, userId: string) {
    const review = await this.reviewModel.findById(reviewId);

    if (!review) {
      throw new Error("Review not found");
    }

    // Check if user already marked as helpful/unhelpful
    const isHelpful = review.helpfulBy.includes(userId);
    const isUnhelpful = review.unhelpfulBy.includes(userId);

    if (isHelpful) {
      // Remove from helpful
      review.helpfulBy = review.helpfulBy.filter((id) => id !== userId);
      review.helpfulCount = Math.max(0, review.helpfulCount - 1);
    } else {
      // Add to helpful and remove from unhelpful if present
      if (isUnhelpful) {
        review.unhelpfulBy = review.unhelpfulBy.filter((id) => id !== userId);
        review.unhelpfulCount = Math.max(0, review.unhelpfulCount - 1);
      }
      review.helpfulBy.push(userId);
      review.helpfulCount += 1;
    }

    return await review.save();
  }

  // Mark review as unhelpful
  async markUnhelpful(reviewId: string, userId: string) {
    const review = await this.reviewModel.findById(reviewId);

    if (!review) {
      throw new Error("Review not found");
    }

    // Check if user already marked as helpful/unhelpful
    const isHelpful = review.helpfulBy.includes(userId);
    const isUnhelpful = review.unhelpfulBy.includes(userId);

    if (isUnhelpful) {
      // Remove from unhelpful
      review.unhelpfulBy = review.unhelpfulBy.filter((id) => id !== userId);
      review.unhelpfulCount = Math.max(0, review.unhelpfulCount - 1);
    } else {
      // Add to unhelpful and remove from helpful if present
      if (isHelpful) {
        review.helpfulBy = review.helpfulBy.filter((id) => id !== userId);
        review.helpfulCount = Math.max(0, review.helpfulCount - 1);
      }
      review.unhelpfulBy.push(userId);
      review.unhelpfulCount += 1;
    }

    return await review.save();
  }

  // Get all reviews (admin)
  async getAllReviews(filters?: { isApproved?: boolean; product?: string }) {
    const query: any = {};

    if (filters?.isApproved !== undefined) {
      query.isApproved = filters.isApproved;
    }

    if (filters?.product) {
      query.product = filters.product;
    }

    return await this.reviewModel
      .find(query)
      .populate("user", "name email")
      .populate("product", "name")
      .sort({ createdAt: -1 });
  }

  // Approve review (admin)
  async approveReview(id: string) {
    const review = await this.reviewModel.findById(id);

    if (!review) {
      throw new Error("Review not found");
    }

    review.isApproved = true;
    review.approvedAt = new Date();
    review.rejectedAt = undefined;
    review.rejectionReason = undefined;

    return await review.save();
  }

  // Reject review (admin)
  async rejectReview(id: string, reason: string) {
    const review = await this.reviewModel.findById(id);

    if (!review) {
      throw new Error("Review not found");
    }

    review.isApproved = false;
    review.rejectedAt = new Date();
    review.rejectionReason = reason;

    return await review.save();
  }

  // Get product rating summary
  async getProductRating(productId: string) {
    const reviews = await this.reviewModel.find({
      product: productId,
      isApproved: true,
    });

    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }

    const ratings = reviews.map((r) => r.rating);
    const averageRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;

    const ratingDistribution = {
      5: reviews.filter((r) => r.rating === 5).length,
      4: reviews.filter((r) => r.rating === 4).length,
      3: reviews.filter((r) => r.rating === 3).length,
      2: reviews.filter((r) => r.rating === 2).length,
      1: reviews.filter((r) => r.rating === 1).length,
    };

    return {
      averageRating: parseFloat(averageRating.toFixed(1)),
      totalReviews: reviews.length,
      ratingDistribution,
    };
  }
}
