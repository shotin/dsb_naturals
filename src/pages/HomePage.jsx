import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import StoreProduct, { storeProducts } from "../components/StoreProduct";
import { HTTP } from "../utils";

const categoryImages = ["photo-1556229010-6c3f2c9ca5f8", "photo-1608248543803-ba4f8c70ae0b", "photo-1601049541289-9b1b7bbbfe19", "photo-1601049541289-9b1b7bbbfe19"];
const reveal = { initial: { opacity: 0, y: 22 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.12 }, transition: { duration: 0.55, ease: "easeOut" } };

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [slides, setSlides] = useState([]);
  const [quote, setQuote] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    storeProducts(HTTP).then(setProducts).catch(() => setProducts([]));
    HTTP.get("/categories").then((res) => {
      const payload = res?.data?.data || res?.data?.categories || res?.data || [];
      setCategories((Array.isArray(payload) ? payload : []).filter((item) => item.name?.toLowerCase() !== "all"));
    }).catch(() => setCategories([]));
    HTTP.get("/homepage-content").then(({ data }) => { setSlides(data?.slides || []); setQuote(data?.quote || null); }).catch(() => {});
  }, []);
  useEffect(() => {
    if (slides.length < 2) return undefined;
    const timer = window.setInterval(() => setActiveSlide((current) => (current + 1) % slides.length), 6000);
    return () => window.clearInterval(timer);
  }, [slides.length]);
  useEffect(() => { if (activeSlide >= slides.length) setActiveSlide(0); }, [activeSlide, slides.length]);

  const slide = slides[activeSlide];
  const changeSlide = (step) => setActiveSlide((current) => (current + step + slides.length) % slides.length);

  return <div className="storefront"><Navbar /><main>
    {slide && <motion.section className="hero-section" aria-label="Featured collection" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <motion.div className="hero-copy" key={slide.id} initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55 }}>
        <span className="eyebrow">{slide.eyebrow}</span><h1>{slide.title}<br /><em>{slide.accent_title}</em></h1><p>{slide.subtitle}</p>
        <Link className="button button-dark" to={slide.cta_url || "/shop"}>{slide.cta_label || "Shop now"} <span>↗</span></Link>
        <div className="hero-note"><span>✳</span> Your skin, your pace, your kind of beautiful.</div>
      </motion.div>
      <motion.div className="hero-image" key={`${slide.id}-image`} initial={{ opacity: 0, scale: 1.035 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}><img src={slide.image_url} alt={slide.title} /><div className="hero-image-tag">A softer kind of self-care<br /><b>Made for every day</b></div></motion.div>
      {slides.length > 1 && <><div className="hero-index">{String(activeSlide + 1).padStart(2, "0")} <span>—</span> {String(slides.length).padStart(2, "0")}</div><div className="hero-controls"><button type="button" aria-label="Previous slide" onClick={() => changeSlide(-1)}><FaArrowLeft /></button><div>{slides.map((item, index) => <button key={item.id} type="button" aria-label={`Show slide ${index + 1}`} aria-current={index === activeSlide} className={index === activeSlide ? "is-active" : ""} onClick={() => setActiveSlide(index)} />)}</div><button type="button" aria-label="Next slide" onClick={() => changeSlide(1)}><FaArrowRight /></button></div></>}
    </motion.section>}

    <motion.section className="trust-strip" {...reveal}><span>Thoughtful selection</span><i>✳</i><span>Everyday beauty</span><i>✳</i><span>Confidence first</span><i>✳</i><span>Made for your routine</span></motion.section>

    <section className="section-wrap category-section">
      <div className="section-heading"><div><span className="eyebrow">Find your ritual</span><h2>Shop by category</h2></div><Link to="/categories" className="category-view-toggle">View more categories ↗</Link></div>
      <div className="category-cards">{categories.slice(0, 5).map((item, index) => <motion.div key={item.id} whileHover={{ y: -7 }} transition={{ duration: 0.22 }} variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}><Link className={`category-card category-card-${index + 1}`} to={`/shop?category=${encodeURIComponent(item.id)}`}><img src={item.image || `https://images.unsplash.com/${categoryImages[index % categoryImages.length]}?auto=format&fit=crop&w=600&q=85`} alt={item.name} /><div><span>0{index + 1} / COLLECTION</span><h3>{item.name}</h3><p>Thoughtfully chosen for your everyday ritual</p></div><b>↗</b></Link></motion.div>)}</div>
    </section>

    <motion.section className="section-wrap picks-section" {...reveal}>
      <div className="section-heading"><div><span className="eyebrow">Your next favourites</span><h2>Serenity picks</h2></div><Link to="/shop" className="text-link">Shop all products ↗</Link></div>
      {products.length ? <div className="product-grid">{products.slice(0, 4).map((product) => <StoreProduct key={product.id} product={product} />)}</div> : <div className="empty-products"><span>✳</span><h3>Beautiful things are on their way</h3><p>Our collection is being refreshed. Check back soon.</p></div>}
    </motion.section>

    <motion.section className="story-banner" {...reveal}><img src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1500&q=85" alt="A woman enjoying her skincare routine" /><div><span className="eyebrow">A little more you</span><h2>Feel good in<br /><em>your own skin.</em></h2><p>We believe the best routine is the one that makes you feel cared for. Discover the products that meet you where you are.</p><Link to="/about" className="button button-light">Get to know us ↗</Link></div></motion.section>

    {quote && <motion.section className="section-wrap quote-section" {...reveal}><span className="eyebrow">Kind words, happy skin</span><h2>“{quote.quote}”</h2><p>— {quote.attribution}</p></motion.section>}
  </main><Footer /></div>;
};
export default HomePage;
