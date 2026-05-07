import axios from "axios";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import illusionImg from "../assets/Images/ImsIllustration.png";
import loginBg from "../assets/Images/Loginbg.png";
import logo from "../assets/Images/logoIMS21Darkmode.png";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      // Connect to your Spring Boot Backend login endpoint
      const response = await axios.post(`${API_BASE_URL}/api/users/login`, {
        email: email,
        password: password,
      });

      // On success, save user data and navigate
      // response.data now contains the User object from your PostgreSQL table
      localStorage.setItem("user", JSON.stringify(response.data));
      // Inside your login success handler
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("userEmail", response.data.email);
      localStorage.setItem("role", response.data.role);
      navigate("/dashboard/home");
    } catch (err) {
      // Log the full error to the browser console for debugging
      console.error("Login Error Details:", err.response);

      // Display the specific error message from the backend (e.g., "Invalid credentials")
      setError(
        err.response?.data ||
          "Connection failed. Please check if the server is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen flex items-center justify-center  bg-cover bg-center bg-no-repeat "
      style={{ backgroundImage: `url(${loginBg}) ` }}
    >
      <div className="w-[850px] h-[520px] bg-white rounded-2xl overflow-hidden flex transition-all duration-300 shadow-[0_15px_40px_rgba(0,0,0,0.25),0_0_40px_rgba(255,255,255,0.5)]">
        {/* LEFT PANEL - Form Section */}
        <div className="w-[45%] px-14 py-20 flex flex-col justify-center">
          <h2 className="text-4xl font-semibold text-gray-800 mb-2">Hello!</h2>
          <p className="text-gray-400 mb-10 text-lg">Welcome back</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* EMAIL INPUT */}
            <div>
              <label className="text-sm text-gray-600 block mb-2 font-medium">
                Email Address
              </label>
              <div className="flex items-center bg-gray-50 border border-gray-100 rounded-lg px-4 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                <Mail size={18} className="text-gray-400 mr-3" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-3 bg-transparent outline-none text-sm"
                  required
                />
              </div>
              <div className="text-xs text-gray-700">
                Test_Email:superadmin@gmail.com
              </div>
            </div>

            {/* PASSWORD INPUT */}
            <div>
              <label className="text-sm text-gray-600 block mb-2 font-medium">
                Password
              </label>
              <div className="flex items-center bg-gray-50 border border-gray-100 rounded-lg px-4 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                <Lock size={18} className="text-gray-400 mr-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-3 bg-transparent outline-none text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-indigo-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="text-xs text-gray-700">password:Supper@min</div>
            </div>

            {/* FORGOT PASSWORD */}
            <div className="text-right">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-indigo-500 font-medium hover:underline transition-all"
              >
                Forgot password?
              </button>
            </div>

            {/* ERROR DISPLAY */}
            {error && (
              <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg border border-red-100 animate-pulse">
                {error}
              </div>
            )}

            {/* SIGN IN BUTTON */}
            <div className="flex justify-center w-full">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 mt-4 text-white font-semibold rounded-lg bg-linear-to-r from-indigo-500 to-indigo-700 shadow-lg shadow-indigo-100 transition-all duration-200
                  ${loading ? "opacity-70 cursor-wait" : "hover:scale-[1.01] active:scale-95 hover:shadow-indigo-200"}
                `}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT PANEL - Illustration Section */}
        <div className="w-[55%] bg-[#636AE8] flex flex-col items-center justify-between p-12 text-white relative overflow-hidden">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>

          <div className="w-full flex items-center justify-center relative z-10">
            <img src={logo} alt="IMS Logo" className="h-16 drop-shadow-2xl" />
          </div>

          <div className="flex-1 flex items-center justify-center relative z-10">
            <img
              src={illusionImg}
              alt="Inventory Illustration"
              className="w-[130%] max-w-[520px] drop-shadow-2xl transform hover:translate-y-[-10px] transition-transform duration-500"
            />
          </div>

          <div className="absolute bottom-2 left-0 w-full text-center  z-10">
            <p className="text-white text-sm font-medium drop-shadow-md">
              Inventory Management System
            </p>
            <p className="text-xs mt-1 text-white/80">
              © 2026 Faculty of Engineering
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
