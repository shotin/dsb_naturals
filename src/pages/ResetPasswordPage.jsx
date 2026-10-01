import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { HTTP } from "../utils";
import { getGuestSessionId } from "../utils/guestSession";
import AuthPageLayout from "../components/AuthPageLayout";
import PasswordField from "../components/PasswordField";

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const submit = async (event) => {
    event.preventDefault(); setError("");
    if (password !== passwordConfirmation) { setError("Your passwords do not match."); return; }
    setLoading(true);
    try {
      const { data } = await HTTP.post("/password/reset", { email: params.get("email"), code, password, password_confirmation: passwordConfirmation, guest_session_id: getGuestSessionId() });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("storefront:updated"));
      toast.success(data.message || "Your password has been reset.");
      navigate("/profile", { replace: true });
    } catch (exception) { setError(exception.response?.data?.message || "That code is invalid or expired. Request another code."); }
    finally { setLoading(false); }
  };
  return <AuthPageLayout eyebrow="Secure password reset" title="Set a new password" description={`Enter the six-digit code sent to ${params.get("email") || "your email"}, then choose your new password.`}>
    <form className="auth-form" onSubmit={submit}>
      <label>Six-digit code<input inputMode="numeric" pattern="[0-9]{6}" maxLength="6" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))} required /></label>
      <PasswordField label="New password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} />
      <PasswordField label="Confirm new password" autoComplete="new-password" value={passwordConfirmation} onChange={(event) => setPasswordConfirmation(event.target.value)} />
      {error && <p className="auth-error" role="alert">{error}</p>}
      <button className="button button-dark auth-submit" disabled={loading}>{loading ? "Updating…" : "Reset password and sign in"}</button>
    </form>
  </AuthPageLayout>;
}
