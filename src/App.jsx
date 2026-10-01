import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { routes } from "./routing/routes";
import ProtectedRoute from "./pages/ProtectedRoute.jsx";
import BackToTop from "./components/BackToTop.jsx";
import WhatsAppWidget from "./components/WhatsAppWidget.jsx";

function StorefrontWhatsAppWidget() {
  const { pathname } = useLocation();
  return pathname.startsWith("/admin-naturals-dsp") ? null : <WhatsAppWidget />;
}

const renderRoutes = (routesArray) => {
  return routesArray.map((route) => {
    if (route.children) {
      // Nested routes
      return (
        <Route
          key={route.id}
          path={route.path}
          element={
            route.protected ? (
              <ProtectedRoute>{route.element}</ProtectedRoute>
            ) : (
              route.element
            )
          }
        >
          {route.children.map((child) => (
            <Route
              key={child.id}
              path={child.path}
              element={
                child.protected ? (
                  <ProtectedRoute>{child.element}</ProtectedRoute>
                ) : (
                  child.element
                )
              }
            />
          ))}
        </Route>
      );
    }

    // Normal routes
    return (
      <Route
        key={route.id}
        path={route.path}
        element={
          route.protected ? (
            <ProtectedRoute>{route.element}</ProtectedRoute>
          ) : (
            route.element
          )
        }
      />
    );
  });
};

function App() {
  return (
    <BrowserRouter>
      <BackToTop />
      <StorefrontWhatsAppWidget />
      <Routes>{renderRoutes(routes)}</Routes>
    </BrowserRouter>
  );
}

export default App;
