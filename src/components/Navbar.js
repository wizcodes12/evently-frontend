import React, { useState } from "react";
import {
  Sparkles,
  Bell,
  LogOut,
  Menu,
  X
} from "lucide-react";

const Navbar = ({ user, onLogout, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Sparkles className="w-8 h-8" />
          <span className="text-2xl font-bold">Evently</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <button onClick={() => onNavigate("home")} className="hover:text-purple-200">Home</button>
          <button className="hover:text-purple-200">Browse Events</button>
          <button className="hover:text-purple-200">Event Gallery</button>
          <button className="hover:text-purple-200">Registered Events</button>

          <button className="hover:text-purple-200 flex items-center space-x-1">
            <Bell className="w-5 h-5" />
            <span>Notifications</span>
          </button>

          <button className="px-4 py-2 bg-white/20 rounded-full hover:bg-white/30">
            View Profile
          </button>

          <button
            onClick={onLogout}
            className="px-4 py-2 bg-white text-purple-600 rounded-full hover:shadow-xl flex items-center space-x-1 font-semibold"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

        {/* Mobile button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-6 pb-4 space-y-3 bg-white/10 backdrop-blur-xl">
          <button onClick={() => onNavigate("home")} className="block text-left w-full py-2 hover:text-purple-200">Home</button>
          <button className="block w-full py-2 text-left hover:text-purple-200">Browse Events</button>
          <button className="block w-full py-2 text-left hover:text-purple-200">Event Gallery</button>
          <button className="block w-full py-2 text-left hover:text-purple-200">Registered Events</button>

          <button className="block w-full py-2 text-left hover:text-purple-200 flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Notifications</span>
          </button>

          <button className="block w-full py-2 text-left bg-white/20 rounded-full">
            View Profile
          </button>

          <button
            onClick={onLogout}
            className="block w-full py-2 bg-white text-purple-600 rounded-full font-semibold mt-2"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
