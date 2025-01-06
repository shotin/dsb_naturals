import { useParams, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";
import { toast } from "react-toastify";

const SingleProduct = () => {
  const { productId } = useParams();
  const { state } = useLocation();
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || {}
  );
  //   console.log(productId);

  const handleAddToCart = (product) => {
    const updatedCart = { ...cart };
    if (updatedCart[product.id]) {
      updatedCart[product.id].quantity += 1;
    } else {
      const priceWithoutNaira = product.price.replace("₦", "").trim();
      updatedCart[product.id] = {
        ...product,
        price: priceWithoutNaira,
        quantity: 1,
      };
    }
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success(`${product.name} added to cart!`);
  };

  const handleIncreaseQuantity = (product) => {
    const updatedCart = { ...cart };
    if (updatedCart[product.id]) {
      updatedCart[product.id].quantity += 1;
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      toast.success(`${product.name} updated successfully!`);
    }
  };

  const handleDecreaseQuantity = (product) => {
    const updatedCart = { ...cart };
    if (updatedCart[product.id] && updatedCart[product.id].quantity > 1) {
      updatedCart[product.id].quantity -= 1;
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      toast.success(`${product.name} updated successfully!`);
    } else if (updatedCart[product.id]) {
      delete updatedCart[product.id];
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      toast.success(`${product.name} removed from cart!`);
    }
  };

  const getProductQuantity = (productId) => {
    return cart[productId] ? cart[productId].quantity : 0;
  };

  const navigate = useNavigate();
  const product =
    state?.product || product.find((prod) => prod.id === parseInt(productId));

  if (!product) {
    return <p>Product not found!</p>;
  }

  return (
    <>
      <Navbar />
      <div
        className="container"
        style={{ marginTop: "150px", marginBottom: "100px" }}
      >
        <a
          onClick={() => navigate("/")}
          className="btn text-decoration-none mb-3 d-inline-block fw-bolder"
        >
          ← Back
        </a>
        <div className="row fw-bolder">
          <div className="col-md-6 mb-5">
            <img
              src={product.image}
              alt={product.name}
              style={{ height: "100%", width: "100%" }}
              className="img-fluid"
            />
          </div>
          <div className="col-md-6">
            <h1>{product.name}</h1>
            <p>{product.price}</p>
            <h2 className="mt-4">Product Description</h2>
            <p className="mb-5" style={{ lineHeight: "35px" }}>
              {product?.description}
            </p>
            {!cart[product.id] ? (
              <div className="d-flex justify-content-center">
                <button
                  className="btn fw-bolder"
                  style={{
                    background: "#cedfc3",
                    width: "auto",
                    padding: "10px 20px",
                  }}
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            ) : (
              <div className="d-flex justify-content-center align-items-center">
                <button
                  className="btn"
                  style={{
                    background: "#cedfc3",
                    width: "auto",
                  }}
                  onClick={() => handleDecreaseQuantity(product)}
                >
                  -
                </button>
                &nbsp;&nbsp;&nbsp;
                <span className="mx-2">
                  {getProductQuantity(product.id)}
                  &nbsp;&nbsp;&nbsp;
                </span>{" "}
                <button
                  className="btn"
                  style={{
                    background: "#cedfc3",
                    width: "auto",
                  }}
                  onClick={() => handleIncreaseQuantity(product)}
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SingleProduct;
