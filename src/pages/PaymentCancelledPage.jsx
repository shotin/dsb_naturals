import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { HTTP } from "../utils";

export default function PaymentCancelledPage() {
  const [params] = useSearchParams();
  const [orderNo, setOrderNo] = useState(params.get("order") || "");
  useEffect(() => {
    const order = params.get("order");
    if (!order) return;
    HTTP.get(`/payment/result?order=${encodeURIComponent(order)}&cancelled=1`).then(({ data }) => setOrderNo(data.order_no || order)).catch(() => {});
  }, [params]);
  return <div className="storefront"><Navbar /><main className="payment-result payment-cancelled"><span className="eyebrow">Payment not successful</span><div className="payment-result-mark">×</div><h1>Your payment was cancelled.</h1><p>{orderNo ? `Order ${orderNo} has not been marked as paid.` : "Your order has not been marked as paid."} No successful payment confirmation was received. You can return to the store whenever you’re ready.</p><div className="payment-result-actions"><Link to="/shop" className="button button-dark">Continue shopping ↗</Link><Link to="/" className="payment-back-link">Return home</Link></div></main><Footer /></div>;
}
