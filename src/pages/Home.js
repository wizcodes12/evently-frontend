// src/pages/HomePage.jsx
import React, { useState, useEffect } from "react";
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
  AlertCircle,
  SlidersHorizontal
} from "lucide-react";
import api from "../api/axios";

const HomePage = ({ user = { name: "Patel", email: "patel@example.com" }, onLogout = () => {}, onNavigate = () => {} }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [filteredFeatured, setFilteredFeatured] = useState([]);
  const [filteredUpcoming, setFilteredUpcoming] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMode, setSelectedMode] = useState("all");

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Apply filters whenever dependencies change
  useEffect(() => {
    applyFilters();
  }, [featuredEvents, upcomingEvents, searchQuery, selectedCategory, selectedMode]);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);

    try {
      const [featuredRes, latestRes] = await Promise.all([
        api.events.getFeatured(),
        api.events.getLatest()
      ]);

      if (featuredRes.success) {
        setFeaturedEvents(featuredRes.data);
      }

      if (latestRes.success) {
        setUpcomingEvents(latestRes.data);
      }

    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered1 = [...featuredEvents];
    let filtered2 = [...upcomingEvents];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      
      filtered1 = filtered1.filter(event =>
        event.title.toLowerCase().includes(query) ||
        event.description?.toLowerCase().includes(query) ||
        event.venue?.toLowerCase().includes(query)
      );

      filtered2 = filtered2.filter(event =>
        event.title.toLowerCase().includes(query) ||
        event.description?.toLowerCase().includes(query) ||
        event.venue?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered1 = filtered1.filter(event => 
        event.category?.name.toLowerCase() === selectedCategory.toLowerCase()
      );
      filtered2 = filtered2.filter(event => 
        event.category?.name.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Mode filter
    if (selectedMode !== "all") {
      filtered1 = filtered1.filter(event => 
        event.mode?.toLowerCase() === selectedMode.toLowerCase()
      );
      filtered2 = filtered2.filter(event => 
        event.mode?.toLowerCase() === selectedMode.toLowerCase()
      );
    }

    setFilteredFeatured(filtered1);
    setFilteredUpcoming(filtered2);
  };

  // Format date helper
  const formatDate = (datetime) => {
    if (!datetime) return 'TBA';
    const date = new Date(datetime);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Format time helper
  const formatTime = (datetime) => {
    if (!datetime) return 'TBA';
    const date = new Date(datetime);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Get unique event titles for suggestions (remove duplicates)
  const getSuggestions = () => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    const allEvents = [...featuredEvents, ...upcomingEvents];
    
    // Use Set to remove duplicate titles
    const uniqueTitles = [...new Set(allEvents.map(e => e.title))];
    
    return uniqueTitles
      .filter(title => title.toLowerCase().includes(query))
      .slice(0, 5);
  };

  // Get unique categories
  const getUniqueCategories = () => {
    const allEvents = [...featuredEvents, ...upcomingEvents];
    const categories = allEvents
      .map(event => event.category?.name)
      .filter(Boolean);
    return [...new Set(categories)];
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(true);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
  };

  // Handle search button click
  const handleSearchSubmit = () => {
    setShowSuggestions(false);
  };

  // Handle event click
  const handleEventClick = (slug) => {
    onNavigate(`event-details-${slug}`);
  };

  const suggestions = getSuggestions();

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
                className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
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
              <button onClick={() => onNavigate("home")} className="block w-full text-left px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg">
                Home
              </button>
              <button onClick={() => onNavigate("browse")} className="block w-full text-left px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg">
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

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
              Welcome back, {user?.name?.split(' ')[0] || 'Patel'}! 👋
            </h1>
            <p className="text-lg text-indigo-100 max-w-2xl">
              Discover amazing events happening on your campus today
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-12">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for events, workshops, festivals..."
                className="w-full py-3.5 pl-12 pr-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all outline-none text-slate-800"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setShowSuggestions(true)}
              />

              {showSuggestions && suggestions.length > 0 && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowSuggestions(false)}
                  ></div>
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-20 max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors text-slate-700 flex items-center space-x-3"
                      >
                        <Search className="w-4 h-4 text-slate-400" />
                        <span>{suggestion}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span>Filters</span>
            </button>

            <button 
              onClick={handleSearchSubmit}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-medium">
              Search
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="pt-4 border-t border-slate-200">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  >
                    <option value="all">All Categories</option>
                    {getUniqueCategories().map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Mode</label>
                  <select
                    value={selectedMode}
                    onChange={(e) => setSelectedMode(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  >
                    <option value="all">All Modes</option>
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading events...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800 mb-1">Error Loading Events</h3>
              <p className="text-red-600 text-sm">{error}</p>
              <button 
                onClick={fetchEvents}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Featured Events */}
      {!loading && !error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-1 h-8 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full"></div>
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-800">Featured Events</h2>
            <Flame className="w-6 h-6 text-orange-500" />
          </div>

          {filteredFeatured.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg">No featured events found matching your search.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredFeatured.map((event) => (
                <div
                  key={event.id}
                  onClick={() => handleEventClick(event.slug)}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden group cursor-pointer border border-slate-100"
                >
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100">
                    {event.banner_image_url ? (
                      <img
                        src={event.banner_image_url}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.querySelector('.placeholder')?.classList.remove('hidden');
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center placeholder">
                        <Calendar className="w-16 h-16 text-indigo-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    
                    <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-orange-500 text-white font-semibold text-xs">
                      FEATURED
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-3 line-clamp-2">
                      {event.title}
                    </h3>

                    {event.category && (
                      <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium mb-3">
                        {event.category.name}
                      </span>
                    )}

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-slate-600 text-sm">
                        <Calendar className="w-4 h-4 text-indigo-600 mr-2 flex-shrink-0" />
                        <span>{formatDate(event.start_datetime)}</span>
                        <Clock className="w-4 h-4 text-indigo-600 ml-4 mr-2 flex-shrink-0" />
                        <span>{formatTime(event.start_datetime)}</span>
                      </div>
                   
                    </div>

                    <button className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg font-semibold text-sm transition-all">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Upcoming Events */}
      {!loading && !error && (
        <div className="bg-slate-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-1 h-8 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full"></div>
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-800">Latest Events</h2>
              <TrendingUp className="w-6 h-6 text-indigo-600" />
            </div>

            {filteredUpcoming.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-500 text-lg">No latest events found matching your search.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {filteredUpcoming.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => handleEventClick(event.slug)}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden cursor-pointer border border-slate-100"
                  >
                    <div className="relative h-40 overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100">
                      {event.banner_image ? (
                        <img
                          src={event.banner_image}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Calendar className="w-12 h-12 text-indigo-300" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-lg font-bold text-slate-800 mb-3 line-clamp-2">
                        {event.title}
                      </h3>

                      {event.category && (
                        <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium mb-3">
                          {event.category.name}
                        </span>
                      )}

                      <div className="flex items-center justify-between text-slate-600 text-sm mb-4">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-indigo-600" />
                          {formatDate(event.start_datetime)}
                        </span>
                        {event.mode && (
                          <span className="px-2 py-1 bg-slate-100 rounded text-xs font-medium">
                            {event.mode.toUpperCase()}
                          </span>
                        )}
                      </div>

                      <button className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg font-semibold text-sm transition-all">
                        Register Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

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

export default HomePage;