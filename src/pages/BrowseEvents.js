// src/pages/BrowseEvents.jsx
import React, { useState } from "react";
import {
  Sparkles,
  Bell,
  Search,
  Calendar,
  Users,
  Clock,
  MapPin,
  LogOut,
  Menu,
  X,
  User,
  Settings,
  TrendingUp,
  Flame,
  Star
} from "lucide-react";

const BrowseEventsPage = ({ user, onLogout, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const featuredEvents = [
    {
      id: 1,
      title: "Campus Music Festival",
      date: "Oct 20, 2025",
      time: "6:00 PM",
      tag: "HOT",
      location: "Main Auditorium",
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80",
    },
    {
      id: 2,
      title: "Student Art Exhibition",
      date: "Oct 25, 2025",
      time: "2:00 PM",
      tag: "NEW",
      location: "Art Gallery",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80",
    },
    {
      id: 3,
      title: "Inter-College Sports Meet",
      date: "Nov 1, 2025",
      time: "8:00 AM",
      tag: "TRENDING",
      location: "Sports Complex",
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80",
    },
  ];

  const upcomingEvents = [
    {
      id: 4,
      title: "Tech Symposium 2025",
      date: "Nov 5, 2025",
      attendees: 250,
      image: "https://images.unsplash.com/photo-1543258103-a62bdc0697bf?w=1200&q=80",
    },
    {
      id: 5,
      title: "Cultural Night",
      date: "Nov 8, 2025",
      attendees: 180,
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80",
    },
    {
      id: 6,
      title: "24hr Hackathon",
      date: "Nov 12, 2025",
      attendees: 320,
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80",
    },
  ];

  const trendingEvents = [
    {
      id: 7,
      title: "Startup Pitch Competition",
      date: "Nov 15, 2025",
      attendees: 150,
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&q=80",
    },
    {
      id: 8,
      title: "Photography Workshop",
      date: "Nov 18, 2025",
      attendees: 80,
      image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1200&q=80",
    },
    {
      id: 9,
      title: "Dance Battle Championship",
      date: "Nov 20, 2025",
      attendees: 200,
      image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=1200&q=80",
    },
  ];

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
                className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                Browse Events
              </button>
              <button 
                onClick={() => onNavigate("gallery")}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors">
                Event Gallery
              </button>
              <button className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors">
                My Registrations
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
                    {user?.name?.charAt(0) || 'P'}
                  </div>
                  <span className="font-medium text-slate-700 text-sm">{user?.name?.split(' ')[0] || 'Patel'}</span>
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

        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            <div className="px-4 py-3 space-y-1">
              <button onClick={() => onNavigate("home")} className="block w-full text-left px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg">
                Home
              </button>
              <button onClick={() => onNavigate("browse")} className="block w-full text-left px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg">
                Browse Events
              </button>
              <button onClick={() => onNavigate("gallery")} className="block w-full text-left px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg">
                Event Gallery
              </button>
              <button className="block w-full text-left px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg">
                My Registrations
              </button>
              <button className="block w-full text-left px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg">
                Profile
              </button>
              <button
                onClick={onLogout}
                className="block w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Page Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Browse All Events
            </h1>
            <p className="text-lg text-indigo-100 max-w-2xl mx-auto">
              Explore our complete collection of campus events and activities
            </p>
          </div>
        </div>
      </div>

      {/* Featured Events Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-1 h-8 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full"></div>
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-800">Featured Events</h2>
          <Flame className="w-6 h-6 text-orange-500" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {featuredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden group cursor-pointer border border-slate-100"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                
                <span
                  className={`absolute top-4 right-4 px-3 py-1 rounded-full text-white font-semibold text-xs ${
                    event.tag === "HOT"
                      ? "bg-red-500"
                      : event.tag === "NEW"
                      ? "bg-emerald-500"
                      : "bg-orange-500"
                  }`}
                >
                  {event.tag}
                </span>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-3 line-clamp-2">
                  {event.title}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-slate-600 text-sm">
                    <Calendar className="w-4 h-4 text-indigo-600 mr-2 flex-shrink-0" />
                    <span>{event.date}</span>
                    <Clock className="w-4 h-4 text-indigo-600 ml-4 mr-2 flex-shrink-0" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center text-slate-600 text-sm">
                    <MapPin className="w-4 h-4 text-indigo-600 mr-2 flex-shrink-0" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <button className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg font-semibold text-sm transition-all">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div className="bg-slate-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-1 h-8 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full"></div>
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-800">Upcoming Events</h2>
            <TrendingUp className="w-6 h-6 text-indigo-600" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden cursor-pointer border border-slate-100"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-3 line-clamp-2">
                    {event.title}
                  </h3>

                  <div className="flex items-center justify-between text-slate-600 text-sm mb-4">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-indigo-600" />
                      {event.date}
                    </span>
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-indigo-600" />
                      {event.attendees}
                    </span>
                  </div>

                  <button className="w-full py-2.5 border-2 border-indigo-600 text-indigo-600 rounded-xl font-semibold hover:bg-indigo-600 hover:text-white transition-all text-sm">
                    Register Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trending Events Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-1 h-8 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full"></div>
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-800">Trending Events</h2>
          <Star className="w-6 h-6 text-yellow-500" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {trendingEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden cursor-pointer border border-slate-100"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-3 line-clamp-2">
                  {event.title}
                </h3>

                <div className="flex items-center justify-between text-slate-600 text-sm mb-4">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-indigo-600" />
                    {event.date}
                  </span>
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-indigo-600" />
                    {event.attendees}
                  </span>
                </div>

                <button className="w-full py-2.5 border-2 border-indigo-600 text-indigo-600 rounded-xl font-semibold hover:bg-indigo-600 hover:text-white transition-all text-sm">
                  Register Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-xl">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Evently</span>
            </div>
            <p className="text-slate-400 text-sm">© 2025 Evently. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BrowseEventsPage;