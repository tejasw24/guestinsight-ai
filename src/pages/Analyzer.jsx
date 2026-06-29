import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Analyzer({ darkMode, setDarkMode }) {
    const sampleResults = [
        {
            review: "The rooms were very clean and the host was friendly.",
            sentiment: "Positive",
            theme: "Cleanliness",
            response: "Thank you for your valuable feedback.",
        },
        {
            review: "Food quality was average but location was excellent.",
            sentiment: "Neutral",
            theme: "Food",
            response: "We appreciate your feedback and will improve.",
        },
    ];

    return (
        <div className="bg-white dark:bg-gray-950 min-h-screen text-gray-900 dark:text-white">
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

            <div className="max-w-7xl mx-auto px-8 py-28">
                <h1 className="text-5xl font-bold mb-4">
                    Review Sentiment Analyzer
                </h1>

                <p className="text-gray-600 dark:text-gray-400 mb-10">
                    Paste one or multiple guest reviews to classify sentiment,
                    detect themes, and generate AI-powered management responses.
                </p>

                {/* Input Section */}
                <div className="bg-gray-100 dark:bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-12 shadow-xl border border-gray-200 dark:border-white/20">
                    <textarea
                        rows="8"
                        placeholder="Paste reviews here (one review per line)..."
                        className="w-full p-5 rounded-xl bg-white dark:bg-black/30 border border-gray-300 dark:border-white/20 outline-none focus:ring-2 focus:ring-green-500"
                    />

                    <button className="mt-6 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold transition duration-300">
                        Analyze Reviews
                    </button>
                </div>

                {/* Results Table */}
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
                            {sampleResults.map((item, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-gray-200 dark:border-white/10"
                                >
                                    <td className="p-4">{item.review}</td>

                                    <td
                                        className={`p-4 font-semibold ${item.sentiment === "Positive"
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
            </div>

            <Footer />
        </div>
    );
}

export default Analyzer;