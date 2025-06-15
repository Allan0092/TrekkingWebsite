import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-[#F6FFFF] text-black p-4 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold">
          <img src="/logo.png" alt="Trekking Website Logo" className="h-12" />
        </Link>

        {/* Center Links */}
        <div className="flex space-x-8">
          <Link to="/" className="hover:text-blue-500">
            Home
          </Link>
          <Link to="/packages" className="hover:text-blue-500">
            Packages
          </Link>
          <Link to="/about" className="hover:text-blue-500">
            About Us
          </Link>
          <Link to="/contact" className="hover:text-blue-500">
            Contact Us
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          <Link to="/search" aria-label="Search">
            <MagnifyingGlassIcon className="h-6 w-6 hover:text-blue-500" />
          </Link>
          <Link
            to="/login"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
