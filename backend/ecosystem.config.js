module.exports = {
  apps: [
    {
      name: 'api-gateway',
      script: './api-gateway/dist/main.js',
      cwd: './backend',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
    },
    {
      name: 'auth-microservice',
      script: './auth-microservice/dist/main.js',
      cwd: './backend',
      env: {
        NODE_ENV: 'development',
        MONGO_URI: 'mongodb://localhost:27017/ecommerce',
        JWT_SECRET: 'your-secret-key',
      },
    },
    {
      name: 'product-microservice',
      script: './product-microservice/dist/main.js',
      cwd: './backend',
      env: {
        NODE_ENV: 'development',
        MONGO_URI: 'mongodb://localhost:27017/ecommerce',
      },
    },
    {
      name: 'order-microservice',
      script: './order-microservice/dist/main.js',
      cwd: './backend',
      env: {
        NODE_ENV: 'development',
        MONGO_URI: 'mongodb://localhost:27017/ecommerce',
      },
    },
    {
      name: 'cart-microservice',
      script: './cart-microservice/dist/main.js',
      cwd: './backend',
      env: {
        NODE_ENV: 'development',
        MONGO_URI: 'mongodb://localhost:27017/ecommerce',
      },
    },
    {
      name: 'chatbot-microservice',
      script: './chatbot-microservice/dist/main.js',
      cwd: './backend',
      env: {
        NODE_ENV: 'development',
        OPENAI_API_KEY: '',
      },
    },
    {
      name: 'review-microservice',
      script: './review-microservice/dist/main.js',
      cwd: './backend',
      env: {
        NODE_ENV: 'development',
        MONGO_URI: 'mongodb://localhost:27017/ecommerce',
      },
    },
  ],
};

