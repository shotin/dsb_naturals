import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HTTP } from "../utils";
import { getGuestSessionId } from "../utils/guestSession";
import AuthPageLayout from "../components/AuthPageLayout";
import PasswordField from "../components/PasswordField";

export default function RegisterPage() {
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", phone_number: "", password: "", password_confirmation: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async (event) => {
    event.preventDefault(); setError("");
    if (form.password !== form.password_confirmation) { setError("Your passwords do not match."); return; }
    setLoading(true);
    try {
      const { data } = await HTTP.post("/register", { ...form, "g-recaptcha-response": "storefront", guest_session_id: getGuestSessionId() });
      navigate(`/verify-registration?email=${encodeURIComponent(data.email || form.email)}`, { replace: true });
    } catch (exception) {
      const validationErrors = exception.response?.data?.errors;
      setError(validationErrors ? Object.values(validationErrors).flat().join(" ") : exception.response?.data?.message || "We could not create your account. Please try again.");
    } finally { setLoading(false); }
  };

  return <AuthPageLayout eyebrow="Join the community" title="Create an account" description="Keep your orders and favourite products together.">
    <form className="auth-form" onSubmit={submit}>
      <div className="auth-fields-two"><label>First name<input name="first_name" autoComplete="given-name" value={form.first_name} onChange={update} required /></label><label>Last name<input name="last_name" autoComplete="family-name" value={form.last_name} onChange={update} required /></label></div>
      <label>Email address<input name="email" type="email" autoComplete="email" value={form.email} onChange={update} required /></label>
      <label>Phone number<input name="phone_number" type="tel" autoComplete="tel" value={form.phone_number} onChange={update} required /></label>
      <PasswordField label="Password" autoComplete="new-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
      <PasswordField label="Confirm password" autoComplete="new-password" value={form.password_confirmation} onChange={(event) => setForm({ ...form, password_confirmation: event.target.value })} />
      {error && <p className="auth-error" role="alert">{error}</p>}
      <button className="button button-dark auth-submit" disabled={loading}>{loading ? "Creating account…" : "Create account"}</button>
      <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
    </form>
  </AuthPageLayout>;
}
