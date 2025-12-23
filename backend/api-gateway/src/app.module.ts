import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { UserController } from "./user/user.controller";
import { ProductController } from "./product/product.controller";
import { CategoryController } from "./category/category.controller";
import { OrderController } from "./order/order.controller";
import { CartController } from "./cart/cart.controller";
import { AdminController } from "./admin/admin.controller";
import { ChatbotController } from "./chatbot/chatbot.controller";
import { ReviewController } from "./review/review.controller";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "AUTH_SERVICE",
        transport: Transport.TCP,
        options: { host: "localhost", port: 4001 },
      },
      {
        name: "PRODUCT_SERVICE",
        transport: Transport.TCP,
        options: { host: "localhost", port: 4002 },
      },
      {
        name: "ORDER_SERVICE",
        transport: Transport.TCP,
        options: { host: "localhost", port: 4003 },
      },
      {
        name: "CART_SERVICE",
        transport: Transport.TCP,
        options: { host: "localhost", port: 4004 },
      },
      {
        name: "CHATBOT_SERVICE",
        transport: Transport.TCP,
        options: { host: "localhost", port: 4005 },
      },
      {
        name: "REVIEW_SERVICE",
        transport: Transport.TCP,
        options: { host: "localhost", port: 4006 },
      },
    ]),
  ],
  controllers: [
    UserController,
    ProductController,
    CategoryController,
    OrderController,
    CartController,
    AdminController,
    ChatbotController,
    ReviewController,
  ],
})
export class AppModule {}
