import {
  ChevronDownIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

const Homepage = () => {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const slides = [
    {
      id: 1,
      image: "/images/5.jpeg",
      alt: "Annapurna Base Camp",
      caption: "Explore Annapurna Base Camp",
      link: "/packages/1",
    },
    {
      id: 2,
      image: "/images/8.JPG",
      alt: "Everest Base Camp",
      caption: "Discover Everest Base Camp",
      link: "/packages/2",
    },
    {
      id: 3,
      image: "/images/9.jpeg",
      alt: "rhino",
      caption: "Chitwan Pokhara Tour",
      link: "/packages/6",
    },
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    dotsClass: "slick-dots slick-dots-custom",
    fade: true,
  };

  const faqs = [
    {
      question: "Is the Internet available in the Everest region?",
      answer:
        "For internet usage, the Everest region has a network “Everest Link” which can be bought for around NPR 600-800 (USD 5-7) for 6GB that can be used at one destination, or you can pay NPR 2500 (USD 21) for 10GB data that can be used in the regions that have access to Everest link.",
    },
    {
      question:
        "Is it possible to obtain a visa for Nepal upon arrival at the airport?",
      answer:
        "Yes, you can obtain a Nepal visa upon your arrival at the airport. There are kiosks in the arrival hall that you use to complete the necessary forms. The cost is USD 30 for a 15-day tourist visa, including numerous entries, or USD 50 and USD 125 for a 30-day or 90-day tourist visa including numerous entries respectively. You should carry cash (USD) with you to pay your visa fees quickly and easily, as digital payments are frequently unavailable. To save time, we recommend filling out the online visa application form in advance. Applying online 2 weeks before your arrival will expedite the process at the airport.",
    },
    {
      question:
        "Is the food in the mountains prepared to international standards in terms of safety?",
      answer:
        "Indeed, the guesthouses follow international guidelines while setting up the food and serve you clean, protected, and warm meals.",
    },
    {
      question:
        "What kind of physical training is necessary for trek preparation?",
      answer:
        "For trekking, you must prepare your body to walk over uneven, hilly landscapes while carrying a backpack. Walking at an incline, jogging, cycling, and going for long-distance hikes are all good ways to exercise. You should work out for at least one hour four to five times a week for at least two months before trekking.",
    },
    {
      question: "Where can I exchange money upon arrival in Nepal?",
      answer:
        "You can exchange currency at one of the money exchange counters in the arrivals area of Tribhuvan International Airport, which operate 24 hours a day. Alternatively, you can also exchange money at authorized exchange centers near your hotel, which are typically open during the day.",
    },
  ];

  const [openFaq, setOpenFaq] = useState(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:8000/api/packages/");
        if (!response.ok) throw new Error("Failed to fetch packages");
        const data = await response.json();
        console.log("Fetched packages:", data);
        setPackages(data.slice(0, 3)); // Limit to 3 packages
      } catch (err) {
        console.error("Error fetching packages:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log("Subscribed with email:", email);
    setEmail("");
  };

  const formatDifficulty = (difficulty) => {
    if (difficulty === "VERY_TOUGH") {
      return "Very Tough";
    }
    return difficulty || "N/A";
  };

  return (
    <div className="bg-[#F6FFFF] text-black font-inter overflow-x-hidden">
      {/* Hero Slider */}
      <div className="relative max-w-full overflow-hidden">
        <Slider {...sliderSettings}>
          {slides.map((slide) => (
            <div key={slide.id}>
              <div className="relative w-full h-[600px] sm:h-[600px] md:h-[600px] lg:h-[600px] bg-gray-100">
                <img
                  src={slide.image}
                  alt={slide.alt}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
                <div className="absolute bottom-8 left-8 right-8 flex flex-col items-start text-white animate-fade-in">
                  <h2 className="text-[36px] font-bold mb-4">
                    {slide.caption}
                  </h2>
                  <Link
                    to={slide.link}
                    className="px-6 py-3 bg-blue-500 text-white text-[18px] font-medium rounded-lg hover:bg-blue-600 transition-all duration-300"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Featured Packages Section */}
      <div className="container mx-auto p-4">
        <h1 className="text-[64px] font-bold mb-4">
          Welcome to Trekking Website Treks
        </h1>
        <div className="flex items-center mb-4">
          <img
            src="/icons/crown.png"
            alt="Crown Icon"
            className="h-8 w-8 mr-2"
          />
          <h2 className="text-[24px] font-medium">Our Top Picks for 2025</h2>
          <Link
            to="/packages"
            className="ml-auto text-[18px] font-medium text-blue-500 hover:text-blue-600"
          >
            View All
          </Link>
        </div>
        {error && (
          <p className="text-[24px] font-medium text-red-500 mb-4">{error}</p>
        )}
        {isLoading && (
          <div className="text-[24px] font-medium text-center py-4">
            Loading packages...
          </div>
        )}
        {!isLoading && packages.length === 0 && (
          <div className="text-[24px] font-medium text-center py-4">
            No packages available.
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="p-4 border rounded-lg bg-white shadow-md"
            >
              {pkg.images && pkg.images.length > 0 ? (
                <img
                  src={pkg.images[0].image}
                  alt={pkg.images[0].alt_text || pkg.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <p className="text-[18px] font-medium text-gray-500">
                    No image available
                  </p>
                </div>
              )}
              <h2 className="text-[32px] font-bold mb-2">
                {pkg.title || "Unnamed Package"}
              </h2>
              <p className="text-[24px] font-medium mb-4">
                {pkg.duration || "N/A"} days | ${pkg.price || "N/A"} |{" "}
                {formatDifficulty(pkg.difficulty)}
              </p>
              <Link
                to={`/packages/${pkg.id}`}
                className="text-blue-500 hover:text-blue-600"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
        <hr className="mt-8 border-gray-200" />
      </div>

      {/* Why Choose Us Section */}
      <div className="container mx-auto p-4 py-12">
        <h2 className="text-[64px] font-bold text-center mb-8">
          Why Choose Us?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <CurrencyDollarIcon className="h-12 w-12 text-blue-500 mb-4" />
            <h3 className="text-[32px] font-bold">Great Value</h3>
            <p className="text-[24px] font-medium">
              Affordable packages with no hidden costs.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <ShieldCheckIcon className="h-12 w-12 text-blue-500 mb-4" />
            <h3 className="text-[32px] font-bold">Safe and Secure</h3>
            <p className="text-[24px] font-medium">
              Trusted guides and secure booking process.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <UserGroupIcon className="h-12 w-12 text-blue-500 mb-4" />
            <h3 className="text-[32px] font-bold">Customer Satisfaction</h3>
            <p className="text-[24px] font-medium">
              Dedicated support for a memorable experience.
            </p>
          </div>
        </div>
        <hr className="mt-8 border-gray-200" />
      </div>

      {/* Frequently Asked Questions Section */}
      <div className="container mx-auto p-4 py-12">
        <h2 className="text-[32px] font-bold text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border rounded-lg">
              <button
                className="w-full flex justify-between items-center p-4 text-left"
                onClick={() => toggleFaq(index)}
              >
                <span className="text-[24px] font-bold">{faq.question}</span>
                <ChevronDownIcon
                  className={`h-6 w-6 transform transition-transform ${
                    openFaq === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openFaq === index && (
                <div className="p-4 text-[18px] font-medium bg-gray-100">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
        <hr className="mt-8 border-gray-200" />
      </div>

      {/* Subscribe to Newsletter Section */}
      <div className="container mx-auto p-4 py-12 bg-blue-50">
        <h2 className="text-[32px] font-bold text-center mb-4">
          Subscribe to Our Newsletter
        </h2>
        <p className="text-[24px] font-medium text-center mb-6">
          Stay updated with our latest trekking packages and exclusive offers!
        </p>
        <div className="flex justify-center">
          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row gap-4 max-w-lg w-full"
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 text-[18px] font-medium border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="p-3 bg-blue-500 text-white text-[20px] font-bold rounded-lg hover:bg-blue-600"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
