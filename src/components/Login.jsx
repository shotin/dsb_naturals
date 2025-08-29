import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import { toast } from "react-toastify";
import { HTTP } from "../utils";

// Login validation schema
const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email address").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

// Register validation schema
const registerSchema = yup.object().shape({
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email address").required("Email is required"),
  phone_number: yup.string().required("Phone number is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const Login = ({ onClose }) => {
  const [rememberMe, setRememberMe] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError, // <-- to inject backend errors
    formState: { errors },
  } = useForm({
    resolver: yupResolver(isRegister ? registerSchema : loginSchema),
  });

  const handleRememberMeChange = () => setRememberMe((prev) => !prev);

  // Handle Login / Register submit
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (isRegister) {
        await HTTP.post("/register", {
          ...data,
          "g-recaptcha-response": "test",
          role: "customer",
        });
        toast.success("Registration successful! Please login.");
        setIsRegister(false);
        reset();
      } else {
        const res = await HTTP.post("/login", data);

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        toast.success("Login successful!");
        onClose();
      }
    } catch (err) {
      if (err.response?.status === 422 && err.response.data?.errors) {
        // Loop through backend validation errors
        Object.entries(err.response.data.errors).forEach(([field, messages]) => {
          setError(field, { type: "server", message: messages[0] });
        });
      } else {
        toast.error(err.response?.data?.message || (isRegister ? "Registration failed" : "Invalid credentials"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pt-3">
      <h3 className="text-center fw-bolder mb-4">{isRegister ? "REGISTER" : "LOGIN"}</h3>

      {isRegister && (
        <>
          <div className="mb-3">
            <label className="form-label fw-bolder">First Name</label>
            <input className={`form-control ${errors.first_name ? "is-invalid" : ""}`} {...register("first_name")} />
            <div className="invalid-feedback">{errors.first_name?.message}</div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bolder">Last Name</label>
            <input className={`form-control ${errors.last_name ? "is-invalid" : ""}`} {...register("last_name")} />
            <div className="invalid-feedback">{errors.last_name?.message}</div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bolder">Phone Number</label>
            <input className={`form-control ${errors.phone_number ? "is-invalid" : ""}`} {...register("phone_number")} />
            <div className="invalid-feedback">{errors.phone_number?.message}</div>
          </div>
        </>
      )}

      {/* Shared Email field */}
      <div className="mb-3">
        <label htmlFor="email" className="form-label fw-bolder">Email Address</label>
        <input type="email" className={`form-control ${errors.email ? "is-invalid" : ""}`} {...register("email")} />
        <div className="invalid-feedback">{errors.email?.message}</div>
      </div>

      {/* Shared Password field */}
      <div className="mb-3">
        <label htmlFor="password" className="form-label fw-bolder">Password</label>
        <input type="password" className={`form-control ${errors.password ? "is-invalid" : ""}`} {...register("password")} />
        <div className="invalid-feedback">{errors.password?.message}</div>
      </div>

      {!isRegister && (
        <div className="d-flex justify-content-between mb-3">
          <div className="d-flex align-items-center">
            <input
              id="remember"
              type="checkbox"
              className="form-check-input me-2"
              checked={rememberMe}
              onChange={handleRememberMeChange}
            />
            <label htmlFor="remember" className="form-check-label fw-bolder">
              Remember me
            </label>
          </div>
          <a href="#" className="text-muted text-decoration-none fw-bolder">
            Forgot Password?
          </a>
        </div>
      )}

      <button
        style={{ background: "#cedfc3" }}
        type="submit"
        className="btn w-100 py-2 fw-bolder text-uppercase mt-3 mb-3 d-flex justify-content-center align-items-center"
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            {isRegister ? "Registering..." : "Logging in..."}
          </>
        ) : (
          isRegister ? "Register" : "Login"
        )}
      </button>

      <div className="mt-4 text-center">
        <p className="text-sm">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            onClick={() => {
              setIsRegister(!isRegister);
              reset();
            }}
            style={{
              cursor: "pointer",
              color: "#007bff",
              fontWeight: "bolder",
            }}
          >
            {isRegister ? "Login" : "Create an account"}
          </span>
        </p>
      </div>
    </form>
  );
};

export default Login;
