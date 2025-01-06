import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Checkout = () => {
  const [cartItems, setCartItems] = useState({});
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [useSavedAddress, setUseSavedAddress] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const cartFromStorage = JSON.parse(localStorage.getItem("cart")) || {};
    setCartItems(cartFromStorage);

    const addresses = JSON.parse(localStorage.getItem("savedAddresses")) || [];
    setSavedAddresses(addresses);

    // If there are saved addresses, use the first one by default
    if (addresses.length > 0) {
      setUseSavedAddress(true);
    }
  }, []);

  const calculateSubtotal = () => {
    return Object.values(cartItems).reduce(
      (acc, item) =>
        acc + parseFloat(item.price.replace(/,/g, "")) * item.quantity,
      0
    );
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal + deliveryFee;
  };

  const schema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    phone: yup
      .string()
      .matches(
        /^(070|080|081|090)\d{8}$/,
        "Phone number must start with 070, 080, 081, or 090 and be exactly 11 digits"
      )
      .required("Phone number is required"),
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    address: yup.string().required("Address is required"),
    delivery: yup.string().required("Please select a delivery option"),
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    resetField,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleSavedAddressSelect = (value) => {
    if (value) {
      const selectedAddress = JSON.parse(value);
      setValue("firstName", selectedAddress.firstName);
      setValue("lastName", selectedAddress.lastName);
      setValue("address", selectedAddress.address);
    } else {
      resetField("firstName");
      resetField("lastName");
      resetField("address");
    }
  };

  const onSubmit = (data) => {
    if (data.saveAddress) {
      const newSavedAddresses = [...savedAddresses, data];
      setSavedAddresses(newSavedAddresses);
      localStorage.setItem("savedAddresses", JSON.stringify(newSavedAddresses));
    }
    // console.log("Form Data Submitted:", data);
    initiatePayment(data);
  };

  const initiatePayment = (formData) => {
    const handler = window.PaystackPop.setup({
      key: "pk_test_a23030865207814321e6b2e688b325baee8c3c64",
      email: formData.email,
      amount: calculateTotal() * 100,
      currency: "NGN",
      ref: `${Math.floor(Math.random() * 1000000000 + 1)}`,
      metadata: {
        custom_fields: [
          {
            display_name: "Phone Number",
            variable_name: "phone",
            value: formData.phone,
          },
        ],
      },
      callback: function (response) {
        // toast.success("Payment successful! Reference");
        toast.success("Payment successful! Reference: " + response.reference);
        localStorage.removeItem("cart");
        setCartItems({});
        reset();
        setDeliveryFee(0);
        navigate("/");
      },
      onClose: function () {
        toast.success("Payment window closed.");
      },
    });

    handler.openIframe();
  };

  const handleDeliveryChange = (fee) => {
    setDeliveryFee(fee);
  };
  return (
    <>
      <Navbar />
      <div
        className="container py-4 fw-bolder"
        style={{ marginTop: "150px", marginBottom: "70px" }}
      >
        <h1 className="fw-bolder fs-4">CHECKOUT (10)</h1>
        <p className="text-secondary">Checkout your order seamlessly.</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row mt-4">
            <div className="col-lg-8">
              <div className="card p-4 mb-4">
                <h2 className="fw-medium mb-3">CONTACT</h2>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="form-control"
                      {...register("email")}
                    />
                    <p className="text-danger">{errors.email?.message}</p>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="phone" className="form-label">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      maxLength="11"
                      className="form-control"
                      {...register("phone")}
                    />
                    <p className="text-danger">{errors.phone?.message}</p>
                  </div>
                </div>
              </div>

              <div className="card p-4 mb-4">
                <h2 className="fw-medium mb-3">DELIVERY ADDRESS</h2>

                {useSavedAddress && savedAddresses.length > 0 ? (
                  <div className="card p-4 mb-4">
                    <h2 className="fw-medium mb-3">SAVED DELIVERY ADDRESS</h2>
                    <p>
                      <strong>
                        {savedAddresses[0].firstName}{" "}
                        {savedAddresses[0].lastName}
                      </strong>
                    </p>
                    <p>{savedAddresses[0].address}</p>
                    <button
                      type="button"
                      className="btn fw-bolder text-primary p-0"
                      onClick={() => setUseSavedAddress(false)}
                    >
                      Use a different address
                    </button>
                  </div>
                ) : (
                  /* Form Section */
                  <div className="card p-4 mb-4">
                    <h2 className="fw-medium mb-3">DELIVERY ADDRESS</h2>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <label htmlFor="firstName" className="form-label">
                          First Name
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          className="form-control"
                          {...register("firstName")}
                        />
                        <p className="text-danger">
                          {errors.firstName?.message}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="lastName" className="form-label">
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          className="form-control"
                          {...register("lastName")}
                        />
                        <p className="text-danger">
                          {errors.lastName?.message}
                        </p>
                      </div>
                    </div>

                    <label htmlFor="address" className="form-label mt-3">
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      className="form-control"
                      {...register("address")}
                    />
                    <p className="text-danger">{errors.address?.message}</p>

                    <div className="form-check mt-3">
                      <input
                        type="checkbox"
                        id="saveAddress"
                        className="form-check-input"
                        {...register("saveAddress")}
                        onChange={(e) =>
                          handleSavedAddressSelect(e.target.value)
                        }
                      />
                      <label className="form-check-label" htmlFor="saveAddress">
                        Save this address for future use
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery Options */}
              <div className="card p-4 mb-5">
                <h2 className="fw-medium mb-3">DELIVERY OPTIONS</h2>
                {[
                  { id: "1", label: "Ikorodu Area", fee: 3000 },
                  {
                    id: "9",
                    label: "Mainland",
                    fee: 4000,
                  },
                  { id: "2", label: "Sango", fee: 8000 },
                  { id: "4", label: "Lekki axis", fee: 5000 },
                  {
                    id: "5",
                    label: "Ajah",
                    fee: 12000,
                  },
                  {
                    id: "6",
                    label: "Sangotedo",
                    fee: 7000,
                  },
                ].map((option) => (
                  <div className="form-check mb-2" key={option.id}>
                    <Controller
                      name="delivery"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          className="form-check-input"
                          type="radio"
                          id={option.id}
                          onChange={() => {
                            field.onChange(option.id);
                            handleDeliveryChange(option.fee);
                          }}
                        />
                      )}
                    />
                    <label className="form-check-label" htmlFor={option.id}>
                      {option.label}{" "}
                      <span className="float-end">
                        {" "}
                        &nbsp;&nbsp;₦{option.fee}
                      </span>
                    </label>
                  </div>
                ))}
                <p className="text-danger">{errors.delivery?.message}</p>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card p-4">
                <h2 className="fw-medium">Order Summary</h2>
                <p className="text-muted">
                  Subtotal: ₦{" "}
                  {calculateSubtotal().toLocaleString("en-NG", {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <p className="text-muted">Delivery: ₦ {deliveryFee}</p>
                <h4 className="text-dark">
                  Total: ₦{" "}
                  {calculateTotal().toLocaleString("en-NG", {
                    minimumFractionDigits: 2,
                  })}
                </h4>
                <button
                  style={{ background: "#cedfc3" }}
                  type="submit"
                  className="btn w-100 mt-3 fw-bolder"
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
