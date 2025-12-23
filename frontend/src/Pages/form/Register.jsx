import React, { useState } from "react";
import apiClient from "../../config/axios";
import { useNavigate } from "react-router-dom";
// import styles from "./style.module.css"; // imported to apply the same style
import styles from "./Register.module.css"; // imported to apply the same style

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertDanger, setShowAlertDanger] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowAlert(false);
    setShowAlertDanger(false);
    
    try {
      await apiClient.post("api/users/register", formData);

      // Show success alert
      setShowAlertDanger(false);
      setShowAlert(true);
      setAlertMessage("Signup successful! Redirecting to login...");

      // Navigate to the login page after success
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Error during signup:", error);
      setShowAlertDanger(true);
      setShowAlert(false);
      setAlertMessage(error.message || "Signup failed! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#1f1f1f", height: "100vh" }}>
      <div className="container">
        {showAlert && (
          <div
            className="alert alert-success text-center fs-3"
            style={{ position: "relative", top: "40px", padding: "20px" }}
            role="alert"
          >
            {alertMessage || "Signup successful! You can now log in."}
          </div>
        )}
        {showAlertDanger && (
          <div
            className="alert alert-danger text-center fs-3"
            style={{ position: "relative", top: "40px", padding: "20px" }}
            role="alert"
          >
            {alertMessage || "Signup failed!"}
          </div>
        )}
        <div className="row">
          <div className="col-lg-3 col-md-2 col-sm-12 "></div>
          <div
            className={
              "col-lg-6 col-md-8 login-box col-sm-12" + " " + styles.loginbox
            }
          >
            {/* Conditional rendering of success alert at the top */}

            <div
              className={
                "col-lg-12 login-title col-sm-12" + " " + styles.logintitle
              }
            >
              Signup
            </div>

            <div
              className={
                "col-lg-12 login-form col-sm-12" + " " + styles.loginform
              }
            >
              <form
                onSubmit={handleSubmit}
                style={{
                  position: "relative",
                  top: "50px",
                }}
              >
                <div className={"form-group" + " " + styles.formgroup}>
                  <label
                    className={"form-control-label   fs-3" + styles.formcontrol}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={"form-control" + " " + styles.input}
                  />
                </div>
                <div className={"form-group" + " " + styles.formgroup}>
                  <label
                    className={"form-control-label fs-3  " + styles.formcontrol}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={"form-control" + " " + styles.input}
                  />
                </div>
                <div className={"form-group" + " " + styles.formgroup}>
                  <label
                    className={"form-control-label fs-3  " + styles.formcontrol}
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={"form-control" + " " + styles.input}
                    minLength={8}
                  />
                </div>
                {/* <div className={"form-group" + " " + styles.formgroup}>
                  <label
                    className={
                      "form-control-label fs-3 me-5  " +
                      styles.formcontrol +
                      styles.formcontrollabel
                    }
                  >
                    password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="form-control"
                  />
                </div> */}
                <div className={"col-lg-12 loginbttm" + " " + styles.loginbttm}>
                  <div
                    className={
                      "col-lg-6 login-btm login-text" + " " + styles.logintext
                    }
                  ></div>
                  <div
                    className={
                      "col-lg-6 login-btm login-button" +
                      " " +
                      styles.loginbutton
                    }
                  >
                    <button
                      type="submit"
                      className={"btn " + " " + styles.btnoutlineprimary}
                      disabled={loading}
                    >
                      {loading ? "Signing up..." : "SIGNUP"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="col-lg-3 col-md-2 col-sm-12"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
