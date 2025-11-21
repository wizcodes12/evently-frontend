// src/pages/Register.jsx
import React, { useState } from "react";
import { Sparkles, Eye, EyeOff } from "lucide-react";
import api from "../api/axios";

const RegisterPage = ({ onNavigate, onLogin }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    enrollment_number: "",
    clg_name: "",
    course: "B.Tech",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setValidationErrors({});

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6 || formData.password.length > 8) {
      setError("Password must be between 6-8 characters");
      return;
    }

    if (formData.phone_number.length < 10 || formData.phone_number.length > 12) {
      setError("Phone number must be between 10-12 digits");
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...submitData } = formData;

      const result = await api.post("/register", submitData);

      if (result.success && result.token && result.user) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        onLogin(result.user);
      } else {
        setError(result.message || "Registration failed");
      }

    } catch (err) {
      if (err.errors) {
        setValidationErrors(err.errors);
        setError("Please fix the errors below");
      } else {
        setError(err.message || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getFieldError = (fieldName) => {
    return validationErrors[fieldName]?.[0];
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md py-12">
          
          <div className="flex items-center space-x-2 mb-6">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-gray-800">Evently</span>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Create Student Account
          </h2>
          <p className="text-gray-600 mb-6">
            Join thousands of students discovering amazing events
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* NAME */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={`w-full px-6 py-3 bg-gray-100 rounded-full focus:ring-2 focus:outline-none ${
                  getFieldError('name') ? 'ring-2 ring-red-400' : 'focus:ring-purple-400'
                }`}
                required
              />
              {getFieldError('name') && (
                <p className="text-red-500 text-xs mt-1 ml-4">{getFieldError('name')}</p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={`w-full px-6 py-3 bg-gray-100 rounded-full focus:ring-2 focus:outline-none ${
                  getFieldError('email') ? 'ring-2 ring-red-400' : 'focus:ring-purple-400'
                }`}
                required
              />
              {getFieldError('email') && (
                <p className="text-red-500 text-xs mt-1 ml-4">{getFieldError('email')}</p>
              )}
            </div>

            {/* PHONE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="10-12 digits"
                value={formData.phone_number}
                onChange={(e) =>
                  setFormData({ ...formData, phone_number: e.target.value })
                }
                className={`w-full px-6 py-3 bg-gray-100 rounded-full focus:ring-2 focus:outline-none ${
                  getFieldError('phone_number') ? 'ring-2 ring-red-400' : 'focus:ring-purple-400'
                }`}
                required
              />
              {getFieldError('phone_number') && (
                <p className="text-red-500 text-xs mt-1 ml-4">{getFieldError('phone_number')}</p>
              )}
            </div>

            {/* ENROLLMENT */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enrollment Number
              </label>
              <input
                type="text"
                placeholder="Your enrollment number"
                value={formData.enrollment_number}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    enrollment_number: e.target.value,
                  })
                }
                className={`w-full px-6 py-3 bg-gray-100 rounded-full focus:ring-2 focus:outline-none ${
                  getFieldError('enrollment_number') ? 'ring-2 ring-red-400' : 'focus:ring-purple-400'
                }`}
                required
              />
              {getFieldError('enrollment_number') && (
                <p className="text-red-500 text-xs mt-1 ml-4">{getFieldError('enrollment_number')}</p>
              )}
            </div>

            {/* COLLEGE NAME */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                College Name
              </label>
              <input
                type="text"
                placeholder="Your college/university name"
                value={formData.clg_name}
                onChange={(e) =>
                  setFormData({ ...formData, clg_name: e.target.value })
                }
                className="w-full px-6 py-3 bg-gray-100 rounded-full focus:ring-2 focus:ring-purple-400 focus:outline-none"
                required
              />
            </div>

            {/* SELECT COURSE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course
              </label>
              <select
                value={formData.course}
                onChange={(e) =>
                  setFormData({ ...formData, course: e.target.value })
                }
                className="w-full px-6 py-3 bg-gray-100 rounded-full focus:ring-2 focus:ring-purple-400 focus:outline-none"
                required
              >
                <option value="B.Tech">B.Tech</option>
                <option value="BBA">BBA</option>
                <option value="BCA">BCA</option>
                <option value="MBA">MBA</option>
                <option value="M.Tech">M.Tech</option>
                <option value="B.Sc">B.Sc</option>
                <option value="M.Sc">M.Sc</option>
                <option value="BA">BA</option>
                <option value="MA">MA</option>
              </select>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password (6-8 characters)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-6 py-3 bg-gray-100 rounded-full focus:ring-2 focus:ring-purple-400 focus:outline-none pr-12"
                  required
                  minLength={6}
                  maxLength={8}
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

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full px-6 py-3 bg-gray-100 rounded-full focus:ring-2 focus:ring-purple-400 focus:outline-none pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* ERROR MESSAGE */}
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
              {loading ? "Creating Account..." : "Sign Up"}
            </button>

            {/* NAVIGATION */}
            <div className="text-center text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => onNavigate("login")}
                className="text-purple-600 font-semibold hover:underline"
              >
                Login
              </button>
            </div>

            {/* BACK TO LANDING */}
            <button
              type="button"
              onClick={() => onNavigate("landing")}
              className="w-full py-3 bg-white border-2 border-gray-300 text-gray-800 rounded-full font-semibold hover:bg-gray-50 transition-all"
            >
              Back to Home
            </button>
          </form>
        </div>
      </div>

      {/* Right Side - Illustration Panel - FIXED WITH STICKY POSITIONING */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 relative overflow-hidden">
        {/* Background Animations */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-300 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Content Box - Sticky positioned to stay centered in viewport */}
        <div className="sticky top-0 h-screen flex items-center justify-center p-12">
          <div className="relative z-10 text-center text-white max-w-md">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-8 border border-white/20">
              <Sparkles className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-3xl font-bold mb-4">Welcome to Evently! 🎉</h3>
              <p className="text-lg text-white/90">
                Join thousands of students discovering amazing campus events, building connections, and creating unforgettable memories!
              </p>
            </div>
            <p className="text-white/70 text-sm">Secure Registration • Student Community</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;