// src/admin/AdminRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Users from "./pages/Users";
import Products from "./pages/Products";
import Categories from "./pages/Categories";

const AdminRoutes = () => {
  const isAdminLoggedIn = !!localStorage.getItem("admin"); 

  return (
    <Routes>
      <Route path="/admin-naturals-dsp/login" element={<Login />} />
      <Route
        path="/admin-naturals-dsp/*"
        element={
          isAdminLoggedIn ? <DashboardLayout /> : <Navigate to="/admin-naturals-dsp/login" />
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="orders" element={<Orders />} />
        <Route path="users" element={<Users />} />
        <Route path="products" element={<Products />} />
        <Route path="categories" element={<Categories />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
