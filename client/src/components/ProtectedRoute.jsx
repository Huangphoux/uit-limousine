import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  // Not logged in - redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user role is allowed
  // Handle role as array, object, or string
  let userRole;
  if (Array.isArray(user.role) && user.role.length > 0) {
    // Role is array like ['INSTRUCTOR']
    userRole = user.role[0].toLowerCase();
  } else if (typeof user.role === "string") {
    userRole = user.role.toLowerCase();
  } else if (user.role?.name) {
    userRole = user.role.name.toLowerCase();
  } else if (user.role?.type) {
    userRole = user.role.type.toLowerCase();
  } else {
    console.error("Unknown role structure:", user.role);
    return <Navigate to="/login" replace />;
  }

  const isAllowed = allowedRoles.includes(userRole);

  if (!isAllowed) {
    // Redirect to appropriate page based on user role
    if (userRole === "learner") {
      return <Navigate to="/courses" replace />;
    } else if (userRole === "instructor") {
      return <Navigate to="/instructor-screen" replace />;
    } else if (userRole === "admin") {
      return <Navigate to="/admin-screen" replace />;
    }
    // Fallback
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
