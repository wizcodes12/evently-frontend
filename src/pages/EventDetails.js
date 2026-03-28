// src/pages/EventDetails.jsx
import React, { useState, useEffect } from "react";
import {
  Sparkles, Bell, Menu, X, User, Settings, LogOut,
  Calendar, Clock, MapPin, Users, Globe, ArrowLeft,
  Share2, Heart, ExternalLink, AlertCircle, CheckCircle2,
  Loader2, Ticket
} from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

const EventDetailsPage = ({ eventSlug, user, onLogout, onNavigate }) => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  // Registration state
  const [registering, setRegistering] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registerError, setRegisterError] = useState(null);

  useEffect(() => {
    fetchEventDetails();
  }, [eventSlug]);

  const fetchEventDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.events.getBySlug(eventSlug);
      if (response.success) {
        setEvent(response.data);
      } else {
        setError(response.message || "Failed to load event details");
      }
    } catch (err) {
      setError(err.message || "Failed to load event details");
    } finally {
      setLoading(false);
    }
  };

const handleRegister = async () => {
  if (!event?.id) return;
  setRegistering(true);
  setRegisterError(null);
  setRegisterSuccess(false);
  try {
    const response = await api.registrations.register(event.id, user.id); // 👈 pass user.id
    if (response.success) {
      setRegisterSuccess(true);
    } else {
      setRegisterError(response.message || "Registration failed. Please try again.");
    }
  } catch (err) {
    setRegisterError(err.message || "Registration failed. Please try again.");
  } finally {
    setRegistering(false);
  }
};

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: event.title, text: event.description, url: window.location.href });
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const formatDate = (datetime) => {
    if (!datetime) return "TBA";
    return new Date(datetime).toLocaleDateString("en-US", {
      weekday: "long", month: "long", day: "numeric", year: "numeric",
    });
  };

  const formatTime = (datetime) => {
    if (!datetime) return "TBA";
    return new Date(datetime).toLocaleTimeString("en-US", {
      hour: "numeric", minute: "2-digit", hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar user={user} onLogout={onLogout} onNavigate={onNavigate} />
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
            <p className="text-slate-600 font-medium">Loading event details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar user={user} onLogout={onLogout} onNavigate={onNavigate} />
        <div className="flex items-center justify-center h-[70vh] p-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Error Loading Event</h2>
            <p className="text-slate-600 mb-6">{error}</p>
            <div className="space-y-3">
              <button onClick={fetchEventDetails} className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
                Retry
              </button>
              <button onClick={() => onNavigate("home")} className="w-full px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium">
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Navbar user={user} onLogout={onLogout} onNavigate={onNavigate} />

      {/* Back Button */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center space-x-2 text-slate-600 hover:text-purple-600 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Events</span>
        </button>
      </div>

      {/* Banner */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
          {event.banner_image_url ? (
            <img src={event.banner_image_url} alt={event.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Calendar className="w-32 h-32 text-white/40" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {event.is_featured && (
            <span className="absolute top-6 right-6 px-4 py-2 bg-orange-500 text-white font-bold rounded-full text-sm">
              FEATURED
            </span>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-8">
            {event.category && (
              <span className="inline-block px-4 py-1.5 bg-purple-600 text-white rounded-full text-sm font-semibold mb-4">
                {event.category.name}
              </span>
            )}
            <h1 className="text-4xl lg:text-5xl font-bold text-white">
              {event.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">About This Event</h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                {event.description || "No description available."}
              </p>
            </div>

            {event.meeting_link && (
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100">
                <div className="flex items-start space-x-3">
                  <ExternalLink className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800 mb-2">Meeting Link</h3>
                    <a
                      href={event.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-700 underline break-all"
                    >
                      {event.meeting_link}
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Date</p>
                    <p className="font-semibold text-slate-800">{formatDate(event.start_datetime)}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Time</p>
                    <p className="font-semibold text-slate-800">
                      {formatTime(event.start_datetime)}
                      {event.end_datetime && ` – ${formatTime(event.end_datetime)}`}
                    </p>
                  </div>
                </div>

                {event.venue && (
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Venue</p>
                      <p className="font-semibold text-slate-800">{event.venue}</p>
                    </div>
                  </div>
                )}

                {event.mode && (
                  <div className="flex items-start space-x-3">
                    <Globe className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Mode</p>
                      <p className="font-semibold text-slate-800 capitalize">{event.mode}</p>
                    </div>
                  </div>
                )}

                {event.max_participants && (
                  <div className="flex items-start space-x-3">
                    <Users className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Max Participants</p>
                      <p className="font-semibold text-slate-800">{event.max_participants}</p>
                    </div>
                  </div>
                )}

                {event.registration_deadline && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800">
                      <span className="font-semibold">Registration Deadline:</span><br />
                      {formatDate(event.registration_deadline)}
                    </p>
                  </div>
                )}
              </div>

              {/* Registration feedback */}
              {registerSuccess && (
                <div className="mb-4 flex items-center space-x-2 px-4 py-3 bg-green-50 border border-green-200 text-green-800 rounded-xl text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="font-medium">Successfully registered! Check <button onClick={() => onNavigate("my-registrations")} className="underline">My Registrations</button>.</span>
                </div>
              )}
              {registerError && (
                <div className="mb-4 flex items-center space-x-2 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span>{registerError}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                {registerSuccess ? (
                  <button
                    onClick={() => onNavigate("my-registrations")}
                    className="w-full px-6 py-3.5 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all flex items-center justify-center space-x-2"
                  >
                    <Ticket className="w-4 h-4" />
                    <span>View My Registrations</span>
                  </button>
                ) : (
                  <button
                    onClick={handleRegister}
                    disabled={registering}
                    className="w-full px-6 py-3.5 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-70 flex items-center justify-center space-x-2"
                  >
                    {registering ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Registering...</span>
                      </>
                    ) : (
                      <span>Register Now</span>
                    )}
                  </button>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`px-4 py-2.5 rounded-xl font-medium transition-all flex items-center justify-center space-x-2 ${
                      isFavorite
                        ? "bg-red-50 text-red-600 border-2 border-red-200"
                        : "bg-slate-50 text-slate-700 border-2 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
                    <span className="text-sm">Save</span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="px-4 py-2.5 bg-slate-50 text-slate-700 border-2 border-slate-200 rounded-xl font-medium hover:bg-slate-100 transition-all flex items-center justify-center space-x-2"
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="text-sm">Share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;