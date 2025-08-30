// src/admin/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { HTTP } from "../../utils";

const Dashboard = () => {
  const [counts, setCounts] = useState({
    total_users: 0,
    total_products: 0,
    total_categories: 0,
    total_orders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token"); // get token from localStorage

        const response = await HTTP.get("admin/count", {
          headers: {
            Authorization: `Bearer ${token}`, // attach token
          },
        });

        setCounts({
          total_users: response.data.total_users,
          total_products: response.data.total_products,
          total_categories: response.data.total_categories,
          total_orders: response.data.total_orders || 0,
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

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

  return (
    <div>
      <h2>Dashboard</h2>
      <div className="row mt-4">
        <div className="col-md-3 mb-3">
          <div className="card text-white bg-primary">
            <div className="card-body">
              <h5 className="card-title">Total Products</h5>
              <p className="card-text">{counts.total_products}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-white bg-success">
            <div className="card-body">
              <h5 className="card-title">Total Categories</h5>
              <p className="card-text">{counts.total_categories}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-white bg-warning">
            <div className="card-body">
              <h5 className="card-title">Total Orders</h5>
              <p className="card-text">{counts.total_orders}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-white bg-danger">
            <div className="card-body">
              <h5 className="card-title">Total Users</h5>
              <p className="card-text">{counts.total_users}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
