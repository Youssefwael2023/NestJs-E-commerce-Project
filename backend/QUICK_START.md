# Quick Start Guide

## ✅ Dependencies Installed

All microservices now have their dependencies installed. You can start them!

## 🚀 Starting Services

### Option 1: Start Each Service Manually (Recommended for Development)

Open **6 separate terminal windows** and run:

**Terminal 1 - API Gateway:**

```bash
cd backend/api-gateway
npm run start:dev
```

**Terminal 2 - Auth Microservice:**

```bash
cd backend/auth-microservice
npm run start:dev
```

**Terminal 3 - Product Microservice:**

```bash
cd backend/product-microservice
npm run start:dev
```

**Terminal 4 - Order Microservice:**

```bash
cd backend/order-microservice
npm run start:dev
```

**Terminal 5 - Cart Microservice:**

```bash
cd backend/cart-microservice
npm run start:dev
```

**Terminal 6 - Chatbot Microservice:**

```bash
cd backend/chatbot-microservice
npm run start:dev
```

### Option 2: Use PM2 (Production-like)

```bash
# Install PM2 globally (if not already installed)
npm install -g pm2

# Navigate to backend directory
cd backend

# Start all services
pm2 start ecosystem.config.js

# View logs
pm2 logs

# Stop all services
pm2 stop all
```

### Option 3: Use Batch Script (Windows)

```bash
cd backend
start-all.bat
```

## ⚠️ Important Notes

1. **MongoDB must be running** before starting services
2. **Start microservices BEFORE the API Gateway** (or start Gateway last)
3. Each service will show a success message when ready:
   - ✅ Auth Microservice is listening on port 4001
   - ✅ Product Microservice is listening on port 4002
   - ✅ Order Microservice is listening on port 4003
   - ✅ Cart Microservice is listening on port 4004
   - ✅ Chatbot Microservice is listening on port 4005
   - 🚀 API Gateway is running on http://localhost:3000

## 🧪 Test the Setup

Once all services are running, test the API Gateway:

```bash
# Health check
curl http://localhost:3000/

# Or open in browser
http://localhost:3000/
```

## 🐛 Troubleshooting

### "Port already in use"

- Stop any services using ports 3000, 4001-4005
- Or change ports in the service's `main.ts` file

### "Cannot connect to MongoDB"

- Make sure MongoDB is running
- Check your `MONGO_URI` in `.env` files
- Default: `mongodb://localhost:27017/ecommerce`

### "ts-node-dev not found"

- Run `npm install` in the service directory
- This should already be done, but if not: `cd backend/[service-name] && npm install`

## 📝 Next Steps

1. ✅ Dependencies installed
2. ⏳ Start all services
3. ⏳ Test API Gateway endpoints
4. ⏳ Start React frontend
5. ⏳ Test complete flow

## 🎯 Expected Output

When services start successfully, you should see:

```
✅ Auth Microservice is listening on port 4001
✅ Product Microservice is listening on port 4002
✅ Order Microservice is listening on port 4003
✅ Cart Microservice is listening on port 4004
✅ Chatbot Microservice is listening on port 4005
🚀 API Gateway is running on http://localhost:3000
```

Good luck! 🚀
