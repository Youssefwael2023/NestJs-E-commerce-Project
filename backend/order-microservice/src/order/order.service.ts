import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Order, OrderDocument } from "../schemas/order.schema";

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>
  ) {}

  async createOrder(data: {
    user: string;
    orderItems: any[];
    shippingAddress: any;
    paymentMethod: string;
    itemsPrice: number;
    shippingPrice: number;
    taxPrice: number;
    totalPrice: number;
  }) {
    if (!data.user) {
      throw new Error("User ID is required");
    }
    if (!data.orderItems || data.orderItems.length === 0) {
      throw new Error("No order items provided");
    }
    if (!data.shippingAddress) {
      throw new Error("Shipping address is required");
    }
    if (!data.paymentMethod) {
      throw new Error("Payment method is required");
    }

    const order = new this.orderModel(data);
    const savedOrder = await order.save();
    return savedOrder;
  }

  async getOrderById(id: string) {
    if (!id) {
      throw new Error("Order ID is required");
    }
    const order = await this.orderModel
      .findById(id)
      .populate("user", "name email");
    if (!order) {
      throw new Error(`Order with ID ${id} not found`);
    }
    return order;
  }

  async getUserOrders(userId: string) {
    return await this.orderModel.find({ user: userId });
  }

  async getAllOrders() {
    return await this.orderModel.find().populate("user", "name email");
  }

  async updateOrderStatus(id: string, status: string) {
    const order = await this.orderModel.findById(id);
    if (!order) {
      throw new Error("Order not found");
    }

    order.status = status;

    if (status === "Pending") {
      order.isShipped = false;
      order.isDelivered = false;
    } else if (status === "Shipped") {
      order.isShipped = true;
      order.isDelivered = false;
    } else if (status === "Delivered") {
      order.isDelivered = true;
      order.isShipped = true;
    }

    return await order.save();
  }

  async updatePaymentStatus(id: string, isPaid: boolean) {
    const order = await this.orderModel.findById(id);
    if (!order) {
      throw new Error("Order not found");
    }

    order.isPaid = isPaid;
    if (isPaid) {
      order.paidAt = new Date();
    } else {
      order.paidAt = null;
    }

    return await order.save();
  }

  async getDashboardStats() {
    const totalOrders = await this.orderModel.countDocuments();

    const totalRevenue = await this.orderModel.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    const pendingOrders = await this.orderModel.countDocuments({
      $and: [{ isDelivered: { $ne: true } }, { isShipped: { $ne: true } }],
    });

    const shippedOrders = await this.orderModel.countDocuments({
      isShipped: true,
      isDelivered: { $ne: true },
    });

    const deliveredOrders = await this.orderModel.countDocuments({
      isDelivered: true,
    });

    return {
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      pendingOrders,
      shippedOrders,
      deliveredOrders,
    };
  }
}
