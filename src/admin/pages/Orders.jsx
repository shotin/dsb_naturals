import { useEffect, useState } from "react";
import { FaBoxOpen, FaTimes } from "react-icons/fa";
import { toast } from "sonner";
import { HTTP } from "../../utils";
import "../../assets/css/admin-order-drawer.css";

const money = (value) => `NGN ${Number(value || 0).toLocaleString("en-NG")}`;
const stages = ["ongoing", "shipped", "delivered"];
const dateTime = (value) => value
  ? new Date(value).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })
  : "Waiting for update";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState("summary");
  const [statusDraft, setStatusDraft] = useState("ongoing");
  const [savingStatus, setSavingStatus] = useState(false);

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const response = await HTTP.get(`/admin/orders?page=${page}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setOrders(response.data.data);
      setPagination({
        current: response.data.current_page,
        last: response.data.last_page,
        next: response.data.next_page_url,
        prev: response.data.prev_page_url,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  useEffect(() => {
    if (!selectedOrder) return undefined;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event) => { if (event.key === "Escape") setSelectedOrder(null); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [selectedOrder]);

  const openOrder = (order) => {
    setSelectedOrder(order);
    setStatusDraft(order.order_status || "ongoing");
    setActiveTab("summary");
  };

  const changePage = (url) => {
    if (!url) return;
    fetchOrders(new URL(url).searchParams.get("page"));
  };

  const saveStatus = async () => {
    if (!selectedOrder || savingStatus) return;
    setSavingStatus(true);
    try {
      const { data } = await HTTP.patch(
        `/admin/orders/${selectedOrder.id}/status`,
        { status: statusDraft },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
      );
      setSelectedOrder(data.order);
      setStatusDraft(data.order.order_status);
      setOrders((current) => current.map((order) => order.id === data.order.id ? data.order : order));
      toast.success("Order status updated.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update the order status.");
    } finally {
      setSavingStatus(false);
    }
  };

  const items = selectedOrder
    ? (Array.isArray(selectedOrder.cart_items) ? selectedOrder.cart_items : Object.values(selectedOrder.cart_items || {}))
    : [];
  const history = selectedOrder?.status_history || [];
  const currentStageIndex = stages.indexOf(selectedOrder?.order_status || "ongoing");
  const allowedStages = stages.slice(Math.max(0, currentStageIndex), Math.max(1, currentStageIndex + 2));

  return (
    <div>
      <div className="admin-page-heading">
        <div><h2>Orders</h2><p>Review payments, delivery details and purchased items.</p></div>
        <span className="admin-order-total">{orders.length} orders on this page</span>
      </div>
      {loading ? <div className="admin-loading">Loading orders…</div> : (
        <div className="card"><div className="table-responsive">
          <table className="table admin-orders-table">
            <thead><tr><th>Order</th><th>Customer</th><th>Phone</th><th>Delivery area</th><th>Total</th><th>Payment</th><th>Order status</th><th>Created</th><th /></tr></thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td><strong>{order.order_no || `DSP-${String(order.id).padStart(3, "0")}`}</strong></td>
                  <td>{order.first_name} {order.last_name}</td>
                  <td>{order.phone_number}</td>
                  <td>{order.delivery_area}</td>
                  <td>{money(order.total)}</td>
                  <td><span className={`admin-status status-${String(order.payment_status).toLowerCase()}`}>{order.payment_status}</span></td>
                  <td><span className={`admin-order-stage stage-${order.order_status || "ongoing"}`}>{order.order_status || "ongoing"}</span></td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td><button type="button" className="admin-view-order" onClick={() => openOrder(order)}>View order</button></td>
                </tr>
              ))}
              {!orders.length && <tr><td colSpan="9" className="text-center py-4 text-muted">No orders to show yet.</td></tr>}
            </tbody>
          </table>
        </div></div>
      )}

      <nav className="mt-3" aria-label="Orders pages">
        <ul className="pagination">
          <li className={`page-item ${!pagination.prev ? "disabled" : ""}`}><button className="page-link" onClick={() => changePage(pagination.prev)}>« Previous</button></li>
          {Array.from({ length: pagination.last || 0 }, (_, index) => index + 1).map((page) => <li key={page} className={`page-item ${page === pagination.current ? "active" : ""}`}><button className="page-link" onClick={() => fetchOrders(page)}>{page}</button></li>)}
          <li className={`page-item ${!pagination.next ? "disabled" : ""}`}><button className="page-link" onClick={() => changePage(pagination.next)}>Next »</button></li>
        </ul>
      </nav>

      {selectedOrder && (
        <div className="admin-order-drawer-layer" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedOrder(null); }}>
          <aside className="admin-order-drawer" role="dialog" aria-modal="true" aria-labelledby="admin-order-drawer-title">
            <header className="admin-order-drawer-head">
              <div><span className="admin-top-kicker">ORDER DETAILS</span><h2 id="admin-order-drawer-title">{selectedOrder.order_no || `DSP-${String(selectedOrder.id).padStart(3, "0")}`}</h2></div>
              <button type="button" onClick={() => setSelectedOrder(null)} aria-label="Close order details"><FaTimes /></button>
            </header>
            <div className="admin-order-tabs" role="tablist" aria-label="Order information">
              <button type="button" role="tab" aria-selected={activeTab === "summary"} className={activeTab === "summary" ? "active" : ""} onClick={() => setActiveTab("summary")}>Summary</button>
              <button type="button" role="tab" aria-selected={activeTab === "items"} className={activeTab === "items" ? "active" : ""} onClick={() => setActiveTab("items")}>Items <span>{items.length}</span></button>
            </div>
            <div className="admin-order-drawer-body">
              {activeTab === "summary" ? (
                <>
                  <section className="admin-order-section">
                    <div className="admin-order-section-heading"><div><span className="admin-top-kicker">FULFILLMENT</span><h3>Order progress</h3></div><span className={`admin-order-stage stage-${selectedOrder.order_status || "ongoing"}`}>{selectedOrder.order_status || "ongoing"}</span></div>
                    <div className="admin-order-status-editor"><label htmlFor="order-status">Update order status</label><select id="order-status" value={statusDraft} onChange={(event) => setStatusDraft(event.target.value)}>{allowedStages.map((stage) => <option value={stage} key={stage}>{stage[0].toUpperCase() + stage.slice(1)}</option>)}</select><button type="button" className="btn btn-primary" onClick={saveStatus} disabled={savingStatus || statusDraft === selectedOrder.order_status || (statusDraft !== "ongoing" && selectedOrder.payment_status !== "paid")}>{savingStatus ? "Saving…" : "Save status"}</button></div>
                    <ol className="admin-order-timeline">{stages.map((stage) => { const event = history.find((entry) => entry.status === stage); const reached = stages.indexOf(selectedOrder.order_status || "ongoing") >= stages.indexOf(stage); return <li className={reached ? "reached" : ""} key={stage}><span className="admin-timeline-dot" /><div><strong>{stage[0].toUpperCase() + stage.slice(1)}</strong><small>{event ? new Date(event.created_at).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" }) : "Not reached yet"}</small></div></li>; })}</ol>
                  </section>
                  <section className="admin-order-section"><span className="admin-top-kicker">CUSTOMER AND DELIVERY</span><h3>Customer information</h3><dl className="admin-order-info"><div><dt>Name</dt><dd>{selectedOrder.first_name} {selectedOrder.last_name}</dd></div><div><dt>Email</dt><dd>{selectedOrder.email}</dd></div><div><dt>Phone</dt><dd>{selectedOrder.phone_number}</dd></div><div><dt>Street address</dt><dd>{selectedOrder.address}</dd></div><div><dt>Delivery area</dt><dd>{selectedOrder.delivery_area}</dd></div></dl></section>
                  <section className="admin-order-section"><span className="admin-top-kicker">PAYMENT SUMMARY</span><h3>Order totals</h3><dl className="admin-order-totals"><div><dt>Payment status</dt><dd><span className={`admin-status status-${String(selectedOrder.payment_status).toLowerCase()}`}>{selectedOrder.payment_status}</span></dd></div><div><dt>Subtotal</dt><dd>{money(selectedOrder.subtotal)}</dd></div><div><dt>Delivery fee</dt><dd>{money(selectedOrder.delivery_cost)}</dd></div><div className="grand-total"><dt>Order total</dt><dd>{money(selectedOrder.total)}</dd></div><div><dt>Payment reference</dt><dd>{selectedOrder.payment_reference || "—"}</dd></div></dl></section>
                </>
              ) : (
                <section className="admin-order-section admin-order-products"><span className="admin-top-kicker">PURCHASED ITEMS</span><h3>{items.length} {items.length === 1 ? "item" : "items"}</h3>{items.map((item, index) => <article className="admin-order-product" key={`${item.id}-${index}`}><span className="admin-order-product-icon"><FaBoxOpen /></span><div><strong>{item.name}</strong><small>Qty {item.quantity} · {money(item.price)} each</small></div><b>{money(Number(item.price) * Number(item.quantity))}</b></article>)}</section>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
