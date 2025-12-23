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
    course: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation rules
  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Full name is required";
        if (value.trim().length < 2) return "Name must be at least 2 characters";
        return "";
      
      case "email":
        if (!value) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email format";
        return "";
      
      case "phone_number":
        if (!value) return "Phone number is required";
        if (!/^\d+$/.test(value)) return "Phone number must contain only digits";
        if (value.length < 10 || value.length > 12) return "Phone number must be 10-12 digits";
        return "";
      
      case "enrollment_number":
        if (!value.trim()) return "Enrollment number is required";
        return "";
      
      case "clg_name":
        if (!value.trim()) return "College name is required";
        return "";
      
      case "course":
        if (!value || value === "") return "Please select a course";
        return "";
      
      case "password":
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        if (value.length > 8) return "Password must not exceed 8 characters";
        return "";
      
      case "confirmPassword":
        if (!value) return "Please confirm your password";
        if (value !== formData.password) return "Passwords do not match";
        return "";
      
      default:
        return "";
    }
  };

  // Handle field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field when user starts typing
    if (touched[name]) {
      const error = validateField(name, value);
      setFieldErrors({ ...fieldErrors, [name]: error });
    }
  };

  // Handle field blur
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    
    const error = validateField(name, value);
    setFieldErrors({ ...fieldErrors, [name]: error });
  };

  // Validate all fields
  const validateAllFields = () => {
    const errors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) errors[key] = error;
    });
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    // Validate all fields
    const errors = validateAllFields();
    setFieldErrors(errors);

    // If there are errors, don't submit
    if (Object.keys(errors).length > 0) {
      setError("Please fix all errors before submitting");
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
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
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

          <div className="space-y-4">
            {/* NAME */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-6 py-3 bg-gray-100 rounded-full focus:ring-2 focus:outline-none text-gray-700 ${
                  fieldErrors.name && touched.name ? 'ring-2 ring-red-400' : 'focus:ring-purple-400'
                }`}
              />
              {fieldErrors.name && touched.name && (
                <p className="text-red-500 text-xs mt-1 ml-4">{fieldErrors.name}</p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-6 py-3 bg-gray-100 rounded-full focus:ring-2 focus:outline-none text-gray-700 ${
                  fieldErrors.email && touched.email ? 'ring-2 ring-red-400' : 'focus:ring-purple-400'
                }`}
              />
              {fieldErrors.email && touched.email && (
                <p className="text-red-500 text-xs mt-1 ml-4">{fieldErrors.email}</p>
              )}
            </div>

            {/* PHONE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone_number"
                placeholder="10-12 digits"
                value={formData.phone_number}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-6 py-3 bg-gray-100 rounded-full focus:ring-2 focus:outline-none text-gray-700 ${
                  fieldErrors.phone_number && touched.phone_number ? 'ring-2 ring-red-400' : 'focus:ring-purple-400'
                }`}
              />
              {fieldErrors.phone_number && touched.phone_number && (
                <p className="text-red-500 text-xs mt-1 ml-4">{fieldErrors.phone_number}</p>
              )}
            </div>

            {/* ENROLLMENT */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enrollment Number
              </label>
              <input
                type="text"
                name="enrollment_number"
                placeholder="Your enrollment number"
                value={formData.enrollment_number}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-6 py-3 bg-gray-100 rounded-full focus:ring-2 focus:outline-none text-gray-700 ${
                  fieldErrors.enrollment_number && touched.enrollment_number ? 'ring-2 ring-red-400' : 'focus:ring-purple-400'
                }`}
              />
              {fieldErrors.enrollment_number && touched.enrollment_number && (
                <p className="text-red-500 text-xs mt-1 ml-4">{fieldErrors.enrollment_number}</p>
              )}
            </div>

            {/* COLLEGE NAME */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                College Name
              </label>
              <input
                type="text"
                name="clg_name"
                placeholder="Your college/university name"
                value={formData.clg_name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-6 py-3 bg-gray-100 rounded-full focus:ring-2 focus:outline-none text-gray-700 ${
                  fieldErrors.clg_name && touched.clg_name ? 'ring-2 ring-red-400' : 'focus:ring-purple-400'
                }`}
              />
              {fieldErrors.clg_name && touched.clg_name && (
                <p className="text-red-500 text-xs mt-1 ml-4">{fieldErrors.clg_name}</p>
              )}
            </div>

            {/* SELECT COURSE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course
              </label>
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-6 py-3 bg-gray-100 rounded-full focus:ring-2 focus:outline-none text-gray-700 ${
                  fieldErrors.course && touched.course ? 'ring-2 ring-red-400' : 'focus:ring-purple-400'
                }`}
              >
                <option value="">Select Course</option>
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
              {fieldErrors.course && touched.course && (
                <p className="text-red-500 text-xs mt-1 ml-4">{fieldErrors.course}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password (6-8 characters)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-6 py-3 bg-gray-100 rounded-full focus:ring-2 focus:outline-none pr-12 text-gray-700 ${
                    fieldErrors.password && touched.password ? 'ring-2 ring-red-400' : 'focus:ring-purple-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {fieldErrors.password && touched.password && (
                <p className="text-red-500 text-xs mt-1 ml-4">{fieldErrors.password}</p>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-6 py-3 bg-gray-100 rounded-full focus:ring-2 focus:outline-none pr-12 text-gray-700 ${
                    fieldErrors.confirmPassword && touched.confirmPassword ? 'ring-2 ring-red-400' : 'focus:ring-purple-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {fieldErrors.confirmPassword && touched.confirmPassword && (
                <p className="text-red-500 text-xs mt-1 ml-4">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-sm">
                {error}
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              onClick={handleSubmit}
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
          </div>
        </div>
      </div>

      {/* Right Side - Illustration Panel */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-300 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

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