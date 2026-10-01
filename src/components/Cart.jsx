import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { toast } from "sonner";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { imageFor, money } from "./StoreProduct";

const Cart = () => {
  const [cart, setCart] = useState({});
  const navigate = useNavigate();
  useEffect(() => { try { setCart(JSON.parse(localStorage.getItem("cart") || "{}")); } catch { setCart({}); } }, []);
  const items = useMemo(() => Object.values(cart), [cart]);
  const total = items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
  const updateCart = (next) => { setCart(next); localStorage.setItem("cart", JSON.stringify(next)); window.dispatchEvent(new Event("storefront:updated")); };
  const change = (id, delta) => { const next = { ...cart }; if (!next[id]) return; next[id] = { ...next[id], quantity: Number(next[id].quantity) + delta }; if (next[id].quantity <= 0) delete next[id]; updateCart(next); };
  const remove = (id) => {
    const item = cart[id];
    if (!item) return;
    toast.custom((toastId) => <div className="dsp-toast-confirm">
      <p>Remove {item.name} from your bag?</p>
      <div className="dsp-toast-confirm-actions">
        <button type="button" className="dsp-toast-confirm-delete" onClick={() => { const next = { ...cart }; delete next[id]; updateCart(next); toast.dismiss(toastId); toast.success("Item removed from your bag"); }}>Remove item</button>
        <button type="button" className="dsp-toast-confirm-cancel" onClick={() => toast.dismiss(toastId)}>Keep item</button>
      </div>
    </div>, { duration: Infinity });
  };
  return <div className="storefront"><Navbar/><main className="cart-page"><div className="cart-heading"><span className="eyebrow">A good choice</span><h1>Your <em>bag.</em></h1><p>{items.length ? `${items.length} lovely ${items.length === 1 ? "find" : "finds"} for your routine.` : "Your next favourite is waiting to be found."}</p></div>
    {items.length ? <div className="cart-layout"><section className="cart-items">{items.map((item) => <article className="cart-item" key={item.id}><img src={imageFor(item)} alt={item.name}/><div className="cart-item-info"><Link to={`/product/${item.id}`}>{item.name}</Link><span>{money(item.price)}</span><div className="quantity-stepper"><button onClick={() => change(item.id, -1)} aria-label="Decrease quantity">−</button><span>{item.quantity}</span><button onClick={() => change(item.id, 1)} aria-label="Increase quantity">+</button></div></div><div className="cart-item-total"><b>{money(Number(item.price) * item.quantity)}</b><button onClick={() => remove(item.id)} aria-label="Remove item"><FaTrash/></button></div></article>)}</section><aside className="cart-summary"><h2>Order summary</h2><div className="summary-line"><span>Subtotal</span><b>{money(total)}</b></div><div className="summary-line"><span>Delivery</span><span>Calculated at checkout</span></div><div className="summary-line total"><span>Total</span><b>{money(total)}</b></div><button className="button button-dark" onClick={() => navigate("/checkout")}>Continue to checkout ↗</button><p>Secure payment with Paystack</p><Link to="/shop">Continue shopping</Link></aside></div> : <div className="empty-products"><span>♡</span><h3>Your bag is taking a quiet moment</h3><p>Explore the collection and find something lovely.</p><Link className="button button-dark" to="/shop">Explore the collection ↗</Link></div>}
  </main><Footer/></div>;
};
export default Cart;
