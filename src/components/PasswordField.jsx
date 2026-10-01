import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function PasswordField({ label, value, onChange, autoComplete, minLength = 8 }) {
  const [visible, setVisible] = useState(false);
  return <label className="auth-password-field">{label}<span><input type={visible ? "text" : "password"} autoComplete={autoComplete} minLength={minLength} value={value} onChange={onChange} required /><button type="button" onClick={() => setVisible((shown) => !shown)} aria-label={visible ? "Hide password" : "Show password"}>{visible ? <FaEyeSlash /> : <FaEye />}</button></span></label>;
}
