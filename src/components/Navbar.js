import React, { useState } from "react";
import {
  Sparkles,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronDown,
  User,
  Ticket
} from "lucide-react";

const Navbar = ({ user, onLogout, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navLinks = [
    { label: "Home", page: "home" },
    { label: "Browse Events", page: "browse" },
    { label: "Event Gallery", page: "gallery" },
    { label: "My Registrations", page: "my-registrations" },
  ];

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => onNavigate("home")}
        >
          <Sparkles className="w-8 h-8" />
          <span className="text-2xl font-bold">Evently</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <button
              key={link.page}
              onClick={() => onNavigate(link.page)}
              className="hover:text-purple-200 transition-colors font-medium text-sm"
            >
              {link.label}
            </button>
          ))}

          <button className="hover:text-purple-200 flex items-center space-x-1 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full"></span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 px-3 py-1.5 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            >
              <div className="w-7 h-7 bg-white text-purple-600 rounded-full flex items-center justify-center font-bold text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <span className="text-sm font-medium">{user?.name?.split(" ")[0]}</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {isProfileOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsProfileOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-52 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-100 py-2 z-20">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="font-semibold text-slate-800 text-sm">{user?.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                  </div>
                  <button className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center space-x-2 text-sm">
                    <User className="w-4 h-4 text-slate-400" />
                    <span>My Profile</span>
                  </button>
                  <button
                    onClick={() => { setIsProfileOpen(false); onNavigate("my-registrations"); }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center space-x-2 text-sm"
                  >
                    <Ticket className="w-4 h-4 text-slate-400" />
                    <span>My Registrations</span>
                  </button>
                  <div className="border-t border-slate-100 my-1" />
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center space-x-2 text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile button */}
        <button
          className="md:hidden p-1"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-6 pb-4 space-y-1 bg-white/10 backdrop-blur-xl">
          {navLinks.map((link) => (
            <button
              key={link.page}
              onClick={() => { onNavigate(link.page); setIsMenuOpen(false); }}
              className="block w-full text-left py-2.5 px-3 rounded-lg hover:bg-white/10 transition-colors text-sm font-medium"
            >
              {link.label}
            </button>
          ))}
          <div className="border-t border-white/20 pt-2 mt-2">
            <div className="flex items-center space-x-2 px-3 py-2">
              <div className="w-8 h-8 bg-white text-purple-600 rounded-full flex items-center justify-center font-bold text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div>
                <p className="text-sm font-semibold">{user?.name}</p>
                <p className="text-xs text-purple-200">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 w-full px-3 py-2.5 bg-white text-purple-600 rounded-xl font-semibold mt-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;