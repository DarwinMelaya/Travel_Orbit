import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home, UserLandingPage, Login, SignUp } from "../pages";
import ProtectedRoutes from "../components/security/ProtectedRoutes";

export const Routers = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Auth */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<SignUp />} />
        {/* Protected: customer/user only */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/user/landing-page" element={<UserLandingPage />} />
        </Route>
      </Routes>
    </Router>
  );
};
