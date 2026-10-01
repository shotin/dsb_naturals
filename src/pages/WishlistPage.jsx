import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import StoreProduct from "../components/StoreProduct";

const WishlistPage = () => {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const sync = () => { try { setItems(Object.values(JSON.parse(localStorage.getItem("wishlist") || "{}"))); } catch { setItems([]); } };
    sync(); window.addEventListener("storefront:updated", sync); window.addEventListener("storage", sync);
    return () => { window.removeEventListener("storefront:updated", sync); window.removeEventListener("storage", sync); };
  }, []);
  return <div className="storefront"><Navbar/><main className="page-main"><div className="page-title-panel compact"><span className="eyebrow">Saved for later</span><h1>Your <em>wishlist.</em></h1><p>A little collection of things you love.</p></div>{items.length ? <div className="product-grid shop-grid">{items.map((p) => <StoreProduct key={p.id} product={p}/>)}</div> : <div className="empty-products"><span>♡</span><h3>Your wishlist is waiting for a little love</h3><p>Save the pieces that feel right for you.</p><Link className="button button-dark" to="/shop">Explore the collection ↗</Link></div>}</main><Footer/></div>;
};
export default WishlistPage;
