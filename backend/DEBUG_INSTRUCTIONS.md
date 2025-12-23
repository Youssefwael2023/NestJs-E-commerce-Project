# Debug Instructions - MongoDB Connection Issue

## Step 1: Restart Services with Logging

Stop all services and restart them one by one to see the logs:

### Terminal 1 - Auth Microservice
```bash
cd backend/auth-microservice
npm run start:dev
```

**Look for these messages:**
- `📄 Loading .env from: ...`
- `📄 MONGO_URI exists: true`
- `🔌 MongoDB URI: ...`
- `📦 Auth Microservice: Connecting to MongoDB...`
- `📊 Connection readyState: ...`
- `✅ Auth Microservice: MongoDB connected successfully!`
- `📊 Database: ecommerce`

### Terminal 2 - API Gateway
```bash
cd backend/api-gateway
npm run start:dev
```

## Step 2: Test User Registration

Use Postman to create a user:
```
POST http://localhost:3000/api/users/register
Body:
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

## Step 3: Check Logs

### In Auth Microservice Terminal, you should see:
```
📨 [UserController] Signup request received: { email: 'test@example.com', name: 'Test User' }
📝 [UserService] Register called with: { name: 'Test User', email: 'test@example.com', role: 'user' }
📝 [UserService] Checking if user exists...
📝 [UserService] Hashing password...
📝 [UserService] Creating new user model...
📝 [UserService] Saving user to database...
📝 [UserService] Connection state: Connected
✅ [UserService] User saved successfully! ID: ...
✅ [UserService] Database: ecommerce
✅ [UserService] Collection: users
✅ [UserController] Signup successful, returning result
```

### If you see errors:
- `❌ Connection not ready!` → MongoDB connection failed
- `❌ [UserService] Register error: ...` → Check the error message
- `Connection state: Not Connected` → MongoDB connection issue

## Step 4: Verify MongoDB Connection

### Check Connection State
Look for these in the logs:
- `Connection readyState: 1` = Connected ✅
- `Connection readyState: 0` = Disconnected ❌
- `Connection readyState: 2` = Connecting... ⏳

### Check Database Name
Look for: `📊 Database: ecommerce`

If you see a different database name, that's the problem!

## Step 5: Common Issues

### Issue: "Connection readyState: 0" (Disconnected)
**Causes:**
1. MongoDB Atlas IP whitelist doesn't include your IP
2. Wrong username/password in connection string
3. Network connectivity issues

**Solutions:**
1. Go to MongoDB Atlas → Network Access → Add IP Address (or 0.0.0.0/0 for development)
2. Verify connection string in `.env` file
3. Test connection manually using the test script

### Issue: "Database: undefined" or wrong database
**Cause:** Connection string doesn't specify database name correctly

**Solution:** Check `.env` file - should be:
```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/ecommerce?appName=Cluster0
```
Note the `/ecommerce` before the `?`

### Issue: "User saved successfully" but no data in Atlas
**Possible causes:**
1. Data saved to wrong database
2. MongoDB Atlas UI not refreshing
3. Collection name is different

**Solutions:**
1. Check logs for actual database name
2. Refresh MongoDB Atlas Data Explorer
3. Check collection name in logs: `Collection: users`

## Step 6: Manual MongoDB Test

Run the test script to verify connection:
```bash
cd backend
node test-mongodb-connection.js
```

This will:
- Test the connection
- Create a test document
- Verify it can be read back

## Step 7: Check MongoDB Atlas

1. Go to MongoDB Atlas → Data Explorer
2. Click "Refresh" button
3. Look for database: `ecommerce`
4. Look for collection: `users`
5. Click on `users` collection to see documents

**Note:** Collections are created lazily - they won't appear until the first document is inserted!

## What to Report

If the problem persists, please provide:
1. Complete logs from auth-microservice when starting
2. Complete logs when registering a user
3. Connection state value
4. Database name shown in logs
5. Any error messages

