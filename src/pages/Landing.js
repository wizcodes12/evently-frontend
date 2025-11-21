import React, { useState } from "react";
import {
  Sparkles,
  Calendar,
  Users,
  Bell,
  Star,
  Search,
  Clock,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Zap
} from "lucide-react";

const LandingPage = ({ onNavigate = () => {} }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const featuredEvents = [
    {
      id: 1,
      title: "AI & Robotics Workshop",
      date: "Oct 20, 2025",
      time: "10:00 AM",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80",
      tag: "HOT",
      location: "Main Auditorium",
    },
    {
      id: 2,
      title: "Student Art Exhibition",
      date: "Oct 25, 2025",
      time: "2:00 PM",
      image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=500&q=80",
      tag: "NEW",
      location: "Art Gallery",
    },
    {
      id: 3,
      title: "Inter-College Sports Meet",
      date: "Nov 1, 2025",
      time: "8:00 AM",
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&q=80",
      tag: "TRENDING",
      location: "Sports Complex",
    },
  ];

  const features = [
    {
      icon: <Calendar className="w-7 h-7" />,
      title: "Discover Events",
      description: "Browse through hundreds of exciting campus events, workshops, and activities.",
    },
    {
      icon: <Users className="w-7 h-7" />,
      title: "Connect with Students",
      description: "Meet like-minded students, build your network, and create lasting friendships.",
    },
    {
      icon: <Bell className="w-7 h-7" />,
      title: "Never Miss Out",
      description: "Get instant notifications for events you're interested in and stay updated.",
    },
    {
      icon: <Star className="w-7 h-7" />,
      title: "Featured Events",
      description: "Access exclusive campus festivals, tech talks, cultural nights, and sports tournaments.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
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

            <div className="flex items-center space-x-3">
              <button
                onClick={() => onNavigate("login")}
                className="px-5 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => onNavigate("register")}
                className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-medium text-sm"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80')] opacity-10 bg-cover bg-center"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-lg px-4 py-2 rounded-full text-white text-sm font-medium mb-6 border border-white/20">
              <Zap className="w-4 h-4" />
              <span>Discover Campus Events Like Never Before</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Connect, Explore & Never Miss Out on Campus Life 🎉
            </h1>
            
            <p className="text-xl md:text-2xl text-indigo-100 mb-10 max-w-3xl mx-auto">
              Join thousands of students discovering amazing events, building connections, and making memories
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <button
                onClick={() => onNavigate("register")}
                className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg hover:shadow-2xl transition-all flex items-center justify-center space-x-2 group"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onNavigate("login")}
                className="px-8 py-4 bg-white/10 backdrop-blur-lg text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all border border-white/20"
              >
                Sign In
              </button>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative bg-white rounded-2xl shadow-2xl">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for events, workshops, festivals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-4 pl-14 pr-6 rounded-2xl text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
            Why Choose Evently?
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Everything you need to stay connected with your campus community
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all text-center group"
            >
              <div className="flex justify-center mb-4 text-indigo-600 bg-indigo-50 w-14 h-14 rounded-xl items-center mx-auto group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-4xl lg:text-5xl font-bold mb-2">1000+</div>
              <div className="text-indigo-100 text-lg">Active Events</div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold mb-2">5000+</div>
              <div className="text-indigo-100 text-lg">Students Registered</div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold mb-2">50+</div>
              <div className="text-indigo-100 text-lg">Campus Partners</div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Events Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
            Featured Events
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Check out what's happening on campus this month
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden group border border-slate-100"
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
                <h3 className="text-lg font-bold mb-3 text-slate-800 line-clamp-2">{event.title}</h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-slate-600 text-sm">
                    <Calendar className="w-4 h-4 text-indigo-600 mr-2" />
                    <span>{event.date}</span>
                    <Clock className="w-4 h-4 text-indigo-600 ml-4 mr-2" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center text-slate-600 text-sm">
                    <MapPin className="w-4 h-4 text-indigo-600 mr-2" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate("register")}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all text-sm"
                >
                  Sign Up to Register
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            Join thousands of students already using Evently to discover amazing campus events and build connections
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <button
              onClick={() => onNavigate("register")}
              className="px-10 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg hover:shadow-2xl transition-all inline-flex items-center justify-center space-x-2 group"
            >
              <span>Create Your Account</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-6 text-indigo-100">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>Free Forever</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>No Credit Card</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>Instant Access</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
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

export default LandingPage;