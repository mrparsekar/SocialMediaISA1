import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/Login.css";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/auth/login",
        { email, password },
        { withCredentials: true }
      );
      if (res.data.ok) {
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Login failed");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  const handleFacebookLogin = () => {
    window.location.href = "http://localhost:5000/auth/facebook";
  };

  const handleRegister = () => {
    navigate("/register");
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

      <div className="main-container">
        {/* Left Section */}
        <div className="left-section">

          <div>
            <img className="socialgif" src="src/assets/social.gif" alt="" />
          </div>
          <h1>
            Welcome to our <br /> <span>Social Media Web</span>
          </h1>
          <p>A whole new productive journey starts right here</p>
         

          
        </div>

        {/* Right Section */}
        <div className="right-section">
          <form className="login-form" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="form-options">
              
              <a href="/">Recovery Password?</a>
            </div>

            <button type="submit" className="signin-btn">SIGN IN</button>

            <div className="divider">or continue with</div>

            <div className="social-buttons">
              <button type="button" onClick={handleGoogleLogin} className="google-btn" backgroundColor="red"><img className="icons" src="src/assets/google.svg" alt="" /></button>
              <button type="button" onClick={handleFacebookLogin} className="facebook-btn"><img className="icons" src="src/assets/fb.svg" alt="" /></button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
