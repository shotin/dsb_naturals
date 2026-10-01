import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function AuthPageLayout({ eyebrow = "Your account", title, description, children }) {
  return <div className="storefront"><Navbar /><main className="auth-page"><div className="auth-card">
    <Link to="/" className="auth-back">← Back to the store</Link>
    <span className="eyebrow">{eyebrow}</span><h1>{title}</h1>{description && <p className="auth-description">{description}</p>}
    {children}
  </div></main><Footer /></div>;
}
