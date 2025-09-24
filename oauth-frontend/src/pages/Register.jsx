import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/Register.css";

import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const res = await axios.post(
        "http://localhost:5000/auth/register",
        { name, email, password, dob },
        { withCredentials: true }
      );
      if (res.data.ok) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
      setErr(error.response?.data?.message || "Registration failed");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  const handleFacebookLogin = () => {
    window.location.href = "http://localhost:5000/auth/facebook";
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="page-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-left">
         
        </div>
        <div className="nav-right">
          <a href="/login" className="signin-link">Sign In</a>
          <button onClick={handleRegister} className="register-btn">
            Register
          </button>
        </div>
      </nav>

      <div className="main-container1">
        {/* Left Section */}
        <div className="left-section">
          <div>
            <img className="socialgif" src="src/assets/social.gif" alt="" />
          </div>
          <h1>
            Join our <br /> <span>Community</span>
          </h1>
          <p>Start your productive journey by creating an account today</p>
         
        </div>

        {/* Right Section */}
        <div className="right-section">
          <form className="register-form" onSubmit={handleRegister}>
            {err && <div className="error-msg">{err}</div>}

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className="register-submit-btn">
              REGISTER
            </button>

            <div className="divider">or continue with</div>

            <div className="social-buttons">
              <button type="button" onClick={handleGoogleLogin} className="google-btn"><img className="icons" src="src/assets/google.svg" alt="" /></button>
              <button type="button" onClick={handleFacebookLogin} className="facebook-btn"><img className="icons" src="src/assets/fb.svg" alt="" /></button>
            </div>

            <div className="login-redirect">
              <p>Already have an account? <span onClick={handleLoginRedirect}>Sign In</span></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
