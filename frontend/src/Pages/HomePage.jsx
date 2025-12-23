import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../config/axios";
import Carousel from "react-bootstrap/Carousel";

function HomePage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories and products from the backend
    const fetchData = async () => {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          apiClient.get("api/categories"),
          apiClient.get("api/products"),
        ]);
        setCategories(categoriesRes.data || []);
        // Limit to 10 products for homepage
        setProducts((productsRes.data || []).slice(0, 10));
      } catch (error) {
        console.error("Error fetching homepage data:", error);
        setCategories([]);
        setProducts([]);
      }
    };
    fetchData();
  }, []);

  return (
    <div
      className="container"
      style={{ backgroundColor: "#121212", color: "#b0b0b0" }}
    >
      <div className="row py-5">
        <div className="col-md-6 d-flex flex-column justify-content-center">
          <h1 className="fw-bold mb-4" style={{ color: "#ffffff" }}>
            Welcome to Al Massryia Store
          </h1>
          <p className="fs-5 mb-4">
            Discover premium products with unbeatable prices and exceptional
            quality. We offer a wide range of items to meet your everyday needs.
          </p>
          <div className="d-flex gap-3">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/shop")}
              style={{ padding: "10px 20px" }}
            >
              Shop Now
            </button>
          </div>
        </div>
        <div className="col-md-6 mt-4 mt-md-0 d-flex align-items-center justify-content-center">
          <div
            style={{
              width: "100%",
              maxWidth: "500px",
              height: "300px",
              backgroundColor: "#1f1f1f",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              className="img-fluid"
              src="/src/assets/hero.png"
              alt="Hero"
              style={{ width: "100%", height: "100%", borderRadius: "20px" }}
            />
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <div className="row py-5 border-top border-bottom border-secondary my-4">
        <div className="col-12 text-center mb-4">
          <h2 style={{ color: "#ffffff" }}>About Us</h2>
        </div>
        <div className="col-md-4 mb-4 mb-md-0">
          <div
            className="card h-100"
            style={{ backgroundColor: "#1f1f1f", border: "none" }}
          >
            <div className="card-body text-center">
              <div className="mb-3 fs-1 text-primary">
                <i className="bi bi-shop"></i>
              </div>
              <h4 className="card-title" style={{ color: "#ffffff" }}>
                Our Story
              </h4>
              <p className="card-text">
                Founded in 2023, we've been dedicated to providing high-quality
                products at competitive prices while ensuring excellent customer
                service.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4 mb-md-0">
          <div
            className="card h-100"
            style={{ backgroundColor: "#1f1f1f", border: "none" }}
          >
            <div className="card-body text-center">
              <div className="mb-3 fs-1 text-primary">
                <i className="bi bi-award"></i>
              </div>
              <h4 className="card-title" style={{ color: "#ffffff" }}>
                Our Mission
              </h4>
              <p className="card-text">
                To transform online shopping with a seamless experience,
                offering innovative products that enhance our customers'
                everyday lives.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div
            className="card h-100"
            style={{ backgroundColor: "#1f1f1f", border: "none" }}
          >
            <div className="card-body text-center">
              <div className="mb-3 fs-1 text-primary">
                <i className="bi bi-heart"></i>
              </div>
              <h4 className="card-title" style={{ color: "#ffffff" }}>
                Our Values
              </h4>
              <p className="card-text">
                Customer satisfaction, product quality, sustainability, and
                innovation are at the core of everything we do at our store.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="row my-4 ">
        <h2 className="text-center">Categories</h2>
        <Carousel>
          {categories.map((category) => (
            <Carousel.Item key={category._id}>
              <div
                className="d-flex justify-content-center"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/shop?category=${category.name}`)}
              >
                <div
                  className="card text-center "
                  style={{
                    width: "80%",
                    backgroundColor: "#1f1f1f",
                  }}
                >
                  <img
                    src={category.image}
                    className="card-img-top"
                    alt={category.name}
                    style={{
                      height: "auto",
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
                  />
                  <div
                    className="card-body"
                    style={{
                      backgroundColor: "#1f1f1f",
                      height: "100px",
                    }}
                  >
                    <h5 className="card-title">{category.name}</h5>
                  </div>
                </div>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>

      <div className="row my-4 pt-5 ">
        <h2 className="text-center mb-5">Latest Products</h2>
        {products.slice(0, 8).map((product) => (
          <div
            key={product._id}
            className="col-sm-6 col-md-3 text-center col-md-3 d-flex  align-items-stretch"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              className="card text-center  mb-4"
              style={{
                cursor: "pointer",
                width: "280px",
                // height: "400px",
                backgroundColor: "#1f1f1f",
              }}
              onClick={() => navigate(`/product/${product._id}`)}
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
                  className="card-img-top"
                  alt={product.name}
                  style={{
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "10px 10px 0 0",
                    width: "100%",
                  }}
                />
              </div>
              <div className="card-body d-flex flex-column fs-5">
                <h5 className="card-title">{product.name}</h5>
                {product.stock > 0 ? (
                  <>
                    {product.discount > 0 ? (
                      <p>
                        <span
                          style={{
                            textDecoration: "line-through",
                            marginRight: "10px",
                            color: "red",
                          }}
                          className="text-decoration-line-through text-danger"
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
                    ) : (
                      <p>${product.price}</p>
                    )}
                  </>
                ) : (
                  <p style={{ color: "red" }} className="text-danger mt-3 fs-3">
                    Out of Stock
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Shop Now Button */}
      <div className="text-center my-4">
        <button
          className="btn btn-primary"
          onClick={() => navigate("/shop")}
          style={{ padding: "10px 20px", fontSize: "16px" }}
        >
          Shop Now
        </button>
      </div>
    </div>
  );
}

export default HomePage;
