import {
  ChevronDownIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ParallaxBanner, ParallaxProvider } from "react-scroll-parallax";
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
      image: "/images/5.jpeg", // Ensure these paths are correct
      alt: "Annapurna Base Camp Trek",
      caption: "Conquer the Annapurna Base Camp",
      link: "/packages/1",
    },
    {
      id: 2,
      image: "/images/8.JPG",
      alt: "Everest Base Camp Trek",
      caption: "Journey to Everest Base Camp",
      link: "/packages/2",
    },
    {
      id: 3,
      image: "/images/9.jpeg",
      alt: "Chitwan Pokhara Tour",
      caption: "Wildlife and Lakeside Wonders",
      link: "/packages/6",
    },
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    dotsClass: "slick-dots slick-dots-custom",
    fade: true,
    cssEase: "ease-in-out",
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
    alert("Thank you for subscribing!"); // User feedback
  };

  const formatDifficulty = (difficulty) => {
    if (difficulty === "VERY_TOUGH") {
      return "Very Tough";
    }
    return difficulty || "N/A";
  };

  // Framer Motion Variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <ParallaxProvider>
      <div className="bg-white text-neutral-800 font-sans antialiased overflow-x-hidden">
        {/* Hero Slider with Parallax */}
        <div className="relative max-w-full overflow-hidden">
          <Slider {...sliderSettings}>
            {slides.map((slide) => (
              <div key={slide.id}>
                <ParallaxBanner
                  layers={[
                    {
                      image: slide.image,
                      speed: -20, // Adjust speed for desired parallax effect
                    },
                    {
                      children: (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col items-center justify-center text-white p-8 text-center">
                          <motion.h2
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="text-4xl sm:text-5xl lg:text-7xl font-extrabold mb-6 drop-shadow-lg"
                          >
                            {slide.caption}
                          </motion.h2>
                          <motion.p
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.8 }}
                            className="text-lg sm:text-xl lg:text-2xl mb-8 max-w-2xl"
                          >
                            Embark on an unforgettable journey through the
                            majestic Himalayas.
                          </motion.p>
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.9, duration: 0.6 }}
                          >
                            <Link
                              to={slide.link}
                              className="px-8 py-4 bg-primary-600 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-primary-700 transition-all duration-300 transform hover:scale-105"
                            >
                              Discover More
                            </Link>
                          </motion.div>
                        </div>
                      ),
                    },
                  ]}
                  className="h-[650px] sm:h-[700px] lg:h-[800px]" // Increased height for better parallax visibility
                />
              </div>
            ))}
          </Slider>
        </div>

        {/* Introduction Section */}
        <div className="container mx-auto px-4 py-16 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-neutral-900 mb-6"
          >
            Welcome to{" "}
            <span className="text-primary-600">Himalaya Adventure</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-neutral-700 max-w-3xl mx-auto leading-relaxed"
          >
            Your ultimate guide to breathtaking treks and tours in the heart of
            the Himalayas. We craft unforgettable experiences, blending
            adventure with cultural immersion and unparalleled safety.
          </motion.p>
        </div>

        {/* Featured Packages Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <motion.h2
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7 }}
              className="text-3xl sm:text-4xl font-bold text-neutral-900 flex items-center"
            >
              <img
                src="/icons/crown.png"
                alt="Crown Icon"
                className="h-9 w-9 mr-3"
              />
              Our Top Picks for 2025
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7 }}
            >
              <Link
                to="/packages"
                className="text-lg font-semibold text-primary-600 hover:text-primary-700 transition-colors duration-300 flex items-center group"
              >
                View All Packages
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5 ml-1 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-200"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                  />
                </svg>
              </Link>
            </motion.div>
          </div>

          {error && (
            <p className="text-xl font-medium text-red-500 mb-4 text-center">
              {error}
            </p>
          )}
          {isLoading && (
            <div className="text-xl font-medium text-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto mb-4"></div>
              Loading incredible treks...
            </div>
          )}
          {!isLoading && packages.length === 0 && (
            <div className="text-xl font-medium text-center py-8 text-neutral-600">
              No featured packages available at the moment.
            </div>
          )}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {packages.map((pkg) => (
              <motion.div
                key={pkg.id}
                variants={itemVariants}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-neutral-100 group"
              >
                {pkg.images && pkg.images.length > 0 ? (
                  <div className="h-56 overflow-hidden">
                    <img
                      src={pkg.images[0].image}
                      alt={pkg.images[0].alt_text || pkg.title}
                      className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="w-full h-56 bg-gray-200 rounded-t-xl flex items-center justify-center text-neutral-500 text-lg">
                    No image available
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                    {pkg.title || "Unnamed Package"}
                  </h3>
                  <p className="text-lg text-neutral-600 mb-4 flex items-center">
                    <span className="font-semibold text-primary-600">
                      ${pkg.price || "N/A"}
                    </span>{" "}
                    <span className="mx-2 text-neutral-400">|</span>
                    <span className="flex items-center">
                      {pkg.duration || "N/A"} days
                    </span>
                    <span className="mx-2 text-neutral-400">|</span>
                    <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                      {formatDifficulty(pkg.difficulty)}
                    </span>
                  </p>
                  <Link
                    to={`/packages/${pkg.id}`}
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold transition-colors duration-200"
                  >
                    View Details
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4 ml-1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                      />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Why Choose Us Section */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl font-extrabold text-center text-neutral-900 mb-12"
            >
              Why Choose{" "}
              <span className="text-primary-600">Himalaya Adventure</span>?
            </motion.h2>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-10"
            >
              <motion.div
                variants={itemVariants}
                className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md border border-blue-100"
              >
                <CurrencyDollarIcon className="h-14 w-14 text-primary-500 mb-5" />
                <h3 className="text-2xl font-bold text-neutral-900 mb-3">
                  Great Value
                </h3>
                <p className="text-lg text-neutral-700 leading-relaxed">
                  Experience the Himalayas without breaking the bank. Our
                  packages offer transparent pricing and exceptional quality.
                </p>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md border border-blue-100"
              >
                <ShieldCheckIcon className="h-14 w-14 text-green-500 mb-5" />
                <h3 className="text-2xl font-bold text-neutral-900 mb-3">
                  Safe & Secure
                </h3>
                <p className="text-lg text-neutral-700 leading-relaxed">
                  Your safety is our priority. We provide experienced guides and
                  adhere to the highest safety standards.
                </p>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md border border-blue-100"
              >
                <UserGroupIcon className="h-14 w-14 text-purple-500 mb-5" />
                <h3 className="text-2xl font-bold text-neutral-900 mb-3">
                  Customer Satisfaction
                </h3>
                <p className="text-lg text-neutral-700 leading-relaxed">
                  We are dedicated to making your adventure seamless and
                  memorable, with support available every step of the way.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Frequently Asked Questions Section */}
        <section className="container mx-auto px-4 py-16">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold text-center text-neutral-900 mb-10"
          >
            Frequently Asked Questions
          </motion.h2>
          <div className="max-w-3xl mx-auto space-y-5">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="border border-neutral-200 rounded-lg shadow-sm bg-white overflow-hidden"
              >
                <button
                  className="w-full flex justify-between items-center p-5 text-left focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-t-lg"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="text-lg sm:text-xl font-semibold text-neutral-800">
                    {faq.question}
                  </span>
                  <ChevronDownIcon
                    className={`h-6 w-6 text-neutral-500 transform transition-transform duration-300 ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="p-5 pt-0 text-neutral-600 leading-relaxed text-md sm:text-lg"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Subscribe to Newsletter Section */}
        <section className="bg-primary-600 py-16">
          <div className="container mx-auto px-4 text-center">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl font-extrabold text-white mb-6"
            >
              Stay Adventurous, Subscribe Now!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-primary-100 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Get exclusive updates, new trek announcements, and special offers
              delivered straight to your inbox.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex justify-center"
            >
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-4 max-w-xl w-full bg-white p-2 rounded-full shadow-lg"
              >
                <input
                  type="email"
                  placeholder="Your Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-grow p-3 text-lg border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 px-5"
                  required
                />
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-lg font-bold rounded-full hover:from-teal-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Subscribe
                </button>
              </form>
            </motion.div>
          </div>
        </section>
      </div>
    </ParallaxProvider>
  );
};

export default Homepage;
