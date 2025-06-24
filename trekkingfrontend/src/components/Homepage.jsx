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

  // Slider settings
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

  return (
    <div className="bg-[#F6FFFF] text-black">
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

      {/* Content Section */}
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">
          Welcome to Trekking Website Treks
        </h1>
        <p className="mb-4">Explore Nepal’s iconic trekking routes.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded">
            <h2 className="text-xl font-semibold">Annapurna Base Camp</h2>
            <p>7 days | $800 | Moderate</p>
            <Link to="/packages/1" className="text-blue-500">
              View Details
            </Link>
          </div>
          <div className="p-4 border rounded">
            <h2 className="text-xl font-semibold">Everest Base Camp</h2>
            <p>14 days | $1500 | Hard</p>
            <Link to="/packages/2" className="text-blue-500">
              View Details
            </Link>
          </div>
          <div className="p-4 border rounded">
            <h2 className="text-xl font-semibold">Manaslu Circuit</h2>
            <p>12 days | $1200 | Hard</p>
            <Link to="/packages/3" className="text-blue-500">
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
