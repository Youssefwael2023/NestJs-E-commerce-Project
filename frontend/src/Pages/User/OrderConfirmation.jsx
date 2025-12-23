import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../../config/axios";

function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchOrder = async () => {
    setLoading(true);
    if (!id) {
      setError("Order ID is missing");
      setLoading(false);
      return;
    }
    try {
      console.log(`📦 Fetching order with ID: ${id}`);
      const response = await apiClient.get(`api/orders/${id}`);
      console.log("✅ Order fetched successfully:", response.data);
      setOrder(response.data);
      setError(null);
    } catch (err) {
      console.error("❌ Error fetching order:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "Order not found";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="container pt-5 text-center" style={{ minHeight: "80vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container pt-5 text-center" style={{ minHeight: "80vh" }}>
        <div className="alert alert-danger" role="alert">
          {error || "Order not found"}
        </div>
        <button className="btn btn-warning me-2 mt-3" onClick={fetchOrder}>
          Retry
        </button>
        <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="container pt-5 pb-5" style={{ minHeight: "80vh" }}>
      <h2 className="mb-4 fs-1 text-center">Order Confirmation</h2>
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
              {order.orderItems &&
                order.orderItems.map((item, idx) => {
                  const unitPrice = item.qty > 0 ? item.price / item.qty : 0;
                  return (
                    <tr key={idx}>
                      <td>
                        <img
                          src={item.image || "/placeholder.png"}
                          alt={item.name || "Product"}
                          style={{ width: 80, height: 80, objectFit: "cover" }}
                          onError={(e) => {
                            e.target.src = "/placeholder.png";
                          }}
                        />
                      </td>
                      <td>{item.name || "Unknown Product"}</td>
                      <td>{item.qty || 0}</td>
                      <td>${unitPrice.toFixed(2)}</td>
                      <td>${(item.price || 0).toFixed(2)}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <div className="col-lg-4">
          <div className="bg-dark text-white p-4 rounded mb-3">
            <h4>Shipping</h4>
            {order.shippingAddress && (
              <div>
                <b>Address:</b> {order.shippingAddress.address || "N/A"},{" "}
                {order.shippingAddress.city || "N/A"},{" "}
                {order.shippingAddress.postalCode || "N/A"},{" "}
                {order.shippingAddress.country || "N/A"}
              </div>
            )}
            <div>
              <b>Payment Method:</b> {order.paymentMethod || "N/A"}
            </div>
            <div>
              <b>Status:</b> {order.isPaid ? "Paid" : "Not paid"}
            </div>
          </div>
          <div className="bg-dark text-white p-4 rounded">
            <h4>Order Summary</h4>
            <div>Items: ${(order.itemsPrice || 0).toFixed(2)}</div>
            <div>Shipping: ${(order.shippingPrice || 0).toFixed(2)}</div>
            <div>Tax: ${(order.taxPrice || 0).toFixed(2)}</div>
            <div>
              <b>Total: ${(order.totalPrice || 0).toFixed(2)}</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;
