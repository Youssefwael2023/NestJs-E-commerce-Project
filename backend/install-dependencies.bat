@echo off
echo Installing dependencies for all microservices...
echo.

echo [1/6] Installing API Gateway dependencies...
cd api-gateway
call npm install
cd ..

echo [2/6] Installing Auth Microservice dependencies...
cd auth-microservice
call npm install
cd ..

echo [3/6] Installing Product Microservice dependencies...
cd product-microservice
call npm install
cd ..

echo [4/6] Installing Order Microservice dependencies...
cd order-microservice
call npm install
cd ..

echo [5/6] Installing Cart Microservice dependencies...
cd cart-microservice
call npm install
cd ..

echo [6/6] Installing Chatbot Microservice dependencies...
cd chatbot-microservice
call npm install
cd ..

echo.
echo ✅ All dependencies installed successfully!
echo.
echo Next steps:
echo 1. Run setup-env.bat to create .env files
echo 2. Start all services using start-all.bat or PM2

