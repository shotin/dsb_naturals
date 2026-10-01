import { useEffect, useLayoutEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FaArrowUp } from "react-icons/fa";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    setVisible(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > 420);
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  if (location.pathname.startsWith("/admin-naturals-dsp")) return null;
  return visible ? <button className="back-to-top" type="button" aria-label="Scroll back to top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><FaArrowUp /></button> : null;
}
