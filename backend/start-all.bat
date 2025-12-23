@echo off
REM Start all microservices on Windows
REM Make sure MongoDB is running before executing this script

echo Starting all microservices...

start "API Gateway" cmd /k "cd api-gateway && npm run start:dev"
start "Auth Microservice" cmd /k "cd auth-microservice && npm run start:dev"
start "Product Microservice" cmd /k "cd product-microservice && npm run start:dev"
start "Order Microservice" cmd /k "cd order-microservice && npm run start:dev"
start "Cart Microservice" cmd /k "cd cart-microservice && npm run start:dev"
start "Chatbot Microservice" cmd /k "cd chatbot-microservice && npm run start:dev"
start "Review Microservice" cmd /k "cd review-microservice && npm run start:dev"

echo All services started!
echo Check the opened windows for logs
echo API Gateway: http://localhost:3000

