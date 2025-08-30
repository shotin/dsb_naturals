// src/admin/pages/Products.jsx
import { useEffect, useState } from "react";
import { HTTP } from "../../utils";
import { toast } from "react-toastify";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [updatingStockId, setUpdatingStockId] = useState(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [categories, setCategories] = useState([]);

  const [editProduct, setEditProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category_id: "",
    price: "",
    stock_status: "In stock",
    description: "",
    image: null,
  });

  const token = localStorage.getItem("token");

  const openAddModal = () => {
    setNewProduct({
      name: "",
      category_id: "",
      price: "",
      stock_status: "In stock",
      description: "",
      image: null,
    });
    setShowAddModal(true);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await HTTP.get("/admin/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(response.data.categories); // Adjust depending on your API structure
      } catch (err) {
        toast.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  const handleAddProduct = async () => {
    setSaving(true);
    try {
      const formData = new FormData();

      // Append only non-null fields
      Object.entries(newProduct).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          formData.append(key, value);
        }
      });

      await HTTP.post("/admin/products/add", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product added successfully!");
      setShowAddModal(false);

      // Refresh products
      fetchProducts(page);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add new product");
    } finally {
      setSaving(false);
    }
  };

  const fetchProducts = async (pageNumber = 1) => {
    setLoading(true);
    setError("");
    try {
      const response = await HTTP.get(`/admin/products?page=${pageNumber}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data.products.data);
      setLastPage(response.data.products.last_page);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const toggleStock = async (productId) => {
    setUpdatingStockId(productId);
    try {
      const response = await HTTP.patch(
        `/admin/products/${productId}/update-stock`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedProduct = response.data.product;
      setProducts((prev) =>
        prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update stock");
    } finally {
      setUpdatingStockId(null);
    }
  };

  const openEditModal = async (productId) => {
    try {
      const response = await HTTP.get(`products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditProduct(response.data);
      setShowModal(true);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to fetch product details"
      );
    }
  };

  const handleSave = async () => {
    if (!editProduct) return;
    setSaving(true);

    try {
      const token = localStorage.getItem("token");

      // Use FormData for optional file upload
      const formData = new FormData();
      formData.append("name", editProduct.name);
      formData.append("description", editProduct.description);
      formData.append("price", editProduct.price);
      formData.append("category_id", editProduct.category_id);
      formData.append("stock_status", editProduct.stock_status);

      // Only append the file if the user selected a new one
      if (editProduct.imageFile) {
        formData.append("image", editProduct.imageFile);
      }

      const response = await HTTP.post(
        `/admin/products/${editProduct.id}/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update product in list
      setProducts((prev) =>
        prev.map((p) => (p.id === response.data.id ? response.data : p))
      );

      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger text-center mt-5">{error}</div>;
  }

  const deleteProduct = (productId, setProducts) => {
    // Render a custom toast with buttons
    const ToastContent = ({ closeToast }) => (
      <div>
        <p>Are you sure you want to delete this product?</p>
        <div className="mt-2">
          <button
            className="btn btn-sm btn-danger me-2"
            onClick={async () => {
              try {
                const token = localStorage.getItem("token");
                await HTTP.delete(`/admin/products/${productId}/delete`, {
                  headers: { Authorization: `Bearer ${token}` },
                });

                // setProducts((prev) => prev.filter((p) => p.id !== productId));
                toast.success("Product deleted successfully!");
              } catch (err) {
                console.log(err);

                toast.error(
                  err.response?.data?.message || "Failed to delete product."
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

  return (
    <div>
      <h2>Products</h2>
      <button className="btn btn-primary mb-3" onClick={openAddModal}>
        Add New Product
      </button>

      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Date Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, idx) => (
            <tr key={p?.id}>
              <td>{idx + 1 + (page - 1) * 10}</td>
              <td>{p?.name}</td>
              <td>{p?.category?.name || "-"}</td>
              <td>{p?.price}</td>
              <td>
                <button
                  className={`btn btn-sm ${
                    p?.stock_status === "In stock"
                      ? "btn-success"
                      : "btn-secondary"
                  }`}
                  onClick={() => toggleStock(p.id)}
                  disabled={updatingStockId === p?.id}
                >
                  {updatingStockId === p?.id ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    p?.stock_status
                  )}
                </button>
              </td>
              <td>{new Date(p?.created_at).toLocaleString()}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => openEditModal(p.id)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => deleteProduct(p.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <nav aria-label="Page navigation">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => setPage(page - 1)}>
              Previous
            </button>
          </li>
          {[...Array(lastPage)].map((_, i) => (
            <li
              key={i}
              className={`page-item ${page === i + 1 ? "active" : ""}`}
            >
              <button className="page-link" onClick={() => setPage(i + 1)}>
                {i + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${page === lastPage ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => setPage(page + 1)}>
              Next
            </button>
          </li>
        </ul>
      </nav>

      {/* Edit Modal */}
      {showModal && editProduct && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Product</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Name:</label>
                  <input
                    className="form-control"
                    value={editProduct.name}
                    onChange={(e) =>
                      setEditProduct({ ...editProduct, name: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Category ID:</label>
                  <input
                    className="form-control"
                    value={editProduct.category.name}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        category_id: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Price:</label>
                  <input
                    className="form-control"
                    value={editProduct.price}
                    onChange={(e) =>
                      setEditProduct({ ...editProduct, price: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Stock Status:</label>
                  <select
                    className="form-select"
                    value={editProduct.stock_status}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        stock_status: e.target.value,
                      })
                    }
                  >
                    <option value="In stock">In stock</option>
                    <option value="Out of stock">Out of stock</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Description:</label>
                  <textarea
                    className="form-control"
                    rows={6} // increase height
                    value={editProduct.description}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Image:</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        imageFile: e.target.files[0],
                      })
                    }
                  />
                  {editProduct.image && !editProduct.imageFile && (
                    <img
                      src={editProduct.image}
                      alt={editProduct.name}
                      className="img-fluid mt-2"
                    />
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Product</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label>Name:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label>Category:</label>
                  <select
                    className="form-control"
                    value={newProduct.category_id}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        category_id: e.target.value,
                      })
                    }
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label>Price:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label>Stock Status:</label>
                  <select
                    className="form-control"
                    value={newProduct.stock_status}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        stock_status: e.target.value,
                      })
                    }
                  >
                    <option value="In stock">In stock</option>
                    <option value="Out of stock">Out of stock</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label>Description:</label>
                  <textarea
                    className="form-control"
                    rows={6}
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label>Image:</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, image: e.target.files[0] })
                    }
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Close
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleAddProduct}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Product"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
