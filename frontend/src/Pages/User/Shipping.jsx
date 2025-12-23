import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Shipping() {
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const shipping = { address, city, postalCode, country, paymentMethod };
    localStorage.setItem("shipping", JSON.stringify(shipping));
    navigate("/summary");
  };

  return (
    <div
      className="container d-flex flex-column align-items-center pt-5 pb-5"
      style={{ minHeight: "80vh" }}
    >
      <h2 className="mb-4 fs-1">Shipping</h2>
      <form className="w-100" style={{ maxWidth: 600 }} onSubmit={handleSubmit}>
        <div className="mb-5">
          <input
            type="text"
            className="form-control"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            placeholder="Enter address"
          />
        </div>
        <div className="mb-5">
          <input
            type="text"
            className="form-control"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            placeholder="Enter city"
          />
        </div>
        <div className="mb-5">
          <input
            type="text"
            className="form-control"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            required
            placeholder="Enter postal code"
          />
        </div>
        <div className="mb-5">
          <input
            type="text"
            className="form-control"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
            placeholder="Enter country"
          />
        </div>
        {/* <div className="mb-5">
          <label className=" ms-0 form-label">Select Method</label>
          <div>
            <input
              type="radio"
              id="paypal"
              name="paymentMethod"
              value="PayPal"
              checked={paymentMethod === "PayPal"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <label htmlFor="paypal" className="ms-2">
              PayPal or Credit Card
            </label>
          </div>
        </div> */}
        <button
          type="submit"
          className="btn btn-lg w-100"
          style={{ background: "#ff4fa1", color: "white" }}
        >
          Continue
        </button>
      </form>
    </div>
  );
}

export default Shipping;
