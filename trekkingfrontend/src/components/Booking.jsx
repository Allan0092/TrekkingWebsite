import {
  AlertCircle,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Globe,
  Mail,
  MapPin,
  Mountain,
  Phone,
  User,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

const Booking = () => {
  const [pkg, setPkg] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [numPeople, setNumPeople] = useState(1);
  const [currentPersonIndex, setCurrentPersonIndex] = useState(0);
  const [people, setPeople] = useState([
    {
      fullName: "",
      dateOfBirth: "",
      email: "",
      phone: "",
      nationality: "",
      gender: "",
      dateOfArrival: "",
      dateOfDeparture: "",
      room: "Single",
      shareRoomWith: "",
    },
  ]);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get package ID from URL parameters
  const [searchParams] = useSearchParams();
  const location = useLocation();

  // Extract package ID from URL parameters or pathname
  const getPackageId = () => {
    // First try to get from ?package= parameter
    const packageParam = searchParams.get("package");
    if (packageParam) return packageParam;

    // Then try to extract from pathname if it's like /booking/7
    const pathParts = location.pathname.split("/");
    const lastPart = pathParts[pathParts.length - 1];
    if (lastPart && !isNaN(lastPart)) return lastPart;

    return null;
  };

  // Fetch package data from API
  useEffect(() => {
    const fetchPackage = async () => {
      const packageId = getPackageId();

      if (!packageId) {
        setError("No package ID provided");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:8000/api/packages/${packageId}/`
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Package not found");
          }
          throw new Error(`Failed to fetch package: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched package:", data);

        // Ensure price is a number
        const processedPackage = {
          ...data,
          price: parseFloat(data.price) || 0,
          altitude: parseFloat(data.altitude) || 0,
        };

        setPkg(processedPackage);
      } catch (err) {
        console.error("Error fetching package:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackage();
  }, [searchParams, location.pathname]);

  useEffect(() => {
    setPeople((prev) => {
      const newPeople = Array.from({ length: numPeople }, (_, i) => {
        if (prev[i]) {
          return prev[i];
        }

        const person1 = prev[0] || {};
        return {
          fullName: "",
          dateOfBirth: "",
          email: "",
          phone: "",
          nationality: person1.nationality || "",
          gender: "",
          dateOfArrival: person1.dateOfArrival || "",
          dateOfDeparture: person1.dateOfDeparture || "",
          room: "Single",
          shareRoomWith: "",
        };
      });
      return newPeople;
    });

    // Reset to first person if current index is out of bounds
    if (currentPersonIndex >= numPeople) {
      setCurrentPersonIndex(0);
    }
  }, [numPeople, currentPersonIndex]);

  const handlePersonChange = (index, field, value) => {
    setPeople((prev) => {
      const newPeople = [...prev];
      newPeople[index] = { ...newPeople[index], [field]: value };

      // If changing room type from Shared to Single
      if (
        field === "room" &&
        value === "Single" &&
        prev[index].room === "Shared"
      ) {
        // Clear this person's roommate selection
        newPeople[index].shareRoomWith = "";

        // Clear any other person who had selected this person as roommate.
        const personName = prev[index].fullName;
        if (personName) {
          newPeople.forEach((person, i) => {
            if (i !== index && person.shareRoomWith === personName) {
              newPeople[i].shareRoomWith = "";
            }
          });
        }
      }

      // Auto-select roommate in both directions
      if (field === "shareRoomWith" && value) {
        const roommateIndex = newPeople.findIndex((p) => p.fullName === value);
        if (roommateIndex !== -1) {
          newPeople[roommateIndex].room = "Shared";
          newPeople[roommateIndex].shareRoomWith = newPeople[index].fullName;
        }
      }

      // Auto-fill common fields from Person 1
      if (
        index === 0 &&
        ["nationality", "dateOfArrival", "dateOfDeparture"].includes(field)
      ) {
        newPeople.forEach((person, i) => {
          if (i !== 0 && !person[field]) {
            newPeople[i][field] = value;
          }
        });
      }

      return newPeople;
    });

    // Clear validation errors for this field
    setValidationErrors((prev) => ({
      ...prev,
      [`${index}-${field}`]: undefined,
    }));
  };

  const getAvailableRoomMates = (currentIndex) => {
    const currentPerson = people[currentIndex];
    if (!currentPerson || currentPerson.room !== "Shared") return [];

    return people
      .map((person, index) => ({ person, index }))
      .filter(
        ({ person, index }) =>
          index !== currentIndex &&
          person.fullName.trim() !== "" &&
          person.room === "Shared" &&
          // Modified condition: either not paired or paired with currentPerson
          (!person.shareRoomWith ||
            person.shareRoomWith === currentPerson.fullName)
      )
      .map(({ person }) => person.fullName);
  };

  const validateForm = () => {
    const errors = {};

    people.forEach((person, index) => {
      const requiredFields = [
        "fullName",
        "dateOfBirth",
        "email",
        "phone",
        "nationality",
        "gender",
        "dateOfArrival",
        "dateOfDeparture",
      ];

      requiredFields.forEach((field) => {
        if (!person[field] || person[field].trim() === "") {
          errors[`${index}-${field}`] = "This field is required";
        }
      });

      // Full name validation - check for text characters
      if (person.fullName && !/[a-zA-Z]/.test(person.fullName)) {
        errors[`${index}-fullName`] = "Full name must contain letters";
      }

      // Email validation
      if (person.email && !/\S+@\S+\.\S+/.test(person.email)) {
        errors[`${index}-email`] = "Please enter a valid email address";
      }

      // Phone validation
      if (person.phone) {
        const phoneRegex =
          /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,3}[-\s.]?[0-9]{4,10}$/;
        if (!phoneRegex.test(person.phone)) {
          errors[`${index}-phone`] = "Please enter a valid phone number";
        }
      }

      // Date validation
      if (person.dateOfArrival && person.dateOfDeparture) {
        const arrivalDate = new Date(person.dateOfArrival);
        const departureDate = new Date(person.dateOfDeparture);

        if (arrivalDate >= departureDate) {
          errors[`${index}-dateOfDeparture`] =
            "Departure date must be after arrival date";
        }
      }

      // Room sharing validation
      if (person.room === "Shared") {
        if (!person.shareRoomWith) {
          errors[`${index}-shareRoomWith`] = "Please select a roommate";
        } else {
          // Check if selected roommate exists and has Shared room selected
          const roommateIndex = people.findIndex(
            (p) => p.fullName === person.shareRoomWith
          );
          if (roommateIndex === -1 || people[roommateIndex].room !== "Shared") {
            errors[`${index}-shareRoomWith`] =
              "Selected roommate is not available for sharing";
          }
        }
      }

      // Date of birth validation - can't be today/future & must be >1 year old
      if (person.dateOfBirth) {
        const today = new Date();
        const birthDate = new Date(person.dateOfBirth);

        // Check if birth date is today or in the future
        if (birthDate >= new Date(today.setHours(0, 0, 0, 0))) {
          errors[`${index}-dateOfBirth`] =
            "Date of birth cannot be today or in the future";
        } else {
          // Check if person is at least one year old
          const oneYearAgo = new Date();
          oneYearAgo.setFullYear(today.getFullYear() - 1);

          if (birthDate > oneYearAgo) {
            errors[`${index}-dateOfBirth`] =
              "Person must be at least one year old";
          }
        }
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const calculatePrice = () => {
    if (!pkg) return { items: [], total: 0 };

    const basePrice = pkg.price || 0;
    const items = [];
    let total = 0;

    // Base price per person
    people.forEach((_, i) => {
      items.push({ name: `Base Price (Person ${i + 1})`, cost: basePrice });
      total += basePrice;
    });

    // Room costs - avoid double charging for shared rooms
    const processedSharedRooms = new Set();

    people.forEach((person, i) => {
      if (person.room === "Single") {
        items.push({ name: `Single Room (Person ${i + 1})`, cost: 100 });
        total += 100;
      } else if (person.room === "Shared" && person.shareRoomWith) {
        // Create a unique key for the shared room pair
        const roomKey = [person.fullName, person.shareRoomWith]
          .sort()
          .join("-");

        if (!processedSharedRooms.has(roomKey)) {
          items.push({
            name: `Shared Room (${person.fullName} & ${person.shareRoomWith})`,
            cost: 120,
          });
          total += 120;
          processedSharedRooms.add(roomKey);
        }
      }
    });

    return { items, total };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to top when validation fails
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    setShowModal(true);
  };

  const confirmBooking = async () => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Booking Submitted:", {
        packageId: pkg.id,
        people,
        additionalInfo,
        totalPrice: calculatePrice().total,
      });

      setShowModal(false);
      alert(
        "Booking confirmed! You will receive a confirmation email shortly."
      );
    } catch (error) {
      console.error("Booking error:", error);
      alert("There was an error processing your booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "EASY":
        return "text-green-600 bg-green-100";
      case "MEDIUM":
        return "text-blue-600 bg-blue-100";
      case "TOUGH":
        return "text-orange-600 bg-orange-100";
      case "VERY_TOUGH":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const formatDifficulty = (difficulty) => {
    return difficulty === "VERY_TOUGH" ? "Very Tough" : difficulty || "N/A";
  };

  const nextPerson = () => {
    setCurrentPersonIndex((prev) => (prev + 1) % people.length);
  };

  const prevPerson = () => {
    setCurrentPersonIndex((prev) => (prev - 1 + people.length) % people.length);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl font-medium text-gray-700">
            Loading package details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-700 mb-2">
            {error === "Package not found"
              ? "Package Not Found"
              : "Error Loading Package"}
          </h2>
          <p className="text-lg text-red-600 mb-4">
            {error || "Package not found."}
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const priceData = calculatePrice();
  const currentPerson = people[currentPersonIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Complete Your Booking
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Secure your spot on this incredible adventure. Fill in the details
            below to complete your booking.
          </p>
        </div>

        {/* Package Overview */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{pkg.title}</h2>
          <p className="text-gray-600 mb-6 line-clamp-2">{pkg.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="text-lg font-semibold">{pkg.duration} days</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Base Price</p>
                <p className="text-lg font-semibold">${pkg.price}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-full">
                <Mountain className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Altitude</p>
                <p className="text-lg font-semibold">{pkg.altitude}m</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-orange-100 rounded-full">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Difficulty</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(
                    pkg.difficulty
                  )}`}
                >
                  {formatDifficulty(pkg.difficulty)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Group Size */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Group Size
            </h2>
            <div className="flex items-center space-x-4">
              <Users className="h-6 w-6 text-gray-600" />
              <label className="text-lg font-medium text-gray-700">
                Number of People:
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={numPeople}
                onChange={(e) =>
                  setNumPeople(
                    Math.max(1, Math.min(20, parseInt(e.target.value) || 1))
                  )
                }
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Personal Details */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Personal Details
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={prevPerson}
                  disabled={people.length <= 1}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="text-sm font-medium text-gray-600">
                  {currentPersonIndex + 1} of {people.length}
                </span>
                <button
                  type="button"
                  onClick={nextPerson}
                  disabled={people.length <= 1}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Person {currentPersonIndex + 1} Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline h-4 w-4 mr-1" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={currentPerson.fullName}
                    onChange={(e) =>
                      handlePersonChange(
                        currentPersonIndex,
                        "fullName",
                        e.target.value
                      )
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      validationErrors[`${currentPersonIndex}-fullName`]
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter full name"
                  />
                  {validationErrors[`${currentPersonIndex}-fullName`] && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors[`${currentPersonIndex}-fullName`]}
                    </p>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={currentPerson.dateOfBirth}
                    onChange={(e) =>
                      handlePersonChange(
                        currentPersonIndex,
                        "dateOfBirth",
                        e.target.value
                      )
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      validationErrors[`${currentPersonIndex}-dateOfBirth`]
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {validationErrors[`${currentPersonIndex}-dateOfBirth`] && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors[`${currentPersonIndex}-dateOfBirth`]}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="inline h-4 w-4 mr-1" />
                    Email *
                  </label>
                  <input
                    type="email"
                    value={currentPerson.email}
                    onChange={(e) =>
                      handlePersonChange(
                        currentPersonIndex,
                        "email",
                        e.target.value
                      )
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      validationErrors[`${currentPersonIndex}-email`]
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter email address"
                  />
                  {validationErrors[`${currentPersonIndex}-email`] && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors[`${currentPersonIndex}-email`]}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="inline h-4 w-4 mr-1" />
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={currentPerson.phone}
                    onChange={(e) =>
                      handlePersonChange(
                        currentPersonIndex,
                        "phone",
                        e.target.value
                      )
                    }
                    pattern="[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,3}[-\s.]?[0-9]{4,10}"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      validationErrors[`${currentPersonIndex}-phone`]
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="e.g. +1 (555) 123-4567"
                  />
                  {validationErrors[`${currentPersonIndex}-phone`] && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors[`${currentPersonIndex}-phone`]}
                    </p>
                  )}
                </div>

                {/* Nationality */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Globe className="inline h-4 w-4 mr-1" />
                    Nationality *
                  </label>
                  <select
                    value={currentPerson.nationality}
                    onChange={(e) =>
                      handlePersonChange(
                        currentPersonIndex,
                        "nationality",
                        e.target.value
                      )
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      validationErrors[`${currentPersonIndex}-nationality`]
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Nationality</option>
                    {[
                      "United States",
                      "United Kingdom",
                      "Nepal",
                      "Canada",
                      "Australia",
                      "India",
                      "Germany",
                      "France",
                      "Japan",
                      "Other",
                    ].map((nat) => (
                      <option key={nat} value={nat}>
                        {nat}
                      </option>
                    ))}
                  </select>
                  {validationErrors[`${currentPersonIndex}-nationality`] && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors[`${currentPersonIndex}-nationality`]}
                    </p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender *
                  </label>
                  <select
                    value={currentPerson.gender}
                    onChange={(e) =>
                      handlePersonChange(
                        currentPersonIndex,
                        "gender",
                        e.target.value
                      )
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      validationErrors[`${currentPersonIndex}-gender`]
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {validationErrors[`${currentPersonIndex}-gender`] && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors[`${currentPersonIndex}-gender`]}
                    </p>
                  )}
                </div>

                {/* Travel Dates */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Arrival Date *
                  </label>
                  <input
                    type="date"
                    value={currentPerson.dateOfArrival}
                    onChange={(e) =>
                      handlePersonChange(
                        currentPersonIndex,
                        "dateOfArrival",
                        e.target.value
                      )
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      validationErrors[`${currentPersonIndex}-dateOfArrival`]
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {validationErrors[`${currentPersonIndex}-dateOfArrival`] && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors[`${currentPersonIndex}-dateOfArrival`]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Departure Date *
                  </label>
                  <input
                    type="date"
                    value={currentPerson.dateOfDeparture}
                    onChange={(e) =>
                      handlePersonChange(
                        currentPersonIndex,
                        "dateOfDeparture",
                        e.target.value
                      )
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      validationErrors[`${currentPersonIndex}-dateOfDeparture`]
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {validationErrors[
                    `${currentPersonIndex}-dateOfDeparture`
                  ] && (
                    <p className="mt-1 text-sm text-red-600">
                      {
                        validationErrors[
                          `${currentPersonIndex}-dateOfDeparture`
                        ]
                      }
                    </p>
                  )}
                </div>

                {/* Room Preferences */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Type *
                  </label>
                  <select
                    value={currentPerson.room}
                    onChange={(e) =>
                      handlePersonChange(
                        currentPersonIndex,
                        "room",
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Single">Single Room (+$100)</option>
                    <option value="Shared" disabled={numPeople === 1}>
                      Shared Room (+$60 per person)
                    </option>
                  </select>
                </div>

                {currentPerson.room === "Shared" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Share Room With *
                    </label>
                    <select
                      value={currentPerson.shareRoomWith}
                      onChange={(e) =>
                        handlePersonChange(
                          currentPersonIndex,
                          "shareRoomWith",
                          e.target.value
                        )
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        validationErrors[`${currentPersonIndex}-shareRoomWith`]
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">Select Roommate</option>
                      {getAvailableRoomMates(currentPersonIndex).map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                    {validationErrors[
                      `${currentPersonIndex}-shareRoomWith`
                    ] && (
                      <p className="mt-1 text-sm text-red-600">
                        {
                          validationErrors[
                            `${currentPersonIndex}-shareRoomWith`
                          ]
                        }
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Additional Information
            </h2>
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Any special requirements, dietary restrictions, or additional notes..."
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Price Summary */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Price Summary
            </h2>
            <div className="space-y-3">
              {priceData.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 border-b border-gray-100"
                >
                  <span className="text-gray-700">{item.name}</span>
                  <span className="font-semibold">${item.cost}</span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-4 border-t-2 border-gray-200">
                <span className="text-xl font-bold text-gray-800">Total</span>
                <span className="text-2xl font-bold text-blue-600">
                  ${priceData.total}
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 transform hover:scale-105"
            >
              Complete Booking
            </button>
          </div>
        </form>

        {/* Confirmation Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Confirm Your Booking
              </h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Package:</span>
                  <span className="font-semibold">{pkg.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">People:</span>
                  <span className="font-semibold">{numPeople}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-bold text-blue-600">
                    ${priceData.total}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-6">
                A confirmation email will be sent to your provided email address
                within 24 hours.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowModal(false)}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50 transition-all duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBooking}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 disabled:opacity-50 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Check className="h-5 w-5 mr-2" />
                      Confirm Booking
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;
