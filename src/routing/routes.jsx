import Cart from "../components/Cart";
import Checkout from "../components/Checkout";
import HomePage from "../pages/HomePage";
import ProfilePage from "../pages/ProfilePage";
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
    protected: true,
  },
  {
    id: 4,
    path: "/product/:productId",
    element: <SingleProduct />,
    protected: false,
  },
  {
    id: 5,
    path: "/profile",
    element: <ProfilePage  />,
    protected: true,
  },
];
