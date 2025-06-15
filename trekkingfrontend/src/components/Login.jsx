import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/login/",
        formData
      );
      // Store token or handle successful login (e.g., save to localStorage)
      localStorage.setItem("token", response.data.token);
      alert("Login successful!");
      navigate("/packages"); // Redirect to packages page after login
    } catch (err) {
      setError("Login failed. Please check your email or password.");
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="p-2 border rounded w-full"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="p-2 border rounded w-full"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded w-full"
        >
          Login
        </button>
      </form>
      <p className="mt-4 text-center">
        Forgot your password?{" "}
        <a href="/forgot-password" className="text-blue-500">
          Reset it here
        </a>
      </p>
      <p className="mt-2 text-center">
        Don't have an account?{" "}
        <a href="/signup" className="text-blue-500">
          Sign Up
        </a>
      </p>
    </div>
  );
};

export default Login;
