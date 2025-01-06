import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  //   const { user } = useAuth();
  const token = localStorage.getItem("token");
  if (!token) {
    // user is not authenticated
    return <Navigate to="/" />;
  }
  return children;
}
