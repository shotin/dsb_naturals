import Cart from "../components/Cart";
import Checkout from "../components/Checkout";
import HomePage from "../pages/HomePage";
import SingleProduct from "../pages/SingleProduct";

export const routes = [
  {
    id: 1,
    path: "/",
    element: <HomePage />,
    protected: false,
  },
  {
    id: 2,
    path: "/cart",
    element: <Cart />,
    protected: false,
  },
  {
    id: 3,
    path: "/checkout",
    element: <Checkout />,
    protected: false,
  },
  {
    id: 3,
    path: "/product/:productId",
    element: <SingleProduct />,
    protected: false,
  },
];
