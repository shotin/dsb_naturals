import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { HTTP } from "../utils";

export default function PaymentResultPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("checking");
  const [orderNo, setOrderNo] = useState("");

  useEffect(() => {
    const reference = params.get("reference") || params.get("trxref");
    if (!reference) { setStatus("unknown"); return undefined; }
    let active = true;
    let timer;
    const check = async () => {
      try {
        const { data } = await HTTP.get(`/payment/result?reference=${encodeURIComponent(reference)}`);
        if (!active) return;
        const nextStatus = data.status || "pending";
        setStatus(nextStatus);
        setOrderNo(data.order_no || "");
        if (nextStatus === "paid") {
          localStorage.removeItem("cart");
          window.dispatchEvent(new Event("storefront:updated"));
          window.clearInterval(timer);
        } else if (["failed", "cancelled"].includes(nextStatus)) {
          window.clearInterval(timer);
          navigate(`/payment-cancelled?order=${encodeURIComponent(data.order_no || "")}`, { replace: true });
        }
      } catch { if (active) setStatus("unknown"); }
    };
    check();
    timer = window.setInterval(check, 4000);
    const timeout = window.setTimeout(() => window.clearInterval(timer), 45000);
    return () => { active = false; window.clearInterval(timer); window.clearTimeout(timeout); };
  }, [params, navigate]);

  const paid = status === "paid";
  return <div className="storefront"><Navbar /><main className="payment-result"><span className="eyebrow">{paid ? "Payment complete" : "Payment update"}</span><div className="payment-result-mark">{paid ? "✓" : "…"}</div><h1>{paid ? "Thank you for your order." : status === "unknown" ? "We couldn’t confirm this payment." : "We’re confirming your payment."}</h1><p>{paid ? `Your payment has been confirmed${orderNo ? ` for order ${orderNo}` : ""}. A receipt will be sent to your email.` : status === "unknown" ? "Please check your order status or contact us if you were charged." : "Please wait while we confirm your payment securely with Paystack."}</p><Link to="/shop" className="button button-dark">Continue shopping ↗</Link></main><Footer /></div>;
}
