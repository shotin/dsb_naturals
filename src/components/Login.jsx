import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HTTP } from "../utils";
import { getGuestSessionId } from "../utils/guestSession";
import PasswordField from "./PasswordField";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (event) => {
    event.preventDefault(); setLoading(true); setError("");
    try {
      const { data } = await HTTP.post("/login", { email, password, guest_session_id: getGuestSessionId() });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("storefront:updated"));
      navigate(location.state?.from || "/profile", { replace: true });
    } catch (exception) {
      setError(exception.response?.data?.message || "We could not sign you in. Check your details and try again.");
    } finally { setLoading(false); }
  };

  return <form className="auth-form" onSubmit={submit}>
    <label>Email address<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
    <PasswordField label="Password" autoComplete="current-password" minLength={1} value={password} onChange={(event) => setPassword(event.target.value)} />
    <div className="auth-options"><label className="auth-checkbox"><input type="checkbox" /> Remember me</label><Link to="/forgot-password">Forgot password?</Link></div>
    {error && <p className="auth-error" role="alert">{error}</p>}
    <button className="button button-dark auth-submit" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</button>
    <p className="auth-switch">New to DSP Naturals? <Link to="/register">Create an account</Link></p>
  </form>;
}
