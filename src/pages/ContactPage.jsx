import { FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const address = "NO 157, AGRIC BUS STOP, IKORODU, LAGOS, NIGERIA";
const ContactPage = () => <div className="storefront"><Navbar/><main className="page-main contact-page"><div className="page-title-panel compact"><span className="eyebrow">We’re here for you</span><h1>Let’s <em>connect.</em></h1><p>Questions about your order or finding the right essentials? We’d love to hear from you.</p></div>
  <div className="contact-layout"><section className="contact-details"><h2>Get in touch</h2><p>Reach out and our team will be happy to help.</p><a href="tel:+2347064548729"><FaPhoneAlt/><span><small>Call us</small>0706 454 8729</span></a><a href="https://wa.me/2347064548729" target="_blank" rel="noreferrer"><FaWhatsapp/><span><small>Chat with us</small>WhatsApp support</span></a><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`} target="_blank" rel="noreferrer"><FaMapMarkerAlt/><span><small>Visit us</small>{address}</span></a></section>
  <div className="map-frame"><iframe title="DSP Naturals location in Ikorodu, Lagos" src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade"/><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`} target="_blank" rel="noreferrer">Open in Google Maps ↗</a></div></div>
</main><Footer/></div>;
export default ContactPage;
