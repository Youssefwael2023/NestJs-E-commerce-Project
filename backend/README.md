# NestJS Microservices Backend

This is the migrated NestJS microservices backend for the Al-Masrya E-commerce platform.

## 🏗️ Architecture

The backend is split into multiple microservices:

- **API Gateway** (Port 3000) - HTTP entry point
- **Auth Microservice** (Port 4001) - Authentication & User management
- **Product Microservice** (Port 4002) - Products & Categories
- **Order Microservice** (Port 4003) - Orders & Payments
- **Cart Microservice** (Port 4004) - Shopping Cart
- **Chatbot Microservice** (Port 4005) - Chatbot functionality

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB running locally or connection string
- npm or yarn

### Installation

1. Install dependencies for each service:

```bash
# Install all dependencies
cd api-gateway && npm install && cd ..
cd auth-microservice && npm install && cd ..
cd product-microservice && npm install && cd ..
cd order-microservice && npm install && cd ..
cd cart-microservice && npm install && cd ..
cd chatbot-microservice && npm install && cd ..
```

2. Set up environment variables (create `.env` files in each service directory)

3. Build TypeScript:

```bash
# Build all services
cd api-gateway && npm run build && cd ..
cd auth-microservice && npm run build && cd ..
cd product-microservice && npm run build && cd ..
cd order-microservice && npm run build && cd ..
cd cart-microservice && npm run build && cd ..
cd chatbot-microservice && npm run build && cd ..
```

### Running Services

**Option 1: Manual (Development)**

Start each service in a separate terminal:

```bash
# Terminal 1
cd api-gateway && npm run start:dev

# Terminal 2
cd auth-microservice && npm run start:dev

# Terminal 3
cd product-microservice && npm run start:dev

# Terminal 4
cd order-microservice && npm run start:dev

# Terminal 5
cd cart-microservice && npm run start:dev

# Terminal 6
cd chatbot-microservice && npm run start:dev
```

**Option 2: PM2 (Production-like)**

```bash
# Install PM2 globally
npm install -g pm2

# Start all services
pm2 start ecosystem.config.js

# View logs
pm2 logs

# Stop all services
pm2 stop all
```

## 📝 Environment Variables

### API Gateway
```
PORT=3000
FRONTEND_URL=http://localhost:3001
```

### Auth Microservice
```
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-secret-key-change-in-production
```

### Product Microservice
```
MONGO_URI=mongodb://localhost:27017/ecommerce
```

### Order Microservice
```
MONGO_URI=mongodb://localhost:27017/ecommerce
```

### Cart Microservice
```
MONGO_URI=mongodb://localhost:27017/ecommerce
```

### Chatbot Microservice
```
OPENAI_API_KEY=your-openai-api-key-optional
```

## 🧪 Testing

Test the API Gateway endpoints:

```bash
# Health check
curl http://localhost:3000/

# Register user
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get products
curl http://localhost:3000/api/products
```

## 📚 API Endpoints

All endpoints are accessed through the API Gateway at `http://localhost:3000`:

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users` - Get all users
- `GET /api/users/profile/:id` - Get user profile
- `PUT /api/users/profile/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `PUT /api/products/sell/:id` - Sell product

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders/user/:userId` - Get user orders
- `PUT /api/orders/:id/status` - Update order status
- `PUT /api/orders/:id/payment` - Update payment status
- `GET /api/orders/admin/stats` - Get dashboard stats

### Cart
- `GET /api/cart/:userId` - Get user cart
- `POST /api/cart/:userId` - Add/update cart item
- `DELETE /api/cart/:userId/:productId` - Remove cart item
- `DELETE /api/cart/:userId` - Clear cart

### Chatbot
- `POST /api/chatbot` - Process chatbot message

### Admin
- `GET /api/admin/report` - Generate AI report

## 🔧 Development

### Project Structure

Each microservice follows this structure:

```
[service-name]/
├── src/
│   ├── [domain]/
│   │   ├── [domain].controller.ts
│   │   ├── [domain].service.ts
│   │   └── [domain].module.ts
│   ├── schemas/
│   │   └── [schema].schema.ts
│   ├── app.module.ts
│   └── main.ts
├── package.json
└── tsconfig.json
```

### Adding New Features

1. Create schema in `src/schemas/`
2. Create service in `src/[domain]/[domain].service.ts`
3. Create controller in `src/[domain]/[domain].controller.ts`
4. Register in module
5. Add route in API Gateway if needed

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process using port
netstat -ano | findstr :3000
# Kill process (Windows)
taskkill /PID <PID> /F
```

### MongoDB Connection Error
- Verify MongoDB is running
- Check connection string in `.env`
- Ensure database exists

### Service Won't Start
- Check TypeScript compilation errors
- Verify all dependencies are installed
- Check environment variables

## 📖 Documentation

For more details, see:
- [Migration Guide](../MIGRATION_GUIDE.md)
- [NestJS Documentation](https://docs.nestjs.com/)
- [NestJS Microservices](https://docs.nestjs.com/microservices/basics)

## 📄 License

ISC

