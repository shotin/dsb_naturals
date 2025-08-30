// src/admin/pages/Categories.jsx
import { useEffect, useState } from "react";
import { HTTP } from "../../utils";
import { toast } from "react-toastify";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [saving, setSaving] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const token = localStorage.getItem("token");

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await HTTP.get("/admin/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data.categories); // adjust if response structure differs
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Open modal for adding
  const openAddModal = () => {
    setEditingCategory(null);
    setNewCategoryName("");
    setShowModal(true);
  };

  // Open modal for editing
  const openEditModal = async (categoryId) => {
    try {
      const response = await HTTP.get(`/categories/${categoryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingCategory(response.data);
      setNewCategoryName(response.data.name);
      setShowModal(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch category");
    }
  };

  // Save (add or update)
  const handleSave = async () => {
    if (!newCategoryName.trim()) return toast.error("Name is required");
    setSaving(true);
    try {
      if (editingCategory) {
        // Update
        const response = await HTTP.patch(
          `/admin/categories/${editingCategory.id}/update`,
          { name: newCategoryName },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCategories((prev) =>
          prev.map((c) => (c.id === response.data.id ? response.data : c))
        );
        toast.success("Category updated successfully!");
      } else {
        // Add
        const response = await HTTP.post(
          "/admin/categories/add",
          { name: newCategoryName },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCategories((prev) => [response.data.category, ...prev]);
        toast.success("Category added successfully!");
      }
      setShowModal(false);
      fetchCategories()
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  // Delete category
  const deleteCategory = (categoryId) => {
    const ToastContent = ({ closeToast }) => (
      <div>
        <p>Are you sure you want to delete this category?</p>
        <div className="mt-2">
          <button
            className="btn btn-sm btn-danger me-2"
            onClick={async () => {
              try {
                await HTTP.delete(`/admin/categories/${categoryId}/delete`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                setCategories((prev) =>
                  prev.filter((c) => c.id !== categoryId)
                );
                toast.success("Category deleted successfully!");
              } catch (err) {
                toast.error(
                  err.response?.data?.message || "Failed to delete category"
                );
              } finally {
                closeToast();
              }
            }}
          >
            Yes
          </button>
          <button className="btn btn-sm btn-secondary" onClick={closeToast}>
            No
          </button>
        </div>
      </div>
    );

    toast.info(<ToastContent />, { autoClose: false });
  };

 
  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  if (error) return <div className="alert alert-danger text-center">{error}</div>;

  return (
    <div>
      <h2>Categories</h2>
      <button className="btn btn-primary mb-3" onClick={openAddModal}>
        Add New Category
      </button>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c, idx) => (
            <tr key={c.id}>
              <td>{idx + 1}</td>
              <td>{c.name}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => openEditModal(c.id)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => deleteCategory(c.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add/Edit Modal */}
      {showModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingCategory ? "Edit Category" : "Add Category"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label>Name:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
