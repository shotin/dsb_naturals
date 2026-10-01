import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function TermsPage() {
  return <div className="storefront"><Navbar/><main className="legal-page"><span className="eyebrow">DSP Naturals</span><h1>Terms &amp; Conditions</h1><p className="legal-intro">These terms explain the basics of shopping with DSP Naturals. By placing an order or using this website, you agree to them.</p>
    <section><h2>Orders and payment</h2><p>Prices and product availability are shown on the website and may change. Your order is confirmed after checkout and successful payment through Paystack. We may contact you if an item becomes unavailable or we need to clarify your order.</p></section>
    <section><h2>Delivery</h2><p>Delivery options, estimated timing and charges are shown during checkout. Delivery times are estimates and may be affected by location, courier availability or circumstances outside our control.</p></section>
    <section><h2>Returns and product care</h2><p>If there is a problem with an order, contact us with your order details so we can review it. For hygiene and safety, opened personal-care products may not be eligible for return unless they arrived damaged or incorrect.</p></section>
    <section><h2>Product information</h2><p>We work to keep product descriptions, images and prices accurate. Product images are illustrative; packaging may vary. Product information is not a substitute for advice from a qualified healthcare professional.</p></section>
    <section><h2>Website use and contact</h2><p>Please use the website lawfully and provide accurate information when ordering. We may update these terms as our services change. For questions, use the contact page.</p></section>
  </main><Footer/></div>;
}
