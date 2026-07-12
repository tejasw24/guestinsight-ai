import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Loader, Toast } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import API_BASE_URL from "../services/api";

function Analyzer({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const { token, logout } = useAuth();

  const [results, setResults] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState("success");

  const showToast = (message, type = "success") => {
    setToast(message);
    setToastType(type);
  };

  const handleUnauthorized = useCallback(() => {
    logout();
    navigate("/login");
  }, [logout, navigate]);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch reviews");
      }

      const reviewList = Array.isArray(data)
        ? data
        : Array.isArray(data.data)
          ? data.data
          : [];

      setResults(reviewList);
    } catch (error) {
      showToast(error.message || "Backend connection failed", "error");
    } finally {
      setLoading(false);
    }
  }, [token, handleUnauthorized]);

  useEffect(() => {
    if (token) {
      fetchReviews();
    }
  }, [token, fetchReviews]);

  const handleAnalyze = async () => {
    if (!reviewText.trim()) {
      showToast("Please enter a review first", "error");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          review: reviewText.trim(),
          sentiment: "Positive",
          theme: "Experience",
          response: "Thank you for sharing your valuable feedback.",
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to add review");
      }

      setReviewText("");
      showToast("Review added successfully", "success");

      await fetchReviews();
    } catch (error) {
      showToast(
        error.message || "Something went wrong while analyzing",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-white">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      {toast && (
        <Toast
          message={toast}
          type={toastType}
          onClose={() => setToast("")}
        />
      )}

      <main className="mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8">
        <h1 className="mb-4 text-4xl font-bold sm:text-5xl">
          Review Sentiment Analyzer
        </h1>

        <p className="mb-10 text-gray-600 dark:text-gray-400">
          Analyze guest feedback and store the result securely in your review
          history.
        </p>

        <section className="mb-12 rounded-2xl border border-gray-200 bg-gray-100 p-6 shadow-xl dark:border-white/20 dark:bg-white/10 sm:p-8">
          <label
            htmlFor="review"
            className="mb-3 block text-lg font-semibold"
          >
            Guest review
          </label>

          <textarea
            id="review"
            rows="8"
            value={reviewText}
            onChange={(event) => setReviewText(event.target.value)}
            placeholder="Enter a guest review here..."
            maxLength={1000}
            className="w-full rounded-xl border border-gray-300 bg-white p-5 outline-none focus:ring-2 focus:ring-green-500 dark:border-white/20 dark:bg-black/30"
          />

          <div className="mt-2 text-right text-sm text-gray-500">
            {reviewText.length}/1000
          </div>

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={loading}
            className="mt-4 rounded-xl bg-green-600 px-8 py-4 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Analyzing..." : "Analyze Review"}
          </button>
        </section>

        {loading && results.length === 0 ? (
          <div className="flex justify-center py-10">
            <Loader />
          </div>
        ) : results.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-gray-100 p-10 text-center shadow-xl dark:border-white/20 dark:bg-white/10">
            <h2 className="mb-2 text-2xl font-semibold">
              No reviews available
            </h2>

            <p className="text-gray-600 dark:text-gray-400">
              Enter your first guest review above and click Analyze Review.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-gray-100 p-4 shadow-xl dark:border-white/20 dark:bg-white/10 sm:p-6">
            <table className="w-full min-w-[800px] border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-300 text-green-600 dark:border-white/20">
                  <th className="p-4">Review</th>
                  <th className="p-4">Sentiment</th>
                  <th className="p-4">Theme</th>
                  <th className="p-4">Suggested Response</th>
                </tr>
              </thead>

              <tbody>
                {results.map((item) => (
                  <tr
                    key={item._id || item.id}
                    className="border-b border-gray-200 dark:border-white/10"
                  >
                    <td className="p-4">{item.review}</td>

                    <td
                      className={`p-4 font-semibold ${
                        item.sentiment?.toLowerCase() === "positive"
                          ? "text-green-600"
                          : item.sentiment?.toLowerCase() === "negative"
                            ? "text-red-500"
                            : "text-yellow-500"
                      }`}
                    >
                      {item.sentiment}
                    </td>

                    <td className="p-4">{item.theme}</td>

                    <td className="p-4">{item.response}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Analyzer;