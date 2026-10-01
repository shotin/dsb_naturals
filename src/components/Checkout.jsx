import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { HTTP } from "../utils";
import { imageFor, money } from "./StoreProduct";
import { getGuestSessionId } from "../utils/guestSession";

const emptyForm = {
  email: "",
  phone_number: "",
  first_name: "",
  last_name: "",
  address: "",
};

const Checkout = () => {
  const [cart, setCart] = useState({});
  const [deliveryAreas, setDeliveryAreas] = useState([]);
  const [delivery, setDelivery] = useState("");
  const [user, setUser] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editingDetails, setEditingDetails] = useState(true);
  const [saveAddress, setSaveAddress] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      setCart(JSON.parse(localStorage.getItem("cart") || "{}"));
    } catch {
      setCart({});
    }

    let storedUser = null;
    try {
      storedUser = JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      storedUser = null;
    }

    if (storedUser) {
      setUser(storedUser);
      setForm({
        ...emptyForm,
        ...storedUser,
        address: storedUser.primary_address || storedUser.address || "",
      });
      setDelivery(storedUser.primary_delivery_area || "");
      setSaveAddress(Boolean(storedUser.primary_address));
      setEditingDetails(!storedUser.primary_address);
    }

    const token = localStorage.getItem("token");
    const requests = [
      HTTP.get("/delivery-areas")
        .then(({ data }) => {
          const areas = data?.delivery_areas || [];
          setDeliveryAreas(areas);
          setDelivery((current) => current || areas[0]?.name || "");
        })
        .catch(() => setError("Delivery options could not be loaded. Please refresh and try again.")),
    ];

    if (token) {
      requests.push(
        HTTP.get("/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then(({ data }) => {
            const profile = data?.user;
            if (!profile) return;
            const currentUser = { ...(storedUser || {}), ...profile };
            setUser(currentUser);
            localStorage.setItem("user", JSON.stringify(currentUser));
            setForm({
              ...emptyForm,
              ...currentUser,
              address: currentUser.primary_address || "",
            });
            setDelivery((current) => currentUser.primary_delivery_area || current);
            setSaveAddress(Boolean(currentUser.primary_address));
            setEditingDetails(!currentUser.primary_address);
          })
          .catch(() => {}),
      );
    }

    Promise.all(requests).finally(() => setLoadingDetails(false));
  }, []);

  useEffect(() => {
    if (deliveryAreas.length && !deliveryAreas.some((area) => area.name === delivery)) {
      setDelivery(deliveryAreas[0].name);
    }
  }, [deliveryAreas, delivery]);

  const items = useMemo(() => Object.values(cart), [cart]);
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0),
    [items],
  );
  const deliveryFee = deliveryAreas.find((area) => area.name === delivery)?.fee || 0;
  const fee = subtotal >= 200000 ? 0 : Number(deliveryFee);
  const hasPrimaryAddress = Boolean(user?.primary_address);
  const update = (event) =>
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const { data } = await HTTP.post(
        "/checkouts",
        {
          ...form,
          delivery_area: delivery,
          save_address: Boolean(token && saveAddress),
          guest_session_id: getGuestSessionId(),
          cart_items: items.map((item) => ({
            id: item.id,
            quantity: Number(item.quantity),
          })),
        },
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
      );
      if (!data?.authorization_url) {
        throw new Error("Payment could not be started. Please try again.");
      }
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      window.location.assign(data.authorization_url);
    } catch (exception) {
      setError(
        exception.response?.data?.message ||
          exception.message ||
          "We could not start your payment. Please try again.",
      );
      setLoading(false);
    }
  };

  const contactSummary = user && (
    <div className="saved-checkout-details">
      <div>
        <span className="eyebrow">Contact details</span>
        <strong>{form.first_name} {form.last_name}</strong>
        <small>{form.email} · {form.phone_number}</small>
      </div>
      <div>
        <span className="eyebrow">Delivery address</span>
        <strong>{form.address}</strong>
        <small>{delivery}</small>
      </div>
      <button type="button" className="checkout-edit-button" onClick={() => setEditingDetails(true)}>
        Edit details
      </button>
    </div>
  );

  return (
    <div className="storefront">
      <Navbar />
      <main className="checkout-page">
        <div className="checkout-heading">
          <span className="eyebrow">Almost yours</span>
          <h1>Secure <em>checkout.</em></h1>
          <p>Guest checkout is ready. Your payment is processed securely by Paystack.</p>
        </div>
        {items.length ? (
          <form className="checkout-layout" onSubmit={submit}>
            <section className="checkout-form">
              {loadingDetails && <p className="checkout-loading">Loading your saved details…</p>}
              {user && hasPrimaryAddress && !editingDetails ? contactSummary : (
                <>
                  <h2>Contact details</h2>
                  <div className="checkout-fields">
                    <label>Email address<input type="email" name="email" value={form.email} onChange={update} required autoComplete="email" /></label>
                    <label>Phone number<input type="tel" name="phone_number" value={form.phone_number} onChange={update} required autoComplete="tel" /></label>
                  </div>
                  <h2>Delivery address</h2>
                  <div className="checkout-fields">
                    <label>First name<input name="first_name" value={form.first_name} onChange={update} required autoComplete="given-name" /></label>
                    <label>Last name<input name="last_name" value={form.last_name} onChange={update} required autoComplete="family-name" /></label>
                    <label className="field-full">Street address<input name="address" value={form.address} onChange={update} required autoComplete="street-address" /></label>
                    {user && <label className="primary-address-toggle"><input type="checkbox" checked={saveAddress} onChange={(event) => setSaveAddress(event.target.checked)} /><span>Save as my primary address for next time</span></label>}
                  </div>
                  {user && hasPrimaryAddress && <button type="button" className="checkout-edit-button checkout-use-saved" onClick={() => { setForm((current) => ({ ...current, ...user, address: user.primary_address })); setDelivery(user.primary_delivery_area || delivery); setSaveAddress(true); setEditingDetails(false); }}>Use saved details</button>}
                </>
              )}

              <h2>Delivery area</h2>
              {subtotal >= 200000 && <p className="free-delivery-note">Your order qualifies for complimentary delivery.</p>}
              <div className="delivery-options">
                {deliveryAreas.map((area) => (
                  <label key={area.id} className={delivery === area.name ? "delivery-option selected" : "delivery-option"}>
                    <input type="radio" name="delivery" value={area.name} checked={delivery === area.name} onChange={() => setDelivery(area.name)} />
                    <span>{area.name}</span>
                    <b>{subtotal >= 200000 ? "FREE" : money(area.fee)}</b>
                  </label>
                ))}
                {!loadingDetails && !deliveryAreas.length && <p className="checkout-error">No delivery areas are available right now.</p>}
              </div>
              {error && <p className="checkout-error">{error}</p>}
            </section>
            <aside className="checkout-summary">
              <h2>Your bag <small>({items.length})</small></h2>
              <div className="summary-items">
                {items.map((item) => (
                  <div className="summary-item" key={item.id}>
                    <img src={imageFor(item)} alt="" />
                    <div><b>{item.name}</b><small>Qty {item.quantity}</small></div>
                    <span>{money(Number(item.price) * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="summary-line"><span>Subtotal</span><b>{money(subtotal)}</b></div>
              <div className="summary-line"><span>Delivery</span><b>{money(fee)}</b></div>
              <div className="summary-line total"><span>Total</span><b>{money(subtotal + fee)}</b></div>
              <button type="submit" className="button button-dark pay-button" disabled={loading || loadingDetails || !deliveryAreas.length || !delivery}>
                {loading ? "Opening Paystack…" : "Continue to payment ↗"}
              </button>
              <p className="secure-note">Secure payment by Paystack · Cards, bank transfer, and more</p>
            </aside>
          </form>
        ) : (
          <div className="empty-products"><span>♡</span><h3>Your bag is empty</h3><p>Add something lovely to your bag before checking out.</p><Link className="button button-dark" to="/shop">Explore the collection ↗</Link></div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
