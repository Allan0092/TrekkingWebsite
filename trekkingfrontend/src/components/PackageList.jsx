import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const PackageList = () => {
  const [packages, setPackages] = useState([]);
  const [search, setSearch] = useState("");
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

  const filteredPackages = packages.filter((pkg) =>
    pkg.title && typeof pkg.title === "string"
      ? pkg.title.toLowerCase().includes(search.toLowerCase())
      : false
  );

  return (
    <div className="container mx-auto p-4 bg-[#F6FFFF] text-black font-inter">
      <h1 className="text-[64px] font-bold mb-4">Trekking Packages</h1>
      {error && (
        <p className="text-[24px] font-medium text-red-500 mb-4">{error}</p>
      )}
      <input
        type="text"
        placeholder="Search packages..."
        className="p-3 text-[24px] font-medium border rounded-lg mb-6 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPackages.length === 0 && !error ? (
          <p className="text-[24px] font-medium">No packages found.</p>
        ) : (
          filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="p-4 border rounded-lg flex flex-col sm:flex-row gap-4"
            >
              {pkg.images && pkg.images.length > 0 && (
                <img
                  src={`http://localhost:8000${pkg.images[0].image}`}
                  alt={pkg.images[0].alt_text || pkg.title}
                  className="w-full sm:w-1/3 h-48 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h2 className="text-[32px] font-bold">
                  {pkg.title || "Unnamed Package"}
                </h2>
                <p className="text-[24px] font-medium">
                  Duration: {pkg.duration || "N/A"} days | Price: $
                  {pkg.price || "N/A"} | Difficulty: {pkg.difficulty || "N/A"} |
                  Altitude: {pkg.altitude || "N/A"}m
                </p>
                <p className="text-[24px] font-medium line-clamp-2">
                  {pkg.description || "No description available."}
                </p>
                <Link
                  to={`/packages/${pkg.id}`}
                  className="text-blue-500 text-[24px] font-medium mt-2 inline-block"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PackageList;
