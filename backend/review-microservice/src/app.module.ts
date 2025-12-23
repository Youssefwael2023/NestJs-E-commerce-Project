import { Module, OnModuleInit } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ReviewModule } from "./review/review.module";
import { Connection } from "mongoose";
import { InjectConnection } from "@nestjs/mongoose";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => {
        const mongoUri =
          process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce";
        console.log("⭐ Review Microservice: Connecting to MongoDB...");
        console.log(
          "⭐ MongoDB URI configured:",
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
    ReviewModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(@InjectConnection() private connection: Connection) {}

  async onModuleInit() {
    const readyState = this.connection.readyState;
    console.log(
      "📊 Review Microservice Connection readyState:",
      readyState,
      "(0=disconnected, 1=connected, 2=connecting, 3=disconnecting)"
    );

    if (readyState === 1) {
      console.log("✅ Review Microservice: MongoDB already connected!");
      console.log("📊 Database:", this.connection.db?.databaseName);
      return;
    }

    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        console.error(
          "❌ Review Microservice: MongoDB connection timeout after 10 seconds!"
        );
        console.error("❌ Current state:", this.connection.readyState);
        reject(new Error("MongoDB connection timeout"));
      }, 10000);

      const onConnected = () => {
        clearTimeout(timeout);
        console.log("✅ Review Microservice: MongoDB connected successfully!");
        console.log("📊 Database:", this.connection.db?.databaseName);
        this.connection.removeListener("connected", onConnected);
        this.connection.removeListener("error", onError);
        resolve();
      };

      const onError = (err: any) => {
        clearTimeout(timeout);
        console.error(
          "❌ Review Microservice: MongoDB connection error:",
          err.message
        );
        this.connection.removeListener("connected", onConnected);
        this.connection.removeListener("error", onError);
        reject(err);
      };

      this.connection.on("connected", onConnected);
      this.connection.on("error", onError);
    });
  }
}
