import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HTTP } from "../../utils";
import images from "../../constants/images";
import "../../assets/css/admin.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault(); setError(""); setLoading(true);
    try {
      const { data } = await HTTP.post("/login", { email, password });
      if (data.message !== "Login successful") throw new Error(data.message || "Invalid credentials");
      localStorage.setItem("token", data.token); localStorage.setItem("user", JSON.stringify(data.user)); navigate("/admin-naturals-dsp");
    } catch (err) { setError(err.response?.data?.message || err.message || "Unable to sign in. Please try again."); }
    finally { setLoading(false); }
  };
  return <main className="admin-login-page">
    <section className="admin-login-aside"><img src={images.dspLogo} alt="DSP Naturals" /><div><span className="admin-top-kicker">YOUR STORE, IN GOOD HANDS</span><h1>Thoughtful care.<br/>Thoughtful business.</h1><p>Manage your catalogue, orders and customer experience from one calm workspace.</p></div><span className="admin-top-kicker">DSP NATURALS · STORE ADMINISTRATION</span></section>
    <section className="admin-login-form-wrap"><form className="admin-login-card" onSubmit={handleSubmit}><span className="eyebrow">WELCOME BACK</span><h2>Admin sign in</h2><p>Sign in to continue to your store dashboard.</p>{error && <div className="alert alert-danger" role="alert">{error}</div>}<div className="mb-3"><label htmlFor="admin-email" className="form-label">Email address</label><input id="admin-email" type="email" className="form-control" autoComplete="username" placeholder="admin@example.com" value={email} onChange={e=>setEmail(e.target.value)} required disabled={loading}/></div><div className="mb-4"><label htmlFor="admin-password" className="form-label">Password</label><input id="admin-password" type="password" className="form-control" autoComplete="current-password" placeholder="Enter your password" value={password} onChange={e=>setPassword(e.target.value)} required disabled={loading}/></div><button className="btn btn-primary w-100" type="submit" disabled={loading}>{loading ? "Signing in…" : "Sign in to dashboard"}</button><div className="admin-login-note">Access is limited to authorized store administrators.</div></form></section>
  </main>;
}
