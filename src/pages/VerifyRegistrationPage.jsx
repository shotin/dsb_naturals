import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { HTTP } from "../utils";
import { getGuestSessionId } from "../utils/guestSession";
import AuthPageLayout from "../components/AuthPageLayout";

export default function VerifyRegistrationPage() {
  const [params] = useSearchParams();
  const [email, setEmail] = useState(params.get("email") || "");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const verify = async (event) => {
    event.preventDefault(); setError(""); setLoading(true);
    try {
      const { data } = await HTTP.post("/register/verify-otp", { email, code, guest_session_id: getGuestSessionId() });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("storefront:updated"));
      navigate("/profile", { replace: true });
    } catch (exception) { setError(exception.response?.data?.message || "That code is invalid or expired."); }
    finally { setLoading(false); }
  };
  const resend = async () => {
    setError(""); setMessage("");
    try { const { data } = await HTTP.post("/register/resend-otp", { email }); setMessage(data.message); }
    catch (exception) { setError(exception.response?.data?.message || "Could not resend the code yet. Please wait and try again."); }
  };
  return <AuthPageLayout eyebrow="One last step" title="Verify your email" description={`Enter the six-digit code sent to ${email || "your email address"}.`}>
    <form className="auth-form" onSubmit={verify}><label>Email address<input readOnly type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><label>Six-digit code<input inputMode="numeric" pattern="[0-9]{6}" maxLength="6" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))} required /></label>{error && <p className="auth-error" role="alert">{error}</p>}{message && <p className="auth-success" role="status">{message}</p>}<button className="button button-dark auth-submit" disabled={loading}>{loading ? "Verifying…" : "Verify and sign in"}</button><button className="button button-light auth-resend" type="button" onClick={resend}>Resend verification code</button></form>
  </AuthPageLayout>;
}
