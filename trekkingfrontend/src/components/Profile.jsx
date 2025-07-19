import {
  BellIcon,
  CalendarIcon,
  CameraIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
  GlobeAltIcon,
  LockClosedIcon,
  PencilIcon,
  PhoneIcon,
  ShieldCheckIcon,
  TrashIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Profile edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalProfileData, setOriginalProfileData] = useState({});

  // Profile picture states
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);

  // Delete account states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteStep, setDeleteStep] = useState(1); // 1: warning, 2: password confirmation, 3: final confirmation
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // Profile form data
  const [profileData, setProfileData] = useState({
    full_name: "",
    email: "",
    phone: "",
    country: "",
    date_of_birth: "",
    gender: "",
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    newsletter: false,
    offers: false,
  });

  // Security form data
  const [securityData, setSecurityData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const countries = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Argentina",
    "Australia",
    "Austria",
    "Bangladesh",
    "Belgium",
    "Brazil",
    "Canada",
    "Chile",
    "China",
    "Colombia",
    "Denmark",
    "Egypt",
    "Finland",
    "France",
    "Germany",
    "Ghana",
    "Greece",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Japan",
    "Kenya",
    "Malaysia",
    "Mexico",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Nigeria",
    "Norway",
    "Pakistan",
    "Philippines",
    "Poland",
    "Portugal",
    "Russia",
    "Saudi Arabia",
    "Singapore",
    "South Africa",
    "South Korea",
    "Spain",
    "Sri Lanka",
    "Sweden",
    "Switzerland",
    "Thailand",
    "Turkey",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
    "Vietnam",
  ];

  // Initialize data when user is available
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const initialData = {
      full_name: user.full_name || "",
      email: user.email || "",
      phone: user.phone || "",
      country: user.country || "",
      date_of_birth: user.date_of_birth || "",
      gender: user.gender || "",
    };

    setProfileData(initialData);
    setOriginalProfileData(initialData);

    // Add this debug line to check what's in user object
    console.log("User object:", user);
    console.log("Profile picture URL:", user.profile_picture_url);

    setProfilePictureUrl(user.profile_picture_url || null);

    setNotificationSettings({
      newsletter: user.subscribe_newsletter || false,
      offers: user.receive_offers || false,
    });
  }, [user, navigate]);

  // Check for changes in profile data
  useEffect(() => {
    const hasDataChanged = Object.keys(profileData).some(
      (key) => profileData[key] !== originalProfileData[key]
    );
    setHasChanges(hasDataChanged);
  }, [profileData, originalProfileData]);

  // Profile picture functions
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG, or GIF)");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("File size too large. Maximum size is 5MB.");
      return;
    }

    setIsUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("profile_picture", file);

      const response = await fetch(
        "http://localhost:8000/api/profile/upload-picture/",
        {
          method: "POST",
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setProfilePictureUrl(data.profile_picture_url);
        updateUser({
          ...user,
          profile_picture_url: data.profile_picture_url,
        });
        toast.success("Profile picture uploaded successfully!");
      } else {
        toast.error(data.error || "Failed to upload profile picture");
      }
    } catch (error) {
      toast.error("An error occurred while uploading the image");
      console.error("Upload error:", error);
    } finally {
      setIsUploadingImage(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeleteProfilePicture = async () => {
    if (!profilePictureUrl) return;

    try {
      const response = await fetch(
        "http://localhost:8000/api/profile/delete-picture/",
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setProfilePictureUrl(null);
        updateUser({
          ...user,
          profile_picture_url: null,
        });
        toast.success("Profile picture deleted successfully!");
      } else {
        toast.error(data.error || "Failed to delete profile picture");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the image");
      console.error("Delete error:", error);
    }
  };

  // Generate initials for avatar fallback
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // Edit mode functions
  const handleEditClick = () => {
    setIsEditing(true);
    setErrors({}); // Clear any existing errors
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setProfileData(originalProfileData); // Reset to original data
    setHasChanges(false);
    setErrors({});
    setSuccessMessage("");
  };

  // Validation functions
  const validateProfile = () => {
    const newErrors = {};

    // Full name validation
    if (!profileData.full_name.trim()) {
      newErrors.full_name = "Full name is required";
    } else if (profileData.full_name.trim().length < 2) {
      newErrors.full_name = "Full name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s'-\.]+$/.test(profileData.full_name.trim())) {
      newErrors.full_name =
        "Full name can only contain letters, spaces, hyphens, apostrophes, and periods";
    } else if (profileData.full_name.trim().length > 50) {
      newErrors.full_name = "Full name cannot exceed 50 characters";
    }

    // Email validation
    if (!profileData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      newErrors.email = "Please enter a valid email address";
    } else if (profileData.email.length > 254) {
      newErrors.email = "Email address is too long";
    }

    // Phone validation
    if (!profileData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (
      !/^[+]?[(]?[\d\s\-\(\)]{10,20}$/.test(
        profileData.phone.replace(/\s/g, "")
      )
    ) {
      newErrors.phone = "Please enter a valid phone number (10-20 digits)";
    }

    // Country validation
    if (!profileData.country) {
      newErrors.country = "Country is required";
    }

    // Date of birth validation
    if (!profileData.date_of_birth) {
      newErrors.date_of_birth = "Date of birth is required";
    } else {
      const today = new Date();
      const birthDate = new Date(profileData.date_of_birth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      if (birthDate >= today) {
        newErrors.date_of_birth =
          "Date of birth cannot be today or in the future";
      } else if (age < 13) {
        newErrors.date_of_birth = "You must be at least 13 years old";
      }
    }

    // Gender validation
    if (!profileData.gender) {
      newErrors.gender = "Gender is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSecurity = () => {
    const newErrors = {};

    // Current password validation
    if (!securityData.current_password) {
      newErrors.current_password = "Current password is required";
    }

    // New password validation
    if (!securityData.new_password) {
      newErrors.new_password = "New password is required";
    } else if (securityData.new_password.length < 8) {
      newErrors.new_password = "Password must be at least 8 characters";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(securityData.new_password)
    ) {
      newErrors.new_password =
        "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    // Confirm password validation
    if (!securityData.confirm_password) {
      newErrors.confirm_password = "Please confirm your new password";
    } else if (securityData.new_password !== securityData.confirm_password) {
      newErrors.confirm_password = "Passwords do not match";
    }

    // Check if new password is different from current
    if (securityData.current_password === securityData.new_password) {
      newErrors.new_password =
        "New password must be different from current password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleProfileChange = (field, value) => {
    if (field === "full_name") {
      value = value.replace(/[^a-zA-Z\s'-\.]/g, "");
      value = value.replace(/\s{2,}/g, " ");
      if (value.length > 50) {
        value = value.substring(0, 50);
      }
    }

    setProfileData({ ...profileData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleSecurityChange = (field, value) => {
    setSecurityData({ ...securityData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleNotificationChange = (field, value) => {
    setNotificationSettings({ ...notificationSettings, [field]: value });
  };

  // Submit handlers
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!validateProfile()) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8000/api/profile/update/",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify(profileData),
        }
      );

      if (response.ok) {
        const data = await response.json();

        updateUser({
          ...user,
          ...profileData,
        });

        toast.success("Profile updated successfully!");
        setSuccessMessage("Profile updated successfully!");

        // Update original data and exit edit mode
        setOriginalProfileData(profileData);
        setIsEditing(false);
        setHasChanges(false);

        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error(error.message);
      setErrors({ submit: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8000/api/profile/notifications/",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify(notificationSettings),
        }
      );

      if (response.ok) {
        const data = await response.json();

        updateUser({
          ...user,
          subscribe_newsletter: notificationSettings.newsletter,
          receive_offers: notificationSettings.offers,
        });

        toast.success("Notification preferences updated successfully!");
        setSuccessMessage("Notification preferences updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to update notification settings"
        );
      }
    } catch (error) {
      toast.error(error.message);
      setErrors({ submit: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    if (!validateSecurity()) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8000/api/profile/change-password/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({
            current_password: securityData.current_password,
            new_password: securityData.new_password,
          }),
        }
      );

      if (response.ok) {
        toast.success("Password changed successfully!");
        setSuccessMessage("Password changed successfully!");
        setSecurityData({
          current_password: "",
          new_password: "",
          confirm_password: "",
        });
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to change password");
      }
    } catch (error) {
      toast.error(error.message);
      setErrors({ submit: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete account functions
  const handleDeleteAccountClick = () => {
    setShowDeleteModal(true);
    setDeleteStep(1);
    setDeletePassword("");
    setErrors({});
  };

  const handlePasswordVerification = async () => {
    if (!deletePassword.trim()) {
      setErrors({ deletePassword: "Password is required" });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8000/api/account/verify-password/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({ password: deletePassword }),
        }
      );

      const data = await response.json();

      if (response.ok && data.valid) {
        setDeleteStep(3);
        setErrors({});
      } else {
        setErrors({ deletePassword: data.error || "Invalid password" });
      }
    } catch (error) {
      setErrors({ deletePassword: "Password verification failed" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalAccountDeletion = async () => {
    setIsDeletingAccount(true);
    try {
      const response = await fetch(
        "http://localhost:8000/api/account/delete/",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Your account has been permanently deleted.");

        // Clear all local storage and logout
        localStorage.removeItem("authToken");
        logout();

        // Redirect to home page
        navigate("/");
      } else {
        toast.error(data.error || "Failed to delete account");
        setShowDeleteModal(false);
      }
    } catch (error) {
      toast.error("An error occurred while deleting your account");
      setShowDeleteModal(false);
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteStep(1);
    setDeletePassword("");
    setErrors({});
  };

  const navigation = [
    { id: "profile", name: "Profile", icon: UserIcon },
    { id: "notifications", name: "Notifications", icon: BellIcon },
    { id: "security", name: "Security", icon: ShieldCheckIcon },
  ];

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Settings
              </h2>
              <nav className="space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                        activeTab === item.id
                          ? "bg-blue-100 text-blue-700 border-l-4 border-blue-500"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </button>
                  );
                })}

                {/* Delete Account Option */}
                <div className="pt-4 border-t border-gray-200 mt-4">
                  <button
                    onClick={handleDeleteAccountClick}
                    className="w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <TrashIcon className="h-5 w-5 mr-3" />
                    <span className="font-bold">Delete Account</span>
                  </button>
                </div>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Success Message */}
              {successMessage && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <p className="text-green-600 font-medium">{successMessage}</p>
                </div>
              )}

              {/* Error Message */}
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-600 font-medium">{errors.submit}</p>
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">
                      Personal Information
                    </h3>
                    {!isEditing ? (
                      <button
                        onClick={handleEditClick}
                        className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                      >
                        <PencilIcon className="h-4 w-4 mr-2" />
                        Edit
                      </button>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Edit Mode</span>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>

                  {/* Profile Picture Section */}
                  <div className="flex flex-col items-center mb-8">
                    <div className="relative group">
                      <div
                        onClick={handleAvatarClick}
                        className="w-32 h-32 rounded-full cursor-pointer transition-all duration-200 group-hover:shadow-lg group-hover:scale-105 overflow-hidden border-4 border-gray-200 group-hover:border-blue-300"
                      >
                        {profilePictureUrl ? (
                          <img
                            src={profilePictureUrl}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                            <span className="text-white text-3xl font-bold">
                              {getInitials(profileData.full_name || user.email)}
                            </span>
                          </div>
                        )}

                        {/* Overlay */}
                        <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                          <CameraIcon className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        </div>

                        {/* Upload indicator */}
                        {isUploadingImage && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                      </div>

                      {/* Delete button for existing profile picture */}
                      {profilePictureUrl && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProfilePicture();
                          }}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center justify-center shadow-lg"
                          title="Delete profile picture"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mt-3 text-center">
                      Upload your photo
                      <br />
                      <span className="text-xs text-gray-500">
                        Click on the avatar to upload a passport-size photo
                        <br />
                        (Max 5MB, JPEG/PNG/GIF)
                      </span>
                    </p>

                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>

                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          value={profileData.full_name}
                          onChange={(e) =>
                            handleProfileChange("full_name", e.target.value)
                          }
                          disabled={!isEditing}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                            errors.full_name
                              ? "border-red-500"
                              : "border-gray-300"
                          } ${
                            !isEditing
                              ? "bg-gray-50 text-gray-500 cursor-not-allowed"
                              : "bg-white"
                          }`}
                          placeholder="Enter your full name"
                        />
                      </div>
                      {errors.full_name && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.full_name}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) =>
                            handleProfileChange("email", e.target.value)
                          }
                          disabled={!isEditing}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                            errors.email ? "border-red-500" : "border-gray-300"
                          } ${
                            !isEditing
                              ? "bg-gray-50 text-gray-500 cursor-not-allowed"
                              : "bg-white"
                          }`}
                          placeholder="Enter your email"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Phone and Country */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <div className="relative">
                          <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) =>
                              handleProfileChange("phone", e.target.value)
                            }
                            disabled={!isEditing}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                              errors.phone
                                ? "border-red-500"
                                : "border-gray-300"
                            } ${
                              !isEditing
                                ? "bg-gray-50 text-gray-500 cursor-not-allowed"
                                : "bg-white"
                            }`}
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                        {errors.phone && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.phone}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country *
                        </label>
                        <div className="relative">
                          <GlobeAltIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <select
                            value={profileData.country}
                            onChange={(e) =>
                              handleProfileChange("country", e.target.value)
                            }
                            disabled={!isEditing}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                              errors.country
                                ? "border-red-500"
                                : "border-gray-300"
                            } ${
                              !isEditing
                                ? "bg-gray-50 text-gray-500 cursor-not-allowed"
                                : "bg-white"
                            }`}
                          >
                            <option value="">Select Country</option>
                            {countries.map((country) => (
                              <option key={country} value={country}>
                                {country}
                              </option>
                            ))}
                          </select>
                        </div>
                        {errors.country && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.country}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Date of Birth and Gender */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date of Birth *
                        </label>
                        <div className="relative">
                          <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="date"
                            value={profileData.date_of_birth}
                            onChange={(e) =>
                              handleProfileChange(
                                "date_of_birth",
                                e.target.value
                              )
                            }
                            disabled={!isEditing}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                              errors.date_of_birth
                                ? "border-red-500"
                                : "border-gray-300"
                            } ${
                              !isEditing
                                ? "bg-gray-50 text-gray-500 cursor-not-allowed"
                                : "bg-white"
                            }`}
                          />
                        </div>
                        {errors.date_of_birth && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.date_of_birth}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gender *
                        </label>
                        <select
                          value={profileData.gender}
                          onChange={(e) =>
                            handleProfileChange("gender", e.target.value)
                          }
                          disabled={!isEditing}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            errors.gender ? "border-red-500" : "border-gray-300"
                          } ${
                            !isEditing
                              ? "bg-gray-50 text-gray-500 cursor-not-allowed"
                              : "bg-white"
                          }`}
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">
                            Prefer not to say
                          </option>
                        </select>
                        {errors.gender && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.gender}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons - Only shown in edit mode */}
                    {isEditing && (
                      <div className="flex space-x-4">
                        <button
                          type="submit"
                          disabled={isLoading || !hasChanges}
                          className={`flex-1 py-3 font-semibold rounded-lg transition-all duration-200 ${
                            hasChanges && !isLoading
                              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          {isLoading ? "Updating..." : "Update Profile"}
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          disabled={isLoading}
                          className="flex-1 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          <XMarkIcon className="h-4 w-4 mr-2" />
                          Cancel
                        </button>
                      </div>
                    )}

                    {/* Show changes indicator */}
                    {isEditing && hasChanges && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-700">
                          💡 You have unsaved changes. Click "Update Profile" to
                          save them.
                        </p>
                      </div>
                    )}
                  </form>
                </div>
              )}

              {/* Notifications Tab - keeping existing implementation */}
              {activeTab === "notifications" && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    Notification Preferences
                  </h3>
                  <form
                    onSubmit={handleNotificationSubmit}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            Newsletter
                          </h4>
                          <p className="text-sm text-gray-600">
                            Receive our weekly newsletter with trekking tips and
                            updates
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings.newsletter}
                            onChange={(e) =>
                              handleNotificationChange(
                                "newsletter",
                                e.target.checked
                              )
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            Special Offers
                          </h4>
                          <p className="text-sm text-gray-600">
                            Get notified about special deals and discounts on
                            trekking packages
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings.offers}
                            onChange={(e) =>
                              handleNotificationChange(
                                "offers",
                                e.target.checked
                              )
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Updating..." : "Update Preferences"}
                    </button>
                  </form>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    Change Password
                  </h3>
                  <form onSubmit={handleSecuritySubmit} className="space-y-6">
                    {/* Current Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password *
                      </label>
                      <div className="relative">
                        <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type={showPasswords.current ? "text" : "password"}
                          value={securityData.current_password}
                          onChange={(e) =>
                            handleSecurityChange(
                              "current_password",
                              e.target.value
                            )
                          }
                          className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                            errors.current_password
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Enter your current password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords({
                              ...showPasswords,
                              current: !showPasswords.current,
                            })
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        >
                          {showPasswords.current ? (
                            <EyeSlashIcon className="h-5 w-5" />
                          ) : (
                            <EyeIcon className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      {errors.current_password && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.current_password}
                        </p>
                      )}
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password *
                      </label>
                      <div className="relative">
                        <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type={showPasswords.new ? "text" : "password"}
                          value={securityData.new_password}
                          onChange={(e) =>
                            handleSecurityChange("new_password", e.target.value)
                          }
                          className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                            errors.new_password
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Enter your new password"
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
                            <EyeSlashIcon className="h-5 w-5" />
                          ) : (
                            <EyeIcon className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      {errors.new_password && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.new_password}
                        </p>
                      )}
                    </div>

                    {/* Confirm New Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password *
                      </label>
                      <div className="relative">
                        <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type={showPasswords.confirm ? "text" : "password"}
                          value={securityData.confirm_password}
                          onChange={(e) =>
                            handleSecurityChange(
                              "confirm_password",
                              e.target.value
                            )
                          }
                          className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                            errors.confirm_password
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Confirm your new password"
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
                            <EyeSlashIcon className="h-5 w-5" />
                          ) : (
                            <EyeIcon className="h-5 w-5" />
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
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Changing Password..." : "Change Password"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8">
            {/* Step 1: Warning */}
            {deleteStep === 1 && (
              <>
                <div className="flex items-center mb-6">
                  <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mr-4" />
                  <h3 className="text-2xl font-bold text-gray-800">
                    Delete Account
                  </h3>
                </div>

                <div className="mb-6">
                  <p className="text-gray-700 mb-4">
                    <strong className="text-red-600">Warning:</strong> This
                    action cannot be undone. Deleting your account will
                    permanently remove:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                    <li>Your profile information</li>
                    <li>All saved bookmarks</li>
                    <li>Booking history</li>
                    <li>Account preferences</li>
                  </ul>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={closeDeleteModal}
                    className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setDeleteStep(2)}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold"
                  >
                    Continue
                  </button>
                </div>
              </>
            )}

            {/* Step 2: Password Confirmation */}
            {deleteStep === 2 && (
              <>
                <div className="flex items-center mb-6">
                  <ShieldCheckIcon className="h-12 w-12 text-orange-500 mr-4" />
                  <h3 className="text-2xl font-bold text-gray-800">
                    Confirm Your Password
                  </h3>
                </div>

                <p className="text-gray-700 mb-6">
                  Please enter your current password to confirm account
                  deletion.
                </p>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${
                      errors.deletePassword
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter your password"
                  />
                  {errors.deletePassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.deletePassword}
                    </p>
                  )}
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => setDeleteStep(1)}
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors font-semibold disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePasswordVerification}
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 flex items-center justify-center"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      "Verify"
                    )}
                  </button>
                </div>
              </>
            )}

            {/* Step 3: Final Confirmation */}
            {deleteStep === 3 && (
              <>
                <div className="flex items-center mb-6">
                  <TrashIcon className="h-12 w-12 text-red-600 mr-4" />
                  <h3 className="text-2xl font-bold text-gray-800">
                    Final Confirmation
                  </h3>
                </div>

                <div className="mb-6">
                  <p className="text-gray-700 mb-4">
                    <strong className="text-red-600">Last chance!</strong> Are
                    you absolutely sure you want to delete your account?
                  </p>
                  <p className="text-sm text-gray-600">
                    Type <strong>DELETE</strong> below to confirm:
                  </p>
                  <input
                    type="text"
                    onChange={(e) => setDeletePassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors mt-2"
                    placeholder="Type DELETE to confirm"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={closeDeleteModal}
                    disabled={isDeletingAccount}
                    className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors font-semibold disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleFinalAccountDeletion}
                    disabled={isDeletingAccount || deletePassword !== "DELETE"}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 flex items-center justify-center"
                  >
                    {isDeletingAccount ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Deleting...
                      </>
                    ) : (
                      "Delete Account"
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
