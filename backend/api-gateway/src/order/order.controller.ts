import {
  Controller,
  Get,
  Post,
  Put,
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

@Controller("api/orders")
@UseInterceptors(new TimeoutInterceptor(20000)) // 20 second timeout for order operations
export class OrderController {
  constructor(
    @Inject("ORDER_SERVICE") private readonly orderClient: ClientProxy
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOrder(@Body() body: any) {
    try {
      const result = await firstValueFrom(
        this.orderClient.send({ cmd: "create-order" }, body).pipe(timeout(20000))
      );
      if (result && result.error) {
        throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
      }
      return {
        statusCode: HttpStatus.CREATED,
        message: "Order created successfully",
        order: result,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || "Failed to create order",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllOrders() {
    try {
      const result = await firstValueFrom(
        this.orderClient.send({ cmd: "get-all-orders" }, {}).pipe(timeout(20000))
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
        error.message || "Failed to fetch orders",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get("admin/stats")
  @HttpCode(HttpStatus.OK)
  async getDashboardStats() {
    try {
      const result = await firstValueFrom(
        this.orderClient.send({ cmd: "get-dashboard-stats" }, {}).pipe(timeout(20000))
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
        error.message || "Failed to fetch dashboard stats",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get("user/:userId")
  @HttpCode(HttpStatus.OK)
  async getUserOrders(@Param("userId") userId: string) {
    try {
      const result = await firstValueFrom(
        this.orderClient.send({ cmd: "get-user-orders" }, userId).pipe(timeout(20000))
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
        error.message || "Failed to fetch user orders",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  async getOrderById(@Param("id") id: string) {
    try {
      const result = await firstValueFrom(
        this.orderClient.send({ cmd: "get-order" }, id).pipe(timeout(20000))
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
        error.message || "Failed to fetch order",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put(":id/status")
  @HttpCode(HttpStatus.OK)
  async updateOrderStatus(@Param("id") id: string, @Body() body: any) {
    try {
      const result = await firstValueFrom(
        this.orderClient.send(
          { cmd: "update-order-status" },
          { id, status: body.status }
        ).pipe(timeout(20000))
      );
      if (result && result.error) {
        throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
      }
      return {
        statusCode: HttpStatus.OK,
        message: "Order status updated successfully",
        order: result,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || "Failed to update order status",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put(":id/payment")
  @HttpCode(HttpStatus.OK)
  async updatePaymentStatus(@Param("id") id: string, @Body() body: any) {
    try {
      const result = await firstValueFrom(
        this.orderClient.send(
          { cmd: "update-payment-status" },
          { id, isPaid: body.isPaid }
        ).pipe(timeout(20000))
      );
      if (result && result.error) {
        throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
      }
      return {
        statusCode: HttpStatus.OK,
        message: "Payment status updated successfully",
        order: result,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || "Failed to update payment status",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
