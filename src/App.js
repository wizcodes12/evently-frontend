// src/App.jsx
import React, { useState, useEffect } from "react";
import LandingPage from "./pages/Landing";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import HomePage from "./pages/Home";
import BrowseEventsPage from "./pages/BrowseEvents";
import EventGalleryPage from "./pages/EventGallery";
import EventDetailsPage from "./pages/EventDetails";

const App = () => {
  const [currentPage, setCurrentPage] = useState("landing");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [eventSlug, setEventSlug] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setCurrentPage("home");
      } catch (err) {
        console.error("Failed to parse user data:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    
    setIsLoading(false);
  }, []);

  // Handle successful login
  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage("home");
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setCurrentPage("landing");
  };

  // Handle page navigation with validation
  const handleNavigate = (page) => {
    // Check if it's an event details page (format: event-details-{slug})
    if (page.startsWith('event-details-')) {
      const slug = page.replace('event-details-', '');
      setEventSlug(slug);
      setCurrentPage('event-details');
      return;
    }

    // Valid pages
    const validPages = ["landing", "login", "register", "home", "browse", "gallery"];
    
    // If page is invalid, redirect to home or landing
    if (!validPages.includes(page)) {
      setCurrentPage(user ? "home" : "landing");
      return;
    }
    
    // If trying to access protected pages without login
    if (["home", "browse", "gallery"].includes(page) && !user) {
      setCurrentPage("login");
      return;
    }
    
    setCurrentPage(page);
  };

  // Show loading spinner while checking session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {currentPage === "landing" && (
        <LandingPage onNavigate={handleNavigate} />
      )}

      {currentPage === "login" && (
        <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />
      )}

      {currentPage === "register" && (
        <RegisterPage onNavigate={handleNavigate} onLogin={handleLogin} />
      )}

      {currentPage === "home" && user && (
        <HomePage
          user={user}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      )}

      {currentPage === "browse" && user && (
        <BrowseEventsPage
          user={user}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      )}

      {currentPage === "gallery" && user && (
        <EventGalleryPage
          user={user}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      )}

      {currentPage === "event-details" && user && eventSlug && (
        <EventDetailsPage
          eventSlug={eventSlug}
          user={user}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
};

export default App;