import axios from "axios";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import illusionImg from "../assets/Images/ImsIllustration.png";
import logo from "../assets/Images/logoIMS21Darkmode.png";
import loginBg from "../assets/Images/Loginbg.png";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function ForgotPassword() {
  const navigate = useNavigate();

  // View States
  const [loading, setLoading] = useState(false);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [error, setError] = useState("");

  // Form States
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post(`${API_BASE_URL}/api/users/forgot-password`, { email });
      setShowOtpPopup(true);
    } catch (err) {
      setError(err.response?.data || "Email not registered in IMS.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword)
      return setError("Passwords do not match");
    if (otp.length !== 6) return setError("Please enter a valid 6-digit OTP");

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/users/verify-otp-reset`, {
        email,
        otp,
        newPassword,
      });
      // Instead of alert(), we show our success popup
      setShowOtpPopup(false);
      setShowSuccessPopup(true);
    } catch (err) {
      setError(err.response?.data || "Invalid OTP or request failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen flex items-center justify-center  bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      {/* 1. OTP POPUP OVERLAY */}
      {showOtpPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in duration-300">
            <div className="text-center mb-6">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="text-indigo-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Verify OTP</h3>
              <p className="text-gray-500 text-sm">
                Sent to <b>{email}</b>
              </p>
            </div>

            {error && (
              <div className="mb-4 p-2 bg-red-50 text-red-500 text-xs text-center border border-red-100 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <input
                type="text"
                maxLength="6"
                placeholder="000000"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-center text-2xl font-bold tracking-[0.5em] outline-none focus:ring-2 focus:ring-indigo-500"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <div className="relative">
                <Lock
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={18}
                />
                <input
                  type="password"
                  placeholder="New Password"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={18}
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition flex justify-center items-center gap-2"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  "Reset Password"
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowOtpPopup(false);
                  setError("");
                }}
                className="w-full text-gray-400 text-sm hover:underline"
              >
                Back to email
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. SUCCESS POPUP OVERLAY */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-10 text-center animate-in fade-in zoom-in duration-500">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="text-green-600" size={48} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Success!</h3>
            <p className="text-gray-500 mb-8">
              Your password has been reset successfully. You can now log in with
              your new credentials.
            </p>
            <button
              onClick={() => navigate("/")}
              className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition shadow-lg shadow-green-200"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}

      {/* MAIN EMAIL FORM */}
      <div className="w-[850px] h-[520px] bg-white rounded-2xl overflow-hidden flex shadow-[0_15px_40px_rgba(0,0,0,0.25),0_0_40px_rgba(255,255,255,0.5)]">
        <div className="w-[45%] px-14 py-20 flex flex-col justify-center relative">
          <button
            onClick={() => navigate("/")}
            className="absolute top-8 left-8 flex items-center text-sm text-indigo-500 hover:underline"
          >
            <ArrowLeft size={18} className="mr-2" /> Back to login
          </button>
          <h2 className="text-4xl font-semibold text-gray-800 mb-2">
            Forgot Password.
          </h2>
          <p className="text-gray-400 mb-10 text-md">
            Enter your email to receive an OTP code
          </p>
          {error && !showOtpPopup && (
            <div className="mb-4 text-red-500 text-xs font-medium">{error}</div>
          )}
          <form onSubmit={handleRequestOtp} className="space-y-6">
            <div className="flex items-center bg-gray-100 rounded-lg px-4 focus-within:ring-2 focus-within:ring-indigo-500 transition">
              <Mail size={18} className="text-gray-400 mr-3" />
              <input
                type="email"
                placeholder="user@eng.jfn.ac.lk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-3 bg-transparent outline-none text-sm"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex justify-center items-center"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                "Send OTP"
              )}
            </button>
          </form>
        </div>
        <div className="w-[55%] bg-[#636AE8] flex flex-col items-center justify-between p-12 text-white">
          <div className="w-full flex items-center justify-center">
            <img src={logo} alt="Logo" className="h-16 drop-shadow-xl" />
          </div>
          <div className="flex-1 flex items-center justify-center relative z-10">
            <img
              src={illusionImg}
              alt="Inventory Illustration"
              className="w-[130%] max-w-[520px] drop-shadow-2xl transform hover:translate-y-[-10px] transition-transform duration-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
