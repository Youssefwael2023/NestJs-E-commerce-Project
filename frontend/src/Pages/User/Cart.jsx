import { useEffect, useState } from "react";
import apiClient from "../../config/axios";
import { useNavigate, useLocation } from "react-router-dom";

function Cart() {
  const [cartProducts, setCartProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user ? user.id || user._id : null;

  const fetchCart = async () => {
    if (!userId) {
      navigate("/login");
      return;
    }
    try {
      setLoading(true);
      console.log("🛒 Cart: Fetching cart for user:", userId);
      const response = await apiClient.get(`api/cart/${userId}`);
      console.log("🛒 Cart: Response received:", response.data);
      
      // Backend returns cart object with items array
      // Handle both { items: [...] } and direct array response
      const items = response.data?.items || (Array.isArray(response.data) ? response.data : []);
      
      console.log("🛒 Cart: Items extracted:", items);
      console.log("🛒 Cart: First item sample:", items[0]);
      
      // Ensure items have product data populated
      const validItems = items.filter(item => {
        const hasProduct = item.product && (item.product._id || item.product.id);
        if (!hasProduct) {
          console.warn("🛒 Cart: Item missing product:", item);
        }
        return hasProduct;
      });
      
      console.log("🛒 Cart: Valid items count:", validItems.length);
      setCartProducts(validItems);
      calculateTotalPrice(validItems);
    } catch (error) {
      console.error("🛒 Cart: Error fetching cart:", error);
      console.error("🛒 Cart: Error details:", error.response?.data);
      // If cart doesn't exist, backend returns empty cart
      setCartProducts([]);
      setTotalPrice(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [userId, navigate]);

  // Refetch cart when component becomes visible (user navigates to cart page)
  useEffect(() => {
    const handleFocus = () => {
      if (location.pathname === '/cart' && userId) {
        console.log("🛒 Cart: Page focused, refetching cart");
        fetchCart();
      }
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [location.pathname, userId]);

  const calculateTotalPrice = (items) => {
    const total = items.reduce((sum, item) => {
      // Ensure product exists and has price
      if (!item.product || typeof item.product.price !== 'number') {
        console.warn("🛒 Cart: Invalid item in cart:", item);
        return sum;
      }
      const priceAfterDiscount = item.product.discount
        ? item.product.price * (1 - item.product.discount / 100)
        : item.product.price;
      return sum + priceAfterDiscount * (item.quantity || 1);
    }, 0);
    setTotalPrice(total);
  };

  const handleQuantityChange = async (productId, quantity) => {
    if (!userId) return;
    try {
      await apiClient.post(`api/cart/${userId}`, {
        productId,
        quantity: parseInt(quantity),
      });
      // Refetch cart to get updated data with populated products
      const response = await apiClient.get(`api/cart/${userId}`);
      const items = response.data?.items || [];
      const validItems = items.filter(item => item.product && (item.product._id || item.product.id));
      setCartProducts(validItems);
      calculateTotalPrice(validItems);
    } catch (error) {
      console.error("Error updating cart item:", error);
      alert(error.message || "Failed to update cart item");
    }
  };

  const handleRemove = async (productId) => {
    if (!userId) return;
    try {
      await apiClient.delete(`api/cart/${userId}/${productId}`);
      // Refetch cart to get updated data with populated products
      const response = await apiClient.get(`api/cart/${userId}`);
      const items = response.data?.items || [];
      const validItems = items.filter(item => item.product && (item.product._id || item.product.id));
      setCartProducts(validItems);
      calculateTotalPrice(validItems);
    } catch (error) {
      console.error("Error removing cart item:", error);
      alert(error.message || "Failed to remove item from cart");
    }
  };

  if (loading) {
    return (
      <div className="container d-flex flex-column text-center pt-5 pb-5" style={{ minHeight: "80vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading cart...</span>
        </div>
        <p className="mt-3">Loading your cart...</p>
      </div>
    );
  }

  return (
    <div
      className="container d-flex flex-column text-center  pt-5 pb-5"
      style={{ minHeight: "80vh" }}
    >
      <h2 className="text-center mb-5 fs-1 ">Your Cart</h2>
      <div className="row w-100 justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          {cartProducts.length === 0 ? (
            <div>
              <h4 className="text-center mb-4">Your cart is empty</h4>
              <button 
                className="btn btn-primary"
                onClick={() => navigate("/shop")}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <table className="table table-dark table-striped text-center align-middle p-5">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Discount</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody className="p-5">
                {cartProducts.map((item, index) => {
                  // Safety check for product data
                  if (!item.product) {
                    console.warn("🛒 Cart: Item missing product data:", item);
                    return null;
                  }
                  const productId = item.product._id || item.product.id || `item-${index}`;
                  return (
                    <tr key={productId}>
                    <td>
                      <img
                        src={item.product.image || '/placeholder.png'}
                        alt={item.product.name || 'Product'}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.target.src = '/placeholder.png';
                        }}
                      />
                    </td>
                    <td>{item.product.name || 'Unknown Product'}</td>
                    <td>${(item.product.price || 0)?.toFixed(2)}</td>
                    <td>
                      {item.product.discount ? (
                        <span className="text-success">
                          $
                          {(
                            (item.product.price || 0) *
                            (1 - (item.product.discount || 0) / 100)
                          ).toFixed(2)}
                        </span>
                      ) : (
                        <span>×</span>
                      )}
                    </td>
                    <td>
                      <select
                        className="form-select"
                        style={{ width: "80px", margin: "0 auto" }}
                        value={item.quantity || 1}
                        onChange={(e) =>
                          handleQuantityChange(productId, e.target.value)
                        }
                      >
                        {Array.from(
                          { length: Math.max(1, item.product.stock || 1) },
                          (_, i) => i + 1
                        ).map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      $
                      {(
                        (item.product.discount
                          ? (item.product.price || 0) *
                            (1 - (item.product.discount || 0) / 100)
                          : (item.product.price || 0)) * (item.quantity || 1)
                      ).toFixed(2)}
                    </td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleRemove(productId)}
                      >
                        Remove
                      </button>
                    </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {cartProducts.length > 0 && (
        <div className="d-flex flex-column align-items-center mt-4">
          <h4 className="mb-3">Total Price: ${totalPrice.toFixed(2)}</h4>
          <button
            className="btn btn-success btn-lg"
            onClick={() => {
              if (!userId) {
                navigate("/login");
              } else {
                navigate("/shipping");
              }
            }}
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;
