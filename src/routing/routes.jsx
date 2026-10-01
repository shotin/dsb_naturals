import Cart from "../components/Cart";
import Checkout from "../components/Checkout";
import HomePage from "../pages/HomePage";
import ProfilePage from "../pages/ProfilePage";
import SingleProduct from "../pages/SingleProduct";
import AdminLogin from "../admin/pages/Login";
import ShopPage from "../pages/ShopPage";
import CategoriesPage from "../pages/CategoriesPage";
import WishlistPage from "../pages/WishlistPage";
import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";
import PaymentResultPage from "../pages/PaymentResultPage";
import PaymentCancelledPage from "../pages/PaymentCancelledPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import VerifyRegistrationPage from "../pages/VerifyRegistrationPage";
import TermsPage from "../pages/TermsPage";
import PrivacyPage from "../pages/PrivacyPage";
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
import HomepageSlides from "../admin/pages/HomepageSlides";
import DeliveryAreas from "../admin/pages/DeliveryAreas";

export const routes = [
  // User routes
  { id: 1, path: "/", element: <HomePage />, protected: false },
  { id: 2, path: "/cart", element: <Cart />, protected: false },
  { id: 3, path: "/checkout", element: <Checkout />, protected: false },
  { id: 4, path: "/product/:productId", element: <SingleProduct />, protected: false },
  { id: 5, path: "/profile", element: <ProfilePage />, protected: true },
  { id: 13, path: "/shop", element: <ShopPage />, protected: false },
  { id: 24, path: "/categories", element: <CategoriesPage />, protected: false },
  { id: 14, path: "/wishlist", element: <WishlistPage />, protected: false },
  { id: 15, path: "/about", element: <AboutPage />, protected: false },
  { id: 16, path: "/contact", element: <ContactPage />, protected: false },
  { id: 17, path: "/payment-result", element: <PaymentResultPage />, protected: false },
  { id: 19, path: "/payment-cancelled", element: <PaymentCancelledPage />, protected: false },
  { id: 20, path: "/login", element: <LoginPage />, protected: false },
  { id: 21, path: "/register", element: <RegisterPage />, protected: false },
  { id: 22, path: "/forgot-password", element: <ForgotPasswordPage />, protected: false },
  { id: 23, path: "/reset-password", element: <ResetPasswordPage />, protected: false },
  { id: 25, path: "/verify-registration", element: <VerifyRegistrationPage />, protected: false },
  { id: 26, path: "/terms", element: <TermsPage />, protected: false },
  { id: 27, path: "/privacy", element: <PrivacyPage />, protected: false },

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
      { id: 18, path: "homepage", element: <HomepageSlides /> },
      { id: 28, path: "delivery-areas", element: <DeliveryAreas /> },
    ],
  },
];
