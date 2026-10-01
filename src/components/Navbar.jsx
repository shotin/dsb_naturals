import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaChevronDown,
  FaHeart,
  FaSearch,
  FaShoppingBag,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { images } from "../constants";
import { HTTP } from "../utils";

const readCount = (key) => {
  try {
    return Object.keys(JSON.parse(localStorage.getItem(key)) || {}).length;
  } catch {
    return 0;
  }
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(readCount("cart"));
  const [wishlistCount, setWishlistCount] = useState(readCount("wishlist"));
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null"),
  );
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const sync = () => {
      setCartCount(readCount("cart"));
      setWishlistCount(readCount("wishlist"));
      setUser(JSON.parse(localStorage.getItem("user") || "null"));
    };
    window.addEventListener("storage", sync);
    window.addEventListener("storefront:updated", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("storefront:updated", sync);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!searchOpen || !searchTerm.trim()) {
      setSearchResults([]);
      return undefined;
    }
    let active = true;
    setSearching(true);
    const timer = window.setTimeout(() => {
      HTTP.get("/products", {
        params: { search: searchTerm.trim(), per_page: 6 },
      })
        .then((response) => {
          if (active) setSearchResults(response.data?.data || []);
        })
        .catch(() => {
          if (active) setSearchResults([]);
        })
        .finally(() => {
          if (active) setSearching(false);
        });
    }, 220);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [searchOpen, searchTerm]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsOpen(false);
    setAccountOpen(false);
    navigate("/");
  };

  return (
    <>
      <div className="announcement">
        A little glow goes a long way{" "}
        <span>Complimentary Lagos delivery on orders over ₦100,000</span>
      </div>
      <header
        className={isOpen ? "site-header mobile-menu-open" : "site-header"}
      >
        <button
          className="mobile-menu icon-button"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
        <Link to="/" className="brand-lockup">
          <img src={images.dspLogo} alt="DSP Naturals" />
        </Link>
        <nav
          id="storefront-mobile-nav"
          className={isOpen ? "main-nav is-open" : "main-nav"}
        >
          <div className="mobile-nav-head">
            <div>
              <span>DSP NATURALS</span>
              <strong>Hi, {user?.first_name || "there"}</strong>
              <small>
                {user
                  ? "Your beauty, all in one place"
                  : "Find your everyday ritual"}
              </small>
            </div>
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setIsOpen(false)}
            >
              <FaTimes />
            </button>
          </div>
          <div className="mobile-nav-links">
            <NavLink to="/" end onClick={() => setIsOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/shop" onClick={() => setIsOpen(false)}>
              Shop
            </NavLink>
            <NavLink to="/about" onClick={() => setIsOpen(false)}>
              Our story
            </NavLink>
            <NavLink to="/contact" onClick={() => setIsOpen(false)}>
              Contact
            </NavLink>
          </div>
          {user ? (
            <div className="mobile-account-links">
              <span className="mobile-account-label">YOUR ACCOUNT</span>
              <Link to="/profile" onClick={() => setIsOpen(false)}>
                Account overview
              </Link>
              <Link
                to="/profile?section=orders"
                onClick={() => setIsOpen(false)}
              >
                Orders
              </Link>
              <Link
                to="/profile?section=reviews"
                onClick={() => setIsOpen(false)}
              >
                Pending reviews
              </Link>
              <Link to="/wishlist" onClick={() => setIsOpen(false)}>
                Wishlist
              </Link>
              <Link
                to="/profile?section=recent"
                onClick={() => setIsOpen(false)}
              >
                Recently viewed
              </Link>
              <Link
                to="/profile?section=newsletter"
                onClick={() => setIsOpen(false)}
              >
                Newsletter preferences
              </Link>
              <button type="button" onClick={logout}>
                Sign out
              </button>
            </div>
          ) : (
            <Link
              className="mobile-drawer-signin"
              to="/login"
              onClick={() => setIsOpen(false)}
            >
              <FaUser /> Sign in to your account
            </Link>
          )}
        </nav>
        <div className="header-actions">
          <button
            type="button"
            className="icon-button search-action"
            aria-label="Search products"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <FaSearch />
          </button>
          <Link to="/wishlist" className="icon-button" aria-label="Wishlist">
            <FaHeart />
            <i>{wishlistCount}</i>
          </Link>
          <Link to="/cart" className="icon-button" aria-label="Shopping bag">
            <FaShoppingBag />
            <i>{cartCount}</i>
          </Link>
          {user ? (
            <div className="header-account">
              <button
                type="button"
                onClick={() => setAccountOpen((open) => !open)}
                className="header-login text-white fw-bolder"
                aria-expanded={accountOpen}
              >
                <FaUser /> <span>Hi, {user.first_name || "there"}</span>
                <FaChevronDown className="account-chevron" />
              </button>
              {accountOpen && (
                <div className="header-account-menu">
                  <Link to="/profile" onClick={() => setAccountOpen(false)}>
                    Account overview
                  </Link>
                  <Link
                    to="/profile?section=orders"
                    onClick={() => setAccountOpen(false)}
                  >
                    Orders
                  </Link>
                  <Link
                    to="/profile?section=reviews"
                    onClick={() => setAccountOpen(false)}
                  >
                    Pending reviews
                  </Link>
                  <Link to="/wishlist" onClick={() => setAccountOpen(false)}>
                    Wishlist
                  </Link>
                  <Link
                    to="/profile?section=recent"
                    onClick={() => setAccountOpen(false)}
                  >
                    Recently viewed
                  </Link>
                  <Link
                    to="/profile?section=newsletter"
                    onClick={() => setAccountOpen(false)}
                  >
                    Newsletter preferences
                  </Link>
                  <button type="button" onClick={logout}>
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="header-login text-white fw-bolder">
              <FaUser /> <span>Sign in</span>
            </Link>
          )}
        </div>
      </header>
      {isOpen && (
        <button
          type="button"
          className="mobile-nav-backdrop"
          aria-label="Close navigation menu"
          onClick={() => setIsOpen(false)}
        />
      )}
      {searchOpen && (
        <section className="search-panel">
          <div className="search-panel-inner">
            <label className="search-field">
              <FaSearch />
              <input
                autoFocus
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search any product…"
                aria-label="Search any product"
              />
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false);
                  setSearchTerm("");
                }}
              >
                Close
              </button>
            </label>
            {searchTerm.trim() && (
              <div className="search-results">
                {searching ? (
                  <p>Searching the collection…</p>
                ) : searchResults.length ? (
                  searchResults.map((product) => (
                    <Link
                      to={`/product/${product.id}`}
                      key={product.id}
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchTerm("");
                      }}
                    >
                      <img
                        src={
                          product.image ||
                          "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=120&q=80"
                        }
                        alt=""
                      />
                      <span>{product.name}</span>
                      <b>
                        ₦{Number(product.price || 0).toLocaleString("en-NG")}
                      </b>
                    </Link>
                  ))
                ) : (
                  <p>No products found. Try a different search.</p>
                )}
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
};
export default Navbar;
