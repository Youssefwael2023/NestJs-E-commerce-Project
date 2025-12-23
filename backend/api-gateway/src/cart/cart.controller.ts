import {
  Controller,
  Get,
  Post,
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

@Controller("api/cart")
@UseInterceptors(new TimeoutInterceptor(15000)) // 15 second timeout for cart operations
export class CartController {
  constructor(
    @Inject("CART_SERVICE") private readonly cartClient: ClientProxy
  ) {}

  @Get(":userId")
  @HttpCode(HttpStatus.OK)
  async getCart(@Param("userId") userId: string) {
    try {
      const result = await firstValueFrom(
        this.cartClient.send({ cmd: "get-cart" }, userId).pipe(timeout(15000))
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
        error.message || "Failed to fetch cart",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post(":userId")
  @HttpCode(HttpStatus.CREATED)
  async addOrUpdateCartItem(
    @Param("userId") userId: string,
    @Body() body: any
  ) {
    try {
      console.log("🛒 API Gateway: Received add-to-cart request");
      console.log("   User ID:", userId);
      console.log("   Body:", body);

      const result = await firstValueFrom(
        this.cartClient.send(
          { cmd: "add-cart-item" },
          { userId, productId: body.productId, quantity: body.quantity }
        ).pipe(timeout(15000))
      );

      console.log("🛒 API Gateway: Cart service response:", result);

      if (result && result.error) {
        throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
      }
      return {
        statusCode: HttpStatus.CREATED,
        message: "Cart item added successfully",
        cart: result,
      };
    } catch (error) {
      console.error("🛒 API Gateway: Error adding to cart:", error.message);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || "Failed to update cart",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(":userId/:productId")
  @HttpCode(HttpStatus.OK)
  async removeCartItem(
    @Param("userId") userId: string,
    @Param("productId") productId: string
  ) {
    try {
      const result = await firstValueFrom(
        this.cartClient.send({ cmd: "remove-cart-item" }, { userId, productId }).pipe(timeout(15000))
      );
      if (result && result.error) {
        throw new HttpException(result.error, HttpStatus.NOT_FOUND);
      }
      return {
        statusCode: HttpStatus.OK,
        message: "Cart item removed successfully",
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || "Failed to remove item",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(":userId")
  @HttpCode(HttpStatus.OK)
  async clearCart(@Param("userId") userId: string) {
    try {
      const result = await firstValueFrom(
        this.cartClient.send({ cmd: "clear-cart" }, userId).pipe(timeout(15000))
      );
      if (result && result.error) {
        throw new HttpException(result.error, HttpStatus.NOT_FOUND);
      }
      return {
        statusCode: HttpStatus.OK,
        message: "Cart cleared successfully",
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || "Failed to clear cart",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
