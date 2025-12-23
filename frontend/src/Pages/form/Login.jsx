import { useState } from "react";
import apiClient from "../../config/axios";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertDanger, setShowAlertDanger] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowAlert(false);
    setShowAlertDanger(false);
    
    try {
      const res = await apiClient.post("api/users/login", {
        email,
        password,
      });

      // Backend returns { message, token, user } or { token, user }
      const { token, user } = res.data;

      if (!token || !user) {
        throw new Error("Invalid response from server");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setShowAlert(true);
      setShowAlertDanger(false);
      setAlertMessage("Login successful!");

      setTimeout(() => {
        if (user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }, 1500);
    } catch (err) {
      console.error("Login error:", err);
      setShowAlertDanger(true);
      setShowAlert(false);
      setAlertMessage(err.message || "Login failed! Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={styles.container}
      style={{ backgroundColor: "#1f1f1f", height: "100vh" }}
    >
      <div className="container">
        {showAlert && (
          <div
            className="alert alert-success text-center fs-3"
            style={{ position: "relative", top: "40px", padding: "20px" }}
            role="alert"
          >
            {alertMessage || "Login successful!"}
          </div>
        )}
        {showAlertDanger && (
          <div
            className="alert alert-danger text-center fs-3"
            style={{ position: "relative", top: "40px", padding: "20px" }}
            role="alert"
          >
            {alertMessage || "Login failed!"}
          </div>
        )}
        <div className="row">
          <div className="col-lg-3 col-md-2"></div>
          <div className={`col-lg-6 col-md-8 ${styles.loginbox}`}>
            {/* Conditional rendering of success alert at the top */}

            <div className={`col-lg-12 ${styles.logintitle}`}>Login</div>

            <div className={`col-lg-12 ${styles.loginform}`}>
              <form onSubmit={handleLogin}>
                <div className={`form-group ${styles.formgroup}`}>
                  <label
                    className={`form-control-label fs-3 ${styles.formcontrol}`}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={`form-control ${styles.input}`}
                  />
                </div>
                <div className={`form-group ${styles.formgroup}`}>
                  <label
                    className={`form-control-label fs-3 ${styles.formcontrol}`}
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={`form-control ${styles.input}`}
                  />
                </div>

                <div className={`col-lg-12 ${styles.loginbttm}`}>
                  <div
                    className={`col-lg-6 login-btm login-text ${styles.logintext}`}
                  ></div>
                  <div
                    className={`col-lg-6 login-btm login-button ${styles.loginbutton}`}
                  >
                    <button
                      type="submit"
                      className={`btn ${styles.btnoutlineprimary}`}
                      disabled={loading}
                    >
                      {loading ? "Logging in..." : "LOGIN"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="col-lg-3 col-md-2"></div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
