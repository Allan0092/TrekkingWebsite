import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

const Booking = () => {
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [numPeople, setNumPeople] = useState(1);
  const [people, setPeople] = useState([
    {
      fullName: "",
      dateOfBirth: "",
      email: "",
      phone: "",
      nationality: "",
      gender: "",
      dateOfArrival: "",
      dateOfDeparture: "",
      room: "Single",
      shareRoomWith: "",
    },
  ]);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [showModal, setShowModal] = useState(false);
  const sliderRef = useRef(null);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:8000/api/packages/4/`);
        if (!response.ok) throw new Error("Failed to fetch package details");
        const data = await response.json();
        console.log("Fetched package:", data);
        setPkg(data);
      } catch (err) {
        console.error("Error fetching package:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackage();
  }, [id]);

  useEffect(() => {
    // Adjust people array based on numPeople
    setPeople((prev) => {
      const newPeople = Array.from({ length: numPeople }, (_, i) => {
        if (prev[i]) {
          return prev[i];
        }
        // Autofill for new people based on Person 1
        const person1 = prev[0] || {};
        return {
          fullName: "",
          dateOfBirth: "",
          email: "",
          phone: "",
          nationality: person1.nationality || "",
          gender: "",
          dateOfArrival: person1.dateOfArrival || "",
          dateOfDeparture: person1.dateOfDeparture || "",
          room: "Single",
          shareRoomWith: "",
        };
      });
      return newPeople;
    });
  }, [numPeople]);

  const handlePersonChange = (index, field, value) => {
    setPeople((prev) => {
      const newPeople = [...prev];
      newPeople[index] = { ...newPeople[index], [field]: value };
      // Update autofill for other people if Person 1 changes
      if (
        index === 0 &&
        ["nationality", "dateOfArrival", "dateOfDeparture"].includes(field)
      ) {
        newPeople.forEach((person, i) => {
          if (i !== 0 && !person[field]) {
            newPeople[i][field] = value;
          }
        });
      }
      return newPeople;
    });
  };

  const getAvailableRoomMates = (currentIndex) => {
    const assigned = people
      .filter((p, i) => i !== currentIndex && p.shareRoomWith)
      .map((p) => p.shareRoomWith);
    const paired = people.reduce((acc, p, i) => {
      if (p.room === "Shared" && p.shareRoomWith) {
        acc.add(p.shareRoomWith);
        acc.add(people[i].fullName);
      }
      return acc;
    }, new Set());
    return people
      .filter(
        (p, i) => i !== currentIndex && p.fullName && !paired.has(p.fullName)
      )
      .map((p) => p.fullName);
  };

  const calculatePrice = () => {
    if (!pkg) return { items: [], total: 0 };
    const basePrice = pkg.price || 0;
    const items = [];
    let total = 0;

    // Base price per person
    people.forEach((_, i) => {
      items.push({ name: `Base Price (Person ${i + 1})`, cost: basePrice });
      total += basePrice;
    });

    // Room costs
    people.forEach((person, i) => {
      if (person.room === "Single") {
        items.push({ name: `Room Cost (Person ${i + 1} - Single)`, cost: 100 });
        total += 100;
      } else if (person.room === "Shared") {
        items.push({ name: `Room Cost (Person ${i + 1} - Shared)`, cost: 60 });
        total += 60;
      }
    });

    return { items, total };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    const isValid = people.every(
      (p) =>
        p.fullName &&
        p.dateOfBirth &&
        p.email &&
        p.phone &&
        p.nationality &&
        p.gender &&
        p.dateOfArrival &&
        p.dateOfDeparture &&
        p.room &&
        (p.room === "Single" || (p.room === "Shared" && p.shareRoomWith))
    );
    if (!isValid) {
      alert("Please fill all required fields for all people.");
      return;
    }
    setShowModal(true);
  };

  const confirmBooking = () => {
    console.log("Booking Submitted:", {
      packageId: id,
      people,
      additionalInfo,
    });
    setShowModal(false);
    // Navigate to confirmation page or reset form (TBD)
  };

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    dotsClass: "slick-dots slick-dots-custom",
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "EASY":
        return "text-green-500";
      case "MEDIUM":
        return "text-blue-500";
      case "TOUGH":
        return "text-orange-500";
      case "VERY_TOUGH":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const formatDifficulty = (difficulty) => {
    if (difficulty === "VERY_TOUGH") {
      return "Very Tough";
    }
    return difficulty || "N/A";
  };

  if (isLoading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-[80px] bg-[#F6FFFF] font-inter text-[24px] font-medium text-center text-red-500">
        Loading package details...
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-[80px] bg-[#F6FFFF] font-inter text-[24px] font-medium text-center text-red-500">
        {error || "Package not found."}
      </div>
    );
  }

  const priceData = calculatePrice();

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 pt-[80px] bg-[#F6FFFF] text-black font-inter">
      {/* Title and Introduction */}
      <h1 className="text-[48px] sm:text-[56px] font-bold mb-8 bg-gradient-to-r from-blue-700 to-teal-600 text-transparent bg-clip-text [text-shadow:_0_2px_4px_rgba(0,0,0,0.1)] animate-fade-in">
        Booking
      </h1>
      <div className="bg-white rounded-xl p-8 shadow-lg mb-8 animate-fade-in">
        <p className="text-[18px] font-normal text-gray-700 mb-4">
          Thank you for choosing your trekking adventure with us. On this page,
          you can review your selected package, provide necessary details, and
          complete your booking to secure your spot on iconic routes.
        </p>
        <ul className="text-[18px] font-normal text-gray-700 list-disc pl-6">
          <li>
            Provide accurate personal details, including full name, contact
            information, and emergency contact, to finalize your booking.
          </li>
          <li>
            Cancellations made more than 30 days before the trek start date are
            eligible for a full refund; later cancellations may incur fees.
          </li>
          <li>
            A confirmation email with itinerary details and payment receipt will
            be sent within 24 hours of successful booking.
          </li>
        </ul>
      </div>

      {/* Package Details */}
      <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-8 shadow-lg mb-8 animate-fade-in">
        <h2 className="text-[32px] font-bold mb-4 text-gray-800">
          Package Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex items-center">
            <img
              src="/icons/calendar.png"
              alt="Calendar"
              className="h-8 w-8 mr-3"
            />
            <p className="text-[24px] font-medium text-gray-800">
              {pkg.duration || "N/A"} days
            </p>
          </div>
          <div className="flex items-center">
            <img src="/icons/dollar.png" alt="Price" className="h-8 w-8 mr-3" />
            <p className="text-[24px] font-medium text-gray-800">
              ${pkg.price || "N/A"}
            </p>
          </div>
          <div className="flex items-center">
            <img
              src="/icons/mountain_peak.png"
              alt="Altitude"
              className="h-8 w-8 mr-3"
            />
            <p className="text-[24px] font-medium text-gray-800">
              {pkg.altitude || "N/A"}m
            </p>
          </div>
          <div className="flex items-center">
            <img
              src="/icons/difficulty.png"
              alt="Difficulty"
              className="h-8 w-8 mr-3"
            />
            <p
              className={`text-[24px] font-medium ${getDifficultyColor(
                pkg.difficulty
              )}`}
            >
              {formatDifficulty(pkg.difficulty)}
            </p>
          </div>
        </div>
      </div>

      {/* Personal Details */}
      <div className="bg-teal-50 rounded-xl p-8 shadow-lg mb-8 animate-fade-in">
        <h2 className="text-[32px] font-bold mb-4 text-gray-800">
          Personal Details
        </h2>
        <div className="mb-6">
          <label
            className="block text-[18px] font-medium text-gray-800 mb-2"
            htmlFor="numPeople"
          >
            Number of People
          </label>
          <input
            type="number"
            id="numPeople"
            min="1"
            max="20"
            value={numPeople}
            onChange={(e) =>
              setNumPeople(
                Math.max(1, Math.min(20, parseInt(e.target.value) || 1))
              )
            }
            className="w-full sm:w-32 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-[16px]"
            aria-label="Number of people"
            required
          />
        </div>
        <Slider {...sliderSettings} ref={sliderRef}>
          {people.map((person, index) => (
            <div key={index} className="bg-white rounded-xl p-4 shadow-md">
              <h3 className="text-[24px] font-medium text-gray-800 mb-4">
                Person {index + 1} Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-[16px] font-medium text-gray-800 mb-1"
                    htmlFor={`fullName-${index}`}
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id={`fullName-${index}`}
                    value={person.fullName}
                    onChange={(e) =>
                      handlePersonChange(index, "fullName", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-[16px]"
                    aria-label={`Full name for person ${index + 1}`}
                    required
                  />
                </div>
                <div>
                  <label
                    className="block text-[16px] font-medium text-gray-800 mb-1"
                    htmlFor={`dateOfBirth-${index}`}
                  >
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id={`dateOfBirth-${index}`}
                    value={person.dateOfBirth}
                    onChange={(e) =>
                      handlePersonChange(index, "dateOfBirth", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-[16px]"
                    aria-label={`Date of birth for person ${index + 1}`}
                    required
                  />
                </div>
                <div>
                  <label
                    className="block text-[16px] font-medium text-gray-800 mb-1"
                    htmlFor={`email-${index}`}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id={`email-${index}`}
                    value={person.email}
                    onChange={(e) =>
                      handlePersonChange(index, "email", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-[16px]"
                    aria-label={`Email for person ${index + 1}`}
                    required
                  />
                </div>
                <div>
                  <label
                    className="block text-[16px] font-medium text-gray-800 mb-1"
                    htmlFor={`phone-${index}`}
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    id={`phone-${index}`}
                    value={person.phone}
                    onChange={(e) =>
                      handlePersonChange(index, "phone", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-[16px]"
                    aria-label={`Phone for person ${index + 1}`}
                    required
                  />
                </div>
                <div>
                  <label
                    className="block text-[16px] font-medium text-gray-800 mb-1"
                    htmlFor={`nationality-${index}`}
                  >
                    Nationality
                  </label>
                  <select
                    id={`nationality-${index}`}
                    value={person.nationality}
                    onChange={(e) =>
                      handlePersonChange(index, "nationality", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-[16px]"
                    aria-label={`Nationality for person ${index + 1}`}
                    required
                  >
                    <option value="">Select Nationality</option>
                    {[
                      "United States",
                      "United Kingdom",
                      "Nepal",
                      "Canada",
                      "Australia",
                      "India",
                      "Other",
                    ].map((nat) => (
                      <option key={nat} value={nat}>
                        {nat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    className="block text-[16px] font-medium text-gray-800 mb-1"
                    htmlFor={`gender-${index}`}
                  >
                    Gender
                  </label>
                  <select
                    id={`gender-${index}`}
                    value={person.gender}
                    onChange={(e) =>
                      handlePersonChange(index, "gender", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-[16px]"
                    aria-label={`Gender for person ${index + 1}`}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label
                    className="block text-[16px] font-medium text-gray-800 mb-1"
                    htmlFor={`dateOfArrival-${index}`}
                  >
                    Date of Arrival
                  </label>
                  <input
                    type="date"
                    id={`dateOfArrival-${index}`}
                    value={person.dateOfArrival}
                    onChange={(e) =>
                      handlePersonChange(index, "dateOfArrival", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-[16px]"
                    aria-label={`Date of arrival for person ${index + 1}`}
                    required
                  />
                </div>
                <div>
                  <label
                    className="block text-[16px] font-medium text-gray-800 mb-1"
                    htmlFor={`dateOfDeparture-${index}`}
                  >
                    Date of Departure
                  </label>
                  <input
                    type="date"
                    id={`dateOfDeparture-${index}`}
                    value={person.dateOfDeparture}
                    onChange={(e) =>
                      handlePersonChange(
                        index,
                        "dateOfDeparture",
                        e.target.value
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-[16px]"
                    aria-label={`Date of departure for person ${index + 1}`}
                    required
                  />
                </div>
                <div>
                  <label
                    className="block text-[16px] font-medium text-gray-800 mb-1"
                    htmlFor={`room-${index}`}
                  >
                    Room
                  </label>
                  <select
                    id={`room-${index}`}
                    value={person.room}
                    onChange={(e) =>
                      handlePersonChange(index, "room", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-[16px]"
                    aria-label={`Room preference for person ${index + 1}`}
                    required
                  >
                    <option value="Single">Single ($100)</option>
                    <option value="Shared" disabled={numPeople === 1}>
                      Shared ($60/person)
                    </option>
                  </select>
                </div>
                <div>
                  <label
                    className="block text-[16px] font-medium text-gray-800 mb-1"
                    htmlFor={`shareRoomWith-${index}`}
                  >
                    Share Room With
                  </label>
                  <select
                    id={`shareRoomWith-${index}`}
                    value={person.shareRoomWith}
                    onChange={(e) =>
                      handlePersonChange(index, "shareRoomWith", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-[16px]"
                    aria-label={`Share room with for person ${index + 1}`}
                    disabled={person.room !== "Shared" || numPeople === 1}
                    required={person.room === "Shared"}
                  >
                    <option value="">Select Person</option>
                    {getAvailableRoomMates(index).map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Additional Information */}
      <div className="bg-gray-50 rounded-xl p-8 shadow-lg mb-8 animate-fade-in">
        <h2 className="text-[32px] font-bold mb-4 text-gray-800">
          Additional Information
        </h2>
        <textarea
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          placeholder="Enter any additional information, such as dietary restrictions or special requests"
          className="w-full h-32 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-[16px] font-normal text-gray-700"
          aria-label="Additional information"
        />
      </div>

      {/* Price Calculation */}
      <div className="bg-white rounded-xl p-8 shadow-lg mb-8 animate-fade-in">
        <h2 className="text-[32px] font-bold mb-4 text-gray-800">
          Price Calculation
        </h2>
        <table className="table-auto w-full text-[16px] font-medium text-gray-800">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2">Item</th>
              <th className="text-right py-2">Cost</th>
            </tr>
          </thead>
          <tbody>
            {priceData.items.map((item, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-2">{item.name}</td>
                <td className="text-right py-2">${item.cost}</td>
              </tr>
            ))}
            <tr className="border-t border-gray-300 font-bold">
              <td className="py-2">Total</td>
              <td className="text-right py-2">${priceData.total}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Buttons */}
      <div className="bg-white rounded-xl p-4 shadow-lg flex justify-between animate-fade-in">
        <Link
          to={`/packages/${id}`}
          className="p-3 bg-gray-200 text-black text-[24px] font-medium rounded-lg hover:bg-gray-300 text-center transition-all duration-200 w-[48%]"
          aria-label="Cancel booking"
        >
          Cancel
        </Link>
        <button
          onClick={handleSubmit}
          className="p-3 bg-blue-500 text-white text-[24px] font-medium rounded-lg hover:bg-blue-600 text-center transition-all duration-200 w-[48%]"
          aria-label="Submit booking"
        >
          Submit
        </button>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="bg-white rounded-xl p-6 shadow-xl w-full max-w-md animate-fade-in">
            <h3 className="text-[24px] font-bold text-gray-800 mb-4">
              Confirm Booking?
            </h3>
            <p className="text-[16px] font-normal text-gray-700 mb-6">
              Please confirm your booking details. A confirmation email will be
              sent within 24 hours.
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => setShowModal(false)}
                className="p-2 bg-gray-200 text-black text-[18px] font-medium rounded-lg hover:bg-gray-300 transition-all duration-200 w-[48%]"
                aria-label="Cancel confirmation"
              >
                Cancel
              </button>
              <button
                onClick={confirmBooking}
                className="p-2 bg-blue-500 text-white text-[18px] font-medium rounded-lg hover:bg-blue-600 transition-all duration-200 w-[48%]"
                aria-label="Confirm booking"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;
