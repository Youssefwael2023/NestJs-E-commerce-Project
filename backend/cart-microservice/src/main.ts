import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { resolve, join } from 'path';
import { existsSync } from 'fs';

// Load environment variables - try multiple possible locations
const possiblePaths = [
  resolve(process.cwd(), '.env'), // Current working directory
  join(__dirname, '..', '.env'), // Service root (for compiled code)
  resolve(__dirname, '..', '.env'), // Service root (alternative)
];

let envLoaded = false;
for (const envPath of possiblePaths) {
  if (existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log('📄 ✅ Loaded .env from:', envPath);
    envLoaded = true;
    break;
  }
}

if (!envLoaded) {
  console.warn('⚠️ No .env file found in any of these locations:');
  possiblePaths.forEach(p => console.warn('   -', p));
  console.warn('⚠️ Using default values or system environment variables');
}

// Log environment loading
console.log('📄 MONGO_URI exists:', !!process.env.MONGO_URI);
if (process.env.MONGO_URI) {
  console.log('📄 MONGO_URI value:', process.env.MONGO_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
}

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 4004,
      },
    },
  );

  await app.listen();
  console.log('✅ Cart Microservice is listening on port 4004');
}
bootstrap();

