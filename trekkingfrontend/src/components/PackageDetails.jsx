import {
  BriefcaseIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ListBulletIcon,
  MapIcon,
  Square2StackIcon as Square2StackOutlineIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { Square2StackIcon as Square2StackSolidIcon } from "@heroicons/react/24/solid";
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
    e.stopPropagation(); // Prevent expanding when clicking checkbox
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
      icon: "general-pk",
      items: [
        "Backpack (40-60L)",
        "Trekking poles",
        "Water bottle or hydration system",
        "Headlamp with extra batteries",
      ],
    },
    {
      category: "Upper Body",
      icon: "upperbody-pk",
      items: [
        "Fleece jacket",
        "Waterproof/windproof jacket",
        "Thermal base layers",
        "T-shirts (moisture-wicking)",
      ],
    },
    {
      category: "Torso",
      icon: "torso-pk",
      items: [
        "Insulated jacket (down or synthetic)",
        "Lightweight pullover",
        "Sports bra (for women)",
      ],
    },
    {
      category: "Lower Body",
      icon: "lowerbody-pk",
      items: [
        "Trekking pants",
        "Waterproof pants",
        "Thermal leggings",
        "Hiking shorts",
      ],
    },
    {
      category: "Hands",
      icon: "hands-pk",
      items: [
        "Lightweight gloves",
        "Insulated gloves",
        "Mittens for high altitude",
      ],
    },
    {
      category: "Feet",
      icon: "feet-pk",
      items: [
        "Hiking boots (broken-in)",
        "Camp shoes or sandals",
        "Wool socks",
        "Gaiters",
      ],
    },
    {
      category: "Undergarments",
      icon: "undergarments-pk",
      items: [
        "Moisture-wicking underwear",
        "Thermal underwear",
        "Socks (extra pairs)",
      ],
    },
    {
      category: "First Aid Kits and Medications",
      icon: "firstaid-pk",
      items: [
        "Personal medications",
        "Bandages and antiseptic",
        "Pain relievers",
        "Altitude sickness medication",
      ],
    },
    {
      category: "Other Essentials",
      icon: "otheressensials-pk",
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
    <div className="w-full px-4 sm:px-6 lg:px-8 py-4 bg-[#F6FFFF] text-black font-inter">
      {/* Image Slider */}
      <div className="mb-8 w-full">
        {pkg.images && pkg.images.length > 0 ? (
          <>
            <Slider {...sliderSettings} ref={sliderRef}>
              {pkg.images.map((img) => (
                <div key={img.id}>
                  <img
                    src={img.image}
                    alt={img.alt_text || pkg.title}
                    className="w-full h-[80vh] object-cover rounded-xl shadow-md"
                    aria-label={`Image of ${img.alt_text || pkg.title}`}
                  />
                </div>
              ))}
            </Slider>
            <div className="flex gap-4 mt-4 justify-center">
              {pkg.images.map((img, index) => (
                <img
                  key={img.id}
                  src={img.image}
                  alt={`Thumbnail ${img.alt_text || pkg.title}`}
                  className="w-20 h-20 object-cover rounded-md cursor-pointer hover:opacity-80 border border-gray-200 hover:border-blue-500 transition-all duration-200"
                  onClick={() => sliderRef.current.slickGoTo(index)}
                  aria-label={`Select thumbnail ${index + 1}`}
                />
              ))}
            </div>
          </>
        ) : (
          <p className="text-[24px] font-medium text-gray-500 text-center">
            No images available.
          </p>
        )}
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
        {/* Left Section */}
        <div className="lg:w-2/3">
          {/* Title */}
          <h1 className="text-[48px] sm:text-[56px] font-bold mb-8 bg-gradient-to-r from-blue-700 to-teal-600 text-transparent bg-clip-text [text-shadow:_0_2px_4px_rgba(0,0,0,0.1)] animate-fade-in">
            {pkg.title || "Unnamed Package"}
          </h1>

          {/* Summary Box */}
          <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-8 shadow-lg mb-8 border border-gray-100 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-center">
                <img
                  src="/icons/calendar.png"
                  alt="Calendar"
                  className="h-8 w-8 mr-3"
                />
                <p className="text-[24px] font-medium text-gray-800">
                  {pkg.duration || "N/A"} days
                </p>
              </div>
              <div className="flex items-center">
                <img
                  src="/icons/dollar.png"
                  alt="Price"
                  className="h-8 w-8 mr-3"
                />
                <p className="text-[24px] font-medium text-gray-800">
                  ${pkg.price || "N/A"}
                </p>
              </div>
              <div className="flex items-center">
                <img
                  src="/icons/mountain_peak.png"
                  alt="Altitude"
                  className="h-8 w-8 mr-3"
                />
                <p className="text-[24px] font-medium text-gray-800">
                  {pkg.altitude || "N/A"}m
                </p>
              </div>
              <div className="flex items-center">
                <img
                  src="/icons/difficulty.png"
                  alt="Difficulty"
                  className="h-8 w-8 mr-3"
                />
                <p
                  className={`text-[24px] font-medium ${getDifficultyColor(
                    pkg.difficulty
                  )}`}
                >
                  {formatDifficulty(pkg.difficulty)}
                </p>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div
            id="overview"
            ref={sectionRefs.current.overview}
            className="bg-white rounded-xl p-8 shadow-lg mb-8 border-l-4 border-teal-500 animate-fade-in"
          >
            <h2 className="text-[32px] font-bold mb-4 text-gray-800">
              Overview
            </h2>
            <p className="text-[24px] font-normal text-gray-700">
              {pkg.description || "No description available."}
            </p>
          </div>

          <div
            id="itinerary"
            ref={sectionRefs.current.itinerary}
            className="bg-teal-50 rounded-xl p-8 shadow-lg mb-8 border border-gray-100 animate-fade-in"
          >
            <h2 className="text-[32px] font-bold mb-4 text-gray-800">
              Itinerary
            </h2>
            <div className="space-y-4">
              {itineraries.map((item) => (
                <div
                  key={item.day}
                  className="bg-white rounded-xl p-4 shadow-md transition-all duration-300 border border-gray-100 hover:bg-teal-100 hover:shadow-xl"
                  onClick={() => toggleDay(item.day)}
                  aria-label={`Expand Day ${item.day} itinerary`}
                >
                  <div className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center">
                      <img
                        src={`/icons/${item.icon}.png`}
                        alt={item.icon}
                        className="h-6 w-6 mr-2"
                      />
                      <h3 className="text-[24px] font-medium text-gray-800">{`Day ${item.day}: ${item.title}`}</h3>
                    </div>
                    {expandedDays[item.day] ? (
                      <ChevronUpIcon className="h-6 w-6 text-gray-500 hover:text-blue-500 transition-colors duration-200" />
                    ) : (
                      <ChevronDownIcon className="h-6 w-6 text-gray-500 hover:text-blue-500 transition-colors duration-200" />
                    )}
                  </div>
                  {expandedDays[item.day] && (
                    <div className="mt-4 text-[18px] font-normal text-gray-700 transition-all duration-300">
                      {item.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div
            id="map"
            ref={sectionRefs.current.map}
            className="bg-white rounded-xl p-8 shadow-lg mb-8 border border-gray-100 animate-fade-in"
          >
            <h2 className="text-[32px] font-bold mb-4 text-gray-800">Map</h2>
            <div className="relative overflow-hidden rounded-xl">
              <img
                src="/icons/map-placeholder.png"
                alt="Trekking Route Map"
                className="w-full min-h-[400px] object-contain rounded-xl border border-gray-200 hover:scale-[1.02] transition-transform duration-300"
                aria-label="Trekking route map"
              />
              <div className="absolute top-4 left-4 bg-blue-600 text-white text-[16px] font-medium px-4 py-2 rounded-full shadow-md">
                Trekking Route
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/30 rounded-xl" />
            </div>
          </div>

          <div
            id="packing"
            ref={sectionRefs.current.packing}
            className="bg-gray-50 rounded-xl p-8 shadow-lg mb-8 border-l-4 border-blue-500 animate-fade-in"
          >
            <h2 className="text-[32px] font-bold mb-4 text-gray-800">
              Packing List
            </h2>
            <div className="space-y-4">
              {packingList.map((item) => (
                <div
                  key={item.category}
                  className={`rounded-xl p-4 shadow-md transition-all duration-300 border border-gray-100 hover:shadow-xl ${
                    checkedItems[item.category] ? "bg-gray-400" : "bg-white"
                  }`}
                  onClick={() => togglePacking(item.category)}
                  aria-label={`Expand ${item.category} packing list`}
                >
                  <div className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      {checkedItems[item.category] ? (
                        <Square2StackSolidIcon
                          className="h-6 w-6 text-blue-500 hover:text-blue-600 transition-colors duration-200 animate-pulse"
                          onClick={(e) => toggleCheckbox(item.category, e)}
                          aria-label={`Uncheck ${item.category}`}
                        />
                      ) : (
                        <Square2StackOutlineIcon
                          className="h-6 w-6 text-gray-500 hover:text-blue-600 transition-colors duration-200"
                          onClick={(e) => toggleCheckbox(item.category, e)}
                          aria-label={`Check ${item.category}`}
                        />
                      )}
                      <img
                        src={`/icons/${item.icon}.png`}
                        alt={item.category}
                        className="h-6 w-6"
                      />
                      <h3 className="text-[24px] font-medium text-gray-800">
                        {item.category}
                      </h3>
                    </div>
                    {expandedPacking[item.category] ? (
                      <ChevronUpIcon className="h-6 w-6 text-gray-500 hover:text-blue-500 transition-colors duration-200" />
                    ) : (
                      <ChevronDownIcon className="h-6 w-6 text-gray-500 hover:text-blue-500 transition-colors duration-200" />
                    )}
                  </div>
                  {expandedPacking[item.category] && (
                    <ul className="mt-4 text-[18px] font-normal text-gray-700 list-disc pl-6 transition-all duration-300">
                      {item.items.map((subItem, index) => (
                        <li key={index}>{subItem}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div
            id="includes"
            ref={sectionRefs.current.includes}
            className="bg-green-50 rounded-xl p-8 shadow-lg mb-8 border border-gray-100 animate-fade-in"
          >
            <h2 className="text-[32px] font-bold mb-4 text-gray-800">
              Price Includes
            </h2>
            <ul className="space-y-2">
              {[
                "Accommodation in standard hotels and teahouses during the trek",
                "All meals (breakfast, lunch, and dinner) during the trekking period",
                "Experienced English-speaking trekking guide",
                "Porter services (1 porter per 2 trekkers, max 15kg luggage per person)",
                "All necessary trekking permits and entrance fees",
                "Domestic flights to and from the trekking starting point",
                "First aid kit and emergency oxygen supply",
                "All ground transportation as per the itinerary",
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-start text-[18px] font-normal text-gray-700 hover:text-blue-500 transition-colors duration-200"
                >
                  <CheckCircleIcon className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-1 hover:scale-110 transition-transform duration-200" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div
            id="excludes"
            ref={sectionRefs.current.excludes}
            className="bg-red-50 rounded-xl p-8 shadow-lg mb-8 border border-gray-100 animate-fade-in"
          >
            <h2 className="text-[32px] font-bold mb-4 text-gray-800">
              Price Excludes
            </h2>
            <ul className="space-y-2">
              {[
                "Lunch and dinner in Kathmandu",
                "International flight fare and airport departure tax",
                "Nepal Entry Visa (Visa can be acquired easily after your arrival at Tribhuvan International Airport in Kathmandu with a fee of USD 30 for 15 days visa, USD 50 for 30 days visa and USD 125 for 90 days visa)",
                "Travel insurance along with high-altitude emergency evacuation coverage",
                "Any beverages including bottled and boiled water",
                "Tips to trekking staff and driver",
                "Personal trekking gear and equipment",
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-start text-[18px] font-normal text-gray-700 hover:text-red-500 transition-colors duration-200"
                >
                  <XCircleIcon className="h-5 w-5 mr-2 text-red-500 flex-shrink-0 mt-1 hover:scale-110 transition-transform duration-200" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:w-1/3">
          <div className="sticky top-[80px]">
            {/* Price and Buttons */}
            <div className="bg-gradient-to-b from-white to-gray-50 rounded-xl p-8 shadow-lg mb-6 border border-gray-100 animate-fade-in">
              <div className="flex items-center mb-4">
                <CurrencyDollarIcon className="h-6 w-6 mr-2 text-blue-500" />
                <p className="text-[32px] font-bold text-gray-800">
                  ${pkg.price || "N/A"}
                </p>
              </div>
              <Link
                to="/booking"
                className="block p-3 bg-blue-500 text-white text-[24px] font-medium rounded-lg hover:bg-blue-600 mb-4 text-center transition-all duration-200"
                aria-label="Book this package"
              >
                Book Now
              </Link>
              <Link
                to="/contact"
                className="block p-3 bg-gray-200 text-black text-[24px] font-medium rounded-lg hover:bg-gray-300 text-center transition-all duration-200"
                aria-label="Inquire about this package"
              >
                Inquire Now
              </Link>
            </div>

            {/* Navigation */}
            <div className="bg-gradient-to-b from-white to-gray-50 rounded-xl p-8 shadow-lg border border-gray-100 animate-fade-in">
              <nav className="space-y-2">
                {[
                  { id: "overview", title: "Overview", icon: DocumentTextIcon },
                  { id: "itinerary", title: "Itinerary", icon: ListBulletIcon },
                  { id: "map", title: "Map", icon: MapIcon },
                  { id: "packing", title: "Packing List", icon: BriefcaseIcon },
                  {
                    id: "includes",
                    title: "Price Includes",
                    icon: CheckCircleIcon,
                  },
                  {
                    id: "excludes",
                    title: "Price Excludes",
                    icon: XCircleIcon,
                  },
                ].map((section, index, arr) => (
                  <div
                    key={section.id}
                    className={`flex items-center p-2 cursor-pointer rounded-lg hover:bg-blue-200 transition-all duration-200 ${
                      activeSection === section.id
                        ? "bg-blue-100 text-blue-600"
                        : ""
                    } ${
                      index < arr.length - 1 ? "border-b border-gray-200" : ""
                    }`}
                    onClick={() => scrollToSection(section.id)}
                    aria-label={`Navigate to ${section.title}`}
                  >
                    <section.icon className="h-5 w-5 mr-2" />
                    <span className="text-[18px] font-medium text-gray-800">
                      {section.title}
                    </span>
                  </div>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetails;
