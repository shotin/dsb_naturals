import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { HTTP } from "../utils";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    HTTP.get("/categories")
      .then(({ data }) => setCategories((data || []).filter((category) => category.name?.toLowerCase() !== "all")))
      .catch(() => setCategories([]));
  }, []);

  return <div className="storefront"><Navbar /><main className="page-main all-categories-page">
    <section className="page-title-panel"><span className="eyebrow">Find your ritual</span><h1>Shop by <em>category.</em></h1><p>Explore thoughtful essentials for every step of your routine.</p></section>
    <section className="section-wrap category-section all-categories-section">
      {categories.length ? <div className="category-cards">{categories.map((category, index) => <Link className={`category-card category-card-${index + 1}`} key={category.id} to={`/shop?category=${encodeURIComponent(category.id)}`}>
        {category.image && <img src={category.image} alt={category.name} />}
        <div><h3>{category.name}</h3></div>
      </Link>)}</div> : <div className="empty-products"><h3>Categories are being prepared</h3><p>Please check back soon.</p></div>}
    </section>
  </main><Footer /></div>;
}
