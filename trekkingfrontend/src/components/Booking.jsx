import {
  ArrowLeft,
  ArrowRight,
  Award,
  Bed,
  Calendar,
  Camera,
  CheckCircle,
  Compass,
  DollarSign,
  Globe,
  Heart,
  Mail,
  MapPin,
  Mountain,
  Phone,
  Send,
  Shield,
  Sparkles,
  Star,
  User,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

const EpicBookingExperience = () => {
  const [currentStep, setCurrentStep] = useState(0);
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
  const [completedSteps, setCompletedSteps] = useState([]);
  const [sparkleAnimation, setSparkleAnimation] = useState(false);

  // Mock package data for demo
  useEffect(() => {
    const mockPackage = {
      id: 1,
      name: "Everest Base Camp Trek",
      duration: 14,
      price: 1299,
      altitude: 5364,
      difficulty: "TOUGH",
      description:
        "Experience the ultimate adventure to the base of the world's highest peak",
      features: [
        "Professional Guide",
        "All Meals",
        "Accommodation",
        "Permits",
        "Medical Kit",
      ],
      images: [
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1551524164-6cf2ac21ebf1?w=800&h=600&fit=crop",
      ],
    };

    setTimeout(() => {
      setPkg(mockPackage);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    setPeople((prev) => {
      const newPeople = Array.from({ length: numPeople }, (_, i) => {
        if (prev[i]) return prev[i];
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
  }, [numPeople]);

  const steps = [
    {
      title: "Package Overview",
      icon: Mountain,
      color: "from-blue-500 to-purple-600",
    },
    { title: "Group Size", icon: Users, color: "from-purple-500 to-pink-600" },
    {
      title: "Personal Details",
      icon: User,
      color: "from-pink-500 to-red-600",
    },
    {
      title: "Additional Info",
      icon: Heart,
      color: "from-red-500 to-orange-600",
    },
    {
      title: "Price & Confirm",
      icon: CheckCircle,
      color: "from-orange-500 to-yellow-600",
    },
  ];

  const handlePersonChange = (index, field, value) => {
    setPeople((prev) => {
      const newPeople = [...prev];
      newPeople[index] = { ...newPeople[index], [field]: value };

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
  };

  const calculatePrice = () => {
    if (!pkg) return { items: [], total: 0 };

    const basePrice = pkg.price || 0;
    const items = [];
    let total = 0;

    people.forEach((_, i) => {
      items.push({ name: `Base Price (Person ${i + 1})`, cost: basePrice });
      total += basePrice;
    });

    people.forEach((person, i) => {
      const roomCost = person.room === "Single" ? 100 : 60;
      items.push({
        name: `Room (Person ${i + 1} - ${person.room})`,
        cost: roomCost,
      });
      total += roomCost;
    });

    return { items, total };
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps((prev) => [...prev, currentStep]);
      setCurrentStep((prev) => prev + 1);
      setSparkleAnimation(true);
      setTimeout(() => setSparkleAnimation(false), 1000);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "EASY":
        return "text-green-400";
      case "MEDIUM":
        return "text-blue-400";
      case "TOUGH":
        return "text-orange-400";
      case "VERY_TOUGH":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const formatDifficulty = (difficulty) => {
    return difficulty === "VERY_TOUGH" ? "Very Tough" : difficulty || "N/A";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-32 h-32 border-4 border-white/20 rounded-full animate-spin border-t-white"></div>
            <Mountain className="w-16 h-16 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-white text-2xl font-bold mt-8 animate-pulse">
            Loading your adventure...
          </p>
        </div>
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 to-pink-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Oops!</h1>
          <p className="text-xl">{error || "Package not found."}</p>
        </div>
      </div>
    );
  }

  const priceData = calculatePrice();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 animate-pulse">
            Epic Adventure Booking
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Embark on the journey of a lifetime. Every step brings you closer to
            extraordinary.
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isCompleted = completedSteps.includes(index);
              const isCurrent = currentStep === index;

              return (
                <div
                  key={index}
                  className={`flex flex-col items-center transition-all duration-500 ${
                    isCurrent ? "scale-110" : "scale-100"
                  }`}
                >
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 transition-all duration-500 ${
                      isCompleted
                        ? "bg-gradient-to-r from-green-400 to-blue-500 shadow-lg shadow-green-500/50"
                        : isCurrent
                        ? `bg-gradient-to-r ${step.color} shadow-lg shadow-purple-500/50 animate-pulse`
                        : "bg-white/20 backdrop-blur-sm"
                    }`}
                  >
                    <StepIcon
                      className={`w-8 h-8 ${
                        isCompleted || isCurrent
                          ? "text-white"
                          : "text-white/60"
                      }`}
                    />
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      isCurrent ? "text-white" : "text-white/60"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 backdrop-blur-sm">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        <div className="max-w-4xl mx-auto">
          {currentStep === 0 && (
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-4xl font-bold text-white mb-4">
                    {pkg.name}
                  </h2>
                  <p className="text-white/80 text-lg mb-6">
                    {pkg.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/10 rounded-2xl p-4 text-center">
                      <Calendar className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                      <p className="text-white font-bold text-xl">
                        {pkg.duration}
                      </p>
                      <p className="text-white/60">Days</p>
                    </div>
                    <div className="bg-white/10 rounded-2xl p-4 text-center">
                      <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
                      <p className="text-white font-bold text-xl">
                        ${pkg.price}
                      </p>
                      <p className="text-white/60">Per Person</p>
                    </div>
                    <div className="bg-white/10 rounded-2xl p-4 text-center">
                      <Mountain className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                      <p className="text-white font-bold text-xl">
                        {pkg.altitude}m
                      </p>
                      <p className="text-white/60">Altitude</p>
                    </div>
                    <div className="bg-white/10 rounded-2xl p-4 text-center">
                      <Award className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                      <p
                        className={`font-bold text-xl ${getDifficultyColor(
                          pkg.difficulty
                        )}`}
                      >
                        {formatDifficulty(pkg.difficulty)}
                      </p>
                      <p className="text-white/60">Difficulty</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-white font-bold text-lg mb-3">
                      ✨ What's Included:
                    </h3>
                    {pkg.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-white/80">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {pkg.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative overflow-hidden rounded-2xl group"
                    >
                      <img
                        src={image}
                        alt={`Trek view ${index + 1}`}
                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <Camera className="absolute bottom-4 right-4 w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="text-center mb-8">
                <Users className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h2 className="text-4xl font-bold text-white mb-4">
                  How Many Adventurers?
                </h2>
                <p className="text-white/80 text-lg">
                  Select your group size for this epic journey
                </p>
              </div>

              <div className="max-w-md mx-auto">
                <div className="grid grid-cols-4 gap-4 mb-8">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      onClick={() => setNumPeople(num)}
                      className={`h-20 rounded-2xl font-bold text-2xl transition-all duration-300 ${
                        numPeople === num
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50 scale-105"
                          : "bg-white/20 text-white/80 hover:bg-white/30"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>

                <div className="bg-white/10 rounded-2xl p-6">
                  <label className="block text-white font-bold mb-4">
                    Custom Group Size (1-20)
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
                    className="w-full p-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl">
                  <h3 className="text-white font-bold mb-2">Group Benefits:</h3>
                  <ul className="text-white/80 space-y-1">
                    <li>• Shared memories and experiences</li>
                    <li>• Group discounts on accommodation</li>
                    <li>• Enhanced safety in numbers</li>
                    <li>• More fun and motivation</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="text-center mb-8">
                <User className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <h2 className="text-4xl font-bold text-white mb-4">
                  Personal Details
                </h2>
                <p className="text-white/80 text-lg">
                  Tell us about your adventuring crew
                </p>
              </div>

              {/* Person selector */}
              <div className="flex justify-center mb-8">
                <div className="flex space-x-2 bg-white/10 rounded-2xl p-2">
                  {people.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPersonIndex(index)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                        currentPersonIndex === index
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                          : "text-white/80 hover:bg-white/20"
                      }`}
                    >
                      Person {index + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Person form */}
              <div className="max-w-2xl mx-auto">
                <div className="bg-white/10 rounded-2xl p-6 mb-6">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <Sparkles className="w-6 h-6 mr-2" />
                    Person {currentPersonIndex + 1} Details
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white font-medium mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={people[currentPersonIndex]?.fullName || ""}
                        onChange={(e) =>
                          handlePersonChange(
                            currentPersonIndex,
                            "fullName",
                            e.target.value
                          )
                        }
                        className="w-full p-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter full name"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={people[currentPersonIndex]?.dateOfBirth || ""}
                        onChange={(e) =>
                          handlePersonChange(
                            currentPersonIndex,
                            "dateOfBirth",
                            e.target.value
                          )
                        }
                        className="w-full p-3 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email
                      </label>
                      <input
                        type="email"
                        value={people[currentPersonIndex]?.email || ""}
                        onChange={(e) =>
                          handlePersonChange(
                            currentPersonIndex,
                            "email",
                            e.target.value
                          )
                        }
                        className="w-full p-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter email"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">
                        <Phone className="w-4 h-4 inline mr-2" />
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={people[currentPersonIndex]?.phone || ""}
                        onChange={(e) =>
                          handlePersonChange(
                            currentPersonIndex,
                            "phone",
                            e.target.value
                          )
                        }
                        className="w-full p-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter phone number"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">
                        <Globe className="w-4 h-4 inline mr-2" />
                        Nationality
                      </label>
                      <select
                        value={people[currentPersonIndex]?.nationality || ""}
                        onChange={(e) =>
                          handlePersonChange(
                            currentPersonIndex,
                            "nationality",
                            e.target.value
                          )
                        }
                        className="w-full p-3 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Nationality</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Nepal">Nepal</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                        <option value="India">India</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">
                        Gender
                      </label>
                      <select
                        value={people[currentPersonIndex]?.gender || ""}
                        onChange={(e) =>
                          handlePersonChange(
                            currentPersonIndex,
                            "gender",
                            e.target.value
                          )
                        }
                        className="w-full p-3 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">
                        <MapPin className="w-4 h-4 inline mr-2" />
                        Date of Arrival
                      </label>
                      <input
                        type="date"
                        value={people[currentPersonIndex]?.dateOfArrival || ""}
                        onChange={(e) =>
                          handlePersonChange(
                            currentPersonIndex,
                            "dateOfArrival",
                            e.target.value
                          )
                        }
                        className="w-full p-3 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">
                        Date of Departure
                      </label>
                      <input
                        type="date"
                        value={
                          people[currentPersonIndex]?.dateOfDeparture || ""
                        }
                        onChange={(e) =>
                          handlePersonChange(
                            currentPersonIndex,
                            "dateOfDeparture",
                            e.target.value
                          )
                        }
                        className="w-full p-3 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">
                        <Bed className="w-4 h-4 inline mr-2" />
                        Room Preference
                      </label>
                      <select
                        value={people[currentPersonIndex]?.room || "Single"}
                        onChange={(e) =>
                          handlePersonChange(
                            currentPersonIndex,
                            "room",
                            e.target.value
                          )
                        }
                        className="w-full p-3 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Single">Single Room ($100)</option>
                        <option value="Shared" disabled={numPeople === 1}>
                          Shared Room ($60)
                        </option>
                      </select>
                    </div>

                    {people[currentPersonIndex]?.room === "Shared" && (
                      <div>
                        <label className="block text-white font-medium mb-2">
                          Share Room With
                        </label>
                        <select
                          value={
                            people[currentPersonIndex]?.shareRoomWith || ""
                          }
                          onChange={(e) =>
                            handlePersonChange(
                              currentPersonIndex,
                              "shareRoomWith",
                              e.target.value
                            )
                          }
                          className="w-full p-3 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select Person</option>
                          {people
                            .filter(
                              (p, i) => i !== currentPersonIndex && p.fullName
                            )
                            .map((p) => (
                              <option key={p.fullName} value={p.fullName}>
                                {p.fullName}
                              </option>
                            ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="text-center mb-8">
                <Heart className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h2 className="text-4xl font-bold text-white mb-4">
                  Additional Information
                </h2>
                <p className="text-white/80 text-lg">
                  Any special requests or dietary requirements?
                </p>
              </div>

              <div className="max-w-2xl mx-auto">
                <div className="bg-white/10 rounded-2xl p-6">
                  <textarea
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    placeholder="Tell us about dietary restrictions, allergies, special celebrations, or any other requests..."
                    className="w-full h-40 p-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  />
                </div>

                <div className="mt-8 grid md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl p-4 text-center">
                    <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <h3 className="text-white font-bold mb-1">Safety First</h3>
                    <p className="text-white/80 text-sm">
                      Professional guides and medical support
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-4 text-center">
                    <Compass className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <h3 className="text-white font-bold mb-1">
                      Expert Guidance
                    </h3>
                    <p className="text-white/80 text-sm">
                      Local knowledge and cultural insights
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl p-4 text-center">
                    <Star className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                    <h3 className="text-white font-bold mb-1">
                      Premium Experience
                    </h3>
                    <p className="text-white/80 text-sm">
                      Carefully curated adventure
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="text-center mb-8">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h2 className="text-4xl font-bold text-white mb-4">
                  Final Review & Confirmation
                </h2>
                <p className="text-white/80 text-lg">
                  You're one step away from your epic adventure!
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Booking Summary */}
                <div className="space-y-6">
                  <div className="bg-white/10 rounded-2xl p-6">
                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                      <Mountain className="w-6 h-6 mr-2" />
                      Trip Summary
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-white/80">Package:</span>
                        <span className="text-white font-medium">
                          {pkg.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/80">Duration:</span>
                        <span className="text-white font-medium">
                          {pkg.duration} days
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/80">Group Size:</span>
                        <span className="text-white font-medium">
                          {numPeople} {numPeople === 1 ? "person" : "people"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/80">Difficulty:</span>
                        <span
                          className={`font-medium ${getDifficultyColor(
                            pkg.difficulty
                          )}`}
                        >
                          {formatDifficulty(pkg.difficulty)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-2xl p-6">
                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                      <Users className="w-6 h-6 mr-2" />
                      Adventurers
                    </h3>
                    <div className="space-y-3">
                      {people.map((person, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-white/10 rounded-xl p-3"
                        >
                          <div>
                            <p className="text-white font-medium">
                              {person.fullName || `Person ${index + 1}`}
                            </p>
                            <p className="text-white/60 text-sm">
                              {person.room} Room
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-medium">
                              $
                              {pkg.price +
                                (person.room === "Single" ? 100 : 60)}
                            </p>
                            <p className="text-white/60 text-sm">Total</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl p-6">
                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                      <DollarSign className="w-6 h-6 mr-2" />
                      Price Breakdown
                    </h3>
                    <div className="space-y-3">
                      {priceData.items.map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="text-white/80">{item.name}</span>
                          <span className="text-white font-medium">
                            ${item.cost}
                          </span>
                        </div>
                      ))}
                      <div className="border-t border-white/30 pt-3 mt-3">
                        <div className="flex justify-between text-xl font-bold">
                          <span className="text-white">Total Amount</span>
                          <span className="text-green-400">
                            ${priceData.total}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4">
                      🎉 What's Next?
                    </h3>
                    <ul className="space-y-2 text-white/80">
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                        Confirmation email within 24 hours
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                        Detailed itinerary and packing list
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                        Pre-trek consultation call
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                        24/7 support throughout your journey
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => setShowModal(true)}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold py-4 px-8 rounded-2xl hover:from-green-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-green-500/50 hover:shadow-xl hover:shadow-green-500/60 transform hover:scale-105"
                  >
                    <Send className="w-6 h-6 inline mr-2" />
                    Confirm Your Epic Adventure
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-12">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`flex items-center px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                currentStep === 0
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
              }`}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Previous
            </button>

            {currentStep < steps.length - 1 && (
              <button
                onClick={nextStep}
                className="flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/60 transform hover:scale-105"
              >
                Next
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            )}
          </div>
        </div>

        {/* Confirmation Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20 max-w-md w-full animate-pulse">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">
                  🎉 Adventure Confirmed!
                </h3>
                <p className="text-white/80 text-lg mb-8">
                  Your epic journey awaits! We'll send you a confirmation email
                  with all the details within 24 hours.
                </p>

                <div className="space-y-4">
                  <div className="bg-white/10 rounded-2xl p-4">
                    <p className="text-white font-bold text-xl">
                      ${priceData.total}
                    </p>
                    <p className="text-white/60">Total Investment</p>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 bg-white/20 text-white font-bold py-3 px-6 rounded-xl hover:bg-white/30 transition-all duration-300"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        setShowModal(false);
                        // Reset form or redirect
                      }}
                      className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:from-green-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-green-500/50"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sparkle animation overlay */}
        {sparkleAnimation && (
          <div className="fixed inset-0 pointer-events-none z-40">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-4 h-4 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EpicBookingExperience;
