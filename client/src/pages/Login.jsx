import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import logo from "../assets/Images/logoIMS21Darkmode.png";
import illusionImg from "../assets/Images/ImsIllustration.png";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("user", JSON.stringify({ email }));
      setLoading(false);
      navigate("/dashboard");
    }, 500); // 0.5 seconds
  };

  return (
    <div className="h-screen bg-gray-200 flex items-center justify-center font-[Poppins]">
      <div className="w-[1000px] h-[580px] bg-white rounded-2xl overflow-hidden shadow-2xl flex">
        {/* LEFT PANEL */}
        <div className="w-[45%] px-14 py-20 flex flex-col justify-center">
          <h2 className="text-4xl font-semibold text-gray-800 mb-2">Hello.</h2>
          <p className="text-gray-400 mb-10 text-lg">Welcome back</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* EMAIL */}
            <div>
              <label className="text-sm text-gray-600 block mb-2">Email</label>
              <div className="flex items-center bg-gray-100 rounded-lg px-4">
                <Mail size={18} className="text-gray-400 mr-3" />
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-3 bg-transparent outline-none text-sm"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm text-gray-600 block mb-2">
                Password
              </label>
              <div className="flex items-center bg-gray-100 rounded-lg px-4">
                <Lock size={18} className="text-gray-400 mr-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-3 bg-transparent outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* FORGOT PASSWORD */}
            <div className="text-right">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-indigo-500 hover:underline transition-all"
              >
                Forgot password?
              </button>
            </div>

            {/* ERROR */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* SIGN IN BUTTON */}
            {/* SIGN IN BUTTON CONTAINER */}
            <div className="flex justify-center w-full">
              <button
                type="submit"
                disabled={loading}
                className={`w-3/4 py-3 mt-4 text-white rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-700 shadow-md transition duration-200
    ${
      loading
        ? "opacity-70 cursor-not-allowed"
        : "hover:scale-[1.02] active:scale-95"
    }`}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-[55%] bg-[#636AE8] flex flex-col items-center justify-between p-12 text-white">
          <div className="w-full flex items-center justify-center">
            <img
              src={logo}
              alt="Inventrax Logo"
              className="h-16 drop-shadow-lg"
            />
          </div>
          <div className="flex-1 flex items-center justify-center">
            <img
              src={illusionImg}
              alt="Inventory Illustration"
              className="w-150 max-w-[800px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
