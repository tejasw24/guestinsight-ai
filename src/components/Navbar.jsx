import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar({ darkMode, setDarkMode }) {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-white/20 dark:bg-black/40">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <Link
                    to="/"
                    className="text-xl font-bold text-green-700 dark:text-white md:text-2xl"
                >
                    Trishul AI Stay
                </Link>

                <div className="hidden items-center gap-6 font-medium text-gray-800 dark:text-white md:flex">
                    <Link to="/" className="hover:text-green-500">
                        Home
                    </Link>

                    <Link to="/about" className="hover:text-green-500">
                        About
                    </Link>

                    {isAuthenticated && (
                        <>
                            <Link to="/dashboard" className="hover:text-green-500">
                                Dashboard
                            </Link>

                            <Link to="/analyzer" className="hover:text-green-500">
                                Analyzer
                            </Link>

                            <Link to="/components" className="hover:text-green-500">
                                Components
                            </Link>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {isAuthenticated ? (
                        <>
                            <span className="hidden text-sm font-medium text-gray-700 dark:text-gray-200 lg:block">
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
                        <div className="hidden items-center gap-3 sm:flex">
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
                        </div>
                    )}

                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="rounded-full bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
                    >
                        {darkMode ? "☀️ Light" : "🌙 Dark"}
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;