# Environment Variables Setup

Since `.env` files are in `.gitignore`, create them manually in each service directory.

## Create .env Files

### 1. API Gateway (`backend/api-gateway/.env`)
```
PORT=3000
FRONTEND_URL=http://localhost:3001
```

### 2. Auth Microservice (`backend/auth-microservice/.env`)
```
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-secret-key-change-in-production
```

### 3. Product Microservice (`backend/product-microservice/.env`)
```
MONGO_URI=mongodb://localhost:27017/ecommerce
```

### 4. Order Microservice (`backend/order-microservice/.env`)
```
MONGO_URI=mongodb://localhost:27017/ecommerce
```

### 5. Cart Microservice (`backend/cart-microservice/.env`)
```
MONGO_URI=mongodb://localhost:27017/ecommerce
```

### 6. Chatbot Microservice (`backend/chatbot-microservice/.env`)
```
OPENAI_API_KEY=your-openai-api-key-optional
```

## Quick Setup Script (Windows)

Create a file `setup-env.bat` in the `backend` directory:

```batch
@echo off
echo Creating .env files...

echo PORT=3000 > api-gateway\.env
echo FRONTEND_URL=http://localhost:3001 >> api-gateway\.env

echo MONGO_URI=mongodb://localhost:27017/ecommerce > auth-microservice\.env
echo JWT_SECRET=your-secret-key-change-in-production >> auth-microservice\.env

echo MONGO_URI=mongodb://localhost:27017/ecommerce > product-microservice\.env

echo MONGO_URI=mongodb://localhost:27017/ecommerce > order-microservice\.env

echo MONGO_URI=mongodb://localhost:27017/ecommerce > cart-microservice\.env

echo OPENAI_API_KEY= > chatbot-microservice\.env

echo .env files created successfully!
```

Run it with: `setup-env.bat`

## Notes

- Replace `mongodb://localhost:27017/ecommerce` with your actual MongoDB connection string if different
- Change `JWT_SECRET` to a strong random string in production
- `OPENAI_API_KEY` is optional - chatbot will use default responses if not provided

