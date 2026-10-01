import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  FaBoxOpen,
  FaClock,
  FaHeart,
  FaRegUser,
  FaStar,
  FaUserCircle,
} from "react-icons/fa";
import { Spinner } from "react-bootstrap";
import { toast } from "sonner";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { HTTP } from "../utils";
import { imageFor, money } from "../components/StoreProduct";

const SECTIONS = [
  { id: "overview", label: "Account overview", icon: FaRegUser },
  { id: "orders", label: "Orders", icon: FaBoxOpen },
  { id: "reviews", label: "Pending reviews", icon: FaStar },
  { id: "recent", label: "Recently viewed", icon: FaClock },
  { id: "newsletter", label: "Newsletter preferences", icon: FaRegUser },
];
const ORDER_STAGES = ["ongoing", "shipped", "delivered"];

function OrderReviewForm({ item, onSubmit }) {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  return (
    <form
      className="account-review-form"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(item.id, rating, review);
      }}
    >
      <label>
        Rating{" "}
        <select
          value={rating}
          onChange={(event) => setRating(Number(event.target.value))}
        >
          {[5, 4, 3, 2, 1].map((value) => (
            <option key={value} value={value}>
              {value} stars
            </option>
          ))}
        </select>
      </label>
      <textarea
        value={review}
        onChange={(event) => setReview(event.target.value)}
        maxLength={2000}
        placeholder="Share your experience (optional)"
      />
      <button className="account-primary-button" type="submit">
        Submit review
      </button>
    </form>
  );
}

export default function ProfilePage() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null"),
  );
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [recentProducts, setRecentProducts] = useState([]);
  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
  });
  const [active, setActive] = useState(params.get("section") || "overview");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newsletterBusy, setNewsletterBusy] = useState(false);
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const loadOrders = async () => {
    try {
      const { data } = await HTTP.get("/user/checkouts?per_page=100", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const fetched = data?.checkouts?.data || [];
      setOrders(fetched);
      setExpandedOrderId((current) => current ?? fetched[0]?.id ?? null);
    } catch {
      toast.error("We could not load your orders.");
    }
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user") || "null");
    if (stored) {
      setUser(stored);
      setProfileData({
        first_name: stored.first_name || "",
        last_name: stored.last_name || "",
        email: stored.email || "",
        phone_number: stored.phone_number || "",
      });
    }
    const auth = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    let localRecent = [];
    try {
      localRecent = JSON.parse(
        localStorage.getItem("recentlyViewedProducts") || "[]",
      );
    } catch {
      localRecent = [];
    }
    setRecentProducts(localRecent);
    Promise.all([
      loadOrders(),
      HTTP.get("/user/recently-viewed", auth)
        .then(({ data }) => {
          const server = data?.products || [];
          setRecentProducts(
            [
              ...server,
              ...localRecent.filter(
                (item) => !server.some((saved) => saved.id === item.id),
              ),
            ].slice(0, 20),
          );
        })
        .catch(() => {}),
      HTTP.get("/user/newsletter-preference", auth)
        .then(({ data }) => setNewsletterSubscribed(Boolean(data?.subscribed)))
        .catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!SECTIONS.some((section) => section.id === active))
      setActive("overview");
    setParams({ section: active }, { replace: true });
  }, [active]);
  useEffect(() => {
    const section = params.get("section");
    if (section && SECTIONS.some((item) => item.id === section))
      setActive(section);
  }, [params]);

  const allItems = useMemo(
    () =>
      orders.flatMap((order) =>
        Object.values(order.cart_items || {}).map((item) => ({
          ...item,
          order,
        })),
      ),
    [orders],
  );
  const pendingReviews = allItems.filter(
    (item) => item.review_eligible && !item.reviewed,
  );

  const submitReview = async (productId, rating, review) => {
    try {
      await HTTP.post(
        `/user/products/${productId}/reviews`,
        { rating, review },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      setOrders((current) =>
        current.map((order) => ({
          ...order,
          cart_items: Object.values(order.cart_items || {}).map((item) =>
            item.id === productId ? { ...item, reviewed: true } : item,
          ),
        })),
      );
      toast.success("Thank you for sharing your review.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Could not submit your review.",
      );
    }
  };

  const updateProfile = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const { data } = await HTTP.put(
        `/users/${user.id}/profile`,
        profileData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("storefront:updated"));
      toast.success("Your account details have been updated.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Could not update your details.",
      );
    } finally {
      setSaving(false);
    }
  };

  const updateNewsletter = async (subscribe) => {
    setNewsletterBusy(true);
    try {
      const { data } = await HTTP.post(
        subscribe ? "/newsletter/subscribe" : "/newsletter/unsubscribe",
        { email: user.email },
      );
      setNewsletterSubscribed(subscribe);
      toast.success(data.message);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Could not update your newsletter preference.",
      );
    } finally {
      setNewsletterBusy(false);
    }
  };

  const changeSection = (section) => {
    if (section === "wishlist") {
      navigate("/wishlist");
      return;
    }
    setActive(section);
  };

  const pageTitle =
    SECTIONS.find((section) => section.id === active)?.label ||
    "Account overview";

  return (
    <div className="storefront">
      <Navbar />
      <main className="account-page">
        <div className="account-welcome">
          <div>
            <span className="eyebrow">Your DSP Naturals account</span>
            <h1>Hi, {user?.first_name || "there"}</h1>
            <p>Keep track of your orders, reviews and skincare favourites.</p>
          </div>
          <div className="account-welcome-avatar">
            <FaUserCircle />
          </div>
        </div>
        <div className="account-layout">
          <aside className="account-sidebar" aria-label="Account navigation">
            <p className="account-sidebar-title">My account</p>
            {SECTIONS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                className={active === id ? "is-active" : ""}
                onClick={() => changeSection(id)}
              >
                <Icon />
                <span>{label}</span>
                {id === "reviews" && pendingReviews.length > 0 && (
                  <b>{pendingReviews.length}</b>
                )}
              </button>
            ))}
          </aside>
          <section className="account-content">
            <header className="account-content-heading">
              <div>
                <span className="eyebrow">Welcome back</span>
                <h2>{pageTitle}</h2>
              </div>
            </header>
            {loading ? (
              <div className="account-loading">
                <Spinner animation="border" />
                <span>Loading your account…</span>
              </div>
            ) : (
              <>
                {active === "overview" && (
                  <div className="account-overview">
                    <div className="account-stat-grid">
                      <button onClick={() => changeSection("orders")}>
                        <span>Orders</span>
                        <strong>{orders.length}</strong>
                        <small>View your purchases ↗</small>
                      </button>
                      <button onClick={() => changeSection("reviews")}>
                        <span>Pending reviews</span>
                        <strong>{pendingReviews.length}</strong>
                        <small>Share your experience ↗</small>
                      </button>
                      <Link to="/wishlist">
                        <span>Saved favourites</span>
                        <strong>♡</strong>
                        <small>Open your wishlist ↗</small>
                      </Link>
                    </div>
                    <form
                      className="account-details-card"
                      onSubmit={updateProfile}
                    >
                      <div className="account-card-heading">
                        <div>
                          <span className="eyebrow">Personal information</span>
                          <h3>Account details</h3>
                        </div>
                      </div>
                      <div className="account-form-grid">
                        <label>
                          First name
                          <input
                            value={profileData.first_name}
                            onChange={(event) =>
                              setProfileData({
                                ...profileData,
                                first_name: event.target.value,
                              })
                            }
                            required
                          />
                        </label>
                        <label>
                          Last name
                          <input
                            value={profileData.last_name}
                            onChange={(event) =>
                              setProfileData({
                                ...profileData,
                                last_name: event.target.value,
                              })
                            }
                            required
                          />
                        </label>
                        <label className="account-form-wide">
                          Email address
                          <input
                            type="email"
                            value={profileData.email}
                            readOnly
                          />
                        </label>
                        <label className="account-form-wide">
                          Phone number
                          <input
                            type="tel"
                            value={profileData.phone_number}
                            onChange={(event) =>
                              setProfileData({
                                ...profileData,
                                phone_number: event.target.value,
                              })
                            }
                          />
                        </label>
                      </div>
                      <button
                        className="account-primary-button"
                        disabled={saving}
                      >
                        {saving ? "Saving…" : "Save changes"}
                      </button>
                    </form>
                    <div className="account-preference-card">
                      <div>
                        <span className="eyebrow">Stay in the loop</span>
                        <h3>Newsletter preferences</h3>
                        <p>
                          Get occasional updates about new arrivals and skincare
                          favourites.
                        </p>
                      </div>
                      <button
                        className="account-secondary-button"
                        onClick={() => changeSection("newsletter")}
                      >
                        Manage preferences
                      </button>
                    </div>
                  </div>
                )}
                {active === "orders" && (
                  <div className="account-orders">
                    {orders.length ? (
                      orders.map((order) => {
                        const expanded = expandedOrderId === order.id;
                        return (
                          <article
                            className={`account-order-card ${expanded ? "is-expanded" : ""}`}
                            key={order.id}
                          >
                            <header>
                              <button
                                className="account-order-toggle"
                                type="button"
                                aria-expanded={expanded}
                                onClick={() =>
                                  setExpandedOrderId(expanded ? null : order.id)
                                }
                              >
                                <span className="account-order-number">
                                  Order {order.order_no || `#${order.id}`}
                                </span>
                                <small>
                                  {new Date(
                                    order.created_at,
                                  ).toLocaleDateString()}{" "}
                                  ?{" "}
                                  {Object.values(order.cart_items || {}).length}{" "}
                                  item(s)
                                </small>
                              </button>
                              <div className="account-order-header-end">
                                <b
                                  className={`account-order-status status-${String(order.payment_status).toLowerCase()}`}
                                >
                                  {order.payment_status}
                                </b>
                                <span className={`account-fulfillment-status stage-${order.order_status || "ongoing"}`}>
                                  {order.order_status || "ongoing"}
                                </span>
                                <button
                                  className="account-order-chevron"
                                  type="button"
                                  aria-label={
                                    expanded
                                      ? "Hide order items"
                                      : "Show order items"
                                  }
                                  onClick={() =>
                                    setExpandedOrderId(
                                      expanded ? null : order.id,
                                    )
                                  }
                                >
                                  {expanded ? "?" : "+"}
                                </button>
                              </div>
                            </header>
                            {expanded && (
                              <>
                                <section className="account-order-tracking" aria-label="Delivery progress">
                                  <h3>Delivery progress</h3>
                                  <ol>{ORDER_STAGES.map((stage) => {
                                    const event = (order.status_history || []).find((entry) => entry.status === stage);
                                    const reached = ORDER_STAGES.indexOf(order.order_status || "ongoing") >= ORDER_STAGES.indexOf(stage);
                                    return <li className={reached ? "reached" : ""} key={stage}><span className="account-tracking-dot" /><div><strong>{stage[0].toUpperCase() + stage.slice(1)}</strong><small>{event ? new Date(event.created_at).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" }) : "Not reached yet"}</small></div></li>;
                                  })}</ol>
                                </section>
                                <div className="account-order-items">
                                  {Object.values(order.cart_items || {}).map(
                                    (item, index) => (
                                      <div
                                        className="account-order-item"
                                        key={`${order.id}-${item.id}-${index}`}
                                      >
                                        <img src={imageFor(item)} alt="" />
                                        <div>
                                          <strong>{item.name}</strong>
                                          <small>
                                            Qty {item.quantity} ?{" "}
                                            {money(item.price)}
                                          </small>
                                          {item.review_eligible &&
                                            !item.reviewed && (
                                              <OrderReviewForm
                                                item={item}
                                                onSubmit={submitReview}
                                              />
                                            )}
                                          {item.reviewed && (
                                            <small className="account-reviewed">
                                              <FaStar /> Review submitted
                                            </small>
                                          )}
                                        </div>
                                      </div>
                                    ),
                                  )}
                                </div>
                                <footer>
                                  <span>
                                    Delivery: {order.delivery_area || "?"}
                                  </span>
                                  <strong>Total {money(order.total)}</strong>
                                </footer>
                              </>
                            )}
                          </article>
                        );
                      })
                    ) : (
                      <div className="account-empty">
                        <FaBoxOpen />
                        <h3>No orders yet</h3>
                        <p>
                          Your purchases will show up here once you place an
                          order.
                        </p>
                        <Link className="account-primary-button" to="/shop">
                          Explore the collection
                        </Link>
                      </div>
                    )}
                  </div>
                )}
                {active === "reviews" && (
                  <div className="account-orders">
                    {pendingReviews.length ? (
                      pendingReviews.map((item, index) => (
                        <article
                          className="account-pending-review"
                          key={`${item.order.id}-${item.id}-${index}`}
                        >
                          <img src={imageFor(item)} alt="" />
                          <div>
                            <span className="eyebrow">
                              Order {item.order.order_no || `#${item.order.id}`}
                            </span>
                            <h3>{item.name}</h3>
                            <small>
                              Purchased{" "}
                              {new Date(
                                item.order.created_at,
                              ).toLocaleDateString()}
                            </small>
                            <OrderReviewForm
                              item={item}
                              onSubmit={submitReview}
                            />
                          </div>
                        </article>
                      ))
                    ) : (
                      <div className="account-empty">
                        <FaStar />
                        <h3>You’re all caught up</h3>
                        <p>
                          Products from paid orders will appear here when
                          they’re ready for a review.
                        </p>
                        <button
                          className="account-secondary-button"
                          onClick={() => changeSection("orders")}
                        >
                          View orders
                        </button>
                      </div>
                    )}
                  </div>
                )}
                {active === "recent" && (
                  <div className="account-product-grid">
                    {recentProducts.length ? (
                      recentProducts.map((product) => (
                        <Link
                          className="account-product-card"
                          to={`/product/${product.id}`}
                          key={product.id}
                        >
                          <img src={imageFor(product)} alt={product.name} />
                          <span>{product.name}</span>
                          <strong>{money(product.price)}</strong>
                        </Link>
                      ))
                    ) : (
                      <div className="account-empty">
                        <FaClock />
                        <h3>No recently viewed products</h3>
                        <p>Products you browse will be saved here.</p>
                        <Link className="account-secondary-button" to="/shop">
                          Browse products
                        </Link>
                      </div>
                    )}
                  </div>
                )}
                {active === "newsletter" && (
                  <div className="account-preference-page">
                    <div className="account-preference-icon">✉</div>
                    <span className="eyebrow">Your inbox, your choice</span>
                    <h3>Newsletter preferences</h3>
                    <p>
                      Choose whether you’d like to receive product news, new
                      arrivals and occasional offers from DSP Naturals. You can
                      change this any time.
                    </p>
                    <div className="account-preference-actions">
                      <button
                        disabled={newsletterBusy}
                        className="account-primary-button"
                        onClick={() => updateNewsletter(true)}
                      >
                        {newsletterBusy ? "Updating…" : "Subscribe to updates"}
                      </button>
                      <button
                        disabled={newsletterBusy}
                        className="account-secondary-button"
                        onClick={() => updateNewsletter(false)}
                      >
                        Unsubscribe
                      </button>
                    </div>
                    {newsletterSubscribed && (
                      <small className="account-reviewed">
                        You’re subscribed to DSP Naturals updates.
                      </small>
                    )}
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
