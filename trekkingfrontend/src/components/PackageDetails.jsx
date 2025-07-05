import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PackageImageUpload from "../components/PackageImageUpload";

const PackageDetails = () => {
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);
  const [error, setError] = useState("");
  const isAdmin = true; // Replace with actual auth check

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/packages/${id}/`)
      .then((response) => setPkg(response.data))
      .catch((error) => {
        console.error("Error fetching package:", error);
        setError("Failed to load package details.");
      });
  }, [id]);

  if (error)
    return <p className="text-red-500 text-[24px] font-medium">{error}</p>;
  if (!pkg) return <p className="text-[24px] font-medium">Loading...</p>;

  return (
    <div className="container mx-auto p-4 bg-[#F6FFFF] text-black font-inter">
      <h1 className="text-[64px] font-bold mb-4">{pkg.title}</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2">
          {pkg.images && pkg.images.length > 0 ? (
            <img
              src={`${pkg.images[0].image}`}
              alt={pkg.images[0].alt_text || pkg.title}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
          ) : (
            <p className="text-[24px] font-medium">No images available.</p>
          )}
        </div>
        <div className="md:w-1/2">
          <p className="text-[24px] font-medium mb-2">
            Duration: {pkg.duration} days | Price: ${pkg.price || "N/A"} |
            Difficulty: {pkg.difficulty} | Altitude: {pkg.altitude}m
          </p>
          <p className="text-[24px] font-medium">{pkg.description}</p>
        </div>
      </div>
      {isAdmin && <PackageImageUpload packageId={id} />}
    </div>
  );
};

export default PackageDetails;
