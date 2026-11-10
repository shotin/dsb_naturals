import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft, FaHeart, FaPlus, FaSearchPlus, FaTimes, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { HTTP } from "../utils";
import StoreProduct, { imageFor, money, storeProducts } from "../components/StoreProduct";

const SingleProduct = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewSummary, setReviewSummary] = useState({ average: 0, count: 0 });
  const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 });

  useEffect(() => {
    HTTP.get(`/products/${productId}`).then((res) => setProduct(res.data?.data || res.data)).catch(() => setProduct(null)).finally(() => setLoading(false));
  }, [productId]);

  useEffect(() => {
    if (!product) return;
    storeProducts(HTTP, { category_id: product.category_id, per_page: 100 }).then((items) => setRelatedProducts(items.filter((item) => item.id !== product.id))).catch(() => setRelatedProducts([]));
    HTTP.get(`/products/${product.id}/reviews`).then(({ data }) => { setReviews(data?.reviews?.data || []); setReviewSummary({ average: data?.average || 0, count: data?.count || 0 }); }).catch(() => {});
    let history = [];
    try { history = JSON.parse(localStorage.getItem("recentlyViewedProducts") || "[]"); } catch { history = []; }
    const recent = [product, ...history.filter((item) => item.id !== product.id)].slice(0, 12);
    localStorage.setItem("recentlyViewedProducts", JSON.stringify(recent));
    setRecentProducts(recent.filter((item) => item.id !== product.id).slice(0, 8));
    const token = localStorage.getItem("token");
    if (token) {
      const auth = { headers: { Authorization: `Bearer ${token}` } };
      HTTP.post(`/user/recently-viewed/${product.id}`, {}, auth)
        .then(() => HTTP.get("/user/recently-viewed", auth))
        .then(({ data }) => {
          const serverItems = data?.products || [];
          const merged = [...serverItems, ...recent.filter((item) => item.id !== product.id && !serverItems.some((saved) => saved.id === item.id))].slice(0, 8);
          setRecentProducts(merged);
        }).catch(() => {});
    }
  }, [product]);

  useEffect(() => {
    if (!product) return;
    try { setSaved(Boolean(JSON.parse(localStorage.getItem("wishlist") || "{}")?.[product.id])); } catch { setSaved(false); }
  }, [product]);

  useEffect(() => {
    if (!zoom.active) return undefined;
    const closeOnEscape = (event) => { if (event.key === "Escape") setZoom((current) => ({ ...current, active: false })); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [zoom.active]);

  const addToBag = () => {
    let cart = {};
    try { cart = JSON.parse(localStorage.getItem("cart") || "{}"); } catch { cart = {}; }
    cart[product.id] = cart[product.id] ? { ...cart[product.id], quantity: Number(cart[product.id].quantity) + quantity } : { ...product, image: imageFor(product), quantity };
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storefront:updated"));
    toast.success("Added to your bag");
  };

  const toggleWishlist = () => {
    let wishlist = {};
    try { wishlist = JSON.parse(localStorage.getItem("wishlist") || "{}"); } catch { wishlist = {}; }
    const willSave = !wishlist[product.id];
    if (willSave) wishlist[product.id] = { ...product, image: imageFor(product) };
    else delete wishlist[product.id];
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    setSaved(willSave);
    window.dispatchEvent(new Event("storefront:updated"));
    toast[willSave ? "success" : "info"](willSave ? "Saved to your wishlist" : "Removed from your wishlist");
  };

  const summaryDescription = product?.short_description || product?.shortDescription || product?.description?.split(/(?<=[.!?])\s+/)[0] || "A thoughtful addition to your everyday skincare and beauty routine.";

  return <div className="storefront"><Navbar /><main className="product-detail-page">
    {loading ? <div className="empty-products">Loading your product...</div> : !product ? <div className="empty-products"><h3>We couldn't find that product</h3><Link className="button button-dark" to="/shop">Back to the collection</Link></div> : <>
      <Link className="product-back" to="/shop"><FaArrowLeft /> Back to shop</Link>
      <motion.section className="product-detail" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <div className="product-detail-image" onMouseMove={(event) => { const rect = event.currentTarget.getBoundingClientRect(); setZoom((current) => ({ ...current, x: ((event.clientX - rect.left) / rect.width) * 100, y: ((event.clientY - rect.top) / rect.height) * 100 })); }} onMouseEnter={() => setZoom((current) => ({ ...current, active: true }))} onMouseLeave={() => setZoom((current) => ({ ...current, active: false }))}>
          <img src={imageFor(product)} alt={product.name} style={zoom.active ? { transformOrigin: `${zoom.x}% ${zoom.y}%`, transform: "scale(2)" } : undefined} />
          <span className="product-zoom-hint"><FaSearchPlus /> Hover to magnify</span>
        </div>
        <div className="product-detail-copy">
          <span className="eyebrow">A little care for you</span>
          <h1>{product.name}</h1>
          <div className="product-summary-meta">
            <div className="product-review-summary">
              {reviewSummary.count > 0 ? <><span className="review-stars">{Array.from({ length: 5 }, (_, index) => <FaStar key={index} className={index < Math.round(reviewSummary.average) ? "is-filled" : ""} />)}</span><span>{reviewSummary.average} <span className="product-summary-muted">({reviewSummary.count} reviews)</span></span></> : <span className="product-summary-new">New arrival</span>}
            </div>
            {product.category && <Link className="product-category-link" to={`/shop?category=${encodeURIComponent(product.category.id)}`}>{product.category.name}</Link>}
          </div>
          <div className="product-detail-price">{money(product.price)}</div>
          <p className="product-summary-description">{summaryDescription}</p>
          <div className="product-detail-stock fw-bolder">{product.stock_quantity !== null && product.stock_quantity !== undefined && Number(product.stock_quantity) < 10 ? (Number(product.stock_quantity) === 0 ? "Currently out of stock" : `Only ${product.stock_quantity} left`) : String(product.stock_status || "in stock").replaceAll("_", " ")}</div>
          <div className="detail-actions"><div className="quantity-stepper"><button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button><span>{quantity}</span><button type="button" onClick={() => setQuantity(quantity + 1)}>+</button></div><button className="button button-dark" onClick={addToBag}><FaPlus /> Add to bag</button><button className={saved ? "detail-save saved" : "detail-save"} onClick={toggleWishlist} aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}><FaHeart /></button></div><div className="detail-perks"><span>Carefully selected essentials</span><span>Secure Paystack checkout</span><span>Delivery across Lagos and beyond</span></div>
        </div>
      </motion.section>
      <section className="product-description-section"><h2>Product details</h2><p>{product.description || "A thoughtful addition to your everyday skincare and beauty ritual."}</p></section>
      {relatedProducts.length > 0 && <section className="related-products-section"><div className="section-heading"><div><span className="eyebrow">More to love</span><h2>Related products</h2></div><Link to={`/shop?category=${encodeURIComponent(product.category_id)}`}>Shop this category ↗</Link></div><div className="product-grid">{relatedProducts.slice(0, 4).map((item) => <StoreProduct key={item.id} product={item} />)}</div></section>}
      {recentProducts.length > 0 && <section className="related-products-section recently-viewed-section"><div className="section-heading"><div><span className="eyebrow">Your browsing ritual</span><h2>Recently viewed</h2></div></div><div className="product-grid">{recentProducts.slice(0, 4).map((item) => <StoreProduct key={item.id} product={item} />)}</div></section>}
      <section className="product-reviews-section"><div className="section-heading"><div><span className="eyebrow">Customer notes</span><h2>Reviews ({reviewSummary.count})</h2></div><span>{reviewSummary.average ? `${reviewSummary.average} / 5` : "Purchased products can be reviewed from Order History"}</span></div>{reviews.length ? reviews.map((review) => <article key={review.id} className="product-review-card"><div className="review-stars">{Array.from({ length: 5 }, (_, index) => <FaStar key={index} className={index < review.rating ? "is-filled" : ""} />)}</div><p>{review.review || "A verified customer shared a rating."}</p><span>{review.user?.first_name} {review.user?.last_name}</span></article>) : <p>No reviews yet. Verified buyers can leave the first one in Order History.</p>}</section>
    </>}
  </main><Footer /></div>;
};
export default SingleProduct;
