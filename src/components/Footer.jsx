import { useState } from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";
import { images } from "../constants";
import { HTTP } from "../utils";
import { toast } from "sonner";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [newsletterMode, setNewsletterMode] = useState("subscribe");
  const [newsletterBusy, setNewsletterBusy] = useState(false);
  const subscribe = async (e) => {
    e.preventDefault(); setNewsletterBusy(true);
    try {
      const { data } = await HTTP.post(newsletterMode === "unsubscribe" ? "/newsletter/unsubscribe" : "/newsletter/subscribe", { email });
      toast.success(data.message);
      if (newsletterMode === "subscribe") setEmail("");
      setSubscribed(newsletterMode === "subscribe");
    } catch (error) { toast.error(error.response?.data?.message || "We could not update your newsletter preference."); }
    finally { setNewsletterBusy(false); }
  };
  return <footer className="site-footer">
    <section className="newsletter-band"><div><span className="eyebrow">DSP NATURALS NOTES</span><h2>A little glow in<br/><em>your inbox.</em></h2><p>New arrivals, skincare favourites, and small reminders to care for you.</p></div><div className="newsletter-signup"><form onSubmit={subscribe}><label className="sr-only" htmlFor="newsletter-email">Your email address</label><input id="newsletter-email" type="email" required placeholder="Your email address" value={email} onChange={(e) => setEmail(e.target.value)}/><button type="submit" disabled={newsletterBusy}>{newsletterBusy ? "Please wait…" : newsletterMode === "unsubscribe" ? "Unsubscribe" : subscribed ? "You’re subscribed" : "Join the list ↗"}</button></form><button type="button" className="newsletter-mode-toggle" onClick={() => setNewsletterMode((mode) => mode === "subscribe" ? "unsubscribe" : "subscribe")}>{newsletterMode === "subscribe" ? "Already subscribed? Unsubscribe" : "Back to newsletter signup"}</button></div></section>
    <div className="footer-main"><div className="footer-brand"><Link to="/" className="footer-logo"><img src={images.dspLogo} alt="DSP Naturals" /></Link><p>Thoughtfully selected skincare and beauty essentials for your everyday ritual.</p><div className="footer-social"><a href="https://www.instagram.com/dsp_naturals" aria-label="Instagram"><FaInstagram/></a><a href="https://www.tiktok.com/@dsp_naturals" aria-label="TikTok"><FaTiktok/></a><a href="https://wa.me/2347064548729" aria-label="WhatsApp"><FaWhatsapp/></a></div></div>
      <div><h3>Explore</h3><Link to="/shop">Shop all</Link><Link to="/wishlist">Your wishlist</Link><Link to="/about">Our story</Link></div><div><h3>Customer care</h3><p className="footer-address">No. 157, Agric Bus Stop,<br/>Ikorodu, Lagos, Nigeria</p><Link to="/contact">Contact us</Link><Link to="/contact">Delivery information</Link><Link to="/contact">Returns & support</Link></div><div><h3>Information</h3><Link to="/terms">Terms &amp; conditions</Link><Link to="/privacy">Privacy policy</Link><a href="tel:+2347064548729">0706 454 8729</a></div>
    </div><div className="footer-bottom"><span>© {new Date().getFullYear()} DSP Naturals. All rights reserved.</span><span>Care made for everyday.</span></div>
  </footer>;
};
export default Footer;
