import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Loader, Toast } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import API_BASE_URL from "../services/api";

function Analyzer({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const { token, logout } = useAuth();

  const [results, setResults] = useState([]);
  const [reviewText, setReviewText] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState("All");
  const [themeFilter, setThemeFilter] = useState("All");

  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [fetchingReviews, setFetchingReviews] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState("success");

  const showToast = useCallback((message, type = "success") => {
    setToast(message);
    setToastType(type);
  }, []);

  const handleUnauthorized = useCallback(() => {
    logout();
    navigate("/login", { replace: true });
  }, [logout, navigate]);


  const fetchReviews = useCallback(async () => {
    if (!token) {
      return;
    }

    try {
      setFetchingReviews(true);

      const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch reviews");
      }

      const reviewList = Array.isArray(data)
        ? data
        : Array.isArray(data.reviews)
          ? data.reviews
          : Array.isArray(data.data)
            ? data.data
            : [];

      setResults(reviewList);
    } catch (error) {
      showToast(
        error.message || "Backend connection failed",
        "error"
      );
    } finally {
      setFetchingReviews(false);
    }
  }, [token, handleUnauthorized, showToast]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleAnalyze = async () => {
    const trimmedReview = reviewText.trim();

    if (!trimmedReview) {
      showToast("Please enter a review first", "error");
      return;
    }

    if (!token) {
      handleUnauthorized();
      return;
    }

    try {
      setAnalyzing(true);

      const aiResponse = await fetch(
        `${API_BASE_URL}/ai/analyze`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            review: trimmedReview,
          }),
        }
      );

      let aiData = {};

      try {
        aiData = await aiResponse.json();
      } catch {
        aiData = {};
      }

      if (aiResponse.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!aiResponse.ok) {
        throw new Error(
          aiData.message ||
          "Gemini could not analyze the review"
        );
      }

      const analysis = aiData.data;
      const confidence = Number(analysis?.confidence);

      if (
        !analysis?.sentiment ||
        !analysis?.theme ||
        !analysis?.response ||
        !Number.isFinite(confidence)
      ) {
        console.log("Gemini analysis received:", analysis);

        throw new Error(
          "Gemini returned an incomplete analysis or missing confidence score"
        );
      }

      const saveResponse = await fetch(
        `${API_BASE_URL}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            review: trimmedReview,
            sentiment: analysis.sentiment,
            theme: analysis.theme,
            confidence: Math.round(confidence),
            response: analysis.response,
          }),
        }
      );

      let saveData = {};

      try {
        saveData = await saveResponse.json();
      } catch {
        saveData = {};
      }

      if (saveResponse.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!saveResponse.ok) {
        throw new Error(
          saveData.message ||
          "The AI analysis was generated but could not be saved"
        );
      }

      setReviewText("");

      const confidenceText = ` with ${Math.round(
        confidence
      )}% confidence`;

      showToast(
        `Gemini analyzed the review as ${analysis.sentiment}${confidenceText}`,
        "success"
      );

      await fetchReviews();
    } catch (error) {
      showToast(
        error.message ||
        "Something went wrong while analyzing the review",
        "error"
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDeleteReview = async () => {
    const reviewId =
      reviewToDelete?._id || reviewToDelete?.id;

    if (!reviewId) {
      showToast("Review ID is missing", "error");
      setReviewToDelete(null);
      return;
    }

    if (!token) {
      handleUnauthorized();
      return;
    }

    try {
      setDeleting(true);

      const response = await fetch(
        `${API_BASE_URL}/reviews/${reviewId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete review"
        );
      }

      setResults((currentResults) =>
        currentResults.filter(
          (item) => (item._id || item.id) !== reviewId
        )
      );

      setReviewToDelete(null);
      showToast("Review deleted successfully", "success");
    } catch (error) {
      showToast(
        error.message || "Unable to delete review",
        "error"
      );
    } finally {
      setDeleting(false);
    }
  };

  const availableThemes = useMemo(() => {
    const themes = results
      .map((item) => item.theme?.trim())
      .filter(Boolean);

    return ["All", ...new Set(themes)];
  }, [results]);

  const filteredResults = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase();

    return results.filter((item) => {
      const review = String(item.review || "").toLowerCase();
      const response = String(
        item.response || ""
      ).toLowerCase();

      const sentiment =
        String(item.sentiment || "").trim() || "Neutral";

      const theme =
        String(item.theme || "").trim() || "Experience";

      const matchesSearch =
        !normalizedSearch ||
        review.includes(normalizedSearch) ||
        response.includes(normalizedSearch) ||
        sentiment
          .toLowerCase()
          .includes(normalizedSearch) ||
        theme.toLowerCase().includes(normalizedSearch);

      const matchesSentiment =
        sentimentFilter === "All" ||
        sentiment.toLowerCase() ===
        sentimentFilter.toLowerCase();

      const matchesTheme =
        themeFilter === "All" ||
        theme.toLowerCase() === themeFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesSentiment &&
        matchesTheme
      );
    });
  }, [
    results,
    searchTerm,
    sentimentFilter,
    themeFilter,
  ]);

  const clearFilters = () => {
    setSearchTerm("");
    setSentimentFilter("All");
    setThemeFilter("All");
  };

  const filtersActive =
    searchTerm.trim() !== "" ||
    sentimentFilter !== "All" ||
    themeFilter !== "All";

  const getSentimentBadge = (sentiment = "") => {
    switch (sentiment.toLowerCase()) {
      case "positive":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300";

      case "negative":
        return "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300";

      default:
        return "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300";
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {toast && (
        <Toast
          message={toast}
          type={toastType}
          onClose={() => setToast("")}
        />
      )}

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <section className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            GuestInsight AI
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Review Sentiment Analyzer
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">
            Enter guest feedback to detect sentiment,
            identify its main theme, and generate a suitable
            management response.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-300">
            <span aria-hidden="true">✦</span>
            Powered by Google Gemini AI
          </div>
        </section>

        <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <label
                htmlFor="review"
                className="text-lg font-bold"
              >
                Guest Review
              </label>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Paste a single guest review below.
              </p>
            </div>

            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Maximum 1000 characters
            </span>
          </div>

          <textarea
            id="review"
            rows={8}
            value={reviewText}
            onChange={(event) =>
              setReviewText(event.target.value)
            }
            placeholder="Example: The room was clean, the host was friendly and the food was excellent."
            maxLength={1000}
            className="mt-5 w-full resize-none rounded-xl border border-slate-300 bg-white p-4 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:placeholder:text-slate-500"
          />

          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p
              className={`text-sm ${reviewText.length >= 900
                ? "font-semibold text-amber-600 dark:text-amber-400"
                : "text-slate-500 dark:text-slate-400"
                }`}
            >
              {reviewText.length}/1000 characters
            </p>

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={analyzing || !reviewText.trim()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {analyzing ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Gemini AI is analyzing...
                </>
              ) : (
                <>
                  <span className="text-lg">✦</span>
                  Analyze Review
                </>
              )}
            </button>
          </div>
        </section>

        <section>
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                Review History
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Search and filter all reviews stored in your
                database.
              </p>
            </div>

            <span className="w-fit rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {filteredResults.length} of {results.length}{" "}
              reviews
            </span>
          </div>

          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="grid gap-4 lg:grid-cols-[1fr_190px_190px_auto]">
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  🔍
                </span>

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                  placeholder="Search reviews, themes or responses..."
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950"
                />
              </div>

              <select
                value={sentimentFilter}
                onChange={(event) =>
                  setSentimentFilter(event.target.value)
                }
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950"
              >
                <option value="All">All Sentiments</option>
                <option value="Positive">Positive</option>
                <option value="Neutral">Neutral</option>
                <option value="Negative">Negative</option>
              </select>

              <select
                value={themeFilter}
                onChange={(event) =>
                  setThemeFilter(event.target.value)
                }
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950"
              >
                {availableThemes.map((theme) => (
                  <option key={theme} value={theme}>
                    {theme === "All"
                      ? "All Themes"
                      : theme}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={clearFilters}
                disabled={!filtersActive}
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:border-red-500/40 dark:hover:bg-red-500/10 dark:hover:text-red-300"
              >
                Clear
              </button>
            </div>
          </div>

          {fetchingReviews && results.length === 0 ? (
            <div className="flex justify-center rounded-2xl border border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-900">
              <Loader />
            </div>
          ) : results.length === 0 ? (
            <EmptyState
              title="No reviews available"
              message="Enter your first guest review above and click Analyze Review."
            />
          ) : filteredResults.length === 0 ? (
            <EmptyState
              title="No matching reviews"
              message="Try changing your search text or selected filters."
              showClearButton
              onClear={clearFilters}
            />
          ) : (
            <>
              <div className="grid gap-5 md:hidden">
                {filteredResults.map((item) => (
                  <article
                    key={item._id || item.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getSentimentBadge(
                            item.sentiment
                          )}`}
                        >
                          {item.sentiment || "Neutral"}
                        </span>

                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {item.theme || "Experience"}
                        </span>
                      </div>

                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                        {Number.isFinite(Number(item.confidence))
                          ? `${Math.round(Number(item.confidence))}% Confidence`
                          : "N/A Confidence"}
                      </span>
                    </div>

                    <div className="mt-5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Guest Review
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
                        {item.review}
                      </p>
                    </div>

                    <div className="mt-5 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Suggested Response
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {item.response}
                      </p>
                    </div>

                    <div className="mt-5 flex justify-end">
                      <button
                        type="button"
                        onClick={() =>
                          setReviewToDelete(item)
                        }
                        className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-500/30 dark:text-red-300 dark:hover:bg-red-500/10"
                      >
                        <DeleteIcon />
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 md:block">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1050px] text-left">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
                      <tr>
                        <th className="px-6 py-4">
                          Review
                        </th>

                        <th className="px-6 py-4">
                          Sentiment
                        </th>

                        <th className="px-6 py-4">
                          Theme
                        </th>

                        <th className="px-6 py-4">
                          Confidence
                        </th>

                        <th className="px-6 py-4">
                          Suggested Response
                        </th>

                        <th className="px-6 py-4 text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {filteredResults.map((item) => (
                        <tr
                          key={item._id || item.id}
                          className="transition hover:bg-slate-50 dark:hover:bg-slate-800/40"
                        >
                          <td className="max-w-sm px-6 py-5 text-sm leading-6 text-slate-700 dark:text-slate-200">
                            {item.review}
                          </td>

                          <td className="px-6 py-5">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getSentimentBadge(
                                item.sentiment
                              )}`}
                            >
                              {item.sentiment || "Neutral"}
                            </span>
                          </td>

                          <td className="px-6 py-5">
                            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                              {item.theme || "Experience"}
                            </span>
                          </td>

                          <td className="px-6 py-5">
                            <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                              {Number.isFinite(Number(item.confidence))
                                ? `${Math.round(Number(item.confidence))}%`
                                : "N/A"}
                            </span>
                          </td>

                          <td className="max-w-md px-6 py-5 text-sm leading-6 text-slate-600 dark:text-slate-300">
                            {item.response}
                          </td>

                          <td className="px-6 py-5 text-right">
                            <button
                              type="button"
                              onClick={() =>
                                setReviewToDelete(item)
                              }
                              className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-500/30 dark:text-red-300 dark:hover:bg-red-500/10"
                            >
                              <DeleteIcon />
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </section>
      </main>

      {reviewToDelete && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm"
          onClick={() => {
            if (!deleting) {
              setReviewToDelete(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-review-title"
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-300">
                <DeleteIcon className="h-6 w-6" />
              </div>

              <div>
                <h2
                  id="delete-review-title"
                  className="text-xl font-bold text-slate-900 dark:text-white"
                >
                  Delete this review?
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  This review will be permanently removed from
                  your database. This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
              <p className="line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {reviewToDelete.review ||
                  "Review text unavailable"}
              </p>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setReviewToDelete(null)}
                disabled={deleting}
                className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteReview}
                disabled={deleting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Deleting...
                  </>
                ) : (
                  "Delete Review"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

function DeleteIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
    </svg>
  );
}

function EmptyState({
  title,
  message,
  showClearButton = false,
  onClear,
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-2xl text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300">
        ◫
      </div>

      <h3 className="mt-4 text-xl font-bold">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
        {message}
      </p>

      {showClearButton && (
        <button
          type="button"
          onClick={onClear}
          className="mt-5 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}

export default Analyzer;