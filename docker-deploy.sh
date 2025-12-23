#!/bin/bash

echo "🚀 Al-Masrya E-commerce Docker Deployment Script"
echo "================================================"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Build and start containers
echo ""
echo "📦 Building Docker images..."
docker-compose build

echo ""
echo "🚀 Starting services..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

echo ""
echo "✅ Deployment Complete!"
echo ""
echo "Services running:"
echo "  Frontend:        http://localhost"
echo "  API Gateway:     http://localhost:3000"
echo "  Auth Service:    http://localhost:4001"
echo "  Product Service: http://localhost:4002"
echo "  Cart Service:    http://localhost:4003"
echo "  Order Service:   http://localhost:4004"
echo "  Chatbot Service: http://localhost:4005"
echo "  Review Service:  http://localhost:4006"
echo "  MongoDB:         mongodb://localhost:27017"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop services: docker-compose down"
echo "To remove volumes: docker-compose down -v"
