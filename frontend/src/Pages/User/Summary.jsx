import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../config/axios";
import "bootstrap-icons/font/bootstrap-icons.css";

function Summary() {
  const [cart, setCart] = useState([]);
  const [shipping, setShipping] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
      navigate("/login");
      return;
    }
    setUser(userData);
    const shippingData = JSON.parse(localStorage.getItem("shipping"));
    if (!shippingData) {
      navigate("/shipping");
      return;
    }
    setShipping(shippingData);
    setPaymentMethod(shippingData.paymentMethod || "InstaPay");
    // Fetch cart
    const fetchCart = async () => {
      try {
        const res = await apiClient.get(
          `api/cart/${userData.id || userData._id}`
        );
        setCart(res.data?.items || []);
      } catch (error) {
        console.error("Error fetching cart:", error);
        setCart([]);
      }
    };
    fetchCart();
  }, [navigate]);

  const itemsPrice = cart.reduce(
    (sum, item) =>
      sum +
      (item.product.discount
        ? item.product.price * (1 - item.product.discount / 100)
        : item.product.price) *
        item.quantity,
    0
  );
  const shippingPrice = 50;
  const taxPrice = Number((itemsPrice * 0.07).toFixed(2));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      // Validate cart is not empty
      if (!cart || cart.length === 0) {
        alert("Your cart is empty. Please add items before placing an order.");
        setLoading(false);
        return;
      }

      const orderItems = cart.map((item) => ({
        name: item.product.name,
        qty: item.quantity,
        image: item.product.image,
        price:
          (item.product.discount
            ? item.product.price * (1 - item.product.discount / 100)
            : item.product.price) * item.quantity,
        product: item.product._id,
      }));

      // Call sellProduct API for each product in the cart
      for (const item of cart) {
        await apiClient.put(`api/products/sell/${item.product._id}`, {
          productId: item.product._id,
          quantity: item.quantity,
        });
      }

      const res = await apiClient.post("api/orders", {
        user: user.id || user._id,
        orderItems,
        shippingAddress: shipping,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      });

      // Backend returns { statusCode, message, order }
      const orderId = res.data?.order?._id || res.data?._id;

      if (!orderId) {
        throw new Error("Order created but no order ID returned");
      }

      // Clear cart and shipping info
      await apiClient.delete(`api/cart/${user.id || user._id}`);
      localStorage.removeItem("shipping");
      setLoading(false);
      navigate(`/order/${orderId}`);
    } catch (error) {
      console.error("Error placing order:", error);
      setLoading(false);
      alert(error.message || "Failed to place order. Please try again.");
    }
  };

  if (!shipping) return null;

  return (
    <div className="container pt-5 pb-5" style={{ minHeight: "80vh" }}>
      <h2 className="mb-4 fs-1 text-center">Order Summary</h2>
      <div className="row">
        <div className="col-lg-8">
          <table className="table table-dark table-striped text-center align-middle">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.product._id}>
                  <td>
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      style={{ width: 80, height: 80, objectFit: "cover" }}
                    />
                  </td>
                  <td>{item.product.name}</td>
                  <td>{item.quantity}</td>
                  <td>
                    $
                    {item.product.discount
                      ? (
                          item.product.price *
                          (1 - item.product.discount / 100)
                        ).toFixed(2)
                      : item.product.price.toFixed(2)}
                  </td>
                  <td>
                    $
                    {(
                      (item.product.discount
                        ? item.product.price * (1 - item.product.discount / 100)
                        : item.product.price) * item.quantity
                    ).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* InstaPay information section under the table */}
          {paymentMethod === "InstaPay" && (
            <div className="mt-4 text-center bg-dark p-4 rounded">
              <h4 className="text-white mb-3">InstaPay Payment Information</h4>
              <img
                src="../src/assets/WhatsApp Image 2025-05-15 at 16.46.36_a0b67228.jpg
                "
                alt="InstaPay QR Code"
                className="img-fluid mb-3"
                style={{ maxWidth: "400px" }}
              />
              <div className="mt-3">
                <a
                  href="https://ipn.eg/S/ahmedalaaeldeinloutfy/instapay/5mhh5k"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="d-block text-primary mb-2 fs-5"
                >
                  Click here
                </a>
                <p>
                  Click the link to send money to ahmedalaaeldeinloutfy@instapay
                  Powered by InstaPay
                </p>
                <a
                  href="https://wa.me/201113634352"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-0 text-white fs-5 text-decoration-none"
                >
                  <i className="bi bi-whatsapp me-2"></i>Message us
                </a>
              </div>
            </div>
          )}
        </div>
        <div className="col-lg-4">
          <div className="bg-dark text-white p-4 rounded mb-3">
            <h4>Shipping</h4>
            <div>
              <b>Address:</b> {shipping.address}, {shipping.city},{" "}
              {shipping.postalCode}, {shipping.country}
            </div>
          </div>
          <div className="bg-dark text-white p-4 rounded">
            <h4>Order Summary</h4>
            <div>Items: ${itemsPrice.toFixed(2)}</div>
            <div>Shipping: ${shippingPrice.toFixed(2)}</div>
            <div>Tax: ${taxPrice.toFixed(2)}</div>
            <div>
              <b>Total: ${totalPrice.toFixed(2)}</b>
            </div>
          </div>
          <div className="bg-dark text-white p-4 rounded mt-3">
            <h5>Select Payment Method</h5>
            <div className="d-flex flex-column gap-3">
              <button
                type="button"
                className={`btn btn-lg w-100 fw-bold ${
                  paymentMethod === "InstaPay" ? "" : "btn-outline-primary"
                }`}
                style={{
                  background:
                    paymentMethod === "InstaPay" ? "#4285F4" : "transparent",
                  color: paymentMethod === "InstaPay" ? "#ffffff" : "#4285F4",
                  border:
                    paymentMethod === "InstaPay" ? "none" : "2px solid #4285F4",
                  transition: "all 0.2s",
                }}
                onClick={() => setPaymentMethod("InstaPay")}
              >
                InstaPay
              </button>

              <button
                type="button"
                className={`btn btn-lg w-100 fw-bold ${
                  paymentMethod === "Cash on Delivery"
                    ? ""
                    : "btn-outline-secondary"
                }`}
                style={{
                  background:
                    paymentMethod === "Cash on Delivery"
                      ? "#eee"
                      : "transparent",
                  color: paymentMethod === "Cash on Delivery" ? "#222" : "#aaa",
                  border:
                    paymentMethod === "Cash on Delivery"
                      ? "none"
                      : "2px solid #aaa",
                  transition: "all 0.2s",
                }}
                onClick={() => setPaymentMethod("Cash on Delivery")}
              >
                Cash on Delivery
              </button>
            </div>
          </div>
          <button
            className="btn btn-lg w-100 mt-4"
            style={{ background: "#ff4fa1", color: "white" }}
            onClick={handlePlaceOrder}
            disabled={loading}
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Summary;
