import { BrowserRouter, Routes, Route } from "react-router-dom";
import { routes } from "./routing/routes";
import ProtectedRoute from "./pages/ProtectedRoute.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={
              route.protected ? (
                <ProtectedRoute>{route.element}</ProtectedRoute>
              ) : (
                route.element
              )
            }
          />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
