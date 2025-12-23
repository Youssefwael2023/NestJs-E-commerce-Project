import React, { useEffect, useState } from "react";
import axios from "axios";
import { getApiUrl } from "../../config/api";
import withAdminAuth from "../../utils/withAdminAuth";

function Profile() {
  const [profile, setProfile] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ message: "", type: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");

        if (!user || !token || !user.id) {
          setAlert({ message: "Please login again", type: "danger" });
          setLoading(false);
          return;
        }

        const res = await axios.get(
          getApiUrl(`api/users/profile/${user.id}`),
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

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
        window.location.href = "/login";
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      if (!token || !user || !user.id) {
        setAlert({ message: "Please login again", type: "danger" });
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

      const updateData = { name: profile.name, email: profile.email };
      if (profile.password) updateData.password = profile.password;

      const response = await axios.put(
        getApiUrl(`api/users/profile/${user.id}`),
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
        window.location.href = "/login";
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
    return <div className="container text-center py-5">Loading...</div>;

  return (
    <div
      className="container text-black"
      style={{
        maxWidth: 500,
        marginTop: 40,
        minHeight: "100vh",
        color: "black",
      }}
    >
      <h2 className="mb-4 text-center">Admin Profile</h2>
      {alert.message && (
        <div className={`alert alert-${alert.type} text-center`} role="alert">
          {alert.message}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="bg-dark p-4 rounded shadow text-black"
      >
        <div className="mb-3 text-black">
          <input
            type="text"
            className="form-control text-black"
            name="name"
            value={profile.name}
            onChange={handleChange}
            required
            placeholder="Name"
          />
        </div>
        <div className="mb-3">
          <input
            type="email"
            className="form-control text-black"
            name="email"
            value={profile.email}
            onChange={handleChange}
            required
            placeholder="Email"
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control text-black"
            name="password"
            value={profile.password}
            onChange={handleChange}
            placeholder="New password"
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default withAdminAuth(Profile);
