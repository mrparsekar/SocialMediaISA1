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
  
  const overview_images = [
    "/images/matplotlib/M1_line.png",
    "/images/seaborn/S1_line.png",
    "/images/matplotlib/M4_Histogram.png",
    "/images/seaborn/S3_Scatter.png",
    "/src/assets/Screenshot 2025-09-25 142620.png"
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

        <p>Version 1.1</p>
      </aside>

      {/* Main content */}
      <div className="main-content">
        {/* Header */}
        <header className="dashboard-header">
          {<h2 className="welcome-text">Welcome, {user ? user.name : "User"} 🎉</h2>}

          <div className="profile-dropdown-wrapper" ref={profileRef} style={{ position: "relative" }}>
          <div><img className="user-icon" src="/src/assets/user.svg" alt="" /></div>
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
            <h1>{activeTab === "home" ? "Overview" : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>

          <div id="graphs-section">

            {activeTab === "home" && (
              

              <div id="home-overview">

                <div className="overview-text">
                  <p>In this project, we performed an Exploratory Data Analysis (EDA) on the dataset “Trending Music on Instagram and Snapchat”. The EDA process began with understanding the dataset structure, identifying important columns such as platform, month, trend, trend_type, music, video_style, theme, part_of_song, video_length, and music_genre, and then cleaning and analyzing the data to extract meaningful insights. Different visualizations were used to represent trends and distributions. For example, bar charts were used to show the frequency of platforms and trend types, highlighting which platform (Instagram or Snapchat) had more trending music content. Pie charts provided a clear percentage share of different music genres, showing which genres dominate on social media trends. Line plots were used to visualize patterns across months, helping us see seasonal or time-based variations in trends. Histograms helped analyze video lengths to understand user preferences for short or long videos. Finally, scatter plots showed relationships between variables such as video length and trend types. Together, these visualizations help in better understanding audience behavior, music popularity, and platform usage patterns, providing actionable insights for integration into a dashboard for interactive analysis.</p>

                  <div>
                    <button className={activeTab === "matplotlib" ? "active" : "explore-btn" } onClick={() => setActiveTab("matplotlib")}>Explore Project</button>
                  </div>
                </div>

                <div className="carousel">
                <button className="carousel-btn left" onClick={prevSlide}>❮</button>
                <img className="graph-img" src={overview_images[currentIndex]} alt={`Matplotlib ${currentIndex + 1}`} />
                <button className="carousel-btn right" onClick={nextSlide}>❯</button>
            </div>
              </div>
            
          )}

          {activeTab === "matplotlib" && (
            <div className="carousel">
              <button className="carousel-btn left" onClick={prevSlide}>❮</button>
              <img className="graph-img" src={matplotlibGraphs[currentIndex]} alt={`Matplotlib ${currentIndex + 1}`} />
              <button className="carousel-btn right" onClick={nextSlide}>❯</button>
            </div>
          )}

          {activeTab === "seaborn" && (
            <div className="carousel">
              <button className="carousel-btn left" onClick={prevSlide}>❮</button>
              <img className="graph-img" src={seabornGraphs[currentIndex]} alt={`Seaborn ${currentIndex + 1}`} />
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
          </div>
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
