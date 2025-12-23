import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: 4006,
      },
    },
  );

  await app.listen();
  console.log('🌟 Review Microservice is running on port 4006');
}

bootstrap().catch((err) => {
  console.error('❌ Failed to start Review Microservice:', err);
  process.exit(1);
});
