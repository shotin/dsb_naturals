import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HTTP } from "../utils";
import AuthPageLayout from "../components/AuthPageLayout";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const submit = async (event) => {
    event.preventDefault(); setLoading(true); setError("");
    try {
      await HTTP.post("/password/forgot", { email });
      navigate(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (exception) { setError(exception.response?.data?.message || "We could not send the reset code. Please try again shortly."); }
    finally { setLoading(false); }
  };
  return <AuthPageLayout eyebrow="Account help" title="Reset your password" description="Enter your account email and we’ll send a one-time reset code.">
    <form className="auth-form" onSubmit={submit}><label>Email address<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>{error && <p className="auth-error" role="alert">{error}</p>}<button className="button button-dark auth-submit" disabled={loading}>{loading ? "Sending…" : "Send reset code"}</button><p className="auth-switch"><Link to="/login">Back to sign in</Link></p></form>
  </AuthPageLayout>;
}
