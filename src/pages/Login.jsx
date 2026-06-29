import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Login({ darkMode, setDarkMode }) {
    return (
        <div className="bg-white dark:bg-gray-950 min-h-screen text-gray-900 dark:text-white">
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

            <div className="flex justify-center items-center py-32 px-6">
                <div className="bg-gray-100 dark:bg-white/10 backdrop-blur-lg p-10 rounded-2xl w-full max-w-md shadow-xl border border-gray-200 dark:border-white/20">
                    <h1 className="text-4xl font-bold mb-8 text-center">
                        Login
                    </h1>

                    <form className="space-y-6">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full p-4 rounded-lg bg-white dark:bg-black/30 border border-gray-300 dark:border-white/20 outline-none focus:ring-2 focus:ring-green-500"
                        />

                        <input
                            type="password"
                            placeholder="Enter your password"
                            className="w-full p-4 rounded-lg bg-white dark:bg-black/30 border border-gray-300 dark:border-white/20 outline-none focus:ring-2 focus:ring-green-500"
                        />

                        <button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-semibold transition duration-300"
                        >
                            Sign In
                        </button>
                    </form>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Login;