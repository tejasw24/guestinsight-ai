import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Dashboard({ darkMode, setDarkMode }) {
    return (
        <div className="bg-white dark:bg-gray-950 min-h-screen text-gray-900 dark:text-white">
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

            <div className="max-w-7xl mx-auto px-8 py-32">
                <h1 className="text-5xl font-bold mb-4">
                    Dashboard
                </h1>

                <p className="text-gray-600 dark:text-gray-400 mb-10">
                    Monitor guest review analytics and AI-generated insights.
                </p>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-gray-100 dark:bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-white/20">
                        <h2 className="text-3xl font-bold text-green-600">120</h2>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Total Reviews
                        </p>
                    </div>

                    <div className="bg-gray-100 dark:bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-white/20">
                        <h2 className="text-3xl font-bold text-green-600">85%</h2>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Positive Reviews
                        </p>
                    </div>

                    <div className="bg-gray-100 dark:bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-white/20">
                        <h2 className="text-3xl font-bold text-red-500">15%</h2>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Negative Reviews
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Dashboard;