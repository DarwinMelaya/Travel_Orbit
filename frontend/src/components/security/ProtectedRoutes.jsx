import { Navigate, Outlet, useLocation } from "react-router-dom";

const ALLOWED_ROLES = ["customer", "user"];

const ProtectedRoutes = () => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  const location = useLocation();

  const user = userStr ? JSON.parse(userStr) : null;
  const hasAllowedRole = user && ALLOWED_ROLES.includes(user.role);

  if (!token || !hasAllowedRole) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
