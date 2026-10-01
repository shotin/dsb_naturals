import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PrivacyPage() {
  return <div className="storefront"><Navbar/><main className="legal-page"><span className="eyebrow">Your information, handled with care</span><h1>Privacy Policy</h1><p className="legal-intro">This policy describes how DSP Naturals uses information you provide while browsing, ordering or contacting us.</p>
    <section><h2>Information we collect</h2><p>We collect information you submit, such as your name, email, phone number, delivery details and messages. We also keep order details, account preferences, product reviews and basic browsing activity used to power account features such as recently viewed products.</p></section>
    <section><h2>How we use it</h2><p>We use this information to process and deliver orders, manage your account, respond to requests, send account verification or password reset codes, and provide newsletter updates when you subscribe.</p></section>
    <section><h2>Payments and service providers</h2><p>Payments are handled by Paystack. We share only the information needed with payment, email and delivery providers to complete the service. Card details are handled by the payment provider and are not stored by DSP Naturals.</p></section>
    <section><h2>Your choices and account security</h2><p>You may update your profile details, unsubscribe from marketing emails using the newsletter preferences, and request help with your account through our contact page. We use reasonable safeguards to protect account and order information.</p></section>
    <section><h2>Cookies and policy updates</h2><p>The website may use browser storage and similar technologies to remember your cart, wishlist and session. We may update this policy as the website changes. Continued use after a change means you have seen the revised policy.</p></section>
  </main><Footer/></div>;
}
