import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import logo from "../assets/Images/logoIMS21Darkmode.png";
import illusionImg from "../assets/Images/ImsIllustration.png";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);

    // Simulated API call
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
    }, 1200);
  };

  return (
    <div className="h-screen bg-gray-200 flex items-center justify-center font-[Poppins]">
      <div className="w-[1000px] h-[580px] bg-white rounded-2xl overflow-hidden shadow-2xl flex">
        {/* LEFT PANEL */}
        <div className="w-[45%] px-14 py-20 flex flex-col justify-center relative">
          {/* BACK BUTTON */}
          <button
            onClick={() => navigate("/")}
            className="absolute top-8 left-8 flex items-center text-sm text-indigo-500 hover:underline transition-all"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to login
          </button>

          {!isSubmitted ? (
            <>
              <h2 className="text-4xl font-semibold text-gray-800 mb-2">
                Forgot Password.
              </h2>
              <p className="text-gray-400 mb-10 text-lg">
                Enter your email to reset your password
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* EMAIL */}
                <div>
                  <label className="text-sm text-gray-600 block mb-2">
                    Email
                  </label>
                  <div className="flex items-center bg-gray-100 rounded-lg px-4 focus-within:ring-2 focus-within:ring-indigo-500 transition">
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

                {/* SUBMIT BUTTON */}
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
                    {loading ? "Sending..." : "Send Reset Link"}
                  </button>
                </div>
              </form>
            </>
          ) : (
            /* SUCCESS STATE */
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <CheckCircle2 size={48} className="text-green-500" />
              </div>
              <h2 className="text-3xl font-semibold text-gray-800 mb-3">
                Check your email
              </h2>
              <p className="text-gray-400 text-lg">
                We've sent a reset link to
              </p>
              <p className="font-semibold text-gray-700 mt-2">{email}</p>

              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-6 text-indigo-500 hover:underline text-sm"
              >
                Try again
              </button>
            </div>
          )}
        </div>

        {/* RIGHT PANEL (Same as Login) */}
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
              alt="Reset Illustration"
              className="w-150 max-w-[800px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
