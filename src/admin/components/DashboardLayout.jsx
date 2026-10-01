import { useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaChartLine, FaImages, FaBoxOpen, FaTags, FaClipboardList, FaUsers, FaSignOutAlt, FaTimes, FaTruck } from "react-icons/fa";
import images from "../../constants/images";
import "../../assets/css/admin.css";

const links = [
  ["/admin-naturals-dsp", "Overview", FaChartLine, true],
  ["/admin-naturals-dsp/homepage", "Homepage slides", FaImages],
  ["/admin-naturals-dsp/products", "Products", FaBoxOpen],
  ["/admin-naturals-dsp/categories", "Categories", FaTags],
  ["/admin-naturals-dsp/orders", "Orders", FaClipboardList],
  ["/admin-naturals-dsp/delivery-areas", "Delivery areas", FaTruck],
  ["/admin-naturals-dsp/users", "Customers", FaUsers],
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin-naturals-dsp/login");
  };

  return <div className="admin-app">
    {menuOpen && <button className="admin-scrim" aria-label="Close menu" onClick={() => setMenuOpen(false)} />}
    <aside className={`admin-sidebar ${menuOpen ? "is-open" : ""}`}>
      <div className="admin-brand"><img src={images.dspLogo} alt="DSP Naturals" /><button className="admin-mobile-close" onClick={() => setMenuOpen(false)} aria-label="Close menu"><FaTimes /></button></div>
      <div className="admin-nav-label">STORE MANAGEMENT</div>
      <nav>{links.map(([to, label, Icon, exact]) => <NavLink key={to} to={to} end={exact} onClick={() => setMenuOpen(false)} className={({ isActive }) => `admin-nav-link ${isActive && (exact ? location.pathname === to : true) ? "active" : ""}`}><Icon /><span>{label}</span></NavLink>)}</nav>
      <div className="admin-sidebar-bottom"><div className="admin-user-chip"><span className="admin-avatar">{(user.first_name || user.name || "A").slice(0, 1).toUpperCase()}</span><span><b>{user.first_name || user.name || "Store admin"}</b><small>Administrator</small></span></div><button className="admin-logout" onClick={handleLogout}><FaSignOutAlt /> Sign out</button></div>
    </aside>
    <main className="admin-main">
      <header className="admin-topbar"><button className="admin-menu-toggle" onClick={() => setMenuOpen(true)} aria-label="Open menu"><FaBars /></button><div><span className="admin-top-kicker">DSP NATURALS · ADMIN</span><strong>{links.find(([to, , , exact]) => exact ? location.pathname === to : location.pathname.startsWith(to))?.[1] || "Store management"}</strong></div><span className="admin-top-status"><i /> Store workspace</span></header>
      <div className="admin-content"><Outlet /></div>
    </main>
  </div>;
}
