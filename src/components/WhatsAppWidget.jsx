import { FaWhatsapp } from "react-icons/fa";
import "../assets/css/WhatsAppWidget.css";

const WhatsAppWidget = () => {
  const phoneNumber = "2347064548729";
  const message = "Hi, dsp naturals."; // Message to send

  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  };

  return (
    <div className="whatsapp-widget">
      <button onClick={handleClick} className="whatsapp-button">
        <FaWhatsapp className="fa-2x" />
      </button>
    </div>
  );
};

export default WhatsAppWidget;
