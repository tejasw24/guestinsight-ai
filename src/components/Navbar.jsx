import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/10 border-b border-white/20">
            <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">
                <h1 className="text-2xl font-bold text-white tracking-wide">
                    Trishul AI Stay
                </h1>

                <div className="flex gap-8 text-white font-medium">
                    <Link to="/" className="hover:text-green-300 transition">
                        Home
                    </Link>
                    <Link to="/about" className="hover:text-green-300 transition">
                        About
                    </Link>
                    <Link to="/dashboard" className="hover:text-green-300 transition">
                        Dashboard
                    </Link>
                    <Link to="/analyzer" className="hover:text-green-300 transition">
                        Analyzer
                    </Link>
                    <Link to="/login" className="hover:text-green-300 transition">
                        Login
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;