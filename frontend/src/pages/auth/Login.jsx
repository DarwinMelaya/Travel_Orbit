import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Background slider state
  const [bgImageIndex, setBgImageIndex] = useState(0);
  const [showingA, setShowingA] = useState(true);
  const bgLayerARef = useRef(null);
  const bgLayerBRef = useRef(null);

  const IMAGES = [
    "/images/ferry_1.jpg",
    "/images/ferry_2.jpg",
    "/images/ferry_4.jpg",
    "/images/ferry_3.jpg",
  ];

  // Background slider effect
  useEffect(() => {
    const interval = setInterval(() => {
      setBgImageIndex((prev) => (prev + 1) % IMAGES.length);
      setShowingA((prev) => !prev);
    }, 6500);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Implement actual login logic
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to landing page after successful login
      navigate("/user/landing-page");
    }, 1000);
  };

  return (
    <div className="min-h-screen font-questrial text-white relative flex items-center justify-center">
      {/* Background slider */}
      <div
        className="fixed inset-0 z-0 overflow-hidden bg-[#060a12]"
        aria-hidden="true"
      >
        <div
          ref={bgLayerARef}
          className="absolute inset-0 bg-cover bg-center scale-[1.08] transition-opacity duration-[550ms] ease-in-out"
          style={{
            backgroundImage: `url("${IMAGES[bgImageIndex]}")`,
            filter: "saturate(1.08) contrast(1.06) brightness(1.08)",
            opacity: showingA ? 1 : 0,
          }}
        />
        <div
          ref={bgLayerBRef}
          className="absolute inset-0 bg-cover bg-center scale-[1.08] transition-opacity duration-[550ms] ease-in-out"
          style={{
            backgroundImage: `url("${IMAGES[(bgImageIndex + 1) % IMAGES.length]}")`,
            filter: "saturate(1.08) contrast(1.06) brightness(1.08)",
            opacity: showingA ? 0 : 1,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(1200px 700px at 22% 28%, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.34) 70%),
              linear-gradient(90deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.22) 45%, rgba(0, 0, 0, 0.16) 100%),
              linear-gradient(180deg, rgba(0, 0, 0, 0.12) 0%, rgba(0, 0, 0, 0.3) 100%)
            `,
          }}
        />
        <div
          className="absolute left-[-220px] top-[52%] w-[720px] h-[720px] rounded-full blur-4 opacity-95"
          style={{
            background:
              "radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.28), transparent 62%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-10">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white/10 ring-1 ring-white/15">
              <img
                src="/images/logo.png"
                alt="Travel Orbit Logo"
                className="h-9 w-9 object-contain"
                loading="eager"
              />
            </div>
            <div className="leading-tight">
              <p className="font-poppins text-sm font-semibold tracking-wide">
                TRAVEL ORBIT
              </p>
              <p className="-mt-1 text-xs text-white/70">
                Ferry Booking System
              </p>
            </div>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 w-full max-w-md px-5 py-20">
        <div className="rounded-[28px] border border-white/16 bg-white/6 backdrop-blur-[18px] shadow-[0_22px_80px_rgba(0,0,0,0.45)] p-8 md:p-10">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 rounded-full px-[14px] py-[10px] border border-white/16 bg-white/6 backdrop-blur-[14px] text-white/85 text-xs mb-6">
              <span className="h-2 w-2 rounded-full bg-[rgba(16,185,129,0.95)] shadow-[0_0_0_6px_rgba(16,185,129,0.16)]"></span>
              Welcome back
            </div>
            <h1 className="font-poppins text-3xl md:text-4xl font-extrabold leading-tight mb-3">
              Sign in to your
              <br />
              <span className="text-[rgba(16,185,129,0.96)]">account</span>
            </h1>
            <p className="text-sm text-white/70">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block font-poppins text-[11px] tracking-[0.03em] text-white/72 mb-[10px]"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-[18px] border border-white/14 bg-white/6 p-[14px_19px] outline-none text-white/92 text-sm placeholder:text-white/50 focus:border-[rgba(16,185,129,0.5)] focus:bg-white/8 transition-all duration-200"
                  placeholder="you@example.com"
                />
                <span className="absolute right-[16px] top-1/2 -translate-y-1/2 text-white/50">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block font-poppins text-[11px] tracking-[0.03em] text-white/72 mb-[10px]"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-[18px] border border-white/14 bg-white/6 p-[14px_19px] pr-[50px] outline-none text-white/92 text-sm placeholder:text-white/50 focus:border-[rgba(16,185,129,0.5)] focus:bg-white/8 transition-all duration-200"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-[16px] top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-white/14 bg-white/6 text-[rgba(16,185,129,0.95)] focus:ring-[rgba(16,185,129,0.5)]"
                />
                <span className="text-white/70">Remember me</span>
              </label>
              <Link
                to="#"
                className="text-[rgba(16,185,129,0.95)] hover:text-[rgba(16,185,129,1)] transition-colors text-xs font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-[18px] border border-white/14 bg-[rgba(16,185,129,0.95)] text-white flex items-center justify-center gap-[10px] min-h-[56px] px-[18px] font-poppins font-extrabold text-sm hover:bg-[rgba(16,185,129,1)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_8px_24px_rgba(16,185,129,0.3)]"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h12" />
                    <path d="M13 6l6 6-6 6" />
                  </svg>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/14"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white/6 text-white/60 rounded-full">
                  OR
                </span>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-sm text-white/70">
                Don't have an account?{" "}
                <Link
                  to="/auth/signup"
                  className="text-[rgba(16,185,129,0.95)] hover:text-[rgba(16,185,129,1)] font-semibold transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-white/50">
            By signing in, you agree to our{" "}
            <Link to="#" className="text-white/70 hover:text-white">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="#" className="text-white/70 hover:text-white">
              Privacy Policy
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
