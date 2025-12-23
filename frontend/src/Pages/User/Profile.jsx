import React, { useEffect, useState } from "react";
import axios from "axios";
import { getApiUrl } from "../../config/api";
import { useNavigate } from "react-router-dom";

function UserProfile() {
  const [profile, setProfile] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");

        if (!user || !token || (!user.id && !user._id)) {
          setAlert({
            message: "Please login to view your profile",
            type: "danger",
          });
          setLoading(false);
          setTimeout(() => navigate("/login"), 2000);
          return;
        }

        const userId = user.id || user._id;
        const res = await axios.get(getApiUrl(`api/users/profile/${userId}`), {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile({
          name: res.data.name,
          email: res.data.email,
          password: "",
        });
        setLoading(false);
      } catch (error) {
        console.error("Profile fetch error:", error);
        setAlert({
          message: "Failed to fetch profile. Please login again.",
          type: "danger",
        });
        setLoading(false);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setTimeout(() => navigate("/login"), 2000);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      if (!token || !user || (!user.id && !user._id)) {
        setAlert({ message: "Please login again", type: "danger" });
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      const userId = user.id || user._id;
      const updateData = { name: profile.name, email: profile.email };
      if (profile.password) updateData.password = profile.password;

      const response = await axios.put(
        getApiUrl(`api/users/profile/${userId}`),
        updateData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data) {
        const updatedUser = {
          ...user,
          name: profile.name,
          email: profile.email,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        setAlert({ message: "Profile updated successfully!", type: "success" });
        setProfile({ ...profile, password: "" });
      }
    } catch (error) {
      console.error("Profile update error:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
      }
      setAlert({
        message:
          error.response?.data?.message ||
          "Failed to update profile. Please login again.",
        type: "danger",
      });
    }
  };

  if (loading)
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  return (
    <div
      className=" py-5"
      style={{ minHeight: "100vh", backgroundColor: "#1f1f1f" }}
    >
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div
            className="card shadow"
            style={{ backgroundColor: "#1f1f1f", height: "80vh" }}
          >
            <div
              className="card-header  text-white"
              style={{ backgroundColor: "black" }}
            >
              <h2 className="mb-0 text-center">My Profile</h2>
            </div>
            <div className="card-body">
              {alert.message && (
                <div
                  className={`alert alert-${alert.type} text-center`}
                  role="alert"
                >
                  {alert.message}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-5 mt-5">
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    required
                    placeholder="Your Name"
                  />
                </div>
                <div className="mb-5 mt-5">
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    required
                    placeholder="Your Email"
                  />
                </div>
                <div className="mb-5 mt-5">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={profile.password}
                    onChange={handleChange}
                    placeholder="Leave blank to keep current password"
                  />
                  <div className=" text-center    mt-5">
                    <button type="submit" className="btn btn-primary">
                      Update Profile
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
