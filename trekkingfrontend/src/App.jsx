import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import About from "./pages/About";
import ContactUs from "./pages/ContactUs";
import ErrorBoundary from "./pages/ErrorBoundary";
import Footer from "./pages/Footer";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Navbar from "./pages/Navbar";
import PackageDetails from "./pages/PackageDetails";
import PackageList from "./pages/PackageList";
import SignUp from "./pages/SignUp";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow pt-[80px] ">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/packages" element={<PackageList />} />
              <Route path="/packages/:id" element={<PackageDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/search" element={<div>Search</div>} />
            </Routes>
          </ErrorBoundary>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
