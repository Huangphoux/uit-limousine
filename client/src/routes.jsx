import App from "./pages/App";
import ErrorPage from "./pages/ErrorPage";
import Login from "./components/Login";
import Signup from "./components/Signup";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <App />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "sign-up",
        element: <Signup />,
      },
    ],
  },
];

export default routes;
