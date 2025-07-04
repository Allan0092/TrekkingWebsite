import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import About from "./components/About";
import ErrorBoundary from "./components/ErrorBoundary";
import Footer from "./components/Footer";
import Homepage from "./components/Homepage";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import PackageDetails from "./components/PackageDetails";
import PackageList from "./components/PackageList";
import SignUp from "./components/SignUp";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow pt-[80px] bg-amber-700">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/packages" element={<PackageList />} />
              <Route path="/packages/:id" element={<PackageDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<div>Contact Us</div>} />
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
