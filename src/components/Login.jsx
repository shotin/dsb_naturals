import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import BModal from "./BModal/BModal";
import RegisterForm from "./Register";

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login = ({ onClose }) => {
  const [rememberMe, setRememberMe] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const handleRememberMeChange = () => setRememberMe((prev) => !prev);

  const closeRegister = () => {
    onClose();
    setShowRegister(false);
  };

  const handleRegister = () => {
    setShowRegister(true);
  };

  const onSubmit = (data) => {
    console.log("Login Data:", data);
    onClose();
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="pt-3">
        <h3 className="text-center fw-bolder mb-4">LOGIN</h3>
        <div className="mb-3">
          <label htmlFor="email" className="form-label fw-bolder">
            Email Address
          </label>
          <input
            type="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            id="email"
            placeholder="Enter your email address"
            {...register("email")}
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email.message}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label fw-bolder">
            Password
          </label>
          <input
            type="password"
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            id="password"
            placeholder="Enter your password"
            {...register("password")}
          />
          {errors.password && (
            <div className="invalid-feedback">{errors.password.message}</div>
          )}
        </div>
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

        <div>
          <button
            style={{ background: "#cedfc3" }}
            type="submit"
            className="btn w-100 py-2 fw-bolder text-uppercase mt-3 mb-3"
          >
            Login
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm">
            Don`t have an account?{" "}
            <span
              onClick={handleRegister}
              style={{
                cursor: "pointer",
                color: "#007bff",
                fontWeight: "bolder",
              }}
            >
              Create an account
            </span>
          </p>
        </div>
      </form>

      {/* Register Modal */}
      <BModal
        keyboard={false}
        show={showRegister}
        onHide={closeRegister}
        size="md"
      >
        <RegisterForm />
      </BModal>
    </>
  );
};

export default Login;
