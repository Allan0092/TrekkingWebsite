import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const PackageDetails = () => {
  const { id } = useParams();
  const [packageData, setPackageData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/packages/${id}/`)
      .then((response) => setPackageData(response.data))
      .catch((err) =>
        setError("Failed to load package details. Please try again.")
      );
  }, [id]);

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-red-500">{error}</p>
        <Link to="/packages" className="text-blue-500">
          Return to Packages
        </Link>
      </div>
    );
  }

  if (!packageData) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Link to="/packages" className="text-blue-500 mb-4 inline-block">
        &larr; Back to Packages
      </Link>
      <h1 className="text-3xl font-bold mb-4">{packageData.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-lg">
            <strong>Duration:</strong> {packageData.duration} days
          </p>
          <p className="text-lg">
            <strong>Price:</strong> ${packageData.price}
          </p>
          <p className="text-lg">
            <strong>Difficulty:</strong> {packageData.difficulty}
          </p>
        </div>
        <div>
          {/* Placeholder for package image */}
          <div className="bg-gray-200 h-48 rounded flex items-center justify-center">
            <span>Package Image</span>
          </div>
        </div>
      </div>
      <h2 className="text-2xl font-semibold mb-2">Itinerary</h2>
      <p className="text-gray-700">{packageData.itinerary}</p>
      <button className="mt-6 p-2 bg-blue-500 text-white rounded">
        Book Now
      </button>
    </div>
  );
};

export default PackageDetails;
