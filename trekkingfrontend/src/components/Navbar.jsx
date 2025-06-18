import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-[#F6FFFF] text-black p-4 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <NavLink to="/" className="text-xl font-bold">
          <img src="/logo.png" alt="[Company Name] Logo" className="h-8" />
        </NavLink>

        {/* Center Links */}
        <div className="flex space-x-8">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "font-bold hover:text-blue-500" : "hover:text-blue-500"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/packages"
            className={({ isActive }) =>
              isActive ? "font-bold hover:text-blue-500" : "hover:text-blue-500"
            }
          >
            Packages
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "font-bold hover:text-blue-500" : "hover:text-blue-500"
            }
          >
            About Us
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? "font-bold hover:text-blue-500" : "hover:text-blue-500"
            }
          >
            Contact Us
          </NavLink>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          <NavLink to="/search" aria-label="Search">
            <MagnifyingGlassIcon className="h-6 w-6 hover:text-blue-500" />
          </NavLink>
          <NavLink
            to="/login"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Login
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
