import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Plot from "react-plotly.js";
import "../CSS/Dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const [showProfile, setShowProfile] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullscreenGraph, setFullscreenGraph] = useState(null);
  const navigate = useNavigate();

  const profileRef = useRef();

  // Close profile dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/user", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
        else navigate("/login");
      });
  }, [navigate]);

  useEffect(() => {
    if (["matplotlib", "seaborn", "plotly"].includes(activeTab)) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % 5);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  const handleLogout = async () => {
    await fetch("http://localhost:5000/logout", {
      method: "POST",
      credentials: "include",
    });
    navigate("/login");
  };

  const matplotlibGraphs = [
    "/images/matplotlib/M1_line.png",
    "/images/matplotlib/M2_bar.png",
    "/images/matplotlib/M3_Scatter.png",
    "/images/matplotlib/M4_Histogram.png",
    "/images/matplotlib/M5_Pie.png",
  ];

  const seabornGraphs = [
    "/images/seaborn/S1_line.png",
    "/images/seaborn/S2_bar.png",
    "/images/seaborn/S3_Scatter.png",
    "/images/seaborn/S4_Histogram.png",
    "/images/seaborn/S5_Box.png",
  ];

  const plotlyGraphs = [
    { data: [{ x: [1, 2, 3], y: [2, 6, 3], mode: "lines+markers", type: "scatter" }], layout: { title: "Plotly - Trend Over Time" } },
    { data: [{ values: [19, 26, 55], labels: ["A", "B", "C"], type: "pie" }], layout: { title: "Plotly - Share Distribution" } },
    { data: [{ type: "bar", x: ["A", "B", "C"], y: [20, 14, 23] }], layout: { title: "Plotly - Category Comparison" } },
    { data: [{ type: "histogram", x: [1, 1, 2, 3, 3, 3, 4, 5, 5, 6] }], layout: { title: "Plotly - Histogram Example" } },
    { data: [{ z: [[1, 20, 30],[20, 1, 60],[30, 60, 1]], type: "heatmap" }], layout: { title: "Plotly - Heatmap" } },
  ];

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % 5);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + 5) % 5);

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Dashboard</h2>
        <button className={activeTab === "home" ? "active" : ""} onClick={() => setActiveTab("home")}>Home</button>
        <button className={activeTab === "matplotlib" ? "active" : ""} onClick={() => setActiveTab("matplotlib")}>Matplotlib</button>
        <button className={activeTab === "seaborn" ? "active" : ""} onClick={() => setActiveTab("seaborn")}>Seaborn</button>
        <button className={activeTab === "plotly" ? "active" : ""} onClick={() => setActiveTab("plotly")}>Plotly</button>
      </aside>

      {/* Main content */}
      <div className="main-content">
        {/* Header */}
        <header className="dashboard-header">
          <h1>{activeTab === "home" ? "Overview" : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>

          <div className="profile-dropdown-wrapper" ref={profileRef} style={{ position: "relative" }}>
            <span
              className="profile-name"
              onClick={() => setShowProfile(!showProfile)}
              style={{ cursor: "pointer" }}
            >
              {user?.name || "User"}
            </span>

            {showProfile && (
              <div className="profile-dropdown" style={{
                position: "absolute",
                top: "120%",
                right: 0,
                background: "#fff",
                border: "1px solid #ccc",
                borderRadius: "6px",
                padding: "0.8rem 1rem",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                zIndex: 1000,
              }}>
                <p><strong>Name:</strong> {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <button
                  onClick={() => {
                    handleLogout();
                    setShowProfile(false);
                  }}
                  className="logout-btn"
                  style={{ marginTop: "0.5rem", padding: "0.4rem 0.8rem", cursor: "pointer", background: "#f44336", color: "#fff", border: "none", borderRadius: "4px" }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="dashboard-content">
          {activeTab === "home" && <h2 className="welcome-text">Welcome, {user ? user.name : "User"} 🎉</h2>}

          {activeTab === "matplotlib" && (
            <div className="carousel">
              <button className="carousel-btn left" onClick={prevSlide}>❮</button>
              <img src={matplotlibGraphs[currentIndex]} alt={`Matplotlib ${currentIndex + 1}`} />
              <button className="carousel-btn right" onClick={nextSlide}>❯</button>
            </div>
          )}

          {activeTab === "seaborn" && (
            <div className="carousel">
              <button className="carousel-btn left" onClick={prevSlide}>❮</button>
              <img src={seabornGraphs[currentIndex]} alt={`Seaborn ${currentIndex + 1}`} />
              <button className="carousel-btn right" onClick={nextSlide}>❯</button>
            </div>
          )}

          {activeTab === "plotly" && (
            <div className="carousel">
              <button className="carousel-btn left" onClick={prevSlide}>❮</button>
              <div className="plotly-container" onClick={() => setFullscreenGraph(plotlyGraphs[currentIndex])}>
                <Plot
                  data={plotlyGraphs[currentIndex].data}
                  layout={{ ...plotlyGraphs[currentIndex].layout, autosize: true, height: 600, margin: { t: 50, b: 80, l: 60, r: 40 } }}
                  style={{ width: "100%", height: "100%" }}
                  useResizeHandler
                  config={{ responsive: true }}
                />
              </div>
              <button className="carousel-btn right" onClick={nextSlide}>❯</button>
            </div>
          )}
        </main>
      </div>

      {/* Fullscreen Modal for Plotly */}
      {fullscreenGraph && (
        <div className="fullscreen-modal" onClick={() => setFullscreenGraph(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <Plot
              data={fullscreenGraph.data}
              layout={{ ...fullscreenGraph.layout, autosize: true, width: window.innerWidth - 100, height: window.innerHeight - 100 }}
              style={{ width: "100%", height: "100%" }}
              useResizeHandler
              config={{ responsive: true }}
            />
            <button className="close-modal" onClick={() => setFullscreenGraph(null)}>✖ Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
