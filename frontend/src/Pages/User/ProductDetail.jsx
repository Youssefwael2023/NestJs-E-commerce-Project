import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../../config/axios";
import { FaShoppingCart, FaArrowRight } from "react-icons/fa";
import { ReviewForm, ReviewsList } from "../../Component/ReviewComponents";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`api/products/${id}`);
        setProduct(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(
          err.message || "Failed to load product. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (product?.stock || 1)) {
      setQuantity(value);
    }
  };

  const addToCart = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        navigate("/login");
        return;
      }

      await apiClient.post(`api/cart/${user.id || user._id}`, {
        productId: product._id,
        quantity: quantity,
      });

      setMessage({ text: "Added to cart successfully!", type: "success" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    } catch (err) {
      console.error("Error adding to cart:", err);
      setMessage({
        text: err.message || "Failed to add to cart. Please try again.",
        type: "danger",
      });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }
  };

  const proceedToCheckout = async () => {
    try {
      // First add to cart
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        navigate("/login");
        return;
      }

      await apiClient.post(`api/cart/${user.id || user._id}`, {
        productId: product._id,
        quantity: quantity,
      });

      // Then navigate to shipping page
      navigate("/shipping");
    } catch (err) {
      console.error("Error proceeding to checkout:", err);
      setMessage({
        text: err.message || "Failed to proceed to checkout. Please try again.",
        type: "danger",
      });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }
  };

  if (loading) {
    return (
      <div className="container pt-5 text-center" style={{ minHeight: "80vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container pt-5 text-center" style={{ minHeight: "80vh" }}>
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate("/shop")}
        >
          Back to Shop
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container pt-5 text-center" style={{ minHeight: "80vh" }}>
        <div className="alert alert-warning" role="alert">
          Product not found
        </div>
        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate("/shop")}
        >
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ minHeight: "80vh" }}>
      {message.text && (
        <div className={`alert alert-${message.type} mb-4`} role="alert">
          {message.text}
        </div>
      )}

      <div className="row">
        <div className="col-md-6 mb-4">
          <div
            style={{
              backgroundColor: "#1f1f1f",
              borderRadius: "10px",
              overflow: "hidden",
              padding: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              className="img-fluid"
              style={{ maxHeight: "400px", borderRadius: "8px" }}
            />
          </div>
        </div>

        <div className="col-md-6">
          <div
            style={{
              backgroundColor: "#1f1f1f",
              borderRadius: "10px",
              padding: "25px",
              height: "100%",
            }}
          >
            <h1 style={{ color: "#ffffff", marginBottom: "20px" }}>
              {product.name}
            </h1>

            {product.discount > 0 ? (
              <div className="d-flex align-items-center mb-3">
                <span
                  style={{
                    textDecoration: "line-through",
                    color: "#888",
                    fontSize: "1.25rem",
                    marginRight: "15px",
                  }}
                >
                  ${product.price}
                </span>
                <span
                  style={{
                    color: "#ffffff",
                    fontSize: "1.75rem",
                    fontWeight: "bold",
                  }}
                >
                  ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                </span>
                <span
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    padding: "3px 8px",
                    borderRadius: "5px",
                    marginLeft: "15px",
                    fontSize: "0.9rem",
                  }}
                >
                  {product.discount}% OFF
                </span>
              </div>
            ) : (
              <div className="mb-3">
                <span
                  style={{
                    color: "#ffffff",
                    fontSize: "1.75rem",
                    fontWeight: "bold",
                  }}
                >
                  ${product.price}
                </span>
              </div>
            )}

            <div className="mb-4">
              <span
                style={{
                  color: product.stock > 0 ? "#4caf50" : "#f44336",
                  fontWeight: "bold",
                }}
              >
                {product.stock > 0
                  ? `In Stock (${product.stock} available)`
                  : "Out of Stock"}
              </span>
            </div>

            <div className="mb-4">
              <h5 style={{ color: "#ffffff" }}>Description</h5>
              <p style={{ color: "#b0b0b0", lineHeight: "1.6" }}>
                {product.description}
              </p>
            </div>

            <div className="mb-4">
              <h5 style={{ color: "#ffffff" }}>Category</h5>
              <span style={{ color: "#b0b0b0" }}>{product.category}</span>
            </div>

            {product.stock > 0 && (
              <>
                <div className="mb-4">
                  <h3
                    htmlFor="quantity"
                    className="form-label"
                    style={{ color: "#ffffff" }}
                  >
                    Quantity
                  </h3>
                  <div className="d-flex align-items-center">
                    <button
                      className="btn btn-secondary"
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      id="quantity"
                      className="form-control mx-2"
                      value={quantity}
                      onChange={handleQuantityChange}
                      min="1"
                      max={product.stock}
                      style={{ width: "70px", textAlign: "center" }}
                    />
                    <button
                      className="btn btn-secondary"
                      onClick={() =>
                        quantity < product.stock && setQuantity(quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="d-flex gap-3">
                  <button
                    className="btn btn-primary p-3 gap-2 d-flex align-items-center "
                    onClick={addToCart}
                  >
                    <FaShoppingCart /> Add to Cart
                  </button>
                  <button
                    className="btn btn-success btn-lg d-flex align-items-center gap-2"
                    onClick={proceedToCheckout}
                  >
                    Proceed to Checkout <FaArrowRight />
                  </button>
                </div>
              </>
            )}
            <div className="mt-5">
              <button
                className="btn btn-secondary"
                onClick={() => navigate(-1)}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-5 pt-5 border-top">
        <h2 className="mb-4">📝 Customer Reviews</h2>

        {(() => {
          const user = JSON.parse(localStorage.getItem("user"));
          return user ? (
            <>
              <ReviewForm
                productId={id}
                userId={user.id || user._id}
                onReviewAdded={() => {
                  // Refresh reviews after new review is added
                  window.location.reload();
                }}
              />
              <ReviewsList productId={id} userId={user.id || user._id} />
            </>
          ) : (
            <div className="alert alert-info">
              <strong>Sign in to leave a review.</strong>
              <button
                className="btn btn-primary btn-sm ms-3"
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

export default ProductDetail;
