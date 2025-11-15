import App from "./pages/App";
import ErrorPage from "./pages/ErrorPage";
import NewPageLayout from "./pages/NewPageLayout";
import Login from "./components/Login";
import Signup from "./components/Signup";
import NewPage from "./components/NewPage";
import UserInfo from "./components/UserInfo";

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
  {
    path: "/user-info",
    element: <UserInfo />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/new-page",
    element: <NewPageLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <NewPage />,
      },
    ],
  },
];

export default routes;
