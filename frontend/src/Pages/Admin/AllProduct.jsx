import React, { useEffect, useState } from "react";
import apiClient from "../../config/axios";
import styles from "./AllProduct.module.css";
import withAdminAuth from "../../utils/withAdminAuth";

function AllProduct() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editedProductData, setEditedProductData] = useState({});
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiClient.get("api/products");
        setProducts(response.data || []);
        setFilteredProducts(response.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setAlert({ message: "Failed to load products", type: "danger" });
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [searchQuery, products]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }
    try {
      await apiClient.delete(`api/products/${id}`);
      setAlert({ message: "Product deleted successfully!", type: "success" });
      setProducts(products.filter((product) => product._id !== id));
      setFilteredProducts(
        filteredProducts.filter((product) => product._id !== id)
      );
    } catch (error) {
      console.error("Error deleting product:", error);
      setAlert({
        message: error.message || "Failed to delete product. Please try again.",
        type: "danger",
      });
    }
  };

  const handleUpdateClick = (product) => {
    setEditingProductId(product._id);
    setEditedProductData({ ...product });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProductData({ ...editedProductData, [name]: value });
  };

  const handleSaveChanges = async () => {
    if (!Number.isInteger(Number(editedProductData.price))) {
      setAlert({ message: "Price must be an integer.", type: "danger" });
      return;
    }
    if (!Number.isInteger(Number(editedProductData.stock))) {
      setAlert({ message: "Stock must be an integer.", type: "danger" });
      return;
    }
    if (
      editedProductData.discount &&
      !Number.isInteger(Number(editedProductData.discount))
    ) {
      setAlert({ message: "Discount must be an integer.", type: "danger" });
      return;
    }
    try {
      await apiClient.put(
        `api/products/${editedProductData._id}`,
        editedProductData
      );
      setAlert({ message: "Product updated successfully!", type: "success" });
      setProducts(
        products.map((p) =>
          p._id === editedProductData._id ? editedProductData : p
        )
      );
      setFilteredProducts(
        filteredProducts.map((p) =>
          p._id === editedProductData._id ? editedProductData : p
        )
      );
      setEditingProductId(null);
      setEditedProductData({});
    } catch (error) {
      console.error("Error updating product:", error);
      setAlert({ 
        message: error.message || "Failed to update product.", 
        type: "danger" 
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setEditedProductData({});
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container" style={{ minHeight: "100vh" }}>
      <h1 className="text-center pt-5 mb-5">All Products</h1>
      {alert.message && (
        <div className={`alert alert-${alert.type} text-center`} role="alert">
          {alert.message}
        </div>
      )}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search products by name..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <div className="row">
        {currentProducts.map((product) => (
          <div key={product._id} className="col-lg-6 mb-3">
            <div
              className="card d-flex flex-column p-3"
              style={{
                backgroundColor: "#181818",
                boxShadow: "0px 8px 10px 0px rgb(128, 128, 128)",
              }}
            >
              {editingProductId === product._id ? (
                <div>
                  <input
                    type="text"
                    className={"form-control mb-2 " + styles.inputt}
                    name="name"
                    value={editedProductData.name}
                    onChange={handleInputChange}
                    placeholder="Name"
                  />
                  <input
                    type="number"
                    className={"form-control mb-2 " + styles.inputt}
                    name="price"
                    value={editedProductData.price}
                    onChange={handleInputChange}
                    placeholder="Price"
                    step="1"
                    min="0"
                  />
                  <input
                    type="number"
                    className={"form-control mb-2 " + styles.inputt}
                    name="stock"
                    value={editedProductData.stock}
                    onChange={handleInputChange}
                    placeholder="Stock"
                    step="1"
                    min="0"
                  />
                  <input
                    type="text"
                    className={"form-control mb-2 " + styles.inputt}
                    name="category"
                    value={editedProductData.category}
                    onChange={handleInputChange}
                    placeholder="Category"
                  />
                  <input
                    type="number"
                    className={"form-control mb-2 " + styles.inputt}
                    name="discount"
                    value={editedProductData.discount || 0}
                    onChange={handleInputChange}
                    placeholder="Discount"
                    step="1"
                    min="0"
                  />
                  <div className="d-flex justify-content-end">
                    <button
                      className="btn btn-success me-2"
                      onClick={handleSaveChanges}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="d-flex flex-row align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="img-fluid"
                      style={{
                        width: "80px",
                        objectFit: "cover",
                        marginRight: "15px",
                      }}
                    />
                    <div>
                      <h5 className="mb-0">{product.name}</h5>
                      <p className="mb-0">
                        <strong>Price:</strong> ${product.price}
                      </p>
                      <p className="mb-0">Stock: {product.stock}</p>
                      <p className="mb-0">Category: {product.category}</p>
                      {product.discount && <p>Discount: {product.discount}$</p>}
                    </div>
                  </div>
                  <div className="d-flex flex-column">
                    <button
                      className="btn btn-primary mb-2"
                      onClick={() => handleUpdateClick(product)}
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
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

export default withAdminAuth(AllProduct);
