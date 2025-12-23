import App from "./pages/App";
import ErrorPage from "./pages/ErrorPage";
import NewPageLayout from "./pages/NewPageLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
import NewPage from "./pages/NewPage";
import UserInfo from "./pages/UserInfo";
import CourseContent from "./pages/CourseContent";
import InstructorScreen from "./pages/InstructorScreen";
import AdminScreen from "./pages/AdminScreen";
import CourseCard from "./components/CourseCard";
import CourseManagementCard from "./components/instructor-screen/course-management/CourseManagementCard";
import CourseManagementView from "./components/instructor-screen/course-management/CourseManagementView";
import EditCourseView from "./components/instructor-screen/course-management/EditCourseView";
import AssignmentSubmit from "./pages/AssignmentSubmit";
import ProtectedRoute from "./components/ProtectedRoute";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
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
    path: "/forgot-password",
    element: <ForgetPassword />,
    errorElement: <ErrorPage />,
  },

  {
    path: "/reset-password",
    element: <ResetPassword />,
    errorElement: <ErrorPage />,
  },

  {
    path: "/user-info",
    element: <UserInfo />,
    errorElement: <ErrorPage />,
  },

  {
    path: "/courses",
    element: (
      <ProtectedRoute allowedRoles={["learner", "instructor", "admin"]}>
        <NewPageLayout />
      </ProtectedRoute>
    ),
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
    element: (
      <ProtectedRoute allowedRoles={["learner", "instructor", "admin"]}>
        <CourseContent />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/course/submit",
    element: <AssignmentSubmit />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/instructor-screen",
    element: (
      <ProtectedRoute allowedRoles={["instructor"]}>
        <NewPageLayout>
          <InstructorScreen />
        </NewPageLayout>
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },

  {
    path: "/instructor/edit-course",
    element: (
      <ProtectedRoute allowedRoles={["instructor"]}>
        <EditCourseView />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },

  {
    path: "/admin-screen",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminScreen />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
];

export default routes;
