import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Fake login (accept any non-empty input)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.email && formData.password) {
      localStorage.setItem("isLoggedIn", "true"); // fake auth
      navigate("/dashboard");
    } else {
      alert("Please enter email and password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold">LOGO</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-purple-600">
          Welcome Back
        </h2>
        <p className="text-gray-500 text-center mt-2 mb-6">
          Sign in to continue to your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Email Address
            </label>
            <div className="flex items-center mt-1 bg-gray-100 rounded-lg px-3 py-2">
              <Mail size={18} className="text-gray-400 mr-2" />
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-transparent outline-none w-full text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between text-sm">
              <label className="font-medium text-gray-600">Password</label>
              <span className="text-purple-600 cursor-pointer hover:underline">
                Forgot password?
              </span>
            </div>

            <div className="flex items-center mt-1 bg-gray-100 rounded-lg px-3 py-2">
              <Lock size={18} className="text-gray-400 mr-2" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="bg-transparent outline-none w-full text-sm"
              />
              {showPassword ? (
                <EyeOff
                  size={18}
                  onClick={() => setShowPassword(false)}
                  className="text-gray-400 cursor-pointer"
                />
              ) : (
                <Eye
                  size={18}
                  onClick={() => setShowPassword(true)}
                  className="text-gray-400 cursor-pointer"
                />
              )}
            </div>
          </div>

          {/* Remember me */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <input type="checkbox" />
            <span>Remember me for 30 days</span>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl text-white font-semibold 
                       bg-gradient-to-r from-purple-500 to-purple-700 
                       hover:opacity-90 transition"
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="px-3 text-gray-400 text-sm">Or continue with</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Social Buttons with real logos */}
        <div className="flex justify-between gap-3">
          <button className="flex-1 border rounded-lg py-2 hover:bg-gray-50 flex justify-center">
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
              alt="Google"
              className="w-5 h-5"
            />
          </button>

          <button className="flex-1 border rounded-lg py-2 hover:bg-gray-50 flex justify-center">
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg"
              alt="Facebook"
              className="w-5 h-5"
            />
          </button>

          <button className="flex-1 border rounded-lg py-2 hover:bg-gray-50 flex justify-center">
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
              alt="GitHub"
              className="w-5 h-5"
            />
          </button>
        </div>

        {/* Signup */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account?{" "}
          <span className="text-purple-600 font-medium cursor-pointer hover:underline">
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
