import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrderService } from './order.service';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @MessagePattern({ cmd: 'create-order' })
  async createOrder(@Payload() data: any) {
    try {
      return await this.orderService.createOrder(data);
    } catch (error) {
      return { error: error.message };
    }
  }

  @MessagePattern({ cmd: 'get-order' })
  async getOrder(@Payload() id: string) {
    try {
      return await this.orderService.getOrderById(id);
    } catch (error) {
      return { error: error.message };
    }
  }

  @MessagePattern({ cmd: 'get-user-orders' })
  async getUserOrders(@Payload() userId: string) {
    try {
      return await this.orderService.getUserOrders(userId);
    } catch (error) {
      return { error: error.message };
    }
  }

  @MessagePattern({ cmd: 'get-all-orders' })
  async getAllOrders() {
    try {
      return await this.orderService.getAllOrders();
    } catch (error) {
      return { error: error.message };
    }
  }

  @MessagePattern({ cmd: 'update-order-status' })
  async updateOrderStatus(@Payload() data: { id: string; status: string }) {
    try {
      return await this.orderService.updateOrderStatus(data.id, data.status);
    } catch (error) {
      return { error: error.message };
    }
  }

  @MessagePattern({ cmd: 'update-payment-status' })
  async updatePaymentStatus(@Payload() data: { id: string; isPaid: boolean }) {
    try {
      return await this.orderService.updatePaymentStatus(data.id, data.isPaid);
    } catch (error) {
      return { error: error.message };
    }
  }

  @MessagePattern({ cmd: 'get-dashboard-stats' })
  async getDashboardStats() {
    try {
      return await this.orderService.getDashboardStats();
    } catch (error) {
      return { error: error.message };
    }
  }
}

