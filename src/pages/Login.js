// src/pages/Login.jsx
import React, { useState } from "react";
import { Sparkles, Eye, EyeOff } from "lucide-react";
import api from "../api/axios";

const LoginPage = ({ onNavigate, onLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await api.post("/login", formData);

      if (result.success && result.token && result.user) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        onLogin(result.user);
      } else {
        setError(result.message || "Login failed. Please try again.");
      }

    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* LEFT FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          <div className="flex items-center space-x-2 mb-8">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-gray-800">Evently</span>
          </div>

          <h2 className="text-4xl font-bold text-gray-800 mb-2">Student Login</h2>
          <p className="text-gray-600 mb-8">
            Welcome back! Please login to your account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-6 py-4 bg-gray-100 rounded-full focus:ring-2 focus:ring-purple-400 focus:outline-none"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-6 py-4 bg-gray-100 rounded-full focus:ring-2 focus:ring-purple-400 focus:outline-none pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* ERROR DISPLAY */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-sm">
                {error}
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* FORGOT PASSWORD */}
            <div className="text-center">
              <button
                type="button"
                className="text-gray-600 hover:text-purple-600 transition-colors text-sm"
              >
                Forgot Password?
              </button>
            </div>

            {/* DIVIDER */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-50 text-gray-500">OR</span>
              </div>
            </div>

            {/* REGISTER BUTTON */}
            <button
              type="button"
              onClick={() => onNavigate("register")}
              className="w-full py-4 bg-gray-100 text-gray-800 rounded-full font-semibold hover:bg-gray-200 transition-all"
            >
              New Student? Register Here
            </button>

            {/* BACK TO LANDING */}
            <button
              type="button"
              onClick={() => onNavigate("landing")}
              className="w-full py-4 bg-white border-2 border-gray-300 text-gray-800 rounded-full font-semibold hover:bg-gray-50 transition-all"
            >
              Back to Home
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE / ILLUSTRATION */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500 items-center justify-center p-12 relative overflow-hidden">

        {/* BLOB BACKGROUND */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-300 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* TEXT CARD */}
        <div className="relative z-10 text-center text-white max-w-md">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-8 border border-white/20">
            <Sparkles className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-3xl font-bold mb-4">Welcome Back! 🎉</h3>
            <p className="text-lg text-white/90">
              Login to discover amazing campus events, connect with students, and never miss out on the action!
            </p>
          </div>
          <p className="text-white/70 text-sm">Secure Login • Student Portal</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;