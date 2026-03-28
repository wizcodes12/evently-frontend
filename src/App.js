// src/App.jsx
import React, { useState, useEffect } from "react";
import LandingPage from "./pages/Landing";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import HomePage from "./pages/Home";
import BrowseEventsPage from "./pages/BrowseEvents";
import EventGalleryPage from "./pages/EventGallery";
import EventDetailsPage from "./pages/EventDetails";
import MyRegistrationsPage from "./pages/Myregistrations";
import Chatbot from "./components/Chatbot";

const App = () => {
  const [currentPage, setCurrentPage] = useState("landing");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [eventSlug, setEventSlug] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setCurrentPage("home");
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);

    // Listen for expired token - auto logout
    const handleAutoLogout = () => {
      setUser(null);
      setCurrentPage("login");
      alert("Your session has expired. Please login again.");
    };
    window.addEventListener("auth:logout", handleAutoLogout);
    return () => window.removeEventListener("auth:logout", handleAutoLogout);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage("home");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setCurrentPage("landing");
  };

  const handleNavigate = (page) => {
    if (page.startsWith("event-details-")) {
      setEventSlug(page.replace("event-details-", ""));
      setCurrentPage("event-details");
      return;
    }
    const validPages = ["landing","login","register","home","browse","gallery","my-registrations"];
    if (!validPages.includes(page)) { setCurrentPage(user ? "home" : "landing"); return; }
    if (["home","browse","gallery","my-registrations"].includes(page) && !user) { setCurrentPage("login"); return; }
    setCurrentPage(page);
  };

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

  const shared = { user, onLogout: handleLogout, onNavigate: handleNavigate };

  return (
    <div>
      {currentPage === "landing"          && <LandingPage onNavigate={handleNavigate} />}
      {currentPage === "login"            && <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />}
      {currentPage === "register"         && <RegisterPage onNavigate={handleNavigate} onLogin={handleLogin} />}
      {currentPage === "home"             && user && <HomePage {...shared} />}
      {currentPage === "browse"           && user && <BrowseEventsPage {...shared} />}
      {currentPage === "gallery"          && user && <EventGalleryPage {...shared} />}
      {currentPage === "my-registrations" && user && <MyRegistrationsPage {...shared} />}
      {currentPage === "event-details"    && user && eventSlug && <EventDetailsPage {...shared} eventSlug={eventSlug} />}
      <Chatbot />
    </div>
  );
};

export default App;