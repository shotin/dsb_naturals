import Cart from "../components/Cart";
import Checkout from "../components/Checkout";
import HomePage from "../pages/HomePage";
import ProfilePage from "../pages/ProfilePage";
import SingleProduct from "../pages/SingleProduct";
import AdminLogin from "../admin/pages/Login";
// import AdminDashboard from "../admin/pages/Dashboard";
// import AdminOrders from "../admin/pages/Orders";
// import AdminUsers from "../admin/pages/Users";
// import AdminProducts from "../admin/pages/Products";
// import AdminCategories from "../admin/pages/Categories";

import DashboardLayout from "../admin/components/DashboardLayout";
import Dashboard from "../admin/pages/Dashboard";
import Products from "../admin/pages/Products";
import Categories from "../admin/pages/Categories";
import Orders from "../admin/pages/Orders";
import Users from "../admin/pages/Users";

export const routes = [
  // User routes
  { id: 1, path: "/", element: <HomePage />, protected: false },
  { id: 2, path: "/cart", element: <Cart />, protected: false },
  { id: 3, path: "/checkout", element: <Checkout />, protected: true },
  { id: 4, path: "/product/:productId", element: <SingleProduct />, protected: false },
  { id: 5, path: "/profile", element: <ProfilePage />, protected: true },

  // Admin routes
  {
    id: 6,
    path: "/admin-naturals-dsp/login",
    element: <AdminLogin />,
    protected: false,
  },
  {
    id: 7,
    path: "/admin-naturals-dsp/*",
    element: <DashboardLayout />,
    protected: true,
    admin: true,
    children: [
      { id: 8, path: "", element: <Dashboard /> },
      { id: 9, path: "products", element: <Products /> },
      { id: 10, path: "categories", element: <Categories /> },
      { id: 11, path: "orders", element: <Orders /> },
      { id: 12, path: "users", element: <Users /> },
    ],
  },
];
