import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Loader, Toast } from "../components/ui";

function Analyzer({ darkMode, setDarkMode }) {
  const [results, setResults] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  const fetchReviews = async () => {
    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/reviews");

      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }

      const data = await response.json();
      setResults(data.data);
    } catch (error) {
      setToast("Backend connection failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleAnalyze = async () => {
    if (!reviewText.trim()) {
      setToast("Please enter a review first");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          review: reviewText,
          sentiment: "Positive",
          theme: "Experience",
          response: "Thank you for sharing your valuable feedback.",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add review");
      }

      setReviewText("");
      setToast("Review added successfully");
      fetchReviews();
    } catch (error) {
      setToast("Something went wrong while analyzing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen text-gray-900 dark:text-white">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      {toast && (
        <Toast
          message={toast}
          type="success"
          onClose={() => setToast("")}
        />
      )}

      <div className="max-w-7xl mx-auto px-8 py-28">
        <h1 className="text-5xl font-bold mb-4">
          Review Sentiment Analyzer
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-10">
          Frontend is now connected to the Express backend using live REST API calls.
        </p>

        <div className="bg-gray-100 dark:bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-12 shadow-xl border border-gray-200 dark:border-white/20">
          <textarea
            rows="8"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Paste reviews here..."
            className="w-full p-5 rounded-xl bg-white dark:bg-black/30 border border-gray-300 dark:border-white/20 outline-none focus:ring-2 focus:ring-green-500"
          />

          <button
            onClick={handleAnalyze}
            className="mt-6 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold transition duration-300"
          >
            Analyze Reviews
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader />
          </div>
        ) : (
          <div className="overflow-x-auto bg-gray-100 dark:bg-white/10 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-white/20">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-300 dark:border-white/20 text-green-600">
                  <th className="p-4">Review</th>
                  <th className="p-4">Sentiment</th>
                  <th className="p-4">Theme</th>
                  <th className="p-4">Suggested Response</th>
                </tr>
              </thead>

              <tbody>
                {results.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-200 dark:border-white/10"
                  >
                    <td className="p-4">{item.review}</td>

                    <td
                      className={`p-4 font-semibold ${
                        item.sentiment === "Positive"
                          ? "text-green-600"
                          : item.sentiment === "Negative"
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
      </div>

      <Footer />
    </div>
  );
}

export default Analyzer;