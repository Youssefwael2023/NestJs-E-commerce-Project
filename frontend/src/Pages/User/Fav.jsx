import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Fav() {
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const navigate = useNavigate();

  // Get userId from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user ? user.id || user._id : null;

  useEffect(() => {
    // NOTE: Favorites endpoint doesn't exist in backend yet
    // This feature is disabled until backend implements it
    setFavoriteProducts([]);
  }, [userId]);

  const handleRemove = async (productId) => {
    // Feature disabled - backend endpoint doesn't exist
    console.warn("Favorites feature not implemented in backend");
  };

  return (
    <div
      className="container d-flex flex-column text-sm-end pt-5 pb-5"
      style={{ minHeight: "80vh" }}
    >
      <h2 className="text-center mb-5 fs-1">Your Favorites</h2>
      <div className="row w-100 justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          {favoriteProducts.length === 0 ? (
            <h4 className="text-center">Your favorites list is empty</h4>
          ) : (
            <table className="table table-dark table-striped text-center align-middle p-5">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="p-5">
                {favoriteProducts.map((item) => (
                  <tr key={item.product._id}>
                    <td>
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                      />
                    </td>
                    <td>{item.product.name}</td>
                    <td>${item.product.price?.toFixed(2)}</td>
                    <td>
                      <button
                        className="btn btn-danger me-2"
                        onClick={() => handleRemove(item.product._id)}
                      >
                        Remove
                      </button>
                      <button className="btn btn-primary">Add to Cart</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Fav;
