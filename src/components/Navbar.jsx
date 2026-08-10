import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar({ darkMode, setDarkMode }) {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
        navigate("/login");
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <nav className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-white/20 dark:bg-black/40">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">

                {/* Logo */}
                <Link
                    to="/"
                    onClick={closeMenu}
                    className="text-xl font-bold text-green-700 dark:text-white md:text-2xl"
                >
                    Trishul AI Stay
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden items-center gap-6 font-medium text-gray-800 dark:text-white md:flex">
                    <Link
                        to="/"
                        className="transition hover:text-green-500"
                    >
                        Home
                    </Link>

                    <Link
                        to="/about"
                        className="transition hover:text-green-500"
                    >
                        About
                    </Link>

                    {isAuthenticated && (
                        <>
                            <Link
                                to="/dashboard"
                                className="transition hover:text-green-500"
                            >
                                Dashboard
                            </Link>

                            <Link
                                to="/analyzer"
                                className="transition hover:text-green-500"
                            >
                                Analyzer
                            </Link>

                            <Link
                                to="/components"
                                className="transition hover:text-green-500"
                            >
                                Components
                            </Link>
                        </>
                    )}
                </div>

                {/* Desktop Actions */}
                <div className="hidden items-center gap-3 md:flex">
                    {isAuthenticated ? (
                        <>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                Hi, {user?.name || "User"}
                            </span>

                            <button
                                onClick={handleLogout}
                                className="rounded-full border border-red-500 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-500 hover:text-white dark:text-red-400"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="rounded-full border border-green-600 px-4 py-2 text-sm font-semibold text-green-600 transition hover:bg-green-600 hover:text-white"
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>

                {/* Dark Mode + Mobile Menu */}
                <div className="flex items-center gap-2">

                    {/* Dark Mode */}
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="rounded-full bg-green-600 px-3 py-2 text-sm text-white transition hover:bg-green-700 sm:px-4"
                    >
                        {darkMode ? "☀️ Light" : "🌙 Dark"}
                    </button>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-xl text-gray-700 dark:border-white/30 dark:text-white md:hidden"
                        aria-label="Toggle navigation menu"
                    >
                        {menuOpen ? "✕" : "☰"}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {menuOpen && (
                <div className="border-t border-gray-200 bg-white px-4 py-4 shadow-lg dark:border-white/20 dark:bg-gray-900 md:hidden">

                    <div className="flex flex-col gap-3 font-medium text-gray-800 dark:text-white">

                        <Link
                            to="/"
                            onClick={closeMenu}
                            className="rounded-lg px-3 py-3 transition hover:bg-green-50 hover:text-green-600 dark:hover:bg-white/10"
                        >
                            Home
                        </Link>

                        <Link
                            to="/about"
                            onClick={closeMenu}
                            className="rounded-lg px-3 py-3 transition hover:bg-green-50 hover:text-green-600 dark:hover:bg-white/10"
                        >
                            About
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    onClick={closeMenu}
                                    className="rounded-lg px-3 py-3 transition hover:bg-green-50 hover:text-green-600 dark:hover:bg-white/10"
                                >
                                    Dashboard
                                </Link>

                                <Link
                                    to="/analyzer"
                                    onClick={closeMenu}
                                    className="rounded-lg px-3 py-3 transition hover:bg-green-50 hover:text-green-600 dark:hover:bg-white/10"
                                >
                                    Analyzer
                                </Link>

                                <Link
                                    to="/components"
                                    onClick={closeMenu}
                                    className="rounded-lg px-3 py-3 transition hover:bg-green-50 hover:text-green-600 dark:hover:bg-white/10"
                                >
                                    Components
                                </Link>

                                <div className="border-t border-gray-200 pt-3 dark:border-white/20">
                                    <p className="mb-3 px-3 text-sm text-gray-600 dark:text-gray-300">
                                        Hi, {user?.name || "User"}
                                    </p>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full rounded-lg border border-red-500 px-4 py-3 text-left font-semibold text-red-600 transition hover:bg-red-500 hover:text-white dark:text-red-400"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col gap-3 border-t border-gray-200 pt-3 dark:border-white/20">

                                <Link
                                    to="/login"
                                    onClick={closeMenu}
                                    className="rounded-full border border-green-600 px-4 py-3 text-center font-semibold text-green-600 transition hover:bg-green-600 hover:text-white"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/register"
                                    onClick={closeMenu}
                                    className="rounded-full bg-green-600 px-4 py-3 text-center font-semibold text-white transition hover:bg-green-700"
                                >
                                    Register
                                </Link>

                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;