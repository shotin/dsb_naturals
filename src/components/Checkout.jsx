import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { HTTP } from "../utils";

const Checkout = () => {
  const [cartItems, setCartItems] = useState({});
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [useSavedAddress, setUseSavedAddress] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const cartFromStorage = JSON.parse(localStorage.getItem("cart")) || {};
    setCartItems(cartFromStorage);

    const addresses = JSON.parse(localStorage.getItem("savedAddresses")) || [];
    setSavedAddresses(addresses);

    // Autofill first saved address if available
    if (addresses.length > 0) {
      const addr = addresses[0];
      setUseSavedAddress(true);
      setValue("firstName", addr.firstName);
      setValue("lastName", addr.lastName);
      setValue("address", addr.address);
      setValue("email", addr.email);
      setValue("phone", addr.phone);
    }
  }, [setValue]);

  const calculateSubtotal = () => {
    return Object.values(cartItems).reduce(
      (acc, item) => acc + Number(item.price) * item.quantity,
      0
    );
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal + deliveryFee;
  };

  const deliveryOptions = [
    { id: "1", label: "Ikorodu Area", fee: 3000 },
    { id: "9", label: "Mainland", fee: 4000 },
    { id: "2", label: "Sango", fee: 8000 },
    { id: "4", label: "Lekki axis", fee: 5000 },
    { id: "5", label: "Ajah", fee: 12000 },
    { id: "6", label: "Sangotedo", fee: 7000 },
  ];

  const onSubmit = async (data) => {
    const selectedDelivery = deliveryOptions.find(
      (opt) => opt.id === data.delivery
    );
    setLoading(true);
    try {
      const payload = {
        email: data.email,
        phone_number: data.phone,
        first_name: data.firstName,
        last_name: data.lastName,
        address: data.address,
        delivery_area: selectedDelivery ? selectedDelivery.label : null,
        delivery_cost: deliveryFee,
        subtotal: calculateSubtotal(),
        total: calculateTotal(),
        cart_items: Object.values(cartItems).map((item) => ({
          id: item.id,
          category_id: item.category_id,
          description: item.description,
          name: item.name,
          price: Number(item.price),
          quantity: item.quantity,
          image: item.image,
          category: item.category,
        })),
      };

      const token = localStorage.getItem("token"); // or however you store it

      const res = await HTTP.post("/user/checkouts", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (res.status === 200 || res.status === 201) {
        // toast.success("Checkout info saved, redirecting to payment...");
        const reference = res.data.ref;
        if (data.saveAddress) {
          const newSavedAddresses = [data]; 
          setSavedAddresses(newSavedAddresses);
          localStorage.setItem(
            "savedAddresses",
            JSON.stringify(newSavedAddresses)
          );
        }

        initiatePayment(data, reference);
      }
    } catch (error) {
      toast.error("Failed to save checkout info. Please try again.");
      setLoading(false);
    }
  };

  const initiatePayment = (formData, reference) => {
    const handler = window.PaystackPop.setup({
      key: "pk_test_a23030865207814321e6b2e688b325baee8c3c64",
      email: formData.email,
      amount: calculateTotal() * 100,
      currency: "NGN",
      ref: reference,
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
        toast.success("Payment successful! Reference");
        localStorage.removeItem("cart");
        setCartItems({});
        reset();
        setDeliveryFee(0);
        setLoading(false);
        // navigate("/");
        navigate(`/?reference=${reference}`);
      },
      onClose: function () {
        toast.success("Payment window closed.");
        setLoading(false);
      },
    });

    handler.openIframe();
  };

  const handleDeliveryChange = (fee) => {
    setDeliveryFee(fee);
  };

  useEffect(() => {
    // Fetch user from localStorage if logged in
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      // Prefill values into the form
      setValue("email", parsedUser.email);
      setValue("phone", parsedUser.phone_number);
    }
  }, [setValue]);

  return (
    <>
      <Navbar />
      <div
        className="container py-4 fw-bolder"
        style={{ marginTop: "150px", marginBottom: "70px" }}
      >
        <h1 className="fw-bolder fs-4">
          CHECKOUT ({Object.keys(cartItems).length})
        </h1>
        <p className="text-secondary">Checkout your order seamlessly.</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row mt-4">
            <div className="col-lg-8">
              {/* Contact */}
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
                      readOnly={!!user} // make read-only if user exists
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
                      readOnly={!!user} // make read-only if user exists
                    />
                    <p className="text-danger">{errors.phone?.message}</p>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
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
                  <div className="card p-4 mb-4">
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
                {deliveryOptions.map((option) => (
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
                          checked={field.value === option.id}
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
                        &nbsp;&nbsp;₦{option.fee}
                      </span>
                    </label>
                  </div>
                ))}
                <p className="text-danger">{errors.delivery?.message}</p>
              </div>
            </div>

            {/* Order Summary */}
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
                  className="btn w-100 mt-3 fw-bolder d-flex justify-content-center align-items-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Processing...
                    </>
                  ) : (
                    "Proceed to Payment"
                  )}
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
