import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { ReviewService } from "./review.service";

@Controller()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @MessagePattern({ cmd: "create-review" })
  async createReview(@Payload() data: any) {
    try {
      return await this.reviewService.createReview(data);
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  @MessagePattern({ cmd: "get-product-reviews" })
  async getProductReviews(@Payload() productId: string) {
    try {
      return await this.reviewService.getProductReviews(productId);
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  @MessagePattern({ cmd: "get-review" })
  async getReview(@Payload() id: string) {
    try {
      return await this.reviewService.getReviewById(id);
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  @MessagePattern({ cmd: "get-user-reviews" })
  async getUserReviews(@Payload() userId: string) {
    try {
      return await this.reviewService.getUserReviews(userId);
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  @MessagePattern({ cmd: "update-review" })
  async updateReview(@Payload() data: any) {
    try {
      return await this.reviewService.updateReview(data.id, data.userId, {
        rating: data.rating,
        title: data.title,
        comment: data.comment,
      });
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  @MessagePattern({ cmd: "delete-review" })
  async deleteReview(@Payload() data: any) {
    try {
      return await this.reviewService.deleteReview(data.id, data.userId);
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  @MessagePattern({ cmd: "mark-helpful" })
  async markHelpful(@Payload() data: any) {
    try {
      return await this.reviewService.markHelpful(data.reviewId, data.userId);
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  @MessagePattern({ cmd: "mark-unhelpful" })
  async markUnhelpful(@Payload() data: any) {
    try {
      return await this.reviewService.markUnhelpful(data.reviewId, data.userId);
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  @MessagePattern({ cmd: "get-all-reviews" })
  async getAllReviews(@Payload() filters: any) {
    try {
      return await this.reviewService.getAllReviews(filters);
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  @MessagePattern({ cmd: "approve-review" })
  async approveReview(@Payload() id: string) {
    try {
      return await this.reviewService.approveReview(id);
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  @MessagePattern({ cmd: "reject-review" })
  async rejectReview(@Payload() data: any) {
    try {
      return await this.reviewService.rejectReview(data.id, data.reason);
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  @MessagePattern({ cmd: "get-product-rating" })
  async getProductRating(@Payload() productId: string) {
    try {
      return await this.reviewService.getProductRating(productId);
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
