import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Heart, Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout, loading } = useAuth();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Treks", href: "/packages" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    alert("Logged out successfully!");
  };

  if (loading) {
    return null;
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-neutral-200/50 opacity-90"
          : "bg-white/90"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <img
                  src="/logo.png"
                  alt="Trekking Website Logo"
                  className="h-12 rounded-4xl"
                />
                <div className="absolute inset-0 bg-primary-400 rounded-full blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-1">
            {navigation.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link
                  to={item.href}
                  className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 group ${
                    isActive(item.href)
                      ? isScrolled
                        ? "text-primary-600 bg-primary-50"
                        : "text-accent-700 bg-white/10"
                      : isScrolled
                      ? "text-neutral-700 hover:text-primary-600 hover:bg-neutral-50"
                      : "text-neutral-950 hover:text-primary-900 hover:bg-white/10"
                  }`}
                >
                  {item.name}
                  <motion.div
                    className={`absolute bottom-0 left-1/2 h-0.5 bg-current transform -translate-x-1/2 ${
                      isActive(item.href) ? "w-6" : "w-0 group-hover:w-6"
                    }`}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Right Section */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link to="/packages">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-full transition-colors duration-300 ${
                  isScrolled
                    ? "text-neutral-600 hover:text-primary-600 hover:bg-primary-50"
                    : "text-neutral-900 hover:text-primary-600 hover:bg-white/10"
                }`}
              >
                <Search className="w-5 h-5" />
              </motion.button>
            </Link>

            {user ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg transition-colors duration-300 hover:bg-white/10"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isScrolled ? "text-neutral-600" : "text-neutral-900"
                    }`}
                  />
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user.full_name
                        ? user.full_name.charAt(0).toUpperCase()
                        : user.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      isUserMenuOpen ? "rotate-180" : ""
                    } ${isScrolled ? "text-neutral-600" : "text-neutral-900"}`}
                  />
                </motion.button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-neutral-200 overflow-hidden"
                    >
                      <div className="py-2">
                        <div className="px-4 py-2 border-b border-neutral-100">
                          <p className="text-sm font-medium text-neutral-900">
                            {user.full_name || user.email}
                          </p>
                          {user.full_name && (
                            <p className="text-xs text-neutral-500">
                              {user.email}
                            </p>
                          )}
                        </div>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          My Profile
                        </Link>
                        <Link
                          to="/bookings"
                          className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          My Bookings
                        </Link>
                        {user.is_staff && (
                          <Link
                            to="/admin"
                            className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Admin Panel
                          </Link>
                        )}
                        <hr className="my-2" />
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                        >
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/login"
                    className="bg-gradient-to-r from-neutral-600 to-neutral-700 text-white px-6 py-2 rounded-lg hover:from-neutral-700 hover:to-neutral-800 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/signup"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors duration-300 ${
              isScrolled
                ? "text-neutral-600 hover:text-primary-600 hover:bg-primary-50"
                : "text-neutral-950 hover:text-white hover:bg-white/90"
            }`}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-neutral-200/50 bg-white/95 backdrop-blur-md"
            >
              <div className="py-4 space-y-2">
                {navigation.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link
                      to={item.href}
                      className={`block px-4 py-3 rounded-lg font-medium transition-colors duration-300 ${
                        isActive(item.href)
                          ? "text-primary-600 bg-primary-50"
                          : "text-neutral-700 hover:text-primary-600 hover:bg-neutral-50"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}

                <hr className="border-neutral-200 my-4" />

                {user ? (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                    className="space-y-2 px-4"
                  >
                    <p className="font-medium text-neutral-900">
                      {user.full_name || user.email}
                    </p>
                    <Link
                      to="/profile"
                      className="block py-2 text-neutral-700 hover:text-primary-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/bookings"
                      className="block py-2 text-neutral-700 hover:text-primary-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Bookings
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="block py-2 text-neutral-700 hover:text-primary-600 transition-colors"
                    >
                      Sign Out
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                    className="flex flex-col space-y-2 px-4"
                  >
                    <Link
                      to="/login"
                      className="bg-gradient-to-r from-neutral-600 to-neutral-700 text-white px-6 py-2 rounded-lg font-medium shadow-lg text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-medium shadow-lg text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Navbar;
