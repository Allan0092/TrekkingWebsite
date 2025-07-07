import {
  BriefcaseIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ListBulletIcon,
  MapIcon,
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
  const sectionRefs = useRef({
    overview: useRef(null),
    itinerary: useRef(null),
    map: useRef(null),
    packing: useRef(null),
    includes: useRef(null),
    excludes: useRef(null),
  });

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
    sectionRefs.current[sectionId].current.scrollIntoView({
      behavior: "smooth",
    });
    setActiveSection(sectionId);
  };

  const toggleDay = (day) => {
    setExpandedDays((prev) => ({
      ...prev,
      [day]: !prev[day],
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

  // Placeholder itinerary data until backend is updated
  const placeholderItinerary = pkg?.duration
    ? Array.from({ length: pkg.duration }, (_, i) => ({
        day: i + 1,
        title: `Day ${i + 1}: Sample Activity`,
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

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 bg-[#F6FFFF] text-black font-inter text-[24px] font-medium text-center py-4">
        Loading package details...
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className="container mx-auto p-4 bg-[#F6FFFF] text-black font-inter text-[24px] font-medium text-center py-4 text-red-500">
        {error || "Package not found."}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-[#F6FFFF] text-black font-inter">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Section */}
        <div className="lg:w-2/3">
          {/* Image Slider */}
          <div className="mb-6">
            {pkg.images && pkg.images.length > 0 ? (
              <>
                <Slider {...sliderSettings}>
                  {pkg.images.map((img) => (
                    <div key={img.id}>
                      <img
                        src={img.image}
                        alt={img.alt_text || pkg.title}
                        className="w-full h-[400px] object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </Slider>
                <div className="flex gap-2 mt-4 justify-center">
                  {pkg.images.map((img, index) => (
                    <img
                      key={img.id}
                      src={img.image}
                      alt={`Thumbnail ${img.alt_text || pkg.title}`}
                      className="w-16 h-16 object-cover rounded-md cursor-pointer hover:opacity-80"
                      onClick={() =>
                        document.querySelector(".slick-slider").slickGoTo(index)
                      }
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

          {/* Title */}
          <h1 className="text-[48px] font-bold mb-6">
            {pkg.title || "Unnamed Package"}
          </h1>

          {/* Summary Box */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center">
                <img
                  src="/icons/calendar.png"
                  alt="Calendar"
                  className="h-6 w-6 mr-2"
                />
                <p className="text-[24px] font-medium">
                  {pkg.duration || "N/A"} days
                </p>
              </div>
              <div className="flex items-center">
                <img
                  src="/icons/dollar.png"
                  alt="Price"
                  className="h-6 w-6 mr-2"
                />
                <p className="text-[24px] font-medium">${pkg.price || "N/A"}</p>
              </div>
              <div className="flex items-center">
                <img
                  src="/icons/mountain_peak.png"
                  alt="Altitude"
                  className="h-6 w-6 mr-2"
                />
                <p className="text-[24px] font-medium">
                  {pkg.altitude || "N/A"}m
                </p>
              </div>
              <div className="flex items-center">
                <img
                  src="/icons/difficulty.png"
                  alt="Difficulty"
                  className="h-6 w-6 mr-2"
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
            className="bg-white rounded-2xl p-8 shadow-lg mb-6"
          >
            <h2 className="text-[32px] font-bold mb-4">Overview</h2>
            <p className="text-[24px] font-medium">
              {pkg.description || "No description available."}
            </p>
          </div>
          <div
            id="itinerary"
            ref={sectionRefs.current.itinerary}
            className="bg-white rounded-2xl p-8 shadow-lg mb-6"
          >
            <h2 className="text-[32px] font-bold mb-4">Itinerary</h2>
            <div className="space-y-4">
              {itineraries.map((item) => (
                <div
                  key={item.day}
                  className="bg-white rounded-2xl p-4 shadow-lg transition-all duration-300"
                  onClick={() => toggleDay(item.day)}
                >
                  <div className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center">
                      <img
                        src={`/icons/${item.icon}.png`}
                        alt={item.icon}
                        className="h-6 w-6 mr-2"
                      />
                      <h3 className="text-[24px] font-medium">{item.title}</h3>
                    </div>
                    {expandedDays[item.day] ? (
                      <ChevronUpIcon className="h-6 w-6 text-gray-500" />
                    ) : (
                      <ChevronDownIcon className="h-6 w-6 text-gray-500" />
                    )}
                  </div>
                  {expandedDays[item.day] && (
                    <div className="mt-4 text-[18px] font-medium text-gray-700">
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
            className="bg-white rounded-2xl p-8 shadow-lg mb-6"
          >
            <h2 className="text-[32px] font-bold mb-4">Map</h2>
            <p className="text-[24px] font-medium">
              Map placeholder for the trekking route.
            </p>
          </div>
          <div
            id="packing"
            ref={sectionRefs.current.packing}
            className="bg-white rounded-2xl p-8 shadow-lg mb-6"
          >
            <h2 className="text-[32px] font-bold mb-4">Packing List</h2>
            <p className="text-[24px] font-medium">
              Recommended packing list will be provided here.
            </p>
          </div>
          <div
            id="includes"
            ref={sectionRefs.current.includes}
            className="bg-white rounded-2xl p-8 shadow-lg mb-6"
          >
            <h2 className="text-[32px] font-bold mb-4">Price Includes</h2>
            <p className="text-[24px] font-medium">
              List of included services will be provided here.
            </p>
          </div>
          <div
            id="excludes"
            ref={sectionRefs.current.excludes}
            className="bg-white rounded-2xl p-8 shadow-lg mb-6"
          >
            <h2 className="text-[32px] font-bold mb-4">Price Excludes</h2>
            <p className="text-[24px] font-medium">
              List of excluded services will be provided here.
            </p>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:w-1/3">
          <div className="sticky top-[80px]">
            {/* Price and Buttons */}
            <div className="bg-white rounded-2xl p-8 shadow-lg mb-6">
              <div className="flex items-center mb-4">
                <CurrencyDollarIcon className="h-6 w-6 mr-2" />
                <p className="text-[32px] font-bold">${pkg.price || "N/A"}</p>
              </div>
              <Link
                to="/booking"
                className="block p-3 bg-blue-500 text-white text-[24px] font-medium rounded-lg hover:bg-blue-600 mb-4 text-center"
              >
                Book Now
              </Link>
              <Link
                to="/contact"
                className="block p-3 bg-gray-200 text-black text-[24px] font-medium rounded-lg hover:bg-gray-300 text-center"
              >
                Inquire Now
              </Link>
            </div>

            {/* Navigation */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
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
                    className={`flex items-center p-2 cursor-pointer rounded-lg hover:bg-gray-100 ${
                      activeSection === section.id
                        ? "bg-blue-100 text-blue-600"
                        : ""
                    } ${
                      index < arr.length - 1 ? "border-b border-gray-200" : ""
                    }`}
                    onClick={() => scrollToSection(section.id)}
                  >
                    <section.icon className="h-5 w-5 mr-2" />
                    <span className="text-[18px] font-medium">
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
