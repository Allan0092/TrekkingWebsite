import {
  ArrowsUpDownIcon,
  BookmarkIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CurrencyDollarIcon,
  ExclamationCircleIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  SparklesIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
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
  const [showFilters, setShowFilters] = useState(false);
  const [region, setRegion] = useState("All Regions");
  const [difficulty, setDifficulty] = useState("All Levels");
  const [duration, setDuration] = useState(100);
  const [priceRange, setPriceRange] = useState(10000);

  const [currentPage, setCurrentPage] = useState(1);
  const packagesPerPage = 10;

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

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortBy, region, difficulty, duration, priceRange]);

  const sortPackages = (packagesToSort) => {
    if (!Array.isArray(packagesToSort) || packagesToSort.length === 0) {
      return [];
    }
    const sortedPackages = [...packagesToSort];
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

  const filterPackages = () => {
    return packages.filter((pkg) => {
      const matchesSearch =
        pkg.title && typeof pkg.title === "string"
          ? pkg.title.toLowerCase().includes(search.toLowerCase())
          : false;
      const matchesRegion =
        region === "All Regions" || (pkg.region && pkg.region === region);
      const matchesDifficulty =
        difficulty === "All Levels" ||
        (pkg.difficulty &&
          pkg.difficulty.toLowerCase() === difficulty.toLowerCase());
      const matchesDuration = Number(pkg.duration) <= duration;
      const matchesPrice = Number(pkg.price) <= priceRange;
      return (
        matchesSearch &&
        matchesRegion &&
        matchesDifficulty &&
        matchesDuration &&
        matchesPrice
      );
    });
  };

  const filteredPackages = sortPackages(filterPackages());

  // Pagination calculations
  const totalPages = Math.ceil(filteredPackages.length / packagesPerPage);
  const startIndex = (currentPage - 1) * packagesPerPage;
  const endIndex = startIndex + packagesPerPage;
  const displayPackages = filteredPackages.slice(startIndex, endIndex);

  const isFilterApplied = () => {
    return (
      region !== "All Regions" ||
      difficulty !== "All Levels" ||
      duration < 100 ||
      priceRange < 10000
    );
  };

  const clearFilters = () => {
    setRegion("All Regions");
    setDifficulty("All Levels");
    setDuration(100);
    setPriceRange(10000);
    setSearch("");
    setCurrentPage(1);
  };

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
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

  const formatDifficulty = (difficulty) => {
    if (difficulty === "VERY_TOUGH") {
      return "Very Tough";
    }
    return difficulty || "N/A";
  };

  // Pagination component
  const Pagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-center space-x-2 mt-8">
        {/* Previous Button */}
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentPage === 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <ChevronLeftIcon className="h-4 w-4 mr-1" />
          Previous
        </button>

        {/* Page Numbers */}
        {startPage > 1 && (
          <>
            <button
              onClick={() => setCurrentPage(1)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              1
            </button>
            {startPage > 2 && (
              <span className="px-2 py-2 text-gray-400">...</span>
            )}
          </>
        )}

        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage === number
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {number}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="px-2 py-2 text-gray-400">...</span>
            )}
            <button
              onClick={() => setCurrentPage(totalPages)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next Button */}
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentPage === totalPages
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          Next
          <ChevronRightIcon className="h-4 w-4 ml-1" />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Discover Your Perfect Trek
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              Explore the majestic Himalayas with our carefully curated trekking
              packages
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 -mt-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search amazing treks..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <ArrowsUpDownIcon className="h-5 w-5 text-gray-500" />
              <select
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="latest">Latest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="duration-short">Duration: Short to Long</option>
                <option value="duration-long">Duration: Long to Short</option>
                <option value="difficulty-easy">
                  Difficulty: Easy to Hard
                </option>
                <option value="difficulty-hard">
                  Difficulty: Hard to Easy
                </option>
              </select>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all ${
                showFilters || isFilterApplied()
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FunnelIcon className="h-5 w-5" />
              Filters
              {isFilterApplied() && (
                <span className="bg-white text-blue-600 px-2 py-1 rounded-full text-xs">
                  {
                    [
                      region !== "All Regions" && "Region",
                      difficulty !== "All Levels" && "Difficulty",
                      duration < 100 && "Duration",
                      priceRange < 10000 && "Price",
                    ].filter(Boolean).length
                  }
                </span>
              )}
            </button>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Region Filter */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    Region
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                  >
                    <option value="All Regions">All Regions</option>
                    <option value="Everest">Everest</option>
                    <option value="Annapurna">Annapurna</option>
                    <option value="Langtang">Langtang</option>
                    <option value="Manaslu">Manaslu</option>
                    <option value="Mustang">Mustang</option>
                  </select>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <SparklesIcon className="h-4 w-4 mr-2" />
                    Difficulty
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                  >
                    <option value="All Levels">All Levels</option>
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="TOUGH">Tough</option>
                    <option value="VERY_TOUGH">Very Tough</option>
                  </select>
                </div>

                {/* Duration Filter */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Duration
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Up to {duration} days
                  </p>
                </div>

                {/* Price Filter */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                    Max Price
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Up to ${priceRange}
                  </p>
                </div>
              </div>

              {isFilterApplied() && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
                  >
                    <XMarkIcon className="h-4 w-4" />
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results Count and Pagination Info */}
        {!isLoading && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <p className="text-gray-600">
              Showing {startIndex + 1}-
              {Math.min(endIndex, filteredPackages.length)} of{" "}
              {filteredPackages.length} packages
            </p>
            {totalPages > 1 && (
              <p className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </p>
            )}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading amazing treks...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        {/* No Results */}
        {!isLoading && filteredPackages.length === 0 && !error && (
          <div className="text-center py-12">
            <ExclamationCircleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No treks found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or clear the filters
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
            >
              <XMarkIcon className="h-5 w-5" />
              Clear All Filters
            </button>
          </div>
        )}

        {/* Package List - Full Width Cards */}
        <div className="space-y-6">
          {displayPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex flex-col lg:flex-row">
                {/* Image Section */}
                <div className="lg:w-1/3 h-64 lg:h-auto relative">
                  {pkg.images && pkg.images.length > 0 ? (
                    pkg.images.length === 1 ? (
                      <img
                        src={pkg.images[0].image}
                        alt={pkg.images[0].alt_text || pkg.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Slider {...sliderSettings}>
                        {pkg.images.map((img) => (
                          <div key={img.id}>
                            <img
                              src={img.image}
                              alt={img.alt_text || pkg.title}
                              className="w-full h-64 lg:h-full object-cover"
                            />
                          </div>
                        ))}
                      </Slider>
                    )
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <p className="text-gray-500">No image available</p>
                    </div>
                  )}

                  {/* Bookmark Button */}
                  <button
                    onClick={() => handleBookmark(pkg.id)}
                    className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                  >
                    <BookmarkIcon className="h-5 w-5 text-gray-700" />
                  </button>
                </div>

                {/* Content Section */}
                <div className="lg:w-2/3 p-6 lg:p-8">
                  <div className="flex flex-col h-full">
                    <div className="flex-grow">
                      <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                        {pkg.title || "Unnamed Package"}
                      </h3>

                      <p className="text-gray-600 mb-6 text-lg leading-relaxed line-clamp-3">
                        {pkg.description || "No description available."}
                      </p>

                      {/* Stats Grid - Updated to include price and remove region */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <div className="text-center">
                          <CalendarIcon className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                          <p className="text-lg font-semibold text-gray-900">
                            {pkg.duration || "N/A"}
                          </p>
                          <p className="text-sm text-gray-500">days</p>
                        </div>
                        <div className="text-center">
                          <CurrencyDollarIcon className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                          <p className="text-lg font-semibold text-blue-600">
                            ${pkg.price || "N/A"}
                          </p>
                          <p className="text-sm text-gray-500">price</p>
                        </div>
                        <div className="text-center">
                          <img
                            src="/icons/mountain_peak.png"
                            alt="Altitude"
                            className="h-6 w-6 mx-auto mb-2"
                          />
                          <p className="text-lg font-semibold text-gray-900">
                            {pkg.altitude || "N/A"}m
                          </p>
                          <p className="text-sm text-gray-500">altitude</p>
                        </div>
                        <div className="text-center">
                          <SparklesIcon className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                          <p
                            className={`text-lg font-semibold ${getDifficultyColor(
                              pkg.difficulty
                            )}`}
                          >
                            {formatDifficulty(pkg.difficulty)}
                          </p>
                          <p className="text-sm text-gray-500">difficulty</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-auto">
                      <Link
                        to={`/booking?package=${pkg.id}`}
                        className="flex-1 bg-blue-600 text-white text-center py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                      >
                        Book Now
                      </Link>
                      <Link
                        to={`/packages/${pkg.id}`}
                        className="flex-1 bg-gray-100 text-gray-700 text-center py-4 rounded-xl font-semibold text-lg hover:bg-gray-200 transition-colors border border-gray-200"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <Pagination />
      </div>
    </div>
  );
};

export default PackageList;
