import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => {
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';
        console.log('📦 Auth Microservice: Connecting to MongoDB...');
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
    UserModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(@InjectConnection() private connection: Connection) {
  }

  async onModuleInit() {
    // Check current connection state
    const readyState = this.connection.readyState;
    console.log('📊 Connection readyState:', readyState, '(0=disconnected, 1=connected, 2=connecting, 3=disconnecting)');
    
    if (readyState === 1) {
      console.log('✅ Auth Microservice: MongoDB already connected!');
      console.log('📊 Database:', this.connection.db?.databaseName);
      console.log('📊 Host:', this.connection.host);
    }

    // Wait for connection with timeout
    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        console.error('❌ MongoDB connection timeout after 10 seconds!');
        console.error('❌ Current state:', this.connection.readyState);
        reject(new Error('MongoDB connection timeout'));
      }, 10000);

      const onConnected = () => {
        clearTimeout(timeout);
        console.log('✅ Auth Microservice: MongoDB connected successfully!');
        console.log('📊 Database:', this.connection.db?.databaseName);
        console.log('📊 Host:', this.connection.host);
        console.log('📊 Collections:', Object.keys(this.connection.collections));
        
        // Verify connection by checking database
        if (this.connection.db) {
          this.connection.db.admin().ping((err, result) => {
            if (err) {
              console.error('❌ MongoDB ping failed:', err);
            } else {
              console.log('✅ MongoDB ping successful:', result);
            }
          });
        }
        
        this.connection.removeListener('connected', onConnected);
        this.connection.removeListener('error', onError);
        resolve();
      };

      const onError = (err: any) => {
        clearTimeout(timeout);
        console.error('❌ Auth Microservice: MongoDB connection error:', err.message);
        console.error('❌ Error details:', err);
        console.error('❌ Error code:', err.code);
        this.connection.removeListener('connected', onConnected);
        this.connection.removeListener('error', onError);
        reject(err);
      };

      if (readyState === 1) {
        onConnected();
      } else {
        this.connection.once('connected', onConnected);
        this.connection.once('error', onError);
      }

      // Also set up persistent listeners
      this.connection.on('error', (err) => {
        console.error('❌ Auth Microservice: MongoDB connection error:', err.message);
      });

      this.connection.on('disconnected', () => {
        console.log('⚠️ Auth Microservice: MongoDB disconnected');
      });
    });
  }
}

