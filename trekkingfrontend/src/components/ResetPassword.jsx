import {
  ArrowRightIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [passwords, setPasswords] = useState({
    new_password: "",
    confirm_password: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [tokenStatus, setTokenStatus] = useState("checking"); // checking, valid, invalid, expired
  const [isSuccess, setIsSuccess] = useState(false);

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/auth/validate-reset-token/${token}/`,
          {
            method: "GET",
          }
        );

        if (response.ok) {
          setTokenStatus("valid");
        } else {
          const data = await response.json();
          if (data.error?.includes("expired")) {
            setTokenStatus("expired");
          } else {
            setTokenStatus("invalid");
          }
        }
      } catch (error) {
        setTokenStatus("invalid");
      }
    };

    if (token) {
      validateToken();
    } else {
      setTokenStatus("invalid");
    }
  }, [token]);

  const validatePasswords = () => {
    const newErrors = {};

    // New password validation
    if (!passwords.new_password) {
      newErrors.new_password = "New password is required";
    } else if (passwords.new_password.length < 8) {
      newErrors.new_password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwords.new_password)) {
      newErrors.new_password =
        "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    // Confirm password validation
    if (!passwords.confirm_password) {
      newErrors.confirm_password = "Please confirm your new password";
    } else if (passwords.new_password !== passwords.confirm_password) {
      newErrors.confirm_password = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordChange = (field, value) => {
    setPasswords({ ...passwords, [field]: value });

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePasswords()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch(
        "http://localhost:8000/api/auth/password-reset-confirm/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            new_password: passwords.new_password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        toast.success("Password reset successfully!");

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setErrors({ submit: data.message || "Failed to reset password" });
        toast.error(data.message || "Failed to reset password");
      }
    } catch (err) {
      const errorMessage =
        err.message || "Network error. Please try again later.";
      setErrors({ submit: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (tokenStatus === "checking") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-6 relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
            <LockClosedIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Validating Reset Link
          </h1>
          <p className="text-gray-600">
            Please wait while we verify your reset link...
          </p>
        </div>
      </div>
    );
  }

  // Invalid or expired token
  if (tokenStatus === "invalid" || tokenStatus === "expired") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <XCircleIcon className="w-8 h-8 text-red-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {tokenStatus === "expired" ? "Link Expired" : "Invalid Reset Link"}
          </h1>

          <p className="text-gray-600 mb-6">
            {tokenStatus === "expired"
              ? "This password reset link has expired. Please request a new one."
              : "This password reset link is invalid or has already been used."}
          </p>

          <div className="space-y-4">
            <Link
              to="/forgot-password"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Request New Reset Link
            </Link>
            <Link
              to="/login"
              className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircleIcon className="w-8 h-8 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Password Reset Successfully!
          </h1>

          <p className="text-gray-600 mb-6">
            Your password has been updated. You can now log in with your new
            password.
          </p>

          <p className="text-sm text-gray-500 mb-6">
            You will be redirected to the login page in 3 seconds...
          </p>

          <Link
            to="/login"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-semibold"
          >
            Go to Login
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // Reset password form
  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative">
        <div className="absolute inset-0">
          <img
            src="/images/mountain-house.JPG"
            alt="Mountain landscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/30 to-black/60"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center items-start p-12 text-white">
          <h1 className="text-4xl xl:text-5xl font-bold mb-6 leading-tight">
            Create New Password
            <span className="block text-blue-300">Secure Your Account</span>
          </h1>
          <p className="text-xl mb-8 text-gray-200 max-w-md">
            Choose a strong password to protect your trekking adventures and
            personal information.
          </p>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-gray-200">Minimum 8 characters</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-gray-200">
                Include uppercase & lowercase
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-gray-200">Include at least one number</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center bg-white p-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Reset Your Password
            </h2>
            <p className="text-gray-600">Enter your new password below</p>
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <ExclamationCircleIcon className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div>
              <label
                htmlFor="new_password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                New Password
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="new_password"
                  type={showPasswords.new ? "text" : "password"}
                  placeholder="Enter your new password"
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.new_password ? "border-red-500" : "border-gray-300"
                  }`}
                  value={passwords.new_password}
                  onChange={(e) =>
                    handlePasswordChange("new_password", e.target.value)
                  }
                  required
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords({
                      ...showPasswords,
                      new: !showPasswords.new,
                    })
                  }
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPasswords.new ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.new_password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.new_password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirm_password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="confirm_password"
                  type={showPasswords.confirm ? "text" : "password"}
                  placeholder="Confirm your new password"
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.confirm_password
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  value={passwords.confirm_password}
                  onChange={(e) =>
                    handlePasswordChange("confirm_password", e.target.value)
                  }
                  required
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords({
                      ...showPasswords,
                      confirm: !showPasswords.confirm,
                    })
                  }
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPasswords.confirm ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirm_password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirm_password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Reset Password
                  <ArrowRightIcon className="ml-2 w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="text-center">
            <Link
              to="/login"
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              Back to Login
            </Link>
          </div>

          {/* Mobile mountain image */}
          <div className="lg:hidden mt-8">
            <img
              src="/images/everest.png"
              alt="Mountain landscape"
              className="w-full h-32 object-cover rounded-lg opacity-50"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
