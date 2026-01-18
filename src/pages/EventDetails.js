// src/pages/EventDetails.jsx
import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Bell,
  Menu,
  X,
  User,
  Settings,
  LogOut,
  Calendar,
  Clock,
  MapPin,
  Users,
  Globe,
  ArrowLeft,
  Share2,
  Heart,
  ExternalLink,
  AlertCircle
} from "lucide-react";
import api from "../api/axios";

const EventDetailsPage = ({ eventSlug, user, onLogout, onNavigate }) => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

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
      }
    } catch (err) {
      console.error('Error fetching event details:', err);
      setError(err.message || 'Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (datetime) => {
    if (!datetime) return 'TBA';
    const date = new Date(datetime);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (datetime) => {
    if (!datetime) return 'TBA';
    const date = new Date(datetime);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleRegister = () => {
    alert('Registration functionality coming soon!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      });
    } else {
      alert('Share functionality not supported on this browser');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Error Loading Event</h2>
            <p className="text-slate-600 mb-6">{error}</p>
            <div className="space-y-3">
              <button 
                onClick={fetchEventDetails}
                className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Retry
              </button>
              <button 
                onClick={() => onNavigate('home')}
                className="w-full px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* NAVBAR */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-xl">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Evently
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-1">
              <button 
                onClick={() => onNavigate("home")}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors">
                Home
              </button>
              <button 
                onClick={() => onNavigate("browse")}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors">
                Browse Events
              </button>
              <button 
                onClick={() => onNavigate("gallery")}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors">
                Event Gallery
              </button>
              
              <button className="relative p-2 text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors ml-2">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="relative ml-4">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="font-medium text-slate-700 text-sm">{user?.name?.split(' ')[0]}</span>
                </button>

                {isProfileMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setIsProfileMenuOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-20">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="font-semibold text-slate-800">{user?.name}</p>
                        <p className="text-sm text-slate-500">{user?.email}</p>
                      </div>
                      <button className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center space-x-3 text-slate-700 text-sm">
                        <User className="w-4 h-4" />
                        <span>My Profile</span>
                      </button>
                      <button className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center space-x-3 text-slate-700 text-sm">
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </button>
                      <div className="border-t border-slate-100 my-1"></div>
                      <button
                        onClick={onLogout}
                        className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-red-600 flex items-center space-x-3 text-sm"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            <button
              className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Back Button */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button 
          onClick={() => onNavigate('home')}
          className="flex items-center space-x-2 text-slate-600 hover:text-indigo-600 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Events</span>
        </button>
      </div>

      {/* Event Header Image */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
          {event.banner_image ? (
            <img 
              src={event.banner_image} 
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
              <Calendar className="w-32 h-32 text-indigo-300" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          
          {event.is_featured && (
            <span className="absolute top-6 right-6 px-4 py-2 bg-orange-500 text-white font-bold rounded-full text-sm">
              FEATURED
            </span>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-3xl">
              {event.category && (
                <span className="inline-block px-4 py-1.5 bg-indigo-600 text-white rounded-full text-sm font-semibold mb-4">
                  {event.category.name}
                </span>
              )}
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                {event.title}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Event Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">About This Event</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                  {event.description || 'No description available.'}
                </p>
              </div>
            </div>

            {event.meeting_link && (
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
                <div className="flex items-start space-x-3">
                  <ExternalLink className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800 mb-2">Meeting Link</h3>
                    <a 
                      href={event.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-700 underline break-all"
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
              {/* Event Details */}
              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Date</p>
                    <p className="font-semibold text-slate-800">{formatDate(event.start_datetime)}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Time</p>
                    <p className="font-semibold text-slate-800">
                      {formatTime(event.start_datetime)}
                      {event.end_datetime && ` - ${formatTime(event.end_datetime)}`}
                    </p>
                  </div>
                </div>

                {event.venue && (
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Venue</p>
                      <p className="font-semibold text-slate-800">{event.venue}</p>
                    </div>
                  </div>
                )}

                {event.mode && (
                  <div className="flex items-start space-x-3">
                    <Globe className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Mode</p>
                      <p className="font-semibold text-slate-800 capitalize">{event.mode}</p>
                    </div>
                  </div>
                )}

                {event.max_participants && (
                  <div className="flex items-start space-x-3">
                    <Users className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
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

              {/* Action Buttons */}
              <div className="space-y-3">
                <button 
                  onClick={handleRegister}
                  className="w-full px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Register Now
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`px-4 py-2.5 rounded-xl font-medium transition-all flex items-center justify-center space-x-2 ${
                      isFavorite 
                        ? 'bg-red-50 text-red-600 border-2 border-red-200' 
                        : 'bg-slate-50 text-slate-700 border-2 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
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