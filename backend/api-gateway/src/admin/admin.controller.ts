import {
  Controller,
  Get,
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

@Controller("api/admin")
@UseInterceptors(new TimeoutInterceptor(20000)) // 20 second timeout for admin operations
export class AdminController {
  constructor(
    @Inject("ORDER_SERVICE") private readonly orderClient: ClientProxy
  ) {}

  @Get("report")
  @HttpCode(HttpStatus.OK)
  async generateAIReport() {
    try {
      // This would need to be implemented in the order service
      // For now, returning dashboard stats
      const stats = await firstValueFrom(
        this.orderClient.send({ cmd: "get-dashboard-stats" }, {}).pipe(timeout(20000))
      );
      if (stats && stats.error) {
        throw new HttpException(stats.error, HttpStatus.BAD_REQUEST);
      }
      // In a real implementation, this would call an AI service
      return {
        summary: {
          totalRevenue: stats.totalRevenue,
          totalOrders: stats.totalOrders,
        },
        insights: ["Business is performing well"],
        recommendations: ["Continue current strategy"],
        dateGenerated: new Date().toISOString(),
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || "Failed to generate report",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
