import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import About from "./components/About";
import Booking from "./components/Booking";
import ContactUs from "./components/ContactUs";
import ErrorBoundary from "./components/ErrorBoundary";
import Footer from "./components/Footer";
import Homepage from "./components/Homepage";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import NotFound from "./components/NotFound";
import PackageDetails from "./components/PackageDetails";
import PackageList from "./components/PackageList";
import Profile from "./components/Profile";
import SignUp from "./components/SignUp";
import { AuthProvider } from "./contexts/AuthContext";
import ScrollToTop from "./utils/ScrollToTop";

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-grow pt-[80px]">
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/packages" element={<PackageList />} />
                <Route path="/packages/:id" element={<PackageDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ErrorBoundary>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
