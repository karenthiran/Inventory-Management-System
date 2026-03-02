import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-gray-200 flex items-center justify-center font-[Poppins]">
      <div className="w-[1000px] h-[580px] bg-white rounded-xl flex overflow-hidden shadow-2xl">
        {/* LEFT SIDE */}
        <div className="w-[45%] px-16 py-20 flex flex-col justify-center">
          <h2 className="text-3xl font-semibold">Hello.</h2>
          <p className="text-gray-400 mb-8">Welcome back</p>

          <div className="mb-5">
            <label className="text-sm block mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter email"
              className="w-full p-3 bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="mb-5">
            <label className="text-sm block mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full p-3 bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="text-right mb-6">
            <a href="#" className="text-sm text-indigo-500">
              Forgot password?
            </a>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="w-3/4 py-3 text-white rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-700 hover:opacity-90 transition duration-200"
          >
            Sign in
          </button>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-[55%] bg-gradient-to-br from-indigo-400 to-indigo-700 flex flex-col items-center p-10">
          {/* Brand */}
          <div className="w-full flex items-center gap-4 mb-8">
            <img src="/logoIMS.png" alt="Logo" className="h-14" />
            <span className="text-4xl font-semibold text-white tracking-widest">
              Inventrax
            </span>
          </div>

          {/* Illustration */}
          <div className="flex-1 flex items-center justify-center">
            <img
              src="/illusion.png"
              alt="Illustration"
              className="w-4/5 max-w-[520px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
