import { BookmarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

const PackageList = () => {
  const [packages, setPackages] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:8000/api/packages/");
        if (!response.ok) throw new Error("Failed to fetch packages");
        const data = await response.json();
        console.log("Fetched data:", data);
        setPackages(data);
      } catch (err) {
        console.error("Error fetching packages:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const sortPackages = (packagesToSort) => {
    if (!Array.isArray(packagesToSort) || packagesToSort.length === 0) {
      return [];
    }
    const sortedPackages = [...packagesToSort];
    console.log("Sorting with:", sortBy, sortedPackages);
    switch (sortBy) {
      case "latest":
        return sortedPackages.sort(
          (a, b) =>
            new Date(b.created_at || "1970-01-01") -
            new Date(a.created_at || "1970-01-01")
        );
      case "price-high":
        return sortedPackages.sort((a, b) => {
          const priceA = a.price ? parseFloat(a.price) : 0;
          const priceB = b.price ? parseFloat(b.price) : 0;
          return priceB - priceA;
        });
      case "price-low":
        return sortedPackages.sort((a, b) => {
          const priceA = a.price ? parseFloat(a.price) : 0;
          const priceB = b.price ? parseFloat(b.price) : 0;
          return priceA - priceB;
        });
      case "duration-short":
        return sortedPackages.sort((a, b) => {
          const durationA = Number(a.duration) || 0;
          const durationB = Number(b.duration) || 0;
          return durationA - durationB;
        });
      case "duration-long":
        return sortedPackages.sort((a, b) => {
          const durationA = Number(a.duration) || 0;
          const durationB = Number(b.duration) || 0;
          return durationB - durationA;
        });
      case "difficulty-easy":
        return sortedPackages.sort((a, b) => {
          const order = { EASY: 1, MEDIUM: 2, TOUGH: 3, VERY_TOUGH: 4 };
          return (order[a.difficulty] || 4) - (order[b.difficulty] || 4);
        });
      case "difficulty-hard":
        return sortedPackages.sort((a, b) => {
          const order = { EASY: 4, MEDIUM: 3, TOUGH: 2, VERY_TOUGH: 1 };
          return (order[a.difficulty] || 1) - (order[b.difficulty] || 1);
        });
      default:
        return sortedPackages;
    }
  };

  const filteredPackages = packages.filter((pkg) =>
    pkg.title && typeof pkg.title === "string"
      ? pkg.title.toLowerCase().includes(search.toLowerCase())
      : false
  );

  const displayPackages = sortPackages(filteredPackages);

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dotsClass: "slick-dots slick-dots-custom",
  };

  const handleBookmark = (pkgId) => {
    console.log(`Bookmarked package ${pkgId}`);
    // Implement bookmark functionality
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

  return (
    <div className="container mx-auto p-4 bg-[#F6FFFF] text-black font-inter">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="text-[64px] font-bold">Trekking Packages</h1>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <input
            type="text"
            placeholder="Search packages..."
            className="p-3 text-[24px] font-medium border rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="p-3 text-[24px] font-medium border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="latest">Latest</option>
            <option value="price-high">Price (High to Low)</option>
            <option value="price-low">Price (Low to High)</option>
            <option value="duration-short">Duration (Short to Long)</option>
            <option value="duration-long">Duration (Long to Short)</option>
            <option value="difficulty-easy">Difficulty (Easy to Hard)</option>
            <option value="difficulty-hard">Difficulty (Hard to Easy)</option>
          </select>
        </div>
      </div>
      {error && (
        <p className="text-[24px] font-medium text-red-500 mb-4">{error}</p>
      )}
      {isLoading && (
        <div className="text-[24px] font-medium text-center py-4">
          Loading packages...
        </div>
      )}
      {!isLoading && displayPackages.length === 0 && (
        <div className="text-[24px] font-medium text-center py-4">
          No packages found.
        </div>
      )}
      <div className="space-y-6">
        {displayPackages.map((pkg) => (
          <div
            key={pkg.id}
            className="border rounded-lg p-6 flex flex-col md:flex-row gap-6 bg-white shadow-md"
          >
            <div className="md:w-1/4">
              {pkg.images && pkg.images.length > 0 ? (
                pkg.images.length === 1 ? (
                  <img
                    src={pkg.images[0].image}
                    alt={pkg.images[0].alt_text || pkg.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ) : (
                  <Slider {...sliderSettings}>
                    {pkg.images.map((img) => (
                      <div key={img.id}>
                        <img
                          src={img.image}
                          alt={img.alt_text || pkg.title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </Slider>
                )
              ) : (
                <p className="text-[24px] font-medium text-gray-500">
                  No images available.
                </p>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-[32px] font-bold mb-2">
                {pkg.title || "Unnamed Package"}
              </h2>
              <p className="text-[24px] font-medium mb-4 line-clamp-3">
                {pkg.description || "No description available."}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
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
                  <p className="text-[24px] font-medium">
                    ${pkg.price || "N/A"}
                  </p>
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
                    {pkg.difficulty || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Link
                  to="/booking"
                  className="p-2 bg-blue-500 text-white text-[24px] font-medium rounded-lg hover:bg-blue-600"
                >
                  Book Now
                </Link>
                <Link
                  to={`/packages/${pkg.id}`}
                  className="p-2 bg-gray-200 text-black text-[24px] font-medium rounded-lg hover:bg-gray-300"
                >
                  Learn More
                </Link>
                <button
                  onClick={() => handleBookmark(pkg.id)}
                  className="p-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300"
                >
                  <BookmarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackageList;
