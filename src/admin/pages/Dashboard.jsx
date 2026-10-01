import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBoxOpen, FaClipboardList, FaArrowUp, FaArrowRight, FaCoins, FaTags } from "react-icons/fa";
import { HTTP } from "../../utils";
import "../../assets/css/admin-dashboard.css";
import "../../assets/css/admin-dashboard-links.css";

const money = (value) => `NGN ${Number(value || 0).toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    HTTP.get("admin/count", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
      .then(({ data: result }) => setData(result))
      .catch((err) => setError(err.response?.data?.message || "Could not load store analytics."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="admin-loading">Loading store overview…</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  const days = data?.sales_by_day || [];
  const maxRevenue = Math.max(...days.map((day) => day.revenue), 1);
  const metrics = [
    { label: "Gross revenue", value: money(data?.paid_revenue), note: `This month ${money(data?.revenue_this_month)}`, Icon: FaCoins },
    { label: "Orders", value: data?.total_orders || 0, note: `${data?.pending_orders || 0} awaiting payment`, Icon: FaClipboardList, to: "/admin-naturals-dsp/orders" },
    { label: "Products", value: data?.total_products || 0, note: `${data?.low_stock_products?.length || 0} with low stock`, Icon: FaBoxOpen, to: "/admin-naturals-dsp/products" },
    { label: "Categories", value: data?.total_categories || 0, note: "Manage product categories", Icon: FaTags, to: "/admin-naturals-dsp/categories" },
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-page-heading">
        <div><h2>Good to see you</h2><p>Here’s how your store is doing today.</p></div>
        <span className="admin-dashboard-date">{new Date().toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span>
      </div>
      <div className="row g-3 mb-4">
        {metrics.map(({ label, value, note, Icon, to }) => {
          const content = <><div className="admin-metric-icon"><Icon /></div><small>{label}</small><strong>{value}</strong><span>{note}</span></>;
          return <div className="col-12 col-sm-6 col-xl-3" key={label}>{to ? <Link to={to} className="admin-metric-card admin-metric-link">{content}</Link> : <article className="admin-metric-card">{content}</article>}</div>;
        })}
      </div>
      <div className="row g-3 mb-4">
        <div className="col-xl-8">
          <section className="admin-panel h-100">
            <div className="admin-panel-heading"><div><h3>Sales activity</h3><p>Paid revenue and order volume · last 7 days</p></div><span className="admin-trend-pill"><FaArrowUp /> 7 days</span></div>
            <div className="admin-chart">{days.map((day) => <div className="admin-chart-column" key={day.date} title={`${day.label}: ${money(day.revenue)} · ${day.orders} orders`}><strong>{day.revenue ? money(day.revenue) : ""}</strong><div className="admin-chart-bar" style={{ height: `${Math.max(5, day.revenue / maxRevenue * 100)}%` }} /><span>{day.label}</span></div>)}</div>
          </section>
        </div>
        <div className="col-xl-4">
          <section className="admin-panel h-100">
            <div className="admin-panel-heading"><div><h3>Inventory watch</h3><p>Products with fewer than 10 units</p></div><Link to="/admin-naturals-dsp/products" className="admin-inline-link">View stock <FaArrowRight /></Link></div>
            {data?.low_stock_products?.length ? <div className="admin-stock-list">{data.low_stock_products.map((product) => <div key={product.id}><span className="admin-stock-dot" /><span className="admin-stock-name"><b>{product.name}</b><small>{product.category?.name || "Uncategorized"}</small></span><strong className={product.stock_quantity < 5 ? "critical" : ""}>{product.stock_quantity} left</strong></div>)}</div> : <div className="admin-empty-small">Inventory looks healthy. Low stock items will appear here.</div>}
          </section>
        </div>
      </div>
      <section className="admin-panel">
        <div className="admin-panel-heading"><div><h3>Recent orders</h3><p>Latest activity across your store</p></div><Link to="/admin-naturals-dsp/orders" className="admin-inline-link">All orders <FaArrowRight /></Link></div>
        <div className="table-responsive"><table className="table"><thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Status</th><th className="text-end">Total</th></tr></thead><tbody>
          {(data?.recent_orders || []).map((order) => <tr key={order.id}><td><Link className="admin-dashboard-order-link" to="/admin-naturals-dsp/orders">{order.order_no || `DSP-${String(order.id).padStart(3, "0")}`}</Link></td><td>{order.first_name} {order.last_name}</td><td>{new Date(order.created_at).toLocaleDateString()}</td><td><span className={`admin-status status-${String(order.payment_status).toLowerCase()}`}>{order.payment_status}</span></td><td className="text-end">{money(order.total)}</td></tr>)}
          {!data?.recent_orders?.length && <tr><td colSpan="5" className="text-center py-4 text-muted">No orders to show yet.</td></tr>}
        </tbody></table></div>
      </section>
    </div>
  );
}
