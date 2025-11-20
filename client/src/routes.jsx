import App from "./pages/App";
import ErrorPage from "./pages/ErrorPage";
import NewPageLayout from "./pages/NewPageLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NewPage from "./pages/NewPage";
import UserInfo from "./pages/UserInfo";
import CourseContent from "./pages/CourseContent";
import InstructorScreen from "./pages/InstructorScreen";
import AdminScreen from "./pages/AdminScreen";

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
  {
    path: "/course/:courseId",
    element: <CourseContent />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/instructor-screen",
    element: <InstructorScreen />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/admin-screen",
    element: <AdminScreen />,
    errorElement: <ErrorPage />,
  },
];

export default routes;
