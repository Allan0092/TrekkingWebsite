import axios from "axios";
import { useState } from "react";

const PackageImageUpload = ({ packageId }) => {
  const [file, setFile] = useState(null);
  const [altText, setAltText] = useState("");
  const [order, setOrder] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("alt_text", altText);
    formData.append("order", order);

    try {
      const response = await axios.post(
        `http://localhost:8000/api/packages/${packageId}/images/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${localStorage.getItem("token")}`, // Adjust based on your auth
          },
        }
      );
      setSuccess("Image uploaded successfully!");
      setFile(null);
      setAltText("");
      setOrder(0);
      setError("");
    } catch (err) {
      setError("Failed to upload image. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-[#F6FFFF] text-black font-inter">
      <h2 className="text-[32px] font-bold mb-4">Upload Image for Package</h2>
      {error && (
        <p className="text-[24px] font-medium text-red-500 mb-4">{error}</p>
      )}
      {success && (
        <p className="text-[24px] font-medium text-green-500 mb-4">{success}</p>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="p-3 text-[24px] font-medium border rounded-lg"
        />
        <input
          type="text"
          placeholder="Alt text"
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          className="p-3 text-[24px] font-medium border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          placeholder="Order"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          className="p-3 text-[24px] font-medium border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="p-3 bg-blue-500 text-white text-[32px] font-bold rounded-lg hover:bg-blue-600"
        >
          Upload
        </button>
      </form>
    </div>
  );
};

export default PackageImageUpload;
