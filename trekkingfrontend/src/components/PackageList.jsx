import axios from "axios";
import { useEffect, useState } from "react";

const PackageList = () => {
  const [packages, setPackages] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/packages/")
      .then((response) => setPackages(response.data))
      .catch((error) => console.error(error));
  }, []);

  const filteredPackages = packages.filter((pkg) =>
    pkg.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Trekking Packages</h1>
      <input
        type="text"
        placeholder="Search packages..."
        className="p-2 border rounded mb-4 w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPackages.map((pkg) => (
          <div key={pkg.id} className="p-4 border rounded">
            <h2 className="text-xl font-semibold">{pkg.name}</h2>
            <p>
              Duration: {pkg.duration} days | Price: ${pkg.price}
            </p>
            <a href={`/packages/${pkg.id}`} className="text-blue-500">
              View Details
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
export default PackageList;
