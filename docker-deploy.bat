@echo off
REM Al-Masrya E-commerce Docker Deployment Script for Windows

echo 🚀 Al-Masrya E-commerce Docker Deployment Script
echo ================================================

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    exit /b 1
)

echo ✅ Docker is installed

REM Build and start containers
echo.
echo 📦 Building Docker images...
docker-compose build

echo.
echo 🚀 Starting services...
docker-compose up -d

echo.
echo ⏳ Waiting for services to be ready (10 seconds)...
timeout /t 10 /nobreak

echo.
echo ✅ Deployment Complete!
echo.
echo Services running:
echo   Frontend:        http://localhost
echo   API Gateway:     http://localhost:3000
echo   Auth Service:    http://localhost:4001
echo   Product Service: http://localhost:4002
echo   Cart Service:    http://localhost:4003
echo   Order Service:   http://localhost:4004
echo   Chatbot Service: http://localhost:4005
echo   Review Service:  http://localhost:4006
echo   MongoDB:         mongodb://localhost:27017
echo.
echo To view logs: docker-compose logs -f
echo To stop services: docker-compose down
echo To remove volumes: docker-compose down -v
