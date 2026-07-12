import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API_BASE_URL from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login({ darkMode, setDarkMode }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    const redirectPath = location.state?.from?.pathname || "/dashboard";

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

        if (!formData.email.trim() || !formData.password) {
            setMessage("Please enter your email and password.");
            setIsError(true);
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email.trim(),
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to sign in.");
            }

            login(data.user, data.token);
            navigate(redirectPath, { replace: true });
        } catch (error) {
            setMessage(error.message || "Unable to connect to the server.");
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${API_BASE_URL}/auth/google`;
    };

    return (
        <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-white">
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

            <main className="flex flex-1 items-center justify-center px-4 pb-12 pt-28 sm:px-6">
                <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-gray-900 lg:grid-cols-2">
                    <section className="hidden bg-gradient-to-br from-green-700 to-emerald-500 p-12 text-white lg:flex lg:flex-col lg:justify-between">
                        <div>
                            <div className="mb-8 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur">
                                GuestInsight AI
                            </div>

                            <h1 className="text-5xl font-bold leading-tight">
                                Understand every guest review.
                            </h1>

                            <p className="mt-6 max-w-md text-lg text-green-50">
                                Analyze sentiment, identify recurring themes, and generate
                                thoughtful responses for your homestay guests.
                            </p>
                        </div>

                        <div className="mt-16 space-y-4 text-sm text-green-50">
                            <p>✓ Secure JWT authentication</p>
                            <p>✓ AI-powered review analysis</p>
                            <p>✓ Persistent review history</p>
                        </div>
                    </section>

                    <section className="p-7 sm:p-10 lg:p-12">
                        <div className="mx-auto max-w-md">
                            <h2 className="text-3xl font-bold sm:text-4xl">
                                Welcome back
                            </h2>

                            <p className="mt-3 text-gray-500 dark:text-gray-400">
                                Sign in to access your GuestInsight AI dashboard.
                            </p>

                            {message && (
                                <div
                                    className={`mt-6 rounded-xl border p-4 text-sm ${isError
                                            ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                                            : "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300"
                                        }`}
                                >
                                    {message}
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3.5 font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-white/20 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                            >
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm font-bold text-blue-600">
                                    G
                                </span>
                                Continue with Google
                            </button>

                            <div className="my-7 flex items-center gap-4">
                                <div className="h-px flex-1 bg-gray-200 dark:bg-white/10" />

                                <span className="text-sm text-gray-400">
                                    or sign in with email
                                </span>

                                <div className="h-px flex-1 bg-gray-200 dark:bg-white/10" />
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-2 block text-sm font-semibold"
                                    >
                                        Email address
                                    </label>

                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="name@example.com"
                                        autoComplete="email"
                                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10 dark:border-white/20 dark:bg-gray-800"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="password"
                                        className="mb-2 block text-sm font-semibold"
                                    >
                                        Password
                                    </label>

                                    <div className="relative">
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Enter your password"
                                            autoComplete="current-password"
                                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 pr-20 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10 dark:border-white/20 dark:bg-gray-800"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((current) => !current)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-green-600 hover:text-green-700"
                                        >
                                            {showPassword ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full rounded-xl bg-green-600 px-4 py-3.5 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {loading ? "Signing in..." : "Sign in"}
                                </button>
                            </form>

                            <p className="mt-7 text-center text-sm text-gray-500 dark:text-gray-400">
                                Don&apos;t have an account?{" "}
                                <Link
                                    to="/register"
                                    className="font-semibold text-green-600 hover:underline"
                                >
                                    Create account
                                </Link>
                            </p>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default Login;