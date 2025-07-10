import { ArrowLeft, Home } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  const [randomImage, setRandomImage] = useState("");

  const images = [
    "/images/ice-spikes.JPG",
    "/images/black-yak.jpeg",
    "/images/bridge.jpeg",
  ];

  useEffect(() => {
    // Select a random image when component mounts
    const randomIndex = Math.floor(Math.random() * images.length);
    setRandomImage(images[randomIndex]);
  }, []);

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative">
            <img
              src={randomImage}
              alt="Lost in mountains"
              className="w-64 h-64 mx-auto rounded-full object-cover shadow-2xl border-8 border-white"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-full"></div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Oops! You've Lost Your Way
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            It looks like you've wandered off the beaten path. The page you're
            looking for doesn't exist, but don't worry - even the best trekkers
            sometimes take a wrong turn!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 mb-8">
          <button
            onClick={handleGoHome}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Home className="w-5 h-5" />
            Take Me Home
          </button>

          <button
            onClick={() => navigate(-1)}
            className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg border-2 border-gray-300 transition-all duration-200 flex items-center justify-center gap-2 hover:border-gray-400"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-gray-600 mb-4">Looking for something specific?</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => navigate("/packages")}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm transition-colors duration-200"
            >
              🏔️ Trekking Packages
            </button>
            <button
              onClick={() => navigate("/about")}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm transition-colors duration-200"
            >
              📖 About Us
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm transition-colors duration-200"
            >
              📞 Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
