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
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    // get user from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);

    // fetch orders
    const token = localStorage.getItem("token");
    if (token) {
      HTTP.get("/user/checkouts", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => setOrders(res.data.checkouts || []))
        .catch((err) => console.error(err));
    }
    if (storedUser) {
      setUser(storedUser);
      setProfileData({
        first_name: storedUser.first_name || "",
        last_name: storedUser.last_name || "",
        email: storedUser.email || "",
        phone_number: storedUser.phone_number || "",
      });
    }
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

        {/* Bootstrap Tabs */}
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
                      alert("Failed to update profile");
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
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
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
              <h4>Order History</h4>
              <p>Total Orders: {orders.length}</p>

              {orders.map((order) => {
                // Ensure cart_items is always an array

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
                      <strong>Delivery Cost:</strong> ₦{order.delivery_cost}
                    </p>
                    <p>
                      <strong>Delivery Location:</strong>{" "}
                      {order.delivery_location}
                    </p>
                    <p>
                      <strong>Total Amount Payable:</strong> ₦
                      {order.total_amount}
                    </p>
                    <p>
                      <strong>Status:</strong> {order.status}
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
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProfilePage;
