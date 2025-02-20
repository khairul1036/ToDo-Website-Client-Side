import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
// import NotFoundPage from "./pages/NotFoundPage";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AuthProvider from "./provider/AuthProvider";
import PrivateRouter from "./routes/PrivateRouter";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    // errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: (
          <PrivateRouter>
            <Home />
          </PrivateRouter>
        ),
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
