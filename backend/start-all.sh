#!/bin/bash

# Start all microservices
# Make sure MongoDB is running before executing this script

echo "🚀 Starting all microservices..."

# Start each service in background
cd api-gateway && npm run start:dev &
cd ../auth-microservice && npm run start:dev &
cd ../product-microservice && npm run start:dev &
cd ../order-microservice && npm run start:dev &
cd ../cart-microservice && npm run start:dev &
cd ../chatbot-microservice && npm run start:dev &

echo "✅ All services started!"
echo "📝 Check logs in each service directory"
echo "🌐 API Gateway: http://localhost:3000"

