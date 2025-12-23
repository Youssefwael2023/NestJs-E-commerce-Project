// Test MongoDB Connection Script
// Run this to verify your MongoDB connection string works

require('dotenv').config({ path: require('path').resolve(__dirname, 'auth-microservice/.env') });
const mongoose = require('mongoose');

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';

console.log('🔍 Testing MongoDB Connection...');
console.log('📄 MONGO_URI:', mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
console.log('');

mongoose.connect(mongoUri, {
  retryWrites: true,
  w: 'majority',
})
  .then(() => {
    console.log('✅ MongoDB connected successfully!');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    console.log('📊 Host:', mongoose.connection.host);
    console.log('📊 Port:', mongoose.connection.port);
    
    // Try to create a test document
    const TestSchema = new mongoose.Schema({ name: String, test: Boolean });
    const TestModel = mongoose.model('TestConnection', TestSchema);
    
    return TestModel.create({ name: 'Connection Test', test: true });
  })
  .then((doc) => {
    console.log('✅ Test document created:', doc._id);
    return mongoose.connection.db.collection('testconnections').findOne({ _id: doc._id });
  })
  .then((found) => {
    if (found) {
      console.log('✅ Document found in database!');
      console.log('✅ Connection is working correctly!');
    }
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:');
    console.error('   Message:', error.message);
    console.error('   Code:', error.code);
    console.error('');
    console.error('💡 Troubleshooting:');
    console.error('   1. Check MongoDB Atlas Network Access - is your IP whitelisted?');
    console.error('   2. Verify username/password in connection string');
    console.error('   3. Check if database name is correct');
    process.exit(1);
  });

