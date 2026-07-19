import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Tooltip,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import API_BASE_URL from "../services/api";

ChartJS.register(
    ArcElement,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
);

function Dashboard({ darkMode, setDarkMode }) {
    const navigate = useNavigate();
    const { token, user, logout } = useAuth();

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const handleUnauthorized = useCallback(() => {
        logout();
        navigate("/login", { replace: true });
    }, [logout, navigate]);

    const fetchReviews = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

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
                throw new Error(data.message || "Failed to fetch dashboard data");
            }

            const reviewList = Array.isArray(data)
                ? data
                : Array.isArray(data.reviews)
                    ? data.reviews
                    : Array.isArray(data.data)
                        ? data.data
                        : [];

            setReviews(reviewList);
        } catch (err) {
            setError(err.message || "Unable to connect to the backend");
        } finally {
            setLoading(false);
        }
    }, [token, handleUnauthorized]);

    useEffect(() => {
        if (token) {
            fetchReviews();
        }
    }, [token, fetchReviews]);

    const analytics = useMemo(() => {
        const sentimentCounts = {
            Positive: 0,
            Neutral: 0,
            Negative: 0,
        };

        const themeCounts = {};

        reviews.forEach((review) => {
            const normalizedSentiment =
                review.sentiment?.trim().toLowerCase() || "neutral";

            if (normalizedSentiment === "positive") {
                sentimentCounts.Positive += 1;
            } else if (normalizedSentiment === "negative") {
                sentimentCounts.Negative += 1;
            } else {
                sentimentCounts.Neutral += 1;
            }

            const theme = review.theme?.trim() || "Experience";
            themeCounts[theme] = (themeCounts[theme] || 0) + 1;
        });

        const total = reviews.length;

        const positivePercentage =
            total > 0
                ? Math.round((sentimentCounts.Positive / total) * 100)
                : 0;

        const mostCommonTheme =
            Object.entries(themeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
            "No data";

        let satisfactionStatus = "No review data";

        if (total > 0) {
            if (positivePercentage >= 80) {
                satisfactionStatus = "Excellent";
            } else if (positivePercentage >= 60) {
                satisfactionStatus = "Good";
            } else if (positivePercentage >= 40) {
                satisfactionStatus = "Average";
            } else {
                satisfactionStatus = "Needs improvement";
            }
        }

        return {
            total,
            sentimentCounts,
            themeCounts,
            positivePercentage,
            mostCommonTheme,
            satisfactionStatus,
        };
    }, [reviews]);

    const sentimentChartData = {
        labels: ["Positive", "Neutral", "Negative"],
        datasets: [
            {
                label: "Reviews",
                data: [
                    analytics.sentimentCounts.Positive,
                    analytics.sentimentCounts.Neutral,
                    analytics.sentimentCounts.Negative,
                ],
                backgroundColor: [
                    "rgba(16, 185, 129, 0.85)",
                    "rgba(245, 158, 11, 0.85)",
                    "rgba(239, 68, 68, 0.85)",
                ],
                borderColor: [
                    "rgba(16, 185, 129, 1)",
                    "rgba(245, 158, 11, 1)",
                    "rgba(239, 68, 68, 1)",
                ],
                borderWidth: 1,
            },
        ],
    };

    const themeEntries = Object.entries(analytics.themeCounts).sort(
        (a, b) => b[1] - a[1]
    );

    const themeChartData = {
        labels: themeEntries.map(([theme]) => theme),
        datasets: [
            {
                label: "Number of reviews",
                data: themeEntries.map(([, count]) => count),
                backgroundColor: "rgba(59, 130, 246, 0.8)",
                borderColor: "rgba(59, 130, 246, 1)",
                borderWidth: 1,
                borderRadius: 8,
            },
        ],
    };

    const commonChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: darkMode ? "#cbd5e1" : "#475569",
                    usePointStyle: true,
                    padding: 18,
                },
            },
            tooltip: {
                displayColors: true,
            },
        },
    };

    const barChartOptions = {
        ...commonChartOptions,
        scales: {
            x: {
                ticks: {
                    color: darkMode ? "#cbd5e1" : "#475569",
                },
                grid: {
                    display: false,
                },
            },
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0,
                    color: darkMode ? "#cbd5e1" : "#475569",
                },
                grid: {
                    color: darkMode
                        ? "rgba(148, 163, 184, 0.12)"
                        : "rgba(148, 163, 184, 0.2)",
                },
            },
        },
    };

    const recentReviews = [...reviews]
        .sort((a, b) => {
            const dateA = new Date(a.createdAt || 0);
            const dateB = new Date(b.createdAt || 0);
            return dateB - dateA;
        })
        .slice(0, 5);

    const getSentimentBadge = (sentiment = "") => {
        const value = sentiment.toLowerCase();

        if (value === "positive") {
            return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300";
        }

        if (value === "negative") {
            return "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300";
        }

        return "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300";
    };

    const formatDate = (date) => {
        if (!date) {
            return "Recently added";
        }

        return new Intl.DateTimeFormat("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }).format(new Date(date));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
                <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

                <main className="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
                    <DashboardSkeleton />
                </main>

                <Footer />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

            <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-16 pt-28 sm:px-6 lg:px-8">
                <section className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                            Analytics Dashboard
                        </p>

                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                            Welcome back, {user?.name || "User"} 👋
                        </h1>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base dark:text-slate-400">
                            Track guest sentiment, identify common themes and review recent
                            feedback from one place.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate("/analyzer")}
                        className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/20"
                    >
                        <span className="text-xl">＋</span>
                        Analyze New Review
                    </button>
                </section>

                {error && (
                    <section className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <p>{error}</p>

                            <button
                                type="button"
                                onClick={fetchReviews}
                                className="w-fit rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                            >
                                Try Again
                            </button>
                        </div>
                    </section>
                )}

                <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        title="Total Reviews"
                        value={analytics.total}
                        description="All analyzed feedback"
                        type="total"
                    />

                    <StatCard
                        title="Positive"
                        value={analytics.sentimentCounts.Positive}
                        description={`${analytics.positivePercentage}% of all reviews`}
                        type="positive"
                    />

                    <StatCard
                        title="Neutral"
                        value={analytics.sentimentCounts.Neutral}
                        description="Balanced guest feedback"
                        type="neutral"
                    />

                    <StatCard
                        title="Negative"
                        value={analytics.sentimentCounts.Negative}
                        description="Reviews needing attention"
                        type="negative"
                    />
                </section>

                <section className="mt-8 grid gap-6 xl:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 xl:col-span-1 dark:border-slate-800 dark:bg-slate-900">
                        <div className="mb-5">
                            <h2 className="text-xl font-bold">Sentiment Distribution</h2>

                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Overall distribution of guest sentiment.
                            </p>
                        </div>

                        {analytics.total > 0 ? (
                            <div className="h-72">
                                <Doughnut
                                    data={sentimentChartData}
                                    options={{
                                        ...commonChartOptions,
                                        cutout: "68%",
                                    }}
                                />
                            </div>
                        ) : (
                            <ChartEmptyState message="Analyze reviews to view sentiment distribution." />
                        )}
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 xl:col-span-2 dark:border-slate-800 dark:bg-slate-900">
                        <div className="mb-5">
                            <h2 className="text-xl font-bold">Theme Distribution</h2>

                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Topics most frequently mentioned by guests.
                            </p>
                        </div>

                        {themeEntries.length > 0 ? (
                            <div className="h-72">
                                <Bar data={themeChartData} options={barChartOptions} />
                            </div>
                        ) : (
                            <ChartEmptyState message="Theme analytics will appear after reviews are added." />
                        )}
                    </div>
                </section>

                <section className="mt-8 grid gap-6 lg:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:col-span-2 dark:border-slate-800 dark:bg-slate-900">
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold">Recent Reviews</h2>

                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    Latest guest feedback stored in your database.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => navigate("/analyzer")}
                                className="text-sm font-semibold text-emerald-600 transition hover:text-emerald-700 dark:text-emerald-400"
                            >
                                View all
                            </button>
                        </div>

                        {recentReviews.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-slate-300 px-5 py-12 text-center dark:border-slate-700">
                                <p className="font-semibold">No reviews yet</p>

                                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                    Analyze your first guest review to populate the dashboard.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentReviews.map((review) => (
                                    <article
                                        key={review._id || review.id}
                                        className="rounded-xl border border-slate-200 p-4 transition hover:border-emerald-300 hover:bg-slate-50 dark:border-slate-800 dark:hover:border-emerald-500/30 dark:hover:bg-slate-800/50"
                                    >
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="min-w-0 flex-1">
                                                <p className="line-clamp-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
                                                    {review.review || "Review text unavailable"}
                                                </p>

                                                <div className="mt-3 flex flex-wrap items-center gap-2">
                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getSentimentBadge(
                                                            review.sentiment
                                                        )}`}
                                                    >
                                                        {review.sentiment || "Neutral"}
                                                    </span>

                                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                                        {review.theme || "Experience"}
                                                    </span>
                                                </div>
                                            </div>

                                            <time className="shrink-0 text-xs font-medium text-slate-400">
                                                {formatDate(review.createdAt)}
                                            </time>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <InsightCard
                            title="Overall Satisfaction"
                            value={`${analytics.positivePercentage}%`}
                            description={analytics.satisfactionStatus}
                            icon="★"
                        />

                        <InsightCard
                            title="Most Common Theme"
                            value={analytics.mostCommonTheme}
                            description={
                                analytics.total > 0
                                    ? "Most discussed guest experience area"
                                    : "Waiting for review data"
                            }
                            icon="⌁"
                        />

                        <InsightCard
                            title="Review Health"
                            value={
                                analytics.sentimentCounts.Negative === 0 &&
                                    analytics.total > 0
                                    ? "Healthy"
                                    : analytics.sentimentCounts.Negative > 0
                                        ? "Needs attention"
                                        : "No data"
                            }
                            description={
                                analytics.sentimentCounts.Negative > 0
                                    ? `${analytics.sentimentCounts.Negative} negative review${analytics.sentimentCounts.Negative === 1 ? "" : "s"
                                    } found`
                                    : "No negative feedback detected"
                            }
                            icon="✓"
                        />
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

function StatCard({ title, value, description, type }) {
    const styles = {
        total: {
            container:
                "border-blue-200 bg-blue-50 dark:border-blue-500/20 dark:bg-blue-500/10",
            icon: "bg-blue-600 text-white",
            value: "text-blue-700 dark:text-blue-300",
            symbol: "▦",
        },
        positive: {
            container:
                "border-emerald-200 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10",
            icon: "bg-emerald-600 text-white",
            value: "text-emerald-700 dark:text-emerald-300",
            symbol: "↑",
        },
        neutral: {
            container:
                "border-amber-200 bg-amber-50 dark:border-amber-500/20 dark:bg-amber-500/10",
            icon: "bg-amber-500 text-white",
            value: "text-amber-700 dark:text-amber-300",
            symbol: "−",
        },
        negative: {
            container:
                "border-red-200 bg-red-50 dark:border-red-500/20 dark:bg-red-500/10",
            icon: "bg-red-600 text-white",
            value: "text-red-700 dark:text-red-300",
            symbol: "↓",
        },
    };

    const selectedStyle = styles[type] || styles.total;

    return (
        <article
            className={`rounded-2xl border p-5 shadow-sm ${selectedStyle.container}`}
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                        {title}
                    </p>

                    <p
                        className={`mt-3 text-3xl font-bold ${selectedStyle.value}`}
                    >
                        {value}
                    </p>

                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                        {description}
                    </p>
                </div>

                <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl font-bold ${selectedStyle.icon}`}
                >
                    {selectedStyle.symbol}
                </div>
            </div>
        </article>
    );
}

function InsightCard({ title, value, description, icon }) {
    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-xl font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                    {icon}
                </div>

                <div>
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                        {title}
                    </p>

                    <p className="mt-1 break-words text-2xl font-bold">
                        {value}
                    </p>

                    <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                        {description}
                    </p>
                </div>
            </div>
        </article>
    );
}

function ChartEmptyState({ message }) {
    return (
        <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-slate-300 px-6 text-center dark:border-slate-700">
            <div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-xl dark:bg-slate-800">
                    ◫
                </div>

                <p className="mt-3 max-w-xs text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {message}
                </p>
            </div>
        </div>
    );
}

function DashboardSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="h-4 w-40 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="mt-4 h-10 w-72 max-w-full rounded bg-slate-200 dark:bg-slate-800" />
            <div className="mt-4 h-4 w-full max-w-xl rounded bg-slate-200 dark:bg-slate-800" />

            <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {[1, 2, 3, 4].map((item) => (
                    <div
                        key={item}
                        className="h-36 rounded-2xl bg-slate-200 dark:bg-slate-800"
                    />
                ))}
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-3">
                <div className="h-96 rounded-2xl bg-slate-200 dark:bg-slate-800" />
                <div className="h-96 rounded-2xl bg-slate-200 xl:col-span-2 dark:bg-slate-800" />
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
                <div className="h-96 rounded-2xl bg-slate-200 lg:col-span-2 dark:bg-slate-800" />
                <div className="space-y-6">
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="h-28 rounded-2xl bg-slate-200 dark:bg-slate-800"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;