import { Module, OnModuleInit } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { OrderModule } from "./order/order.module";
import { Connection } from "mongoose";
import { InjectConnection } from "@nestjs/mongoose";

// Import User schema to register it in MongoDB
import { User, UserSchema } from "./schemas/user.schema";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => {
        const mongoUri =
          process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce";
        console.log("📦 Order Microservice: Connecting to MongoDB...");
        console.log(
          "📦 MongoDB URI configured:",
          mongoUri.replace(/\/\/[^:]+:[^@]+@/, "//***:***@")
        );
        return {
          uri: mongoUri,
          retryWrites: true,
          w: "majority",
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
        };
      },
    }),
    // Register User schema globally so Order can reference it
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    OrderModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(@InjectConnection() private connection: Connection) {}

  async onModuleInit() {
    // Check current connection state
    const readyState = this.connection.readyState;
    console.log(
      "📊 Order Microservice Connection readyState:",
      readyState,
      "(0=disconnected, 1=connected, 2=connecting, 3=disconnecting)"
    );

    if (readyState === 1) {
      console.log("✅ Order Microservice: MongoDB already connected!");
      console.log("📊 Database:", this.connection.db?.databaseName);
      return;
    }

    // Wait for connection with timeout
    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        console.error(
          "❌ Order Microservice: MongoDB connection timeout after 10 seconds!"
        );
        console.error("❌ Current state:", this.connection.readyState);
        reject(new Error("MongoDB connection timeout"));
      }, 10000);

      const onConnected = () => {
        clearTimeout(timeout);
        console.log("✅ Order Microservice: MongoDB connected successfully!");
        console.log("📊 Database:", this.connection.db?.databaseName);
        console.log("📊 Host:", this.connection.host);
        this.connection.removeListener("connected", onConnected);
        this.connection.removeListener("error", onError);
        resolve();
      };

      const onError = (err: any) => {
        clearTimeout(timeout);
        console.error(
          "❌ Order Microservice: MongoDB connection error:",
          err.message
        );
        this.connection.removeListener("connected", onConnected);
        this.connection.removeListener("error", onError);
        reject(err);
      };

      this.connection.once("connected", onConnected);
      this.connection.once("error", onError);

      // Also set up persistent listeners
      this.connection.on("error", (err) => {
        console.error(
          "❌ Order Microservice: MongoDB connection error:",
          err.message
        );
      });

      this.connection.on("disconnected", () => {
        console.log("⚠️ Order Microservice: MongoDB disconnected");
      });
    });
  }
}
