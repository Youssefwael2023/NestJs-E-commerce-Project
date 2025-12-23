import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Inject,
  HttpException,
  HttpStatus,
  HttpCode,
  UseInterceptors,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { timeout } from "rxjs/operators";
import { TimeoutInterceptor } from "../common/interceptors/timeout.interceptor";

@Controller("api/reviews")
@UseInterceptors(new TimeoutInterceptor(20000))
export class ReviewController {
  constructor(
    @Inject("REVIEW_SERVICE") private readonly reviewClient: ClientProxy
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createReview(@Body() body: any) {
    try {
      const result = await firstValueFrom(
        this.reviewClient
          .send({ cmd: "create-review" }, body)
          .pipe(timeout(20000))
      );
      if (result && result.error) {
        throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
      }
      return {
        statusCode: HttpStatus.CREATED,
        message: "Review created successfully",
        review: result,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || "Failed to create review",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get("product/:productId")
  @HttpCode(HttpStatus.OK)
  async getProductReviews(@Param("productId") productId: string) {
    try {
      const result = await firstValueFrom(
        this.reviewClient
          .send({ cmd: "get-product-reviews" }, productId)
          .pipe(timeout(20000))
      );
      if (result && result.error) {
        throw new HttpException(result.error, HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || "Failed to fetch reviews",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get("user/:userId")
  @HttpCode(HttpStatus.OK)
  async getUserReviews(@Param("userId") userId: string) {
    try {
      const result = await firstValueFrom(
        this.reviewClient
          .send({ cmd: "get-user-reviews" }, userId)
          .pipe(timeout(20000))
      );
      if (result && result.error) {
        throw new HttpException(result.error, HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || "Failed to fetch user reviews",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  async getReview(@Param("id") id: string) {
    try {
      const result = await firstValueFrom(
        this.reviewClient.send({ cmd: "get-review" }, id).pipe(timeout(20000))
      );
      if (result && result.error) {
        throw new HttpException(result.error, HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || "Failed to fetch review",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put(":id")
  @HttpCode(HttpStatus.OK)
  async updateReview(@Param("id") id: string, @Body() body: any) {
    try {
      const result = await firstValueFrom(
        this.reviewClient
          .send({ cmd: "update-review" }, { id, userId: body.userId, ...body })
          .pipe(timeout(20000))
      );
      if (result && result.error) {
        throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
      }
      return {
        statusCode: HttpStatus.OK,
        message: "Review updated successfully",
        review: result,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || "Failed to update review",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  async deleteReview(@Param("id") id: string, @Body() body: any) {
    try {
      const result = await firstValueFrom(
        this.reviewClient
          .send({ cmd: "delete-review" }, { id, userId: body.userId })
          .pipe(timeout(20000))
      );
      if (result && result.error) {
        throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
      }
      return {
        statusCode: HttpStatus.OK,
        message: "Review deleted successfully",
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || "Failed to delete review",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put(":id/helpful")
  @HttpCode(HttpStatus.OK)
  async markHelpful(@Param("id") id: string, @Body() body: any) {
    try {
      const result = await firstValueFrom(
        this.reviewClient
          .send({ cmd: "mark-helpful" }, { reviewId: id, userId: body.userId })
          .pipe(timeout(20000))
      );
      if (result && result.error) {
        throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
      }
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || "Failed to mark review as helpful",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put(":id/unhelpful")
  @HttpCode(HttpStatus.OK)
  async markUnhelpful(@Param("id") id: string, @Body() body: any) {
    try {
      const result = await firstValueFrom(
        this.reviewClient
          .send(
            { cmd: "mark-unhelpful" },
            { reviewId: id, userId: body.userId }
          )
          .pipe(timeout(20000))
      );
      if (result && result.error) {
        throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
      }
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || "Failed to mark review as unhelpful",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get("rating/:productId")
  @HttpCode(HttpStatus.OK)
  async getProductRating(@Param("productId") productId: string) {
    try {
      const result = await firstValueFrom(
        this.reviewClient
          .send({ cmd: "get-product-rating" }, productId)
          .pipe(timeout(20000))
      );
      if (result && result.error) {
        throw new HttpException(result.error, HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || "Failed to fetch product rating",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
