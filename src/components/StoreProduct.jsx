import { useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "sonner";

export const money = (amount) => `₦${Number(amount || 0).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export const imageFor = (product) => product?.image || "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=85";

export const storeProducts = async (HTTP, params = {}) => {
  const response = await HTTP.get("/products", { params });
  const data = response?.data?.data || response?.data || [];
  return Array.isArray(data) ? data : [];
};

const StoreProduct = ({ product }) => {
  const [saved, setSaved] = useState(() => {
    try { return Boolean(JSON.parse(localStorage.getItem("wishlist") || "{}")?.[product.id]); } catch { return false; }
  });
  const addToCart = (event) => {
    event.preventDefault();
    let cart = {};
    try { cart = JSON.parse(localStorage.getItem("cart") || "{}"); } catch { cart = {}; }
    cart[product.id] = cart[product.id] ? { ...cart[product.id], quantity: Number(cart[product.id].quantity || 0) + 1 } : { ...product, image: imageFor(product), quantity: 1 };
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storefront:updated"));
    toast.success("Added to your bag");
  };
  const toggleSaved = (event) => {
    event.preventDefault();
    let wishlist = {};
    try { wishlist = JSON.parse(localStorage.getItem("wishlist") || "{}"); } catch { wishlist = {}; }
    if (wishlist[product.id]) delete wishlist[product.id]; else wishlist[product.id] = { ...product, image: imageFor(product) };
    localStorage.setItem("wishlist", JSON.stringify(wishlist)); setSaved(Boolean(wishlist[product.id]));
    window.dispatchEvent(new Event("storefront:updated"));
    toast.info(wishlist[product.id] ? "Saved to your wishlist" : "Removed from your wishlist");
  };
  return <motion.article className="beauty-product" whileHover={{ y: -5 }} transition={{ duration: 0.22, ease: "easeOut" }}><Link to={`/product/${product.id}`} className="beauty-product-link" aria-label={`View details for ${product.name}`}>
    <div className="beauty-product-image"><img src={imageFor(product)} alt={product.name} loading="lazy" /><button className={saved ? "save-product is-saved" : "save-product"} aria-label={saved ? "Remove from wishlist" : "Add to wishlist"} onClick={toggleSaved}><FaHeart /></button><Link className="quick-view fw-bolder" to={`/product/${product.id}`}>View details</Link></div>
    <Link to={`/product/${product.id}`} className="beauty-product-name">{product.name}</Link>
    <div className="beauty-product-price">{money(product.price)}</div>
    <button className="add-bag" onClick={addToCart}><FaPlus /> Add to bag</button></Link>
  </motion.article>;
};
export default StoreProduct;
