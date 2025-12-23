import React, { useEffect, useState } from "react";
import axios from "axios";
import { getApiUrl, API_BASE_URL } from "../../config/api";
import withAdminAuth from "../../utils/withAdminAuth";

function OutOfStock() {
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editedStock, setEditedStock] = useState(0);
  const [alert, setAlert] = useState({ message: "", type: "" });

  useEffect(() => {
    const fetchOutOfStock = async () => {
      try {
        const response = await axios.get(getApiUrl("api/products"));
        const OutOfStock = response.data.filter(
          (product) => product.stock === 0
        );
        setProducts(OutOfStock);
      } catch (error) {
        console.error("Error fetching low stock products:", error);
      }
    };
    fetchOutOfStock();
  }, []);

  const handleEditClick = (product) => {
    setEditingProductId(product._id);
    setEditedStock(product.stock);
  };

  const handleSaveClick = async (id) => {
    if (!Number.isInteger(Number(editedStock))) {
      setAlert({ message: "Stock must be an integer.", type: "danger" });
      return;
    }

    try {
      await axios.put(getApiUrl(`api/products/${id}`), {
        stock: editedStock,
      });
      setAlert({ message: "Stock updated successfully!", type: "success" });
      setProducts(
        products.map((product) =>
          product._id === id ? { ...product, stock: editedStock } : product
        )
      );
      setEditingProductId(null);
      const response = await axios.get(getApiUrl("api/products"));
      const OutOfStock = response.data.filter((product) => product.stock === 0);
      setProducts(OutOfStock);
    } catch (error) {
      console.error("Error updating stock:", error);
      setAlert({ message: "Failed to update stock.", type: "danger" });
    }
  };

  return (
    <div className="container" style={{ minHeight: "100vh" }}>
      <h1 className="text-center pt-5 mb-5 text-light">Out Of Stock</h1>
      {alert.message && (
        <div
          className={`alert alert-${alert.type} text-center`}
          role="alert"
          style={{ color: "#ffffff" }}
        >
          {alert.message}
        </div>
      )}
      {products.length === 0 ? (
        <div className="text-center text-light">
          <h3>No products are out of stock.</h3>
        </div>
      ) : (
        <table className="table table-dark table-striped">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                  />
                </td>
                <td>{product.name}</td>
                <td>
                  {editingProductId === product._id ? (
                    <input
                      type="number"
                      value={editedStock}
                      onChange={(e) => setEditedStock(e.target.value)}
                      className="form-control"
                      style={{ width: "80px" }}
                      step="1"
                      min="0"
                    />
                  ) : (
                    product.stock
                  )}
                </td>
                <td>${product.price}</td>
                <td>
                  {editingProductId === product._id ? (
                    <button
                      className="btn btn-success"
                      onClick={() => handleSaveClick(product._id)}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary"
                      onClick={() => handleEditClick(product)}
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
export default withAdminAuth(OutOfStock);
