import React, { useEffect, useState } from "react";
import axios from "axios";
import { getApiUrl } from "../../config/api";
import withAdminAuth from "../../utils/withAdminAuth";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 6;

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(getApiUrl("api/orders"));
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setAlert({ message: "Failed to fetch orders.", type: "danger" });
    }
  };

  const handleUpdatePaymentStatus = async (orderId, isPaid) => {
    try {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, isPaid } : order
        )
      );

      await axios.put(getApiUrl(`api/orders/${orderId}/payment`), {
        isPaid,
      });

      setAlert({
        message: `Payment status updated to ${isPaid ? "Paid" : "Not Paid"}!`,
        type: "success",
      });

      fetchOrders();
    } catch (error) {
      console.error("Error updating payment status:", error);
      setAlert({ message: "Failed to update payment status.", type: "danger" });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, isPaid: !isPaid } : order
        )
      );
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status } : order
        )
      );

      await axios.put(getApiUrl(`api/orders/${orderId}/status`), {
        status,
      });

      setAlert({
        message: `Order status updated to ${status}!`,
        type: "success",
      });

      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      setAlert({ message: "Failed to update order status.", type: "danger" });
    }
  };

  return (
    <div className="container" style={{ minHeight: "100vh" }}>
      <h1 className="text-center pt-5 mb-5">Orders</h1>
      {alert.message && (
        <div
          className={`alert alert-${alert.type} text-center`}
          role="alert"
          style={{ color: "#ffffff" }}
        >
          {alert.message}
        </div>
      )}
      <table className="table table-dark table-striped">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User</th>
            <th>Total</th>
            <th>Payment Method</th>
            <th>Paid</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.map((order) => (
            <tr key={order._id}>
              <td>{order._id.substring(0, 8)}...</td>
              <td>{order.user?.name || "Unknown"}</td>
              <td>${order.totalPrice?.toFixed(2) ?? 0}</td>
              <td>{order.paymentMethod}</td>
              <td>
                <button
                  className={`btn btn-sm ${
                    order.isPaid ? "btn-success" : "btn-danger"
                  }`}
                  onClick={() =>
                    handleUpdatePaymentStatus(order._id, !order.isPaid)
                  }
                >
                  {order.isPaid ? "Paid" : "Not Paid"}
                </button>
              </td>
              <td>
                {order.status ||
                  (order.isDelivered
                    ? "Delivered"
                    : order.isShipped
                    ? "Shipped"
                    : "Pending")}
              </td>
              <td>
                <select
                  value={order.status || "Pending"}
                  onChange={(e) =>
                    handleUpdateOrderStatus(order._id, e.target.value)
                  }
                  className="form-select"
                >
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="d-flex justify-content-center mt-4">
        <nav>
          <ul className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <li
                key={index}
                className={`page-item ${
                  currentPage === index + 1 ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default withAdminAuth(Orders);
