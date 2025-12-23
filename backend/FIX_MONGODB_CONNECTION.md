# Fix MongoDB Connection Issue

## Problem
API requests return success but no data appears in MongoDB Atlas - no collections are created.

## Root Cause
The microservices were not loading environment variables from `.env` files because:
1. `dotenv` package was not installed in microservices
2. `dotenv` was not being loaded in `main.ts` files
3. MongoDB URI was missing the database name

## Solution Applied

### 1. Added dotenv to all microservices
- ✅ `auth-microservice/package.json`
- ✅ `product-microservice/package.json`
- ✅ `order-microservice/package.json`
- ✅ `cart-microservice/package.json`
- ✅ `chatbot-microservice/package.json`
- ✅ `api-gateway/package.json`

### 2. Added dotenv loading in all main.ts files
Each `main.ts` now includes:
```typescript
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();
```

### 3. Fixed MongoDB URI
Updated `setup-env.bat` to include database name:
```
mongodb+srv://...@cluster0.ctnp6x8.mongodb.net/ecommerce?appName=Cluster0
```

## Steps to Fix

### Step 1: Install Dependencies
Run the installation script:
```bash
cd backend
install-dependencies.bat
```

Or manually install in each service:
```bash
cd auth-microservice && npm install
cd ../product-microservice && npm install
cd ../order-microservice && npm install
cd ../cart-microservice && npm install
cd ../chatbot-microservice && npm install
cd ../api-gateway && npm install
```

### Step 2: Recreate .env Files
Run the setup script to create/update .env files:
```bash
cd backend
setup-env.bat
```

This will create `.env` files in each microservice directory with the correct MongoDB URI.

### Step 3: Verify .env Files
Check that each microservice has a `.env` file:
- `auth-microservice/.env`
- `product-microservice/.env`
- `order-microservice/.env`
- `cart-microservice/.env`
- `chatbot-microservice/.env`
- `api-gateway/.env`

Each should contain:
```
MONGO_URI=mongodb+srv://ywael164_db_user:cv9siNS0BlbKa5hY@cluster0.ctnp6x8.mongodb.net/ecommerce?appName=Cluster0
```

### Step 4: Restart All Services
Stop all running services and restart them:

**Option 1: Using PM2**
```bash
pm2 delete all
pm2 start ecosystem.config.js
```

**Option 2: Using start-all.bat**
```bash
cd backend
start-all.bat
```

**Option 3: Manual Start**
Start each service in separate terminals:
```bash
# Terminal 1
cd backend/api-gateway
npm run start:dev

# Terminal 2
cd backend/auth-microservice
npm run start:dev

# Terminal 3
cd backend/product-microservice
npm run start:dev

# Terminal 4
cd backend/order-microservice
npm run start:dev

# Terminal 5
cd backend/cart-microservice
npm run start:dev

# Terminal 6
cd backend/chatbot-microservice
npm run start:dev
```

### Step 5: Test Connection
1. Check console logs - you should see MongoDB connection messages
2. Test creating a user via Postman:
   ```
   POST http://localhost:3000/api/users/register
   Body: {
     "name": "Test User",
     "email": "test@example.com",
     "password": "password123"
   }
   ```
3. Check MongoDB Atlas - you should see:
   - Database: `ecommerce`
   - Collection: `users` (or `users` collection created)
   - Document with the new user

## Verification

### Check Logs
When services start, you should see:
- ✅ Auth Microservice is listening on port 4001
- ✅ Product Microservice is listening on port 4002
- ✅ Order Microservice is listening on port 4003
- ✅ Cart Microservice is listening on port 4004
- ✅ Chatbot Microservice is listening on port 4005
- 🚀 API Gateway is running on http://localhost:3000

### Check MongoDB Connection
If MongoDB connection fails, you'll see errors like:
- `MongooseError: connect ECONNREFUSED`
- `MongoServerError: Authentication failed`

If successful, Mongoose will automatically create collections when you insert the first document.

## Troubleshooting

### Issue: Still no collections in MongoDB
1. **Check MongoDB Atlas IP Whitelist**: Make sure your IP is whitelisted in MongoDB Atlas Network Access
2. **Check Connection String**: Verify the username/password in the connection string
3. **Check Database Name**: Ensure `/ecommerce` is in the URI
4. **Check Logs**: Look for Mongoose connection errors in service logs

### Issue: dotenv not working
1. Verify `dotenv` is installed: `npm list dotenv` in each service directory
2. Verify `.env` file exists in each service directory
3. Check that `dotenv.config()` is called BEFORE any other imports in `main.ts`

### Issue: Environment variables not loading
1. Check `.env` file location - must be in the service root directory
2. Check `.env` file format - no spaces around `=`
3. Restart the service after creating/updating `.env` file

## Expected Behavior After Fix

1. ✅ Services start without errors
2. ✅ MongoDB connection established (check logs)
3. ✅ Collections created automatically on first insert
4. ✅ Data persists in MongoDB Atlas
5. ✅ Can query data from MongoDB Atlas dashboard

## Collections That Will Be Created

- `users` - User accounts
- `products` - Product catalog
- `categories` - Product categories
- `orders` - Customer orders
- `carts` - Shopping carts

These collections are created automatically when the first document is inserted.

