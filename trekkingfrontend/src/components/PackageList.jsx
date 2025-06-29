import {
  ArrowTrendingUpIcon,
  ArrowUpIcon,
  BookmarkIcon,
  ClockIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
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

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/packages/")
      .then((response) => setPackages(response.data))
      .catch((error) => {
        console.error("Error fetching packages:", error);
        setError("Failed to load packages. Please try again.");
      });
  }, []);

  const sortPackages = (packages) => {
    if (!packages || !Array.isArray(packages)) {
      return [];
    }
    const sorted = [...packages];
    switch (sortBy) {
      case "latest":
        return sorted.sort(
          (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
        );
      case "price-high":
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      case "price-low":
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      case "duration-short":
        return sorted.sort((a, b) => (a.duration || 0) - (b.duration || 0));
      case "duration-long":
        return sorted.sort((a, b) => (b.duration || 0) - (a.duration || 0));
      case "difficulty-easy":
        return sorted.sort((a, b) => {
          const order = { EASY: 1, MEDIUM: 2, TOUGH: 3, VERY_TOUGH: 4 };
          return (order[a.difficulty] || 4) - (order[b.difficulty] || 4);
        });
      case "difficulty-hard":
        return sorted.sort((a, b) => {
          const order = { EASY: 4, MEDIUM: 3, TOUGH: 2, VERY_TOUGH: 1 };
          return (order[a.difficulty] || 1) - (order[b.difficulty] || 1);
        });
      default:
        return sorted;
    }
  };

  const filteredPackages = packages
    .filter((pkg) =>
      pkg.title && typeof pkg.title === "string"
        ? pkg.title.toLowerCase().includes(search.toLowerCase())
        : false
    )
    .sort(sortPackages);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dotsClass: "slick-dots slick-dots-custom",
  };

  const handleBookmark = (pkgId) => {
    console.log(`Bookmarked package ${pkgId}`);
    // Implement bookmark functionality (e.g., API call to save bookmark)
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
      <div className="space-y-6">
        {filteredPackages.length === 0 && !error ? (
          <p className="text-[24px] font-medium">No packages found.</p>
        ) : (
          filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="border rounded-lg p-6 flex flex-col md:flex-row gap-6 bg-white shadow-md"
            >
              <div className="md:w-1/4">
                {pkg.images && pkg.images.length > 0 ? (
                  <Slider {...sliderSettings}>
                    {pkg.images.map((img) => (
                      <div key={img.id}>
                        <img
                          src={`${img.image}`}
                          alt={img.alt_text || pkg.title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </Slider>
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
                    <ClockIcon className="h-6 w-6 text-blue-500 mr-2" />
                    <p className="text-[24px] font-medium text-blue-500">
                      {pkg.duration || "N/A"} days
                    </p>
                  </div>
                  <div className="flex items-center">
                    <CurrencyDollarIcon className="h-6 w-6 text-green-500 mr-2" />
                    <p className="text-[24px] font-medium text-green-500">
                      ${pkg.price || "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <ArrowUpIcon className="h-6 w-6 text-purple-500 mr-2" />
                    <p className="text-[24px] font-medium text-purple-500">
                      {pkg.altitude || "N/A"}m
                    </p>
                  </div>
                  <div className="flex items-center">
                    <ArrowTrendingUpIcon className="h-6 w-6 text-red-500 mr-2" />
                    <p className="text-[24px] font-medium text-red-500">
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
          ))
        )}
      </div>
    </div>
  );
};

export default PackageList;
