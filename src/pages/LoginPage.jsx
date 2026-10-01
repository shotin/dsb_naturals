import { useLocation } from "react-router-dom";
import AuthPageLayout from "../components/AuthPageLayout";
import Login from "../components/Login";

export default function LoginPage() {
  const location = useLocation();
  return <AuthPageLayout eyebrow="Welcome back" title="Sign in" description="Sign in to view your orders and saved favourites.">{location.state?.message && <p className="auth-success">{location.state.message}</p>}<Login /></AuthPageLayout>;
}
