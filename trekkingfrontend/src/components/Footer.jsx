import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Mountain,
  Phone,
  Twitter,
} from "lucide-react";

import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <Mountain className="w-8 h-8 text-primary-400" />
              <span className="font-display font-bold text-xl">
                Himalaya Adventure
              </span>
            </Link>
            <p className="text-neutral-300 text-sm leading-relaxed">
              Your trusted partner for unforgettable Himalayan adventures. We
              specialize in creating life-changing trekking experiences in the
              heart of Nepal.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-neutral-400 hover:text-primary-400 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-neutral-400 hover:text-primary-400 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-neutral-400 hover:text-primary-400 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/packages"
                  className="text-neutral-300 hover:text-primary-400 transition-colors text-sm"
                >
                  All Treks
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-neutral-300 hover:text-primary-400 transition-colors text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-neutral-300 hover:text-primary-400 transition-colors text-sm"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Treks */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Popular Treks</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="http://localhost:5173/packages/4"
                  className="text-neutral-300 hover:text-primary-400 transition-colors text-sm"
                >
                  Everest Three Passes Trek
                </Link>
              </li>
              <li>
                <Link
                  to="http://localhost:5173/packages/1"
                  className="text-neutral-300 hover:text-primary-400 transition-colors text-sm"
                >
                  Annapurna Base Camp
                </Link>
              </li>
              <li>
                <Link
                  to="http://localhost:5173/packages/7"
                  className="text-neutral-300 hover:text-primary-400 transition-colors text-sm"
                >
                  Langtang Valley
                </Link>
              </li>
              <li>
                <Link
                  to="http://localhost:5173/packages/3"
                  className="text-neutral-300 hover:text-primary-400 transition-colors text-sm"
                >
                  Manaslu Circuit
                </Link>
              </li>
              <li>
                <Link
                  to="http://localhost:5173/packages/2"
                  className="text-neutral-300 hover:text-primary-400 transition-colors text-sm"
                >
                  Kanchenjunga Base Camp
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                <div className="text-neutral-300 text-sm">
                  <p>Thamel, Kathmandu</p>
                  <p>Nepal</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <span className="text-neutral-300 text-sm">+977-1-4441234</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <span className="text-neutral-300 text-sm">
                  info@himalayaadventure.com
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-neutral-400 text-sm">
              © 2025 Himalaya Adventures. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                to="/privacy"
                className="text-neutral-400 hover:text-primary-400 transition-colors text-sm"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-neutral-400 hover:text-primary-400 transition-colors text-sm"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
