import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";

const Cart = () => {
  const [cartItems, setCartItems] = useState({});

  useEffect(() => {
    const cartFromStorage = JSON.parse(localStorage.getItem("cart")) || {};
    setCartItems(cartFromStorage);
  }, []);

  const handleRemoveFromCart = (productId) => {
    const updatedCart = { ...cartItems };
    delete updatedCart[productId];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    toast.success("Item removed from cart!");
  };

  const handleQuantityChange = (productId, type) => {
    const updatedCart = { ...cartItems };
    if (type === "increase") {
      updatedCart[productId].quantity += 1;
      toast.success("Item updated successfully");
    } else if (updatedCart[productId].quantity > 1) {
      updatedCart[productId].quantity -= 1;
      toast.success("Item updated successfully");
    }
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
  };

  const calculateTotal = () => {
    const total = Object.values(cartItems).reduce(
      (acc, item) =>
        acc + parseFloat(item.price.replace(/,/g, "")) * item.quantity,
      0
    );
    return `₦ ${total.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <div
        className="container shadow"
        style={{ marginTop: "150px", marginBottom: "70px" }}
      >
        <div className="bg-white p-4 rounded shadow-sm">
          <h1 className="h3 mb-4">MY CART ({Object.keys(cartItems).length})</h1>

          <div>
            {Object.keys(cartItems).length > 0 ? (
              Object.values(cartItems).map((item) => (
                <div
                  key={item.id}
                  className="d-flex justify-content-between align-items-center border p-3 mb-3 rounded"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="img-fluid rounded"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                  <div className="flex-fill ms-3">
                    <h5>{item.name}</h5>
                    <p>₦ {item.price}</p>

                    <div className="d-flex align-items-center">
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() =>
                          handleQuantityChange(item.id, "decrease")
                        }
                      >
                        -
                      </button>
                      <span className="mx-3">{item.quantity}</span>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() =>
                          handleQuantityChange(item.id, "increase")
                        }
                      >
                        +
                      </button>
                      <FaTrash
                        className=" ms-auto text-danger"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleRemoveFromCart(item.id)}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="fw-bolder text-uppercase text-center mb-5">
                <p>Your cart is empty.</p>
                <button
                  className="btn  fw-bolder"
                  style={{ background: "#cedfc3" }}
                  onClick={() => navigate("/")}
                >
                  Shop
                </button>
              </div>
            )}
          </div>
          {Object.keys(cartItems).length > 0 ? (
            <>
              <div className="border-top pt-3 fw-bolder ">
                <div className="d-flex justify-content-between font-weight-bold">
                  <p>Total</p>
                  <p>{calculateTotal()}</p>
                </div>
              </div>

              <button
                className="btn fw-bolder w-100 mt-4"
                style={{ background: "#cedfc3" }}
                onClick={() => navigate("/checkout")}
              >
                PROCEED TO CHECKOUT
              </button>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
