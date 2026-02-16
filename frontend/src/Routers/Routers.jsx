import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home, UserLandingPage } from "../pages";

export const Routers = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* User */}
        <Route path="/user/landing-page" element={<UserLandingPage />} />
      </Routes>
    </Router>
  );
};
