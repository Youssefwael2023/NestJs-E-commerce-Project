import { useState, useEffect } from "react";
import axios from "axios";
import { getApiUrl } from "../../config/api";
import styles from "./AllProduct.module.css";
import withAdminAuth from "../../utils/withAdminAuth";

function AddProduct() {
  const [checked, setChecked] = useState(false);
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    quantity: "",
    stock: "",
    description: "",
    category: "",
    discount: "",
    imageFile: null,
  });
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(getApiUrl("api/categories"));
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        setAlert({
          message: "Only image files (JPG, PNG, WEBP) are allowed.",
          type: "danger",
        });
        return;
      }
      setProductData((prevData) => ({ ...prevData, imageFile: file }));
    }
  };

  const handleDiscountCheck = (e) => {
    const isChecked = e.target.checked;
    setChecked(isChecked);
    if (!isChecked) {
      setProductData((prevData) => ({
        ...prevData,
        discount: "",
      }));
    }
  };

  const validateForm = () => {
    if (!productData.name.trim()) {
      setAlert({ message: "Product name is required.", type: "danger" });
      return false;
    }
    if (productData.price <= 0 || isNaN(productData.price)) {
      setAlert({ message: "Price must be a positive number.", type: "danger" });
      return false;
    }
    if (!Number.isInteger(Number(productData.price))) {
      setAlert({ message: "Price must be an integer.", type: "danger" });
      return false;
    }
    if (productData.stock < 0 || isNaN(productData.stock)) {
      setAlert({ message: "Stock cannot be negative.", type: "danger" });
      return false;
    }
    if (!Number.isInteger(Number(productData.stock))) {
      setAlert({ message: "Stock must be an integer.", type: "danger" });
      return false;
    }
    if (!productData.description.trim()) {
      setAlert({ message: "Description is required.", type: "danger" });
      return false;
    }
    if (!productData.category) {
      setAlert({ message: "Please select a category.", type: "danger" });
      return false;
    }
    if (checked && (productData.discount < 0 || isNaN(productData.discount))) {
      setAlert({
        message: "Discount must be a non-negative number.",
        type: "danger",
      });
      return false;
    }
    if (checked && !Number.isInteger(Number(productData.discount))) {
      setAlert({ message: "Discount must be an integer.", type: "danger" });
      return false;
    }
    if (!productData.imageFile) {
      setAlert({
        message: "Product image file is required.",
        type: "danger",
      });
      return false;
    }
    if (
      productData.quantity &&
      !Number.isInteger(Number(productData.quantity))
    ) {
      setAlert({ message: "Quantity must be an integer.", type: "danger" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // Use FormData for file upload
      const formData = new FormData();
      formData.append("name", productData.name);
      formData.append("price", Number(productData.price));
      formData.append("stock", Number(productData.stock));
      formData.append("description", productData.description);
      formData.append("category", productData.category);
      formData.append(
        "discount",
        productData.discount ? Number(productData.discount) : 0
      );
      formData.append("image", productData.imageFile);

      const response = await axios.post(getApiUrl("api/products"), formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAlert({
        message: "✅ Product added successfully!",
        type: "success",
      });
      console.log(response.data);

      setProductData({
        name: "",
        price: "",
        quantity: "",
        stock: "",
        description: "",
        category: "",
        discount: "",
        imageFile: null,
      });
      setChecked(false);
    } catch (error) {
      console.error(
        "❌ Error adding product:",
        error.response?.data,
        error.response?.status
      );
      setAlert({
        message:
          error.response?.data?.message ||
          "Failed to add product. Please try again.",
        type: "danger",
      });
    }
  };

  return (
    <div
      className="container text-lg-start text-center"
      style={{ backgroundColor: "#121212" }}
    >
      <h1 className="text-center"> Add Product</h1>
      {alert.message && (
        <div
          className={`alert alert-${alert.type} text-center`}
          role="alert"
          style={{ color: "#ffffff" }}
        >
          {alert.message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-lg-12">
            <h2>Product Image</h2>
            <input
              type="file"
              className={"form-control mt-3 mb-5" + " " + styles.inputt}
              name="imageFile"
              accept="image/jpeg,image/png,image/jpg,image/webp"
              onChange={handleFileChange}
              style={{
                width: "86%",
                padding: "30px",
                color: "#bb86fc",
              }}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6">
            <h2>Name</h2>
            <input
              type="text"
              className={styles.inputt}
              name="name"
              value={productData.name}
              onChange={handleChange}
              required
              style={{
                width: "70%",
                margin: "auto",
                marginBottom: "20px",
                padding: "10px",
                color: "#bb86fc",
              }}
            />
          </div>
          <div className="col-lg-6">
            <h2>Price</h2>
            <input
              type="number"
              className={styles.inputt}
              name="price"
              value={productData.price}
              onChange={handleChange}
              required
              step="1"
              min="0"
              style={{
                width: "70%",
                margin: "auto",
                marginBottom: "20px",
                padding: "10px",
                color: "#bb86fc",
              }}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12 pt-5 pb-5">
            <h2>Stock</h2>
            <input
              type="number"
              className={styles.inputt}
              name="stock"
              value={productData.stock}
              onChange={handleChange}
              required
              style={{
                width: "86%",
                margin: "auto",
                padding: "10px",
                color: "#bb86fc",
              }}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12 pt-5 pb-5">
            <h2>Description</h2>
            <textarea
              name="description"
              className={styles.inputt}
              value={productData.description}
              onChange={handleChange}
              required
              style={{
                width: "86%",
                margin: "auto",
                padding: "10px",
                color: "#bb86fc",
              }}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6 pt-5 mb-5">
            <h2>Category</h2>
            <select
              name="category"
              className={styles.inputt}
              value={productData.category}
              onChange={handleChange}
              required
              style={{
                width: "70%",
                margin: "auto",
                marginBottom: "20px",
                padding: "10px",
                color: "#bb86fc",
              }}
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((category) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-lg-6 pt-5 mb-5">
            <h2>Discount</h2>
            <input
              type="checkbox"
              className="form-check-input p-3"
              checked={checked}
              onChange={handleDiscountCheck}
            />
            {checked && (
              <input
                type="number"
                name="discount"
                className={styles.inputt}
                value={productData.discount}
                onChange={handleChange}
                style={{
                  width: "70%",
                  margin: "auto",
                  marginBottom: "20px",
                  padding: "10px",
                  color: "#bb86fc",
                }}
                placeholder="Enter discount %"
              />
            )}
          </div>
        </div>

        <div className="row  pt-5 pb-5">
          <button
            type="submit"
            className="btn pe-4 ps-4 fw-bold text-light fs-1 text-center mb-5"
            style={{
              backgroundColor: "#b0b0b0",
              width: "200px",
              margin: "auto",
            }}
          >
            ADD
          </button>
        </div>
      </form>
    </div>
  );
}

export default withAdminAuth(AddProduct);
