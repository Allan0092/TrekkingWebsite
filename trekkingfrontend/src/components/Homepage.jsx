import {
  ChevronDownIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

const Homepage = () => {
  const slides = [
    {
      id: 1,
      image: "/images/annapurna.JPG",
      alt: "Annapurna Base Camp",
      caption: "Explore Annapurna Base Camp",
      link: "/packages/1",
    },
    {
      id: 2,
      image: "/images/everest.png",
      alt: "Everest Base Camp",
      caption: "Discover Everest Base Camp",
      link: "/packages/2",
    },
    {
      id: 3,
      image: "/images/manaslu.JPG",
      alt: "Manaslu Circuit",
      caption: "Trek the Manaslu Circuit",
      link: "/packages/3",
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

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="bg-[#F6FFFF] text-black font-inter">
      {/* Photo Slider */}
      <div className="w-full">
        <Slider {...sliderSettings}>
          {slides.map((slide) => (
            <div key={slide.id}>
              <div className="relative h-[400px]">
                <img
                  src={slide.image}
                  alt={slide.alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded">
                  <h2 className="text-xl font-bold">{slide.caption}</h2>
                  <Link
                    to={slide.link}
                    className="text-blue-300 hover:text-blue-100"
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
        <p className="text-[24px] font-medium mb-4">
          Explore Nepal’s iconic trekking routes.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded">
            <h2 className="text-[32px] font-bold">Annapurna Base Camp</h2>
            <p className="text-[24px] font-medium">7 days | $800 | Moderate</p>
            <Link to="/packages/1" className="text-blue-500">
              View Details
            </Link>
          </div>
          <div className="p-4 border rounded">
            <h2 className="text-[32px] font-bold">Everest Base Camp</h2>
            <p className="text-[24px] font-medium">14 days | $1500 | Hard</p>
            <Link to="/packages/2" className="text-blue-500">
              View Details
            </Link>
          </div>
          <div className="p-4 border rounded">
            <h2 className="text-[32px] font-bold">Manaslu Circuit</h2>
            <p className="text-[24px] font-medium">12 days | $1200 | Hard</p>
            <Link to="/packages/3" className="text-blue-500">
              View Details
            </Link>
          </div>
        </div>
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
      </div>
    </div>
  );
};

export default Homepage;
