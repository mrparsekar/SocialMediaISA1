import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/Dashboard.css';

const Dashboard = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:5000/api/user", { credentials: "include" })
            .then(res => res.json())
            .then(data => {
                if (data.user) setUser(data.user);
                else navigate("/login");
            });
    }, [navigate]);

    const handleLogout = async () => {
        await fetch("http://localhost:5000/logout", { method: "POST", credentials: "include" });
        navigate("/login");
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-left">
                    <h1>Dashboard</h1>
                </div>
                <div className="header-right">
                    <div className="user-icon-container" onClick={toggleDropdown}>
                        <i className="fas fa-user-circle user-icon"></i>
                        {isDropdownOpen && (
                            <div className="user-dropdown">
                                <button onClick={handleLogout} className="logout-button">Logout</button>
                            </div>
                        )}
                    </div>
                    {/* Always-visible logout button */}
                    <button 
                        onClick={handleLogout} 
                        className="logout-button header-logout"
                        style={{
                            marginLeft: "1rem",
                            backgroundColor: "#ff4d4d",
                            color: "#fff",
                            border: "none",
                            padding: "8px 16px",
                            borderRadius: "5px",
                            cursor: "pointer"
                        }}
                    >
                        Logout
                    </button>
                </div>
            </header>

            <main className="dashboard-content">
                <span className="welcome-message" >Welcome,</span>
                <p>
                    {user ? ` ${user.name} (${user.email})` : "Welcome to your dashboard!"}
                </p>
            </main>
        </div>
    );
};

export default Dashboard;
