# Review & Rating Microservice Setup Guide

## 🎯 Overview

The Review & Rating Microservice is a standalone NestJS microservice that handles product reviews, ratings, and customer feedback. It's fully integrated with your e-commerce platform and follows the same architecture as other microservices.

**Port:** 4006
**Database:** MongoDB (shared with other microservices)

## 📋 Features

✅ Create product reviews with ratings (1-5 stars)
✅ View reviews with pagination and sorting
✅ Mark reviews as helpful/unhelpful
✅ User can only review a product once
✅ Admin can approve/reject reviews (with reason)
✅ Rating statistics and distribution
✅ Search and filter reviews
✅ Edit and delete own reviews

## 🚀 Installation & Setup

### 1. Install Dependencies

```bash
cd backend/review-microservice
npm install
```

### 2. Build the Microservice

```bash
npm run build
```

### 3. Run the Microservice

**Development Mode (with auto-reload):**
```bash
npm run start:dev
```

**Production Mode:**
```bash
npm run start:prod
```

**Using PM2 (from backend directory):**
```bash
pm2 start ecosystem.config.js --only review-microservice
```

## 🔌 API Endpoints

### Create Review
```
POST /api/reviews
Body: {
  product: "product_id",
  user: "user_id",
  rating: 5,
  title: "Great Product!",
  comment: "This product exceeded my expectations..."
}
```

### Get Product Reviews
```
GET /api/reviews/product/:productId
Response: {
  reviews: [...],
  stats: {
    averageRating: 4.5,
    totalReviews: 12,
    ratingDistribution: { 5: 8, 4: 3, 3: 1, 2: 0, 1: 0 }
  }
}
```

### Get User Reviews
```
GET /api/reviews/user/:userId
```

### Get Single Review
```
GET /api/reviews/:id
```

### Update Review
```
PUT /api/reviews/:id
Body: {
  userId: "user_id",
  rating: 4,
  title: "Updated Title",
  comment: "Updated comment..."
}
```

### Delete Review
```
DELETE /api/reviews/:id
Body: { userId: "user_id" }
```

### Mark as Helpful
```
PUT /api/reviews/:id/helpful
Body: { userId: "user_id" }
```

### Mark as Unhelpful
```
PUT /api/reviews/:id/unhelpful
Body: { userId: "user_id" }
```

### Get Product Rating Summary
```
GET /api/reviews/rating/:productId
Response: {
  averageRating: 4.5,
  totalReviews: 12,
  ratingDistribution: { 5: 8, 4: 3, 3: 1, 2: 0, 1: 0 }
}
```

## 🎨 Frontend Components

### Location: `frontend/src/Component/ReviewComponents.jsx`

#### ReviewForm Component
Displays a form for users to submit reviews.

```jsx
<ReviewForm
  productId="product_id"
  userId="user_id"
  onReviewAdded={(review) => console.log(review)}
/>
```

#### ReviewsList Component
Displays all reviews with rating statistics and sorting options.

```jsx
<ReviewsList
  productId="product_id"
  userId="user_id"
/>
```

#### ReviewItem Component
Displays individual review with helpful/unhelpful buttons.

## 📱 Integration with ProductDetail Page

The reviews section is automatically integrated into the ProductDetail page:

1. **Location:** `frontend/src/Pages/User/ProductDetail.jsx`
2. **Authenticated users** can submit reviews
3. **Anonymous users** see a login prompt
4. **Automatic display** of rating statistics and all reviews

## 🛠 Environment Variables

No additional environment variables are needed. The microservice uses:

- `MONGO_URI`: MongoDB connection string (default: `mongodb://localhost:27017/ecommerce`)
- `NODE_ENV`: Environment mode (development/production)

These are inherited from your main backend setup.

## 📊 Database Schema

### Review Document
```javascript
{
  product: ObjectId,          // Reference to Product
  user: ObjectId,             // Reference to User
  rating: Number (1-5),       // Product rating
  title: String,              // Review title (10-1000 chars)
  comment: String,            // Review content (20-2000 chars)
  helpfulCount: Number,       // Count of helpful votes
  unhelpfulCount: Number,     // Count of unhelpful votes
  isApproved: Boolean,        // Admin approval status
  helpfulBy: [String],        // Array of user IDs who found helpful
  unhelpfulBy: [String],      // Array of user IDs who found unhelpful
  approvedAt: Date,           // When review was approved
  rejectedAt: Date,           // When review was rejected
  rejectionReason: String,    // Reason for rejection
  createdAt: Date,            // Auto-generated
  updatedAt: Date             // Auto-generated
}
```

**Indexes:**
- `product + isApproved`: Fast filtering of approved reviews per product
- `user`: Quick lookup of user reviews
- `product + user` (unique): Ensures one review per user per product
- `createdAt` (descending): Sorted retrieval
- `rating`: Filter by rating

## ✅ Validation Rules

### Rating
- Must be between 1 and 5

### Title
- Minimum 10 characters
- Maximum 1000 characters
- Required

### Comment
- Minimum 20 characters
- Maximum 2000 characters
- Required

### Duplicate Reviews
- Only one review per user per product
- Attempting to create duplicate throws error

## 🧪 Testing the Service

### 1. Start MongoDB
```bash
mongod
```

### 2. Start Review Microservice
```bash
cd backend/review-microservice
npm run start:dev
```

### 3. Test with cURL

```bash
# Create a review
curl -X POST http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "product": "507f1f77bcf86cd799439011",
    "user": "507f1f77bcf86cd799439012",
    "rating": 5,
    "title": "Excellent Product!",
    "comment": "This is a great product that exceeded my expectations in every way."
  }'

# Get product reviews
curl http://localhost:3000/api/reviews/product/507f1f77bcf86cd799439011

# Get product rating
curl http://localhost:3000/api/reviews/rating/507f1f77bcf86cd799439011
```

## 🐛 Troubleshooting

### Connection Issues
If the microservice fails to connect to MongoDB:
1. Verify MongoDB is running: `mongod`
2. Check `MONGO_URI` environment variable
3. Ensure database name is consistent: `ecommerce`

### Port Already in Use
If port 4006 is already in use:
1. Find the process: `netstat -ano | findstr 4006` (Windows) or `lsof -i :4006` (Linux/Mac)
2. Kill the process
3. Or modify the port in `src/main.ts`

### API Gateway Not Recognizing Reviews
1. Ensure API Gateway has REVIEW_SERVICE registered
2. Check `api-gateway/src/app.module.ts` includes ReviewController
3. Restart API Gateway

## 📈 Performance Optimization

The Review microservice includes:

✅ **Database Indexes** for fast queries
✅ **Pagination-ready** architecture
✅ **Sorting options** (recent, helpful, rating)
✅ **Efficient aggregation** for statistics
✅ **Caching-friendly** endpoints

For production, consider:
- Adding Redis caching for popular products
- Implementing pagination with `skip` and `limit`
- Rate limiting on review creation
- Background job for spam detection

## 🔒 Security Considerations

✅ Users can only edit/delete their own reviews
✅ One review per user per product (enforced at DB level)
✅ Input validation on all fields
✅ Email verification recommended before review creation
✅ Admin approval system for moderation

## 📝 Future Enhancements

Potential features to add:
- Review moderation dashboard
- Spam detection AI
- Review images/video
- Reply to reviews
- Review helpfulness machine learning
- Email notifications
- SMS notifications
- Scheduled review reminders

## 🎓 Learning Resources

- [NestJS Microservices](https://docs.nestjs.com/microservices/basics)
- [MongoDB Mongoose](https://mongoosejs.com/)
- [React Hooks](https://react.dev/reference/react)
- [Bootstrap 5](https://getbootstrap.com/docs/5.0/)

## 📞 Support

For issues or questions:
1. Check the console logs in the microservice
2. Verify all dependencies are installed
3. Ensure MongoDB is running and accessible
4. Check API Gateway configuration
5. Review the API endpoints documentation above

---

**Last Updated:** December 23, 2025
**Version:** 1.0.0
**Status:** ✅ Production Ready
