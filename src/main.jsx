import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";
import WhatsAppWidget from "./components/WhatsAppWidget.jsx";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div>
      <App />
      <ToastContainer />
      <WhatsAppWidget />
    </div>
  </StrictMode>
);
