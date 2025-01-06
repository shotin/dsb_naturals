import { useState } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaTiktok,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import "../assets/css/footer.css";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const currentYear = new Date().getFullYear();

  const handleSubscription = (e) => {
    e.preventDefault();
    if (email) {
      setMessage("Thank you for subscribing!");
      setEmail("");
      setTimeout(() => setMessage(""), 5000);
    } else {
      setMessage("Please enter a valid email address.");
    }
  };

  const phoneNumber = "2347064548729";
  const address =
    "NO 1, REMILEKUN STREET, FIRST GATE, IKORODU, LAGOS STATE, NIGERIA";

  return (
    <footer className="footer">
      <div className="container text-center">
        <div className="footer-content">
          {/* Social Media Links */}
          <div className="social-icons mb-4">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <FaTwitter />
            </a>
            <a
              href="https://www.instagram.com/dsp_naturals"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <FaInstagram />
            </a>

            <a
              href="https://www.tiktok.com/dsp_naturals"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <FaTiktok />
            </a>
          </div>

          {/* Contact Us Section */}
          <div className="contact-us mb-4 fw-bolder">
            <h5 className="fw-bolder">CONTACT US</h5>
            <p>
              <a
                className="text-white"
                href={`tel:${phoneNumber}`}
                style={{ textDecoration: "none" }}
              >
                <FaPhoneAlt /> 07064548729
              </a>
            </p>
            <p>
              <a
                className="text-white"
                href={`https://www.google.com/maps?q=${encodeURIComponent(
                  address
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <FaMapMarkerAlt /> {address}
              </a>
            </p>
          </div>

          {/* Newsletter Subscription */}
          <div className="newsletter fw-bolder">
            <h5>Subscribe to our Newsletter</h5>
            <form onSubmit={handleSubscription} className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="newsletter-input"
                required
              />
              <button
                type="submit"
                className="newsletter-button text-dark fw-bolder"
              >
                Subscribe
              </button>
            </form>
            {message && <p className="message">{message}</p>}
          </div>

          {/* Copyright */}
          <p className="footer-text fw-bolder">
            &copy; {currentYear} DSP NATURAL. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
