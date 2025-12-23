@echo off
echo Creating .env files...

echo PORT=3000 > api-gateway\.env
echo FRONTEND_URL=http://localhost:5173 >> api-gateway\.env

echo MONGO_URI=mongodb+srv://ywael164_db_user:2wYirZlp4z9y9BGz@cluster0.yishnf8.mongodb.net/ecommerce?appName=Cluster0> auth-microservice\.env
echo JWT_SECRET=your-secret-key-change-in-production >> auth-microservice\.env

echo MONGO_URI=mongodb+srv://ywael164_db_user:2wYirZlp4z9y9BGz@cluster0.yishnf8.mongodb.net/ecommerce?appName=Cluster0> product-microservice\.env

echo MONGO_URI=mongodb+srv://ywael164_db_user:2wYirZlp4z9y9BGz@cluster0.yishnf8.mongodb.net/ecommerce?appName=Cluster0> order-microservice\.env

echo MONGO_URI=mongodb+srv://ywael164_db_user:2wYirZlp4z9y9BGz@cluster0.yishnf8.mongodb.net/ecommerce?appName=Cluster0> cart-microservice\.env

echo OPENAI_API_KEY= > chatbot-microservice\.env

echo .env files created successfully!

