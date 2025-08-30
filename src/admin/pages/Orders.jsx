// src/admin/pages/Orders.jsx
import { useEffect, useState } from "react";
import { HTTP } from "../../utils"; // your axios instance
import { toast } from "react-toastify";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const response = await HTTP.get(`/admin/orders?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data.data);
      setPagination({
        current: response.data.current_page,
        last: response.data.last_page,
        next: response.data.next_page_url,
        prev: response.data.prev_page_url,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handlePageChange = (url) => {
    if (!url) return;
    const page = new URL(url).searchParams.get("page");
    fetchOrders(page);
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  return (
    <div>
      <h2>Orders</h2>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Phone Number</th>
            <th>Address</th>
            <th>Delivery Area</th>
            <th>Total</th>
            <th>Status</th>
            <th>Reference</th>
            <th>Items</th>
            <th>Created Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{`${o.first_name} ${o.last_name}`}</td>
              <td>{o.phone_number}</td>
              <td>{o.address}</td>
              <td>{o.delivery_area}</td>
              <td>₦{Number(o.total).toLocaleString()}</td>
              <td>{o.payment_status}</td>
              <td>{o.payment_reference}</td>
              <td>
                <ul className="mb-0">
                  {Array.isArray(o.cart_items)
                    ? o.cart_items.map((item) => (
                        <li key={item.id}>
                          {item.name} - ₦{Number(item.price).toLocaleString()} (x
                          {item.quantity})
                        </li>
                      ))
                    : Object.values(o.cart_items || {}).map((item) => (
                        <li key={item.id}>
                          {item.name} - ₦{Number(item.price).toLocaleString()} (x
                          {item.quantity})
                        </li>
                      ))}
                </ul>
              </td>
              <td>{new Date(o.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <nav>
        <ul className="pagination">
          <li className={`page-item ${!pagination.prev ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(pagination.prev)}
            >
              &laquo; Previous
            </button>
          </li>

          {Array.from({ length: pagination.last }, (_, i) => i + 1).map(
            (num) => (
              <li
                key={num}
                className={`page-item ${
                  num === pagination.current ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => fetchOrders(num)}
                >
                  {num}
                </button>
              </li>
            )
          )}

          <li className={`page-item ${!pagination.next ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(pagination.next)}
            >
              Next &raquo;
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Orders;
