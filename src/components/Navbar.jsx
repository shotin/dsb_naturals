import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { images } from "../constants";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import BModal from "./BModal/BModal";
import Login from "./Login";

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState(() => {
    // Get cart from localStorage or default to an empty array
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    return savedCart ? Object.values(savedCart) : [];
  });

  const [cartLength, setCartLength] = useState(cart.length);

  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const cartFromStorage = JSON.parse(localStorage.getItem("cart")) || {};
      setCart(Object.values(cartFromStorage));
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setCartLength(cart.length);
  }, [cart]);

  return (
    <>
      <nav className="app__bg-home navbar navbar-expand-md navbar-dark position-absolute mb-5 top-0 right-0 p-3 me-4 w-100">
        <div className="container d-flex justify-content-between align-items-center">
          <div
            className="d-flex align-items-center"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            <img
              src={images.logo}
              alt="Luminé Naturals Logo"
              className="w-10 h-10 rounded-circle"
              style={{ maxWidth: "40px", maxHeight: "40px" }}
            />
            <span className="ms-2 fw-bolder text-xl">
              DSP <br /> NATURAL
            </span>
          </div>

          <div className="d-flex ms-auto align-items-center app__collection">
            <div
              className="cart-icon me-3 position-relative"
              onClick={() => navigate("/cart")}
            >
              <FaShoppingCart
                className="text-light"
                style={{ fontSize: "1.5rem", cursor: "pointer" }}
              />
              {cartLength > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartLength}
                </span>
              )}
            </div>

            <div className="profile-icon me-3">
              <FaUserCircle
                className="text-light"
                style={{ fontSize: "1.5rem", cursor: "pointer" }}
              />
            </div>

            <div onClick={handleOpen} className="login-text btn btn-light">
              <a
                style={{ textDecoration: "none" }}
                className="text-dark fw-bolder"
              >
                Login
              </a>
            </div>
          </div>
        </div>
      </nav>
      <BModal keyboard={false} show={isOpen} onHide={handleClose} size="md">
        <Login onClose={handleClose} />
      </BModal>
    </>
  );
};

export default Navbar;
