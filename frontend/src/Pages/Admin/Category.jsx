import React, { useState, useEffect } from "react";
import axios from "axios";
import { getApiUrl, API_BASE_URL } from "../../config/api";
import withAdminAuth from "../../utils/withAdminAuth";

function Category() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryImageFile, setNewCategoryImageFile] = useState(null);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editedCategoryName, setEditedCategoryName] = useState("");
  const [editedCategoryImageFile, setEditedCategoryImageFile] = useState(null);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [errors, setErrors] = useState({});

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

  const isImageMimeType = (file) => {
    if (!file) return false;
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/jpg",
      "image/webp",
    ];
    return allowedTypes.includes(file.type);
  };

  const handleFileChange = (e) => {
    const { files } = e.target;
    if (files && files[0]) {
      if (!isImageMimeType(files[0])) {
        setErrors((prev) => ({
          ...prev,
          newCategoryImageFile:
            "Please provide a valid image file (jpg, jpeg, png, gif, webp).",
        }));
        setNewCategoryImageFile(null);
      } else {
        setErrors((prev) => ({ ...prev, newCategoryImageFile: "" }));
        setNewCategoryImageFile(files[0]);
      }
    }
  };

  const handleEditedFileChange = (e) => {
    const { files } = e.target;
    if (files && files[0]) {
      if (!isImageMimeType(files[0])) {
        setErrors((prev) => ({
          ...prev,
          editedCategoryImageFile: "Please provide a valid image file.",
        }));
        setEditedCategoryImageFile(null);
      } else {
        setErrors((prev) => ({ ...prev, editedCategoryImageFile: "" }));
        setEditedCategoryImageFile(files[0]);
      }
    }
  };

  const handleAddCategory = async () => {
    let valid = true;
    let tempErrors = {};

    if (!newCategory.trim()) {
      tempErrors.newCategory = "Category name is required.";
      valid = false;
    }

    if (!newCategoryImageFile) {
      tempErrors.newCategoryImageFile = "Category image file is required.";
      valid = false;
    } else if (!isImageMimeType(newCategoryImageFile)) {
      tempErrors.newCategoryImageFile = "Please provide a valid image file.";
      valid = false;
    }

    setErrors(tempErrors);
    if (!valid) return;

    try {
      // Use FormData for file upload
      const formData = new FormData();
      formData.append("name", newCategory);
      formData.append("image", newCategoryImageFile);

      const response = await axios.post(getApiUrl("api/categories"), formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const categoryData = response.data.category || response.data;
      setCategories([...categories, categoryData]);

      setNewCategory("");
      setNewCategoryImageFile(null);
      setAlert({ message: "Category added successfully!", type: "success" });
    } catch (error) {
      console.error("Error adding category:", error);
      setAlert({ message: "Failed to add category.", type: "danger" });
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategoryId(category._id);
    setEditedCategoryName(category.name);
    setEditedCategoryImageFile(null);
  };

  const handleSaveCategory = async (id) => {
    let valid = true;
    let tempErrors = {};

    if (!editedCategoryName.trim()) {
      tempErrors.editedCategoryName = "Category name is required.";
      valid = false;
    }
    if (editedCategoryImageFile && !isImageMimeType(editedCategoryImageFile)) {
      tempErrors.editedCategoryImageFile = "Please provide a valid image file.";
      valid = false;
    }

    setErrors(tempErrors);
    if (!valid) return;

    try {
      if (editedCategoryImageFile) {
        // Use FormData for file upload
        const formData = new FormData();
        formData.append("name", editedCategoryName);
        formData.append("image", editedCategoryImageFile);

        const response = await axios.put(
          getApiUrl(`api/categories/${id}`),
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const categoryData = response.data.category || response.data;
        setCategories(
          categories.map((cat) =>
            cat._id === id
              ? { ...cat, name: categoryData.name, image: categoryData.image }
              : cat
          )
        );
      } else {
        // Update name only without changing image
        const payload = {
          name: editedCategoryName,
        };

        const response = await axios.put(
          getApiUrl(`api/categories/${id}`),
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const categoryData = response.data.category || response.data;
        setCategories(
          categories.map((cat) =>
            cat._id === id
              ? { ...cat, name: categoryData.name, image: categoryData.image }
              : cat
          )
        );
      }

      setEditingCategoryId(null);
      setAlert({ message: "Category updated successfully!", type: "success" });
    } catch (error) {
      console.error("Error updating category:", error);
      setAlert({ message: "Failed to update category.", type: "danger" });
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(getApiUrl(`api/categories/${id}`));
      setCategories(categories.filter((cat) => cat._id !== id));
      setAlert({ message: "Category deleted successfully!", type: "success" });
    } catch (error) {
      console.error("Error deleting category:", error);
      setAlert({ message: "Failed to delete category.", type: "danger" });
    }
  };

  return (
    <div className="container" style={{ minHeight: "100vh" }}>
      <h1 className="text-center pt-5 mb-5 text-light">Category Management</h1>
      {alert.message && (
        <div
          className={`alert alert-${alert.type} text-center`}
          role="alert"
          style={{ color: "#ffffff" }}
        >
          {alert.message}
        </div>
      )}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="New Category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          style={{ width: "50%", margin: "0 auto", marginBottom: "10px" }}
        />
        {errors.newCategory && (
          <div
            className="text-danger text-center"
            style={{ marginBottom: "5px" }}
          >
            {errors.newCategory}
          </div>
        )}

        <input
          type="file"
          className="form-control"
          accept="image/jpeg,image/png,image/gif,image/jpg,image/webp"
          onChange={handleFileChange}
          style={{ width: "50%", margin: "0 auto", marginBottom: "10px" }}
        />
        {errors.newCategoryImageFile && (
          <div
            className="text-danger text-center"
            style={{ marginBottom: "5px" }}
          >
            {errors.newCategoryImageFile}
          </div>
        )}

        <button
          className="btn btn-primary"
          onClick={handleAddCategory}
          style={{ display: "block", margin: "0 auto" }}
        >
          Add Category
        </button>
      </div>
      <table
        className="table table-dark table-striped"
        style={{ width: "50%", margin: "0 auto" }}
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category._id}>
              <td>
                {editingCategoryId === category._id ? (
                  <>
                    <input
                      type="text"
                      value={editedCategoryName}
                      onChange={(e) => setEditedCategoryName(e.target.value)}
                      className="form-control"
                    />
                    {errors.editedCategoryName && (
                      <div
                        className="text-danger"
                        style={{ marginBottom: "5px" }}
                      >
                        {errors.editedCategoryName}
                      </div>
                    )}

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/jpg,image/webp"
                      onChange={handleEditedFileChange}
                      className="form-control mt-2"
                    />
                    {errors.editedCategoryImageFile && (
                      <div
                        className="text-danger"
                        style={{ marginBottom: "5px" }}
                      >
                        {errors.editedCategoryImageFile}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {category.name}
                    <br />
                    <img
                      src={category.image}
                      alt={category.name}
                      style={{
                        width: "50px",
                        height: "50px",
                        marginTop: "5px",
                      }}
                    />
                  </>
                )}
              </td>
              <td>
                {editingCategoryId === category._id ? (
                  <button
                    className="btn btn-success me-2"
                    onClick={() => handleSaveCategory(category._id)}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className="btn btn-primary me-2"
                    onClick={() => handleEditCategory(category)}
                  >
                    Edit
                  </button>
                )}
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteCategory(category._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default withAdminAuth(Category);
