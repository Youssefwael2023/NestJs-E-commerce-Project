import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../config/axios";

function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        navigate("/login");
        return;
      }
      try {
        const res = await apiClient.get(`api/orders/user/${user.id || user._id}`);
        setOrders(res.data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [navigate]);

  if (loading) return <div className="text-center pt-5">Loading...</div>;

  return (
    <div className="container pt-5 pb-5" style={{ minHeight: "80vh" }}>
      <h2 className="mb-4 fs-1 text-center">My Orders</h2>
      <table className="table table-dark table-striped text-center align-middle">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Date</th>
            <th>Total</th>
            <th>Paid</th>
            <th>Status</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{new Date(order.createdAt).toLocaleString()}</td>
              <td>${order.totalPrice.toFixed(2)}</td>
              <td>{order.isPaid ? "Yes" : "No"}</td>
              <td>
                {order.status ||
                  (order.isDelivered
                    ? "Delivered"
                    : order.isShipped
                    ? "Shipped"
                    : "Pending")}
              </td>
              <td>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => navigate(`/order/${order._id}`)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserOrders;
