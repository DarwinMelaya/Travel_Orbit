import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home, UserLandingPage, Login, SignUp } from "../pages";

export const Routers = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Auth */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<SignUp />} />
        {/* User */}
        <Route path="/user/landing-page" element={<UserLandingPage />} />
      </Routes>
    </Router>
  );
};
