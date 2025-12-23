import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables - try multiple possible locations
const envPath = resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

// Log environment loading
console.log('📄 Loading .env from:', envPath);
console.log('📄 MONGO_URI exists:', !!process.env.MONGO_URI);

// Log MongoDB URI (without password for security)
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';
console.log('🔌 MongoDB URI:', mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 4003,
      },
    },
  );

  await app.listen();
  console.log('✅ Order Microservice is listening on port 4003');
}
bootstrap();

