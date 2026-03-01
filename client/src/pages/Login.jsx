import "./Login.css";

function Login() {
  return (
    <div className="page">
      <div className="login-card">

        {/* LEFT SIDE */}
        <div className="login-left">
          <h2 className="title">Hello.</h2>
          <p className="subtitle">Welcome back</p>

          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="Enter email" />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter password" />
          </div>

          <div className="forgot">
            <a href="#">Forgot password?</a>
          </div>

          <button className="login-btn">Sign in</button>
        </div>

        {/* RIGHT SIDE */}
        <div className="login-right">

          {/* LOGO + NAME SAME LINE */}
          <div className="brand">
            <img
              src="/logoIMS.png"
              alt="Logo"
              className="brand-icon"
            />
            <span className="brand-text">Inventrax</span>
          </div>

          {/* ILLUSTRATION UNDER LOGO */}
          <div className="illustration-wrapper">
            <img
              src="/illusion.png"
              alt="Illustration"
              className="illustration"
            />
          </div>

        </div>

      </div>
    </div>
  );
}

export default Login;