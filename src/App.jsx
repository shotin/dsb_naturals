import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { routes } from "./routing/routes";
import ProtectedRoute from "./pages/ProtectedRoute.jsx";

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
      <Routes>{renderRoutes(routes)}</Routes>
    </BrowserRouter>
  );
}

export default App;
