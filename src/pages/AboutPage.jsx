import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AboutPage = () => <div className="storefront"><Navbar/><main className="page-main about-page">
  <section className="about-hero"><div><span className="eyebrow">Our story</span><h1>Care should feel<br/><em>like coming home.</em></h1><p>DSP Naturals is here to make choosing your skincare feel simpler, warmer, and a little more joyful. We bring together everyday beauty essentials chosen with care for real routines and real people.</p><Link className="button button-dark" to="/shop">Meet your new favourites ↗</Link></div><img src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1200&q=85" alt="A joyful skincare moment"/></section>
  <section className="values-section"><span className="eyebrow">What matters to us</span><h2>The DSP Naturals feeling</h2><div className="values-grid"><article><b>01</b><h3>Thoughtful selection</h3><p>A considered edit of skincare and beauty essentials, selected to fit naturally into your day.</p></article><article className="value-highlight"><b>02</b><h3>Everyday care</h3><p>Self-care can be simple. We make it easier to find products you’ll reach for again and again.</p></article><article><b>03</b><h3>Confidence first</h3><p>Your skin is yours. Our aim is to help you feel informed, comfortable, and good in it.</p></article></div></section>
  <section className="about-cta"><span className="eyebrow">Your next favourite might be here</span><h2>Make room for a<br/><em>little more glow.</em></h2><Link className="button button-light" to="/shop">Shop the collection ↗</Link></section>
</main><Footer/></div>;
export default AboutPage;
