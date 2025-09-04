import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { HTTP } from "../utils";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
  });
  const [loading, setLoading] = useState(false);

  // Fetch Orders
  const fetchOrders = (page = 1) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setOrdersLoading(true);
    HTTP.get(`/user/checkouts?page=${page}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        const data = res.data.checkouts;
        setOrders(data.data || []);
        setPagination({
          current_page: data.current_page,
          last_page: data.last_page,
          per_page: data.per_page,
          total: data.total,
        });
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load orders.");
      })
      .finally(() => setOrdersLoading(false));
  };

  useEffect(() => {
    // Get user from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setProfileData({
        first_name: storedUser.first_name || "",
        last_name: storedUser.last_name || "",
        email: storedUser.email || "",
        phone_number: storedUser.phone_number || "",
      });
    }

    // Fetch initial orders
    fetchOrders(1);
  }, []);

  if (!user) return <p>Loading profile...</p>;

  return (
    <>
      <Navbar />
      <div className="container mt-5 mb-5">
        <h2 className="mb-4 d-flex align-items-center">
          <FaUserCircle className="me-2 text-secondary" size={32} />
          My Account
        </h2>

        {/* Tabs */}
        <ul
          className="nav nav-tabs border-0"
          style={{ marginTop: "40px", marginBottom: "20px" }}
        >
          <li className="nav-item">
            <button
              className={`nav-link ${
                activeTab === "profile"
                  ? "active bg-primary text-white fw-bold"
                  : "text-primary fw-bolder"
              }`}
              style={{ border: "none" }}
              onClick={() => setActiveTab("profile")}
            >
              Profile Details
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${
                activeTab === "orders"
                  ? "active bg-primary text-white fw-bold"
                  : "text-primary fw-bolder"
              }`}
              style={{ border: "none" }}
              onClick={() => setActiveTab("orders")}
            >
              Order History
            </button>
          </li>
        </ul>

        {/* Tab Content */}
        <div className="tab-content p-4 border border-top-0 rounded-bottom">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div>
              <h4>Profile Details</h4>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const token = localStorage.getItem("token");
                  setLoading(true);
                  HTTP.put(`/users/${user.id}/profile`, profileData, {
                    headers: { Authorization: `Bearer ${token}` },
                  })
                    .then((res) => {
                      toast.success("Profile updated successfully!");
                      setUser(res.data.user);
                      localStorage.setItem(
                        "user",
                        JSON.stringify(res.data.user)
                      );
                    })
                    .catch((err) => {
                      console.error(err);
                      toast.error("Failed to update profile.");
                    })
                    .finally(() => setLoading(false));
                }}
              >
                <div className="mb-3">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profileData.first_name}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        first_name: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profileData.last_name}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        last_name: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={profileData.email}
                    readOnly
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        email: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profileData.phone_number}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        phone_number: e.target.value,
                      })
                    }
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary d-flex align-items-center"
                  disabled={loading}
                >
                  {loading && (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                  )}
                  {loading ? "Updating..." : "Update Profile"}
                </button>
              </form>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div>
              <h3 className="fw-bolder">Order History</h3>

              {/* Show spinner while loading */}
              {ordersLoading ? (
                <div className="text-center my-4">
                  <Spinner animation="border" role="status" />
                  <p className="mt-2">Loading orders...</p>
                </div>
              ) : (
                <>
                  <p>Total Orders: {pagination?.total || 0}</p>

                  {orders.length === 0 ? (
                    <p>No orders found.</p>
                  ) : (
                    orders.map((order) => {
                      const cartItems = order?.cart_items
                        ? Object.values(order.cart_items)
                        : [];

                      return (
                        <div key={order.id} className="mb-4 border p-3 rounded">
                          <p>
                            <strong>Order ID:</strong> {order.id}
                          </p>
                          <p>
                            <strong>Order Date:</strong>{" "}
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                          <p>
                            <strong>Delivery Cost:</strong> ₦
                            {order.delivery_cost}
                          </p>
                          <p>
                            <strong>Delivery Location:</strong>{" "}
                            {order.delivery_area}
                          </p>
                          <p>
                            <strong>Total Amount Payable:</strong> ₦
                            {order.total}
                          </p>
                          <p>
                            <strong>Payment Status:</strong>{" "}
                            {order.payment_status}
                          </p>

                          <h6 className="mt-3">Cart Items</h6>
                          <table className="table table-bordered table-sm mt-2">
                            <thead className="table-light">
                              <tr>
                                <th>Item Name</th>
                                <th>Quantity</th>
                                <th>Price</th>
                              </tr>
                            </thead>
                            <tbody>
                              {cartItems.map((item, idx) => (
                                <tr key={idx}>
                                  <td>{item?.name}</td>
                                  <td>{item?.quantity}</td>
                                  <td>₦{item?.price}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      );
                    })
                  )}

                  {/* Pagination Controls */}
                  {pagination && (
                    <div className="d-flex justify-content-between mt-3">
                      <button
                        className="btn btn-outline-primary"
                        disabled={pagination.current_page === 1}
                        onClick={() => fetchOrders(pagination.current_page - 1)}
                      >
                        Previous
                      </button>
                      <span className="align-self-center">
                        Page {pagination.current_page} of {pagination.last_page}
                      </span>
                      <button
                        className="btn btn-outline-primary"
                        disabled={
                          pagination.current_page === pagination.last_page
                        }
                        onClick={() => fetchOrders(pagination.current_page + 1)}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProfilePage;
