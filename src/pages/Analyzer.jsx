import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Analyzer() {
    const sampleResults = [
        {
            review: "The rooms were very clean and the host was friendly.",
            sentiment: "Positive",
            theme: "Cleanliness",
            response: "Thank you for your valuable feedback."
        },
        {
            review: "Food quality was average but location was excellent.",
            sentiment: "Neutral",
            theme: "Food",
            response: "We appreciate your feedback and will improve."
        }
    ];

    return (
        <div className="bg-gray-950 min-h-screen text-white">
            <Navbar />

            <div className="max-w-7xl mx-auto px-8 py-28">
                <h1 className="text-5xl font-bold mb-4">
                    Review Sentiment Analyzer
                </h1>

                <p className="text-gray-400 mb-10">
                    Paste single or multiple guest reviews to classify sentiment,
                    detect themes, and generate AI-powered management responses.
                </p>

                {/* Input Section */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-12 shadow-lg">
                    <textarea
                        rows="8"
                        placeholder="Paste reviews here (one per line)..."
                        className="w-full p-5 rounded-xl bg-black/30 border border-white/20 outline-none"
                    ></textarea>

                    <button className="mt-6 bg-green-500 hover:bg-green-600 px-8 py-4 rounded-xl font-semibold transition">
                        Analyze Reviews
                    </button>
                </div>

                {/* Results Table */}
                <div className="overflow-x-auto bg-white/10 rounded-2xl p-6 shadow-lg">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/20 text-green-400">
                                <th className="p-4">Review</th>
                                <th className="p-4">Sentiment</th>
                                <th className="p-4">Theme</th>
                                <th className="p-4">Suggested Response</th>
                            </tr>
                        </thead>

                        <tbody>
                            {sampleResults.map((item, index) => (
                                <tr key={index} className="border-b border-white/10">
                                    <td className="p-4">{item.review}</td>
                                    <td className="p-4">{item.sentiment}</td>
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