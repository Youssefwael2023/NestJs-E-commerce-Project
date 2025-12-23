import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => {
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';
        console.log('📦 Product Microservice: Connecting to MongoDB...');
        console.log('📦 MongoDB URI configured:', mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
        return {
          uri: mongoUri,
          retryWrites: true,
          w: 'majority',
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
        };
      },
    }),
    ProductModule,
    CategoryModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(@InjectConnection() private connection: Connection) {
  }

  async onModuleInit() {
    // Check current connection state
    const readyState = this.connection.readyState;
    console.log('📊 Product Microservice Connection readyState:', readyState, '(0=disconnected, 1=connected, 2=connecting, 3=disconnecting)');
    
    if (readyState === 1) {
      console.log('✅ Product Microservice: MongoDB already connected!');
      console.log('📊 Database:', this.connection.db?.databaseName);
      return;
    }

    // Wait for connection with timeout
    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        console.error('❌ Product Microservice: MongoDB connection timeout after 10 seconds!');
        console.error('❌ Current state:', this.connection.readyState);
        reject(new Error('MongoDB connection timeout'));
      }, 10000);

      const onConnected = () => {
        clearTimeout(timeout);
        console.log('✅ Product Microservice: MongoDB connected successfully!');
        console.log('📊 Database:', this.connection.db?.databaseName);
        console.log('📊 Host:', this.connection.host);
        this.connection.removeListener('connected', onConnected);
        this.connection.removeListener('error', onError);
        resolve();
      };

      const onError = (err: any) => {
        clearTimeout(timeout);
        console.error('❌ Product Microservice: MongoDB connection error:', err.message);
        this.connection.removeListener('connected', onConnected);
        this.connection.removeListener('error', onError);
        reject(err);
      };

      this.connection.once('connected', onConnected);
      this.connection.once('error', onError);

      // Also set up persistent listeners
      this.connection.on('error', (err) => {
        console.error('❌ Product Microservice: MongoDB connection error:', err.message);
      });

      this.connection.on('disconnected', () => {
        console.log('⚠️ Product Microservice: MongoDB disconnected');
      });
    });
  }
}

