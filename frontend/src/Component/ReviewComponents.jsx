import { useState, useEffect } from "react";
import apiClient from "../config/axios.js";
import { FaStar, FaRegStar, FaThumbsUp, FaThumbsDown } from "react-icons/fa";

function ReviewForm({ productId, userId, onReviewAdded }) {
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!title.trim() || title.length < 10) {
        throw new Error("Title must be at least 10 characters long");
      }

      if (!comment.trim() || comment.length < 10) {
        throw new Error("Comment must be at least 20 characters long");
      }

      const response = await apiClient.post("api/reviews", {
        product: productId,
        user: userId,
        rating,
        title,
        comment,
      });

      setMessage({
        text: "Review submitted successfully!",
        type: "success",
      });

      setRating(5);
      setTitle("");
      setComment("");

      if (onReviewAdded) {
        onReviewAdded(response.data.review);
      }

      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    } catch (error) {
      setMessage({
        text: error.message || "Failed to submit review",
        type: "danger",
      });
      setTimeout(() => setMessage({ text: "", type: "" }), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light p-4 rounded mb-4">
      <h5 className="">⭐ Leave a Review</h5>

      {message.text && (
        <div
          className={`alert alert-${message.type} alert-dismissible fade show`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="">
          <label className="form-label  text-black mb-3 text-center">
            Rating
          </label>
          <div className="d-flex gap-2  mt-4 bg">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="btn btn-link p-0 text-warning"
                onClick={() => setRating(star)}
              >
                {star <= rating ? (
                  <FaStar size={24} />
                ) : (
                  <FaRegStar size={24} />
                )}
              </button>
            ))}
          </div>
          <small className="text-muted ms-4">{rating} out of 5 stars</small>
        </div>

        <div className="mb-">
          <label htmlFor="reviewTitle" className="form-label mb-5 text-black">
            Title
          </label>
          <input
            id="reviewTitle"
            type="text"
            className="form-control"
            placeholder="Summarize your experience "
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength="1000"
            required
          />
          <small className="text-muted">{title.length}/1000</small>
        </div>

        <div className="mb-3">
          <label htmlFor="reviewComment" className="form-label mb-5 text-black">
            Your Review
          </label>
          <textarea
            id="reviewComment"
            className="form-control"
            placeholder="Share your detailed review "
            rows="5"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength="2000"
            required
          ></textarea>
          <small className="text-muted">{comment.length}/2000</small>
        </div>

        <button
          type="submit"
          className="btn btn-primary mt-5 mb-5 "
          style={{ position: "relative", left: "40%" }}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}

function ReviewItem({ review, userId, onHelpful, onUnhelpful }) {
  const isHelpful = review.helpfulBy?.includes(userId);
  const isUnhelpful = review.unhelpfulBy?.includes(userId);

  const renderStars = (rating) => {
    return (
      <div className="d-flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className="text-warning">
            {star <= rating ? <FaStar /> : <FaRegStar />}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="border-bottom pb-3 mb-3">
      <div className="d-flex justify-content-between align-items-start">
        <div className="flex-grow-1">
          <div className="mb-2">{renderStars(review.rating)}</div>
          <h6 className="mb-1">{review.title}</h6>
          <p className="text-muted small mb-2">
            By <strong>{review.user?.name || "Anonymous"}</strong> on{" "}
            {new Date(review.createdAt).toLocaleDateString()}
          </p>
          <p className="mb-3">{review.comment}</p>

          <div className="d-flex gap-3">
            <button
              className={`btn btn-sm btn-outline-success d-flex gap-2 align-items-center ${
                isHelpful ? "active" : ""
              }`}
              onClick={() => onHelpful(review._id, userId)}
            >
              <FaThumbsUp /> Helpful ({review.helpfulCount || 0})
            </button>
            <button
              className={`btn btn-sm btn-outline-danger d-flex gap-2 align-items-center ${
                isUnhelpful ? "active" : ""
              }`}
              onClick={() => onUnhelpful(review._id, userId)}
            >
              <FaThumbsDown /> Not Helpful ({review.unhelpfulCount || 0})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewsList({ productId, userId }) {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("recent");

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`api/reviews/product/${productId}`);
      const { reviews: fetchedReviews, stats: fetchedStats } = response.data;

      let sortedReviews = [...fetchedReviews];
      if (sortBy === "recent") {
        sortedReviews.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      } else if (sortBy === "helpful") {
        sortedReviews.sort(
          (a, b) => (b.helpfulCount || 0) - (a.helpfulCount || 0)
        );
      } else if (sortBy === "highest") {
        sortedReviews.sort((a, b) => b.rating - a.rating);
      } else if (sortBy === "lowest") {
        sortedReviews.sort((a, b) => a.rating - b.rating);
      }

      setReviews(sortedReviews);
      setStats(fetchedStats);
      setError(null);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError(err.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleHelpful = async (reviewId, userId) => {
    try {
      await apiClient.put(`api/reviews/${reviewId}/helpful`, { userId });
      fetchReviews();
    } catch (error) {
      console.error("Error marking helpful:", error);
    }
  };

  const handleUnhelpful = async (reviewId, userId) => {
    try {
      await apiClient.put(`api/reviews/${reviewId}/unhelpful`, { userId });
      fetchReviews();
    } catch (error) {
      console.error("Error marking unhelpful:", error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        {error}
        <button
          className="btn btn-sm btn-outline-danger ms-2"
          onClick={fetchReviews}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Rating Summary */}
      {stats && (
        <div className="bg-light p-4 rounded mb-4">
          <div className="row">
            <div className="col-md-3 text-center">
              <h3 className="text-warning">⭐ {stats.averageRating}</h3>
              <small className="text-muted">
                Based on {stats.totalReviews}{" "}
                {stats.totalReviews === 1 ? "review" : "reviews"}
              </small>
            </div>
            <div className="col-md-9">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div
                  key={rating}
                  className="d-flex align-items-center gap-2 mb-2"
                >
                  <span style={{ width: "40px" }} className="small">
                    {rating} ⭐
                  </span>
                  <div
                    className="progress flex-grow-1"
                    style={{ height: "20px" }}
                  >
                    <div
                      className="progress-bar bg-warning"
                      role="progressbar"
                      style={{
                        width: `${
                          stats.totalReviews > 0
                            ? (stats.ratingDistribution[rating] /
                                stats.totalReviews) *
                              100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="small text-muted" style={{ width: "30px" }}>
                    {stats.ratingDistribution[rating]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sort Options */}
      <div className="mb-5">
        <label className="form-label mb-5">Sort by:</label>
        <select
          className="form-select mb-5"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="recent">Most Recent</option>
          <option value="helpful">Most Helpful</option>
          <option value="highest">Highest Rating</option>
          <option value="lowest">Lowest Rating</option>
        </select>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="alert alert-info">
          No reviews yet. Be the first to review this product!
        </div>
      ) : (
        <div>
          {reviews.map((review) => (
            <ReviewItem
              key={review._id}
              review={review}
              userId={userId}
              onHelpful={handleHelpful}
              onUnhelpful={handleUnhelpful}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export { ReviewForm, ReviewsList, ReviewItem };
