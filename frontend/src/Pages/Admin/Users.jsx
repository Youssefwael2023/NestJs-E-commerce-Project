import { useEffect, useState } from "react";
import withAdminAuth from "../../utils/withAdminAuth";
import axios from "axios";
import { getApiUrl } from "../../config/api";

function Users() {
  const [users, setUsers] = useState([]);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(users.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(getApiUrl("api/users"));
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(getApiUrl(`api/users/${id}`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setAlert({ message: "User deleted successfully!", type: "success" });
        setUsers(users.filter((user) => user._id !== id));
      } else {
        setAlert({
          message: "Failed to delete user. Please try again.",
          type: "danger",
        });
      }
    } catch (error) {
      console.error("Error deleting user:", error.response || error.message);
      setAlert({
        message:
          "Failed to delete user. Please check your connection or try again later.",
        type: "danger",
      });
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const newUserData = {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        role: "admin",
      };

      const response = await axios.post(
        getApiUrl("api/users/register"),
        newUserData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setAlert({ message: "User added successfully!", type: "success" });
        setUsers([...users, response.data]);
        setShowForm(false);
        setNewUser({ name: "", email: "", password: "" });
      } else {
        setAlert({
          message: "Failed to add user. Please try again.",
          type: "danger",
        });
      }
    } catch (error) {
      console.error(
        "Error adding user:",
        error.response?.data || error.message
      );
      setAlert({
        message:
          error.response?.data?.message ||
          "Failed to add user. Please check your connection or try again later.",
        type: "danger",
      });
    }
  };

  return (
    <div className="container" style={{ minHeight: "100vh" }}>
      <h1 className="text-center pt-5 mb-5">All Users</h1>
      {alert.message && (
        <div
          className={`alert alert-${alert.type} text-center`}
          role="alert"
          style={{ color: "#ffffff" }}
        >
          {alert.message}
        </div>
      )}
      <button
        className="btn btn-primary mb-3"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Close Form" : "Add Employee"}
      </button>
      {showForm && (
        <form onSubmit={handleAddUser} className="mb-4 pb-5">
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              id="name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              required
              placeholder="Name"
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              id="email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              required
              placeholder="Email"
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              id="password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              required
              placeholder="Password"
            />
          </div>
          <button type="submit" className="btn btn-success">
            Save
          </button>
        </form>
      )}
      <table className="table table-dark table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                {user.role !== "admin" ? (
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </button>
                ) : (
                  <button
                    disabled
                    className="btn btn-danger"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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

export default withAdminAuth(Users);
