import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/category.css";
import { images } from "../constants";
import { toast } from "react-toastify";

const categories = [
  { id: 11, name: "All" },
  { id: 1, name: "Sunscreen" },
  { id: 2, name: "Masks" },
  { id: 3, name: "Eye Care" },
  { id: 4, name: "Moisturizers" },
  { id: 5, name: "Soaps" },
  { id: 6, name: "Lotions" },
  { id: 7, name: "Body Cream" },
  { id: 8, name: "Serums" },
  { id: 9, name: "Oils" },
  { id: 10, name: "Acne Sets" },
];

const products = [
  {
    id: 1,
    name: "Sunscreen SPF 50",
    category: 1,
    description:
      "Protect your skin from harmful UV rays with our Sunscreen SPF 50. Specially formulated to offer broad-spectrum protection, this sunscreen shields your skin from both UVA and UVB rays, preventing sunburn, premature aging, and damage caused by prolonged sun exposure. With a lightweight and non-greasy formula, it absorbs quickly into the skin, leaving it feeling soft and smooth. Ideal for daily use, it is suitable for all skin types, including sensitive skin. Stay protected and enjoy the sun with confidence!",
    price: "₦10,000",
    image: images.kooo,
  },
  {
    id: 2,
    name: "Advanced Sunscreen",
    category: 1,
    description:
      "Protect your skin from harmful UV rays with our Sunscreen SPF 50. Specially formulated to offer broad-spectrum protection, this sunscreen shields your skin from both UVA and UVB rays, preventing sunburn, premature aging, and damage caused by prolonged sun exposure. With a lightweight and non-greasy formula, it absorbs quickly into the skin, leaving it feeling soft and smooth. Ideal for daily use, it is suitable for all skin types, including sensitive skin. Stay protected and enjoy the sun with confidence!",
    price: "₦12,000",
    image: images.kooo,
  },
  {
    id: 3,
    name: "Charcoal Face Mask",
    category: 2,
    description:
      "Protect your skin from harmful UV rays with our Sunscreen SPF 50. Specially formulated to offer broad-spectrum protection, this sunscreen shields your skin from both UVA and UVB rays, preventing sunburn, premature aging, and damage caused by prolonged sun exposure. With a lightweight and non-greasy formula, it absorbs quickly into the skin, leaving it feeling soft and smooth. Ideal for daily use, it is suitable for all skin types, including sensitive skin. Stay protected and enjoy the sun with confidence!",
    price: "₦25,000",
    image: images.kooo,
  },
  {
    id: 4,
    name: "Under Eye Gel",
    category: 3,
    description:
      "Protect your skin from harmful UV rays with our Sunscreen SPF 50. Specially formulated to offer broad-spectrum protection, this sunscreen shields your skin from both UVA and UVB rays, preventing sunburn, premature aging, and damage caused by prolonged sun exposure. With a lightweight and non-greasy formula, it absorbs quickly into the skin, leaving it feeling soft and smooth. Ideal for daily use, it is suitable for all skin types, including sensitive skin. Stay protected and enjoy the sun with confidence!",
    price: "₦8,000",
    image: images.kooo,
  },
  {
    id: 5,
    name: "Hydrating Moisturizer",
    category: 4,
    description:
      "Protect your skin from harmful UV rays with our Sunscreen SPF 50. Specially formulated to offer broad-spectrum protection, this sunscreen shields your skin from both UVA and UVB rays, preventing sunburn, premature aging, and damage caused by prolonged sun exposure. With a lightweight and non-greasy formula, it absorbs quickly into the skin, leaving it feeling soft and smooth. Ideal for daily use, it is suitable for all skin types, including sensitive skin. Stay protected and enjoy the sun with confidence!",
    price: "₦15,000",
    image: images.kooo,
  },
  {
    id: 6,
    name: "Daily Moisturizer",
    category: 4,
    description:
      "Protect your skin from harmful UV rays with our Sunscreen SPF 50. Specially formulated to offer broad-spectrum protection, this sunscreen shields your skin from both UVA and UVB rays, preventing sunburn, premature aging, and damage caused by prolonged sun exposure. With a lightweight and non-greasy formula, it absorbs quickly into the skin, leaving it feeling soft and smooth. Ideal for daily use, it is suitable for all skin types, including sensitive skin. Stay protected and enjoy the sun with confidence!",
    price: "₦18,000",
    image: images.kooo,
  },
];

const Category = () => {
  const [selectedCategory, setSelectedCategory] = useState(11);
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || {}
  );
  const navigate = useNavigate();
  const filteredProducts =
    selectedCategory === 11
      ? products
      : products.filter((product) => product.category === selectedCategory);

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
      // Remove item from cart if quantity is 1 and minus is clicked
      delete updatedCart[product.id];
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      toast.success(`${product.name} removed from cart!`);
    }
  };

  const getProductQuantity = (productId) => {
    return cart[productId] ? cart[productId].quantity : 0;
  };
  const handleViewProduct = (productId) => {
    const product = products.find((prod) => prod.id === productId);
    navigate(`/product/${productId}`, { state: { product } });
  };

  return (
    <div className="container category-list-container">
      <h1
        style={{ background: "#cedfc3" }}
        className="text-center fw-bolder mb-4"
      >
        CATEGORIES
      </h1>
      <div className="categories">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`category-button ${
              selectedCategory === category.id ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="row">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="col-6 col-md-3 mb-4">
              <div className="product-card">
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => handleViewProduct(product.id)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image img-fluid"
                  />
                  <h4 className="product-title">{product.name}</h4>
                  <p className="product-price">{product.price}</p>
                </div>

                {!cart[product.id] ? (
                  <button
                    className="btn w-100 fw-bolder"
                    style={{ background: "#cedfc3" }}
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                ) : (
                  <div className="d-flex justify-content-between align-items-center">
                    <button
                      className="btn"
                      style={{ background: "#cedfc3" }}
                      onClick={() => handleDecreaseQuantity(product)}
                    >
                      -
                    </button>
                    <span>{getProductQuantity(product.id)}</span>
                    <button
                      className="btn"
                      style={{ background: "#cedfc3" }}
                      onClick={() => handleIncreaseQuantity(product)}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center fw-bolder my-auto">
            No products available for this category.
          </p>
        )}
      </div>
    </div>
  );
};

export default Category;
