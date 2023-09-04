import "./index.sass";
import ReactDOM from "react-dom/client";
import Intro from "./pages/Intro/Intro";
import Scene from "./pages/Scene/Scene";
import Attribution from "./pages/Attribution/Attribution";
import Privacy from "./pages/Privacy/Privacy";
import Error from "./pages/Error/Error";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const basename = process.env.NODE_ENV === "production" ? "/asteroids" : "";

const router = createBrowserRouter(
  [
    {
      path: "*",
      element: <Error />,
      errorElement: <Error />,
    },
    {
      path: "/",
      element: <Intro />,
    },
    {
      path: "/play",
      element: <Scene />,
    },
    {
      path: "/attribution",
      element: <Attribution />,
    },
    {
      path: "/privacy",
      element: <Privacy />,
    },
  ],
  { basename }
);

const root = document.getElementById("root");
root && ReactDOM.createRoot(root).render(<RouterProvider router={router} />);
