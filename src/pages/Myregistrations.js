// src/pages/MyRegistrations.jsx
import React, { useState, useEffect } from "react";
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  Globe,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  Search,
  Filter,
  RefreshCw,
  XCircle
} from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

const MyRegistrationsPage = ({ user, onLogout, onNavigate }) => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmCancel, setConfirmCancel] = useState(null); // registration id to confirm cancel

  useEffect(() => {
    fetchMyRegistrations();
  }, []);

  const fetchMyRegistrations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.registrations.getMyRegistrations();
      if (response.success) {
        setRegistrations(response.data || []);
      } else {
        setError(response.message || "Failed to load registrations");
      }
    } catch (err) {
      setError(err.message || "Failed to load registrations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegistration = async (id) => {
    setCancellingId(id);
    setConfirmCancel(null);
    try {
      const response = await api.registrations.cancel(id);
      if (response.success) {
        setRegistrations((prev) => prev.filter((r) => r.id !== id));
        setSuccessMessage("Registration cancelled successfully.");
        setTimeout(() => setSuccessMessage(null), 4000);
      } else {
        setError(response.message || "Failed to cancel registration.");
      }
    } catch (err) {
      setError(err.message || "Failed to cancel registration.");
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (datetime) => {
    if (!datetime) return "TBA";
    return new Date(datetime).toLocaleDateString("en-US", {
      weekday: "short",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (datetime) => {
    if (!datetime) return "TBA";
    return new Date(datetime).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const isUpcoming = (datetime) => {
    if (!datetime) return false;
    return new Date(datetime) > new Date();
  };

  const filtered = registrations.filter((reg) => {
    const title = reg.event?.title || "";
    return title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar user={user} onLogout={onLogout} onNavigate={onNavigate} />
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
            <p className="text-slate-600 font-medium">Loading your registrations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/30">
      <Navbar user={user} onLogout={onLogout} onNavigate={onNavigate} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page Header */}
        <div className="mb-8">
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center space-x-2 text-slate-500 hover:text-purple-600 transition-colors mb-4 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-500 rounded-xl flex items-center justify-center">
                  <Ticket className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-slate-800">My Registrations</h1>
              </div>
              <p className="text-slate-500 ml-13 pl-1">
                {registrations.length} event{registrations.length !== 1 ? "s" : ""} registered
              </p>
            </div>
            <button
              onClick={fetchMyRegistrations}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 hover:border-purple-300 transition-all text-sm font-medium shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 flex items-center space-x-3 px-5 py-4 bg-green-50 border border-green-200 text-green-800 rounded-xl shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
            <span className="font-medium text-sm">{successMessage}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 flex items-center justify-between px-5 py-4 bg-red-50 border border-red-200 text-red-800 rounded-xl shadow-sm">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="font-medium text-sm">{error}</span>
            </div>
            <button onClick={() => setError(null)}>
              <XCircle className="w-5 h-5 text-red-400 hover:text-red-600" />
            </button>
          </div>
        )}

        {/* Search */}
        {registrations.length > 0 && (
          <div className="mb-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search your registered events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent shadow-sm text-sm"
            />
          </div>
        )}

        {/* Empty State */}
        {!loading && registrations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
              <Ticket className="w-10 h-10 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-700 mb-2">No Registrations Yet</h2>
            <p className="text-slate-500 mb-8 max-w-sm">
              You haven't registered for any events. Explore upcoming events and reserve your spot!
            </p>
            <button
              onClick={() => onNavigate("browse")}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Browse Events
            </button>
          </div>
        )}

        {/* No search results */}
        {!loading && registrations.length > 0 && filtered.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-1">No results found</h3>
            <p className="text-slate-400 text-sm">Try a different search term</p>
          </div>
        )}

        {/* Registration Cards */}
        <div className="space-y-4">
          {filtered.map((registration) => {
            const event = registration.event;
            const upcoming = isUpcoming(event?.start_datetime);

            return (
              <div
                key={registration.id}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all group"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Banner / Color strip */}
                  <div className="sm:w-48 h-40 sm:h-auto relative flex-shrink-0 overflow-hidden">
                    {event?.banner_image_url ? (
                      <img
                        src={event.banner_image_url}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                        <Calendar className="w-14 h-14 text-white/60" />
                      </div>
                    )}
                    {/* Status badge */}
                    <span
                      className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold ${
                        upcoming
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {upcoming ? "Upcoming" : "Past"}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      {event?.category && (
                        <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold mb-2">
                          {event.category.name}
                        </span>
                      )}
                      <h3 className="text-lg font-bold text-slate-800 mb-3 line-clamp-2">
                        {event?.title || "Unknown Event"}
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-500">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-purple-400 flex-shrink-0" />
                          <span>{formatDate(event?.start_datetime)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-purple-400 flex-shrink-0" />
                          <span>{formatTime(event?.start_datetime)}</span>
                        </div>
                        {event?.venue && (
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-purple-400 flex-shrink-0" />
                            <span className="truncate">{event.venue}</span>
                          </div>
                        )}
                        {event?.mode && (
                          <div className="flex items-center space-x-2">
                            <Globe className="w-4 h-4 text-purple-400 flex-shrink-0" />
                            <span className="capitalize">{event.mode}</span>
                          </div>
                        )}
                      </div>

                      {/* Registration date */}
                      {registration.created_at && (
                        <p className="text-xs text-slate-400 mt-3">
                          Registered on {formatDate(registration.created_at)}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-slate-100">
                      <button
                        onClick={() => onNavigate(`event-details-${event?.slug}`)}
                        className="px-4 py-2 text-sm font-medium text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
                      >
                        View Event
                      </button>

                      {upcoming && (
                        <>
                          {confirmCancel === registration.id ? (
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-slate-500">Are you sure?</span>
                              <button
                                onClick={() => handleCancelRegistration(registration.id)}
                                disabled={cancellingId === registration.id}
                                className="px-3 py-1.5 text-xs font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center space-x-1"
                              >
                                {cancellingId === registration.id ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : null}
                                <span>Yes, Cancel</span>
                              </button>
                              <button
                                onClick={() => setConfirmCancel(null)}
                                className="px-3 py-1.5 text-xs font-semibold bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                              >
                                Keep
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmCancel(registration.id)}
                              className="flex items-center space-x-1.5 px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Cancel Registration</span>
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyRegistrationsPage;