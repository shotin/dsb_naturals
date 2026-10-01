import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { Toaster } from "sonner";
import "./assets/css/storefront.css";
import "./assets/css/checkout.css";
import "./assets/css/details.css";
import "./assets/css/cart.css";
import "./assets/css/delivery.css";
import "./assets/css/brand-theme.css";
import "./assets/css/responsive-polish.css";
import "./assets/css/checkout-address.css";
import "./assets/css/order-tracking.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div>
      <App />
      <Toaster
        position="top-right"
        theme="light"
        closeButton
        visibleToasts={4}
        expand={false}
        gap={10}
        offset={20}
        toastOptions={{ duration: 3600, className: "dsp-toast" }}
      />
    </div>
  </StrictMode>
);
