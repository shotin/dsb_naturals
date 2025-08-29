import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/category.css";
import { toast } from "react-toastify";
import { HTTP } from "../utils";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || {}
  );
  const navigate = useNavigate();
  const IMAGE_BASE_URL = "https://dspnaturals.com/api/public/storage/images/";

  // 🔹 Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await HTTP.get("/categories");
        let backendCategories = res.data;

        // remove duplicate "All" if backend already has it
        backendCategories = backendCategories.filter(
          (cat) => cat.name.toLowerCase() !== "all"
        );

        // Add "All" manually at the top
        setCategories([{ id: "all", name: "All" }, ...backendCategories]);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories!");
      }
    };

    fetchCategories();
  }, []);

  // 🔹 Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await HTTP.get("/products");

        setProducts(res?.data?.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products!");
      }
    };

    fetchProducts();
  }, []);

  // 🔹 Filter products based on category
  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category_id === selectedCategory);

  // 🔹 Cart Handlers
  const handleAddToCart = (product) => {
    const updatedCart = { ...cart };
    if (updatedCart[product.id]) {
      updatedCart[product.id].quantity += 1;
    } else {
      updatedCart[product.id] = {
        ...product,
        image: `${IMAGE_BASE_URL}${product.image}`, 
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
    }
  };

  const handleDecreaseQuantity = (product) => {
    const updatedCart = { ...cart };
    if (updatedCart[product.id] && updatedCart[product.id].quantity > 1) {
      updatedCart[product.id].quantity -= 1;
    } else {
      delete updatedCart[product.id];
    }
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const getProductQuantity = (productId) =>
    cart[productId] ? cart[productId].quantity : 0;

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

      {/* 🔹 Categories */}
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

      {/* 🔹 Products */}
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
                    src={`${IMAGE_BASE_URL}${product.image}`}
                    alt={product.name}
                    className="product-image img-fluid"
                  />
                  <h4 className="product-title">{product.name}</h4>
                  <p className="product-price">₦{product.price}</p>
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
