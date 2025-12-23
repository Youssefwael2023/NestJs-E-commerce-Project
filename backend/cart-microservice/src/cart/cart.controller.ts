import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CartService } from "./cart.service";

@Controller()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @MessagePattern({ cmd: "get-cart" })
  async getCart(@Payload() userId: string) {
    try {
      return await this.cartService.getCart(userId);
    } catch (error) {
      return { error: error.message };
    }
  }

  @MessagePattern({ cmd: "add-cart-item" })
  async addOrUpdateCartItem(@Payload() data: any) {
    try {
      console.log(
        "🛒 Cart Controller: add-cart-item message received with:",
        data
      );
      const result = await this.cartService.addOrUpdateCartItem(data);
      console.log("🛒 Cart Controller: add-cart-item result:", result);
      return result;
    } catch (error) {
      console.error(
        "🛒 Cart Controller: Error in add-cart-item:",
        error.message
      );
      return { error: error.message };
    }
  }

  @MessagePattern({ cmd: "remove-cart-item" })
  async removeCartItem(@Payload() data: any) {
    try {
      return await this.cartService.removeCartItem(data);
    } catch (error) {
      return { error: error.message };
    }
  }

  @MessagePattern({ cmd: "clear-cart" })
  async clearCart(@Payload() userId: string) {
    try {
      return await this.cartService.clearCart(userId);
    } catch (error) {
      return { error: error.message };
    }
  }
}
