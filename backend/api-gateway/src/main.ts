import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./common/filters/http-exception.filter";
import * as dotenv from "dotenv";
import { resolve } from "path";
import * as express from "express";

// Load environment variables - try multiple possible locations
const envPath = resolve(process.cwd(), ".env");
dotenv.config({ path: envPath });
console.log("📄 API Gateway loading .env from:", envPath);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure file upload limits (50MB for base64 encoded images)
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Global Exception Filter - handles all exceptions consistently
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global Validation Pipe - validates all incoming requests
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: false, // Don't throw error for non-whitelisted properties
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Enable implicit type conversion
      },
    })
  );

  // Enable CORS for React frontend
  // Allow both Vite (5173) and potential other ports for development
  const allowedOrigins = [
    process.env.FRONTEND_URL || "http://localhost:5173",
    "http://localhost:5173", // Vite default
    "http://localhost:3001", // Alternative port
    "http://localhost:3000", // Alternative port
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests) in development
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 API Gateway is running on http://localhost:${port}`);
}
bootstrap();
