import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API_BASE_URL from "../services/api";

function Register({ darkMode, setDarkMode }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setIsError(false);

    if (!formData.name || !formData.email || !formData.password) {
      setMessage("Please fill in all fields.");
      setIsError(true);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setMessage("Registration successful. Redirecting to login...");
      setIsError(false);

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      setMessage(error.message);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-white">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-gray-100 p-8 shadow-xl dark:border-white/20 dark:bg-white/10">
          <h1 className="mb-2 text-center text-4xl font-bold">
            Create Account
          </h1>

          <p className="mb-8 text-center text-gray-600 dark:text-gray-300">
            Register to start using GuestInsight AI
          </p>

          {message && (
            <div
              className={`mb-5 rounded-lg p-3 text-sm ${
                isError
                  ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                  : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
              }`}
            >
              {message}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium"
              >
                Full name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full rounded-lg border border-gray-300 bg-white p-4 outline-none focus:ring-2 focus:ring-green-500 dark:border-white/20 dark:bg-black/30"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium"
              >
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                autoComplete="email"
                className="w-full rounded-lg border border-gray-300 bg-white p-4 outline-none focus:ring-2 focus:ring-green-500 dark:border-white/20 dark:bg-black/30"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                autoComplete="new-password"
                className="w-full rounded-lg border border-gray-300 bg-white p-4 outline-none focus:ring-2 focus:ring-green-500 dark:border-white/20 dark:bg-black/30"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-green-600 py-4 font-semibold text-white transition duration-300 hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-green-600 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Register;