import {
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

const PackageDetails = () => {
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");
  const [expandedDays, setExpandedDays] = useState({});
  const [expandedPacking, setExpandedPacking] = useState({});
  const [checkedItems, setCheckedItems] = useState({});
  const sectionRefs = useRef({
    overview: useRef(null),
    itinerary: useRef(null),
    map: useRef(null),
    packing: useRef(null),
    includes: useRef(null),
    excludes: useRef(null),
  });
  const sliderRef = useRef(null);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `http://localhost:8000/api/packages/${id}/`
        );
        if (!response.ok) throw new Error("Failed to fetch package details");
        const data = await response.json();
        console.log("Fetched package:", data);
        setPkg(data);
      } catch (err) {
        console.error("Error fetching package:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackage();
  }, [id]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => {
      Object.values(sectionRefs.current).forEach((ref) => {
        if (ref.current) observer.unobserve(ref.current);
      });
    };
  }, []);

  const scrollToSection = (sectionId) => {
    const element = sectionRefs.current[sectionId].current;
    if (element) {
      const offset = 80; // 80px offset for navbar
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
      setActiveSection(sectionId);
    }
  };

  const toggleDay = (day) => {
    setExpandedDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  const togglePacking = (category) => {
    setExpandedPacking((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const toggleCheckbox = (category, e) => {
    e.stopPropagation();
    setCheckedItems((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 5000,
    dotsClass: "slick-dots slick-dots-custom",
    appendDots: (dots) => (
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <ul style={{ margin: "0", padding: "0" }}> {dots} </ul>
      </div>
    ),
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "EASY":
        return "text-green-500";
      case "MEDIUM":
        return "text-blue-500";
      case "TOUGH":
        return "text-orange-500";
      case "VERY_TOUGH":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const formatDifficulty = (difficulty) => {
    if (difficulty === "VERY_TOUGH") {
      return "Very Tough";
    }
    return difficulty || "N/A";
  };

  // Placeholder itinerary data
  const placeholderItinerary = pkg?.duration
    ? Array.from({ length: pkg.duration }, (_, i) => ({
        day: i + 1,
        title: `Sample Activity`,
        description: `Description for Day ${
          i + 1
        }. This is a placeholder for the itinerary details.`,
        icon:
          i === 0
            ? "plane-land"
            : i === pkg.duration - 1
            ? "flight-depart"
            : i === Math.floor(pkg.duration / 2)
            ? "highest-point"
            : i % 2 === 0
            ? "hike-up"
            : "hike-down",
      }))
    : [];

  const itineraries =
    pkg?.itineraries?.length > 0 ? pkg.itineraries : placeholderItinerary;

  // Packing list data
  const packingList = [
    {
      category: "General",
      icon: "🎒", // Backpack emoji
      items: [
        "Backpack (40-60L)",
        "Trekking poles",
        "Water bottle or hydration system",
        "Headlamp with extra batteries",
      ],
    },
    {
      category: "Upper Body",
      icon: "👕", // T-shirt emoji
      items: [
        "Fleece jacket",
        "Waterproof/windproof jacket",
        "Thermal base layers",
        "T-shirts (moisture-wicking)",
      ],
    },
    {
      category: "Torso",
      icon: "🧥", // Coat emoji
      items: [
        "Insulated jacket (down or synthetic)",
        "Lightweight pullover",
        "Sports bra (for women)",
      ],
    },
    {
      category: "Lower Body",
      icon: "👖", // Jeans emoji
      items: [
        "Trekking pants",
        "Waterproof pants",
        "Thermal leggings",
        "Hiking shorts",
      ],
    },
    {
      category: "Hands",
      icon: "🧤", // Gloves emoji
      items: [
        "Lightweight gloves",
        "Insulated gloves",
        "Mittens for high altitude",
      ],
    },
    {
      category: "Feet",
      icon: "👢", // Boot emoji
      items: [
        "Hiking boots (broken-in)",
        "Camp shoes or sandals",
        "Wool socks",
        "Gaiters",
      ],
    },
    {
      category: "Undergarments",
      icon: "🩲", // Underwear emoji
      items: [
        "Moisture-wicking underwear",
        "Thermal underwear",
        "Socks (extra pairs)",
      ],
    },
    {
      category: "First Aid Kits and Medications",
      icon: "🏥", // Hospital emoji
      items: [
        "Personal medications",
        "Bandages and antiseptic",
        "Pain relievers",
        "Altitude sickness medication",
      ],
    },
    {
      category: "Other Essentials",
      icon: "☀️", // Sun emoji
      items: [
        "Sunglasses (UV protection)",
        "Sunscreen (SPF 50+)",
        "Toiletries",
        "Quick-dry towel",
      ],
    },
  ];

  if (isLoading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 bg-[#F6FFFF] font-inter text-[24px] font-medium text-center text-red-500">
        Loading package details...
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 bg-[#F6FFFF] font-inter text-[24px] font-medium text-center text-red-500">
        {error || "Package not found."}
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-b from-gray-50 to-white text-black font-inter">
      {/* Hero Section with Image Slider */}
      <div className="relative mb-12">
        {pkg.images && pkg.images.length > 0 ? (
          <>
            <div className="relative h-[70vh] overflow-hidden">
              <Slider {...sliderSettings} ref={sliderRef}>
                {pkg.images.map((img) => (
                  <div key={img.id}>
                    <img
                      src={img.image}
                      alt={img.alt_text || pkg.title}
                      className="w-full h-[70vh] object-cover"
                      aria-label={`Image of ${img.alt_text || pkg.title}`}
                    />
                  </div>
                ))}
              </Slider>
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              {/* Title overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className=" mx-auto px-4 sm:px-6 lg:px-8">
                  <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                    {pkg.title || "Unnamed Package"}
                  </h1>
                  <div className="flex flex-wrap gap-6 text-lg">
                    <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                      🗓️ {pkg.duration || "N/A"} days
                    </span>
                    <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                      💰 ${pkg.price || "N/A"}
                    </span>
                    <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                      ⛰️ {pkg.altitude || "N/A"}m
                    </span>
                    <span
                      className={`bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full ${getDifficultyColor(
                        pkg.difficulty
                      )}`}
                    >
                      🎯 {formatDifficulty(pkg.difficulty)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Thumbnail navigation */}
            <div className="flex gap-4 mt-6 justify-center px-4">
              {pkg.images.map((img, index) => (
                <img
                  key={img.id}
                  src={img.image}
                  alt={`Thumbnail ${img.alt_text || pkg.title}`}
                  className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 border-2 border-transparent hover:border-blue-400 transition-all duration-200 shadow-md"
                  onClick={() => sliderRef.current.slickGoTo(index)}
                  aria-label={`Select thumbnail ${index + 1}`}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="h-[70vh] bg-gray-200 flex items-center justify-center">
            <p className="text-2xl text-gray-500">No images available</p>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Section */}
          <div className="lg:w-2/3">
            {/* Overview Section - Clean, no box */}
            <section
              id="overview"
              ref={sectionRefs.current.overview}
              className="mb-16"
            >
              <div className="border-l-4 border-blue-500 pl-8 mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  Overview
                </h2>
              </div>
              <div className="text-lg leading-relaxed text-gray-700 space-y-4">
                {pkg.description
                  ?.split("\n")
                  .map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  )) || <p>No description available.</p>}
              </div>
            </section>

            {/* Itinerary Section - Card style */}
            <section
              id="itinerary"
              ref={sectionRefs.current.itinerary}
              className="mb-16"
            >
              <div className="border-l-4 border-green-500 pl-8 mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  Daily Itinerary
                </h2>
              </div>
              <div className="space-y-4">
                {itineraries.map((item) => (
                  <div
                    key={item.day}
                    className="group cursor-pointer"
                    onClick={() => toggleDay(item.day)}
                  >
                    <div className="flex items-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group-hover:border-green-300">
                      <div className="flex-shrink-0 w-16 h-16 bg-green-100 rounded-full flex flex-col items-center justify-center mr-4 group-hover:bg-green-200 transition-colors">
                        {/* Icon */}
                        {item.icon && (
                          <img
                            src={`/icons/${item.icon}.png`}
                            alt={item.icon}
                            className="w-6 h-6 mb-1"
                          />
                        )}
                        {/* Day number */}
                        <span className="text-green-600 font-bold text-xs">
                          Day {item.day}
                        </span>
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-xl font-semibold text-gray-800 mb-1">
                          {item.title}
                        </h3>
                        <p className="text-gray-500 text-sm">Day {item.day}</p>
                      </div>
                      <div className="flex-shrink-0">
                        {expandedDays[item.day] ? (
                          <ChevronUpIcon className="h-6 w-6 text-gray-400 group-hover:text-green-500" />
                        ) : (
                          <ChevronDownIcon className="h-6 w-6 text-gray-400 group-hover:text-green-500" />
                        )}
                      </div>
                    </div>
                    {expandedDays[item.day] && (
                      <div className="mt-2  p-4 bg-green-50 rounded-lg border-l-4 border-green-200">
                        <p className="text-gray-700 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Map Section */}
            <section id="map" ref={sectionRefs.current.map} className="mb-16">
              <div className="border-l-4 border-orange-500 pl-8 mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  Route Map
                </h2>
              </div>
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src="/icons/map-placeholder.jpg"
                  alt="Trekking Route Map"
                  className="w-full min-h-[500px] object-cover"
                />
                <div className="absolute top-6 left-6 bg-orange-500 text-white px-6 py-3 rounded-full shadow-lg font-semibold">
                  📍 Trekking Route
                </div>
              </div>
            </section>

            {/* Packing List - Grid style */}
            <section
              id="packing"
              ref={sectionRefs.current.packing}
              className="mb-16"
            >
              <div className="border-l-4 border-blue-500 pl-8 mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  Packing Checklist
                </h2>
                <p className="text-gray-600">
                  Click to expand categories and check off items as you pack
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {packingList.map((item) => (
                  <div
                    key={item.category}
                    className={`cursor-pointer transition-all duration-300 ${
                      checkedItems[item.category]
                        ? "bg-green-100 border-green-300"
                        : "bg-white hover:bg-blue-50 border-gray-200"
                    } border-2 rounded-xl p-6 shadow-sm hover:shadow-md`}
                    onClick={() => togglePacking(item.category)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer ${
                            checkedItems[item.category]
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 text-gray-500"
                          }`}
                          onClick={(e) => toggleCheckbox(item.category, e)}
                        >
                          {checkedItems[item.category] ? "✓" : "○"}
                        </div>
                        {/* Add icon here */}
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xl">{item.icon}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {item.category}
                        </h3>
                      </div>
                      {expandedPacking[item.category] ? (
                        <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    {expandedPacking[item.category] && (
                      <ul className="space-y-2 text-gray-600">
                        {item.items.map((subItem, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                            {subItem}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Includes/Excludes - Side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              <section id="includes" ref={sectionRefs.current.includes}>
                <div className="h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircleIcon className="h-6 w-6 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      What's Included
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {[
                      "Accommodation in standard hotels and teahouses",
                      "All meals during trekking",
                      "Experienced English-speaking guide",
                      "Porter services",
                      "Trekking permits and fees",
                      "Domestic flights",
                      "First aid kit and emergency oxygen",
                      "Ground transportation",
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-green-50 rounded-lg"
                      >
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section id="excludes" ref={sectionRefs.current.excludes}>
                <div className="h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <XCircleIcon className="h-6 w-6 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Not Included
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {[
                      "Meals in Kathmandu",
                      "International flights",
                      "Nepal Entry Visa",
                      "Travel insurance",
                      "Beverages and bottled water",
                      "Tips for staff",
                      "Personal gear",
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-red-50 rounded-lg"
                      >
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:w-1/3">
            <div className="sticky top-[80px]">
              {/* Booking Card */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 shadow-lg mb-8 border border-blue-200">
                <div className="text-center mb-6">
                  <p className="text-sm text-gray-600 mb-2">Starting from</p>
                  <p className="text-4xl font-bold text-blue-600 mb-1">
                    ${pkg.price || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">per person</p>
                </div>

                <div className="space-y-3 mb-6">
                  <Link
                    to={`/booking?package=${pkg.id}`}
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-4 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    📅 Book This Trek
                  </Link>
                  <Link
                    to="/contact"
                    className="block w-full bg-white hover:bg-gray-50 text-blue-600 text-center py-3 rounded-xl font-semibold border-2 border-blue-600 transition-all duration-200"
                  >
                    💬 Ask Questions
                  </Link>
                </div>

                <div className="text-center text-sm text-gray-600">
                  <p>✅ Free cancellation up to 24 hours</p>
                  <p>✅ Best price guarantee</p>
                </div>
              </div>

              {/* Navigation */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-800">
                    Quick Navigation
                  </h3>
                </div>
                <nav className="p-2">
                  {[
                    {
                      id: "overview",
                      title: "Overview",
                      icon: "📋",
                      color: "blue",
                    },
                    {
                      id: "itinerary",
                      title: "Daily Itinerary",
                      icon: "🗓️",
                      color: "green",
                    },
                    {
                      id: "map",
                      title: "Route Map",
                      icon: "🗺️",
                      color: "orange",
                    },
                    {
                      id: "packing",
                      title: "Packing Checklist",
                      icon: "🎒",
                      color: "blue",
                    },
                    {
                      id: "includes",
                      title: "What's Included",
                      icon: "✅",
                      color: "green",
                    },
                    {
                      id: "excludes",
                      title: "Not Included",
                      icon: "❌",
                      color: "red",
                    },
                  ].map((section) => (
                    <div
                      key={section.id}
                      className={`flex items-center gap-3 p-3 cursor-pointer rounded-lg transition-all duration-200 ${
                        activeSection === section.id
                          ? `bg-${section.color}-100 text-${section.color}-700`
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => scrollToSection(section.id)}
                    >
                      <span className="text-lg">{section.icon}</span>
                      <span className="font-medium">{section.title}</span>
                    </div>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetails;
