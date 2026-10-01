import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import StoreProduct, { storeProducts } from "../components/StoreProduct";
import { HTTP } from "../utils";
import { motion } from "framer-motion";

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [params] = useSearchParams();
  const [category, setCategory] = useState(params.get("category") || "all");
  useEffect(() => {
    HTTP.get("/categories").then((res) => setCategories(res?.data || [])).catch(() => setCategories([]));
  }, []);
  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(() => {
      storeProducts(HTTP, { search: query, per_page: 100 })
        .then((items) => { if (active) setProducts(items); })
        .catch(() => { if (active) setProducts([]); });
    }, query ? 220 : 0);
    return () => { active = false; window.clearTimeout(timer); };
  }, [query]);
  const filtered = useMemo(() => {
    const matchingCategory = categories.find((item) => item.name?.toLowerCase() === category.toLowerCase());
    const categoryId = matchingCategory?.id || category;
    const items = products.filter((p) => (category === "all" || String(p.category_id) === String(categoryId) || String(p.category?.name || "").toLowerCase() === category.toLowerCase()) && p.name?.toLowerCase().includes(query.toLowerCase()));
    if (sort === "price-low") items.sort((a,b) => Number(a.price)-Number(b.price));
    if (sort === "price-high") items.sort((a,b) => Number(b.price)-Number(a.price));
    if (sort === "name") items.sort((a,b) => a.name.localeCompare(b.name));
    return items;
  }, [products, categories, category, query, sort]);
  return <div className="storefront"><Navbar /><motion.main className="page-main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}><div className="page-title-panel"><span className="eyebrow">The collection</span><h1>Find your <em>feel-good.</em></h1><p>Everyday essentials, thoughtfully picked for your skin and your routine.</p></div>
    <div className="shop-toolbar"><div><span className="eyebrow">{filtered.length} products</span><h2>Shop all</h2></div><div className="shop-controls"><input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the collection" aria-label="Search products"/><select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by category"><option value="all">All categories</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select><select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products"><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name</option></select></div></div>
    {filtered.length ? <motion.div className="product-grid shop-grid" initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.045 } } }}>{filtered.map((product) => <motion.div key={product.id} variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}><StoreProduct product={product}/></motion.div>)}</motion.div> : <div className="empty-products"><span>✳</span><h3>{products.length ? "No products match your search" : "The shelves are being prepared"}</h3><p>{products.length ? "Try another name or category." : "Please check back soon for the collection."}</p></div>}
  </motion.main><Footer /></div>;
};
export default ShopPage;
