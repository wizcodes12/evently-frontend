// src/pages/BrowseEvents.jsx
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
  Search,
  Filter,
  SlidersHorizontal,
  Grid3x3,
  List,
  AlertCircle
} from "lucide-react";
import api from "../api/axios";

const BrowseEventsPage = ({ user, onLogout, onNavigate }) => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMode, setSelectedMode] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchAllEvents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [events, searchQuery, selectedCategory, selectedMode]);

  const fetchAllEvents = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.events.getAll();
      
      if (response.success) {
        setEvents(response.data);
        setFilteredEvents(response.data);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...events];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(query) ||
        event.description?.toLowerCase().includes(query) ||
        event.venue?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(event => 
        event.category?.name.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Mode filter
    if (selectedMode !== "all") {
      filtered = filtered.filter(event => 
        event.mode?.toLowerCase() === selectedMode.toLowerCase()
      );
    }

    setFilteredEvents(filtered);
  };

  const formatDate = (datetime) => {
    if (!datetime) return 'TBA';
    const date = new Date(datetime);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
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

  const getUniqueCategories = () => {
    const categories = events
      .map(event => event.category?.name)
      .filter(Boolean);
    return [...new Set(categories)];
  };

  const handleEventClick = (slug) => {
    onNavigate(`event-details-${slug}`);
  };

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

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Browse All Events</h1>
          <p className="text-lg text-indigo-100">Discover and register for upcoming campus events</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events..."
                className="w-full py-3 pl-12 pr-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span>Filters</span>
            </button>

            {/* View Toggle */}
            <div className="flex bg-slate-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-white shadow-sm text-indigo-600' 
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white shadow-sm text-indigo-600' 
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-slate-200">
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

      {/* Results Count */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <p className="text-slate-600">
          Showing <span className="font-semibold text-slate-800">{filteredEvents.length}</span> of <span className="font-semibold text-slate-800">{events.length}</span> events
        </p>
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
                onClick={fetchAllEvents}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Events Grid/List */}
      {!loading && !error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">No Events Found</h3>
              <p className="text-slate-500">Try adjusting your search or filters</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={() => handleEventClick(event.slug)}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden cursor-pointer border border-slate-100"
                >
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100">
                    {event.banner_image ? (
                      <img
                        src={event.banner_image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Calendar className="w-16 h-16 text-indigo-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    
                    {event.is_featured && (
                      <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-orange-500 text-white font-semibold text-xs">
                        FEATURED
                      </span>
                    )}
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
                      </div>
                      <div className="flex items-center text-slate-600 text-sm">
                        <Clock className="w-4 h-4 text-indigo-600 mr-2 flex-shrink-0" />
                        <span>{formatTime(event.start_datetime)}</span>
                      </div>
                      {event.venue && (
                        <div className="flex items-center text-slate-600 text-sm">
                          <MapPin className="w-4 h-4 text-indigo-600 mr-2 flex-shrink-0" />
                          <span className="line-clamp-1">{event.venue}</span>
                        </div>
                      )}
                    </div>

                    <button className="w-full py-2.5 border-2 border-indigo-600 text-indigo-600 rounded-xl font-semibold hover:bg-indigo-600 hover:text-white transition-all text-sm">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={() => handleEventClick(event.slug)}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden cursor-pointer border border-slate-100 flex"
                >
                  <div className="w-64 h-48 flex-shrink-0 bg-gradient-to-br from-indigo-100 to-purple-100 relative">
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
                    {event.is_featured && (
                      <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-orange-500 text-white font-semibold text-xs">
                        FEATURED
                      </span>
                    )}
                  </div>

                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">{event.title}</h3>
                        {event.category && (
                          <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                            {event.category.name}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                      {event.description || 'No description available.'}
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center text-slate-600 text-sm">
                        <Calendar className="w-4 h-4 text-indigo-600 mr-2" />
                        <span>{formatDate(event.start_datetime)}</span>
                      </div>
                      <div className="flex items-center text-slate-600 text-sm">
                        <Clock className="w-4 h-4 text-indigo-600 mr-2" />
                        <span>{formatTime(event.start_datetime)}</span>
                      </div>
                      {event.venue && (
                        <div className="flex items-center text-slate-600 text-sm col-span-2">
                          <MapPin className="w-4 h-4 text-indigo-600 mr-2 flex-shrink-0" />
                          <span className="line-clamp-1">{event.venue}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BrowseEventsPage;