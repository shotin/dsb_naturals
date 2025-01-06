import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import BModal from "./BModal/BModal";
import Login from "./Login";
import { useState } from "react";

const registerSchema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: yup
    .string()
    .matches(
      /^(\+?\d{1,4}[\s-])?(\(?\d{1,4}\)?[\s-]?)?[\d\s-]{6,10}$/,
      "Phone number is not valid"
    )
    .required("Phone number is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const RegisterForm = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);
  // const handleOpen = () => setIsOpen(true);

  // const handleLogin = () => {
  //   handleClose();
  //   handleOpen();
  // };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="pt-3">
        <h3 className="text-center fw-bold mb-4">REGISTER</h3>
        <div className="mb-3">
          <label htmlFor="firstName" className="form-label fw-bold">
            First Name
          </label>
          <input
            type="text"
            className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
            id="firstName"
            placeholder="Enter your first name"
            {...register("firstName")}
          />
          {errors.firstName && (
            <div className="invalid-feedback">{errors.firstName.message}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="lastName" className="form-label fw-bold">
            Last Name
          </label>
          <input
            type="text"
            className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
            id="lastName"
            placeholder="Enter your last name"
            {...register("lastName")}
          />
          {errors.lastName && (
            <div className="invalid-feedback">{errors.lastName.message}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label fw-bold">
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
          <label htmlFor="phone" className="form-label fw-bold">
            Phone Number
          </label>
          <input
            type="text"
            className={`form-control ${errors.phone ? "is-invalid" : ""}`}
            id="phone"
            placeholder="Enter your phone number"
            {...register("phone")}
          />
          {errors.phone && (
            <div className="invalid-feedback">{errors.phone.message}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label fw-bold">
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

        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label fw-bold">
            Confirm Password
          </label>
          <input
            type="password"
            className={`form-control ${
              errors.confirmPassword ? "is-invalid" : ""
            }`}
            id="confirmPassword"
            placeholder="Confirm your password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <div className="invalid-feedback">
              {errors.confirmPassword.message}
            </div>
          )}
        </div>

        <div>
          <button
            style={{ background: "#cedfc3" }}
            type="submit"
            className="btn w-100 py-2 fw-bolder text-uppercase mt-3 mb-3"
          >
            Register
          </button>
        </div>
        {/* <div className="mt-4 text-center">
          <p className="text-sm">
            Already have an account?{" "}
            <span onClick={() => handleLogin()} style={{ cursor: "pointer" }}>
              Login
            </span>
          </p>
        </div> */}
      </form>
      <BModal
        keyboard={false}
        show={isOpen}
        onHide={handleClose}
        size="md"
        BModal
      >
        <Login />
      </BModal>
    </>
  );
};

export default RegisterForm;
