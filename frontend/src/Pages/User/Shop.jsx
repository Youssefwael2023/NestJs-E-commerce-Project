import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import apiClient from "../../config/axios";
import { FaCartPlus } from "react-icons/fa";

function Shop() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const location = useLocation(); // Added location

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiClient.get("api/products");
        setProducts(response.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setAlertMessage("Failed to load products");
        setTimeout(() => setAlertMessage(""), 3000);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await apiClient.get("api/categories");
        setCategories(response.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    // Read category from query string
    const params = new URLSearchParams(location.search);
    const category = params.get("category");
    if (category) {
      setSelectedCategory(category);
    }
  }, [location]); // Triggered when location changes

  const handleAddToCart = async (product) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        setAlertMessage("Please log in to add to cart.");
        setTimeout(() => setAlertMessage(""), 3000);
        return;
      }
      await apiClient.post(`api/cart/${user.id || user._id}`, {
        productId: product._id,
        quantity: 1,
      });
      setAlertMessage("Product added to cart!");
      setTimeout(() => setAlertMessage(""), 2000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      setAlertMessage(error.message || "Failed to add to cart.");
      setTimeout(() => setAlertMessage(""), 3000);
    }
  };

  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((product) =>
      selectedCategory === "All" ? true : product.category === selectedCategory
    )
    .sort((a, b) => {
      // Calculate effective price (with discount)
      const priceA =
        a.discount > 0 ? a.price * (1 - a.discount / 100) : a.price;
      const priceB =
        b.discount > 0 ? b.price * (1 - b.discount / 100) : b.price;

      if (sortOption === "price-asc") return priceA - priceB;
      if (sortOption === "price-desc") return priceB - priceA;
      if (sortOption === "name-asc") return a.name.localeCompare(b.name);
      if (sortOption === "name-desc") return b.name.localeCompare(a.name);
      return 0;
    });

  return (
    <div className="container pt-5 pb-5 ">
      {alertMessage && (
        <div
          style={{
            position: "fixed",
            top: "30px",
            right: "10px",
            backgroundColor: "green",
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
            zIndex: 1000,
          }}
        >
          {alertMessage}
        </div>
      )}

      <div className="row mb-4">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </select>
        </div>
      </div>
      <div className="row pt-5 pb5 ">
        {filteredProducts.map((product) => (
          <div key={product._id} className="col-lg-4 col-md-12 col-sm-6 mb-4">
            <div
              className="card "
              style={{
                backgroundColor: "#1E1E1E",
                color: "white",
                height: "auto",
              }}
            >
              <div style={{ position: "relative" }}>
                {product.stock > 0 && product.discount > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      left: "10px",
                      backgroundColor: "red",
                      color: "white",
                      padding: "5px",
                      borderRadius: "5px",
                    }}
                  >
                    {product.discount}% OFF
                  </div>
                )}
                <img
                  src={product.image}
                  className="card-img-top img-fluid"
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "250px",
                  }}
                />
              </div>
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                {product.stock > 0 ? (
                  <>
                    {product.discount > 0 && (
                      <p>
                        <span
                          style={{
                            textDecoration: "line-through",
                            marginRight: "10px",
                          }}
                        >
                          ${product.price}
                        </span>
                        <span>
                          $
                          {(
                            product.price *
                            (1 - product.discount / 100)
                          ).toFixed(2)}
                        </span>
                      </p>
                    )}
                    {!product.discount && <p>${product.price}</p>}
                    <div className="d-flex justify-content-between align-items-center">
                      <button
                        className="btn btn-primary"
                        onClick={() =>
                          (window.location.href = `/product/${product._id}`)
                        }
                      >
                        Read More
                      </button>
                      <div>
                        <FaCartPlus
                          className="me-3"
                          style={{
                            cursor: "pointer",
                            color: "white",
                          }}
                          onClick={() => handleAddToCart(product)}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <p
                      style={{
                        color: "red",
                        minHeight: "24px",
                        display: "flex",
                        justifyContent: "center",
                        fontSize: "1.3rem",
                        fontWeight: "bolder",
                      }}
                      className="text-center text-danger"
                    >
                      Out of Stock
                    </p>
                    <div style={{ height: "30px" }}></div>
                    {/* Placeholder to maintain size */}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Shop;
