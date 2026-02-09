// src/pages/EventGallery.jsx
import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Bell,
  LogOut,
  Menu,
  X,
  User,
  Settings,
  Camera,
  Calendar,
  AlertCircle
} from "lucide-react";
import api from "../api/axios";

const EventGalleryPage = ({ user, onLogout, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch events on component mount
  useEffect(() => {
    fetchGalleryEvents();
  }, []);

  const fetchGalleryEvents = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch both featured and latest events
      const [featuredRes, latestRes] = await Promise.all([
        api.events.getFeatured(),
        api.events.getLatest()
      ]);

      const allEvents = [];

      if (featuredRes.success) {
        allEvents.push(...featuredRes.data);
      }

      if (latestRes.success) {
        allEvents.push(...latestRes.data);
      }

      // Filter events that have banner images and transform to gallery format
      const gallery = allEvents
        .filter(event => event.banner_image_url)
        .map(event => ({
          id: event.id,
          image: event.banner_image_url,
          title: event.title,
          eventName: event.category?.name || 'Campus Event',
          slug: event.slug
        }));

      setGalleryItems(gallery);

    } catch (err) {
      console.error('Error fetching gallery events:', err);
      setError(err.message || 'Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  // Handle image click to view full size
  const handleImageClick = (item) => {
    setSelectedImage(item);
  };

  // Close full size view
  const closeFullView = () => {
    setSelectedImage(null);
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
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors">
                Browse Events
              </button>
              <button 
                onClick={() => onNavigate("gallery")}
                className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
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
              <button onClick={() => onNavigate("browse")} className="block w-full text-left px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg">
                Browse Events
              </button>
              <button onClick={() => onNavigate("gallery")} className="block w-full text-left px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg">
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
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Camera className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Event Gallery
            </h1>
            <p className="text-lg text-indigo-100 max-w-2xl mx-auto">
              Explore memorable moments captured from our amazing campus events
            </p>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading gallery...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800 mb-1">Error Loading Gallery</h3>
              <p className="text-red-600 text-sm">{error}</p>
              <button 
                onClick={fetchGalleryEvents}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      {!loading && !error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {galleryItems.length === 0 ? (
            <div className="text-center py-12">
              <Camera className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">No gallery items available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleImageClick(item)}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden group cursor-pointer border border-slate-100"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Overlay info on hover */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex items-center space-x-2 text-white">
                        <Camera className="w-4 h-4" />
                        <span className="text-xs font-medium">View Full Size</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-bold text-slate-800 mb-1 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {item.eventName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Full Size Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeFullView}
        >
          <button
            onClick={closeFullView}
            className="absolute top-4 right-4 text-white hover:text-slate-300 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage.image}
              alt={selectedImage.title}
              className="w-full h-auto rounded-xl"
            />
            <div className="mt-4 text-center">
              <h3 className="text-xl font-bold text-white mb-2">
                {selectedImage.title}
              </h3>
              <p className="text-slate-300">
                {selectedImage.eventName}
              </p>
            </div>
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

export default EventGalleryPage;