import { Link } from "react-router-dom";

function Navbar({ darkMode, setDarkMode }) {
    return (
        <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/80 dark:bg-black/40 border-b border-gray-200 dark:border-white/20">
            <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
                <h1 className="text-xl md:text-2xl font-bold text-green-700 dark:text-white">
                    Trishul AI Stay
                </h1>

                <div className="hidden md:flex gap-6 text-gray-800 dark:text-white font-medium">
                    <Link to="/" className="hover:text-green-500">Home</Link>
                    <Link to="/about" className="hover:text-green-500">About</Link>
                    <Link to="/dashboard" className="hover:text-green-500">Dashboard</Link>
                    <Link to="/analyzer" className="hover:text-green-500">Analyzer</Link>
                    <Link to="/components" className="hover:text-green-500">Components</Link>
                    <Link to="/login" className="hover:text-green-500">Login</Link>
                </div>

                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="px-4 py-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition"
                >
                    {darkMode ? "☀️ Light" : "🌙 Dark"}
                </button>
            </div>
        </nav>
    );
}

export default Navbar;